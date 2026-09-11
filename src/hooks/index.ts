import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Creator, FilterOptions, SortConfig } from '../types/Creator';
import { debounce, filterCreators, sortCreators, parseCreatorCSV, storage } from '../utils';

// Custom hook for data loading with error handling and caching
export const useCreatorData = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${process.env.PUBLIC_URL || ''}/data.csv`, { signal: controller.signal, cache: 'no-cache' })
      .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.text(); })
      .then(csv => { const data = parseCreatorCSV(csv); if (!cancelled) setCreators(data); })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Data unavailable'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [attempt]);
  const refreshData = useCallback(() => setAttempt(previous => previous + 1), []);
  return { creators, loading, error, refreshData };
};

// Custom hook for search functionality with debouncing
export const useSearch = (initialQuery = '', delay = 300) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value), delay),
    [delay]
  );

  useEffect(() => {
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  return {
    query,
    debouncedQuery,
    setQuery
  };
};

// Custom hook for filtering and sorting
export const useCreatorFiltering = (creators: Creator[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    platform: '',
    status: '',
    minFollowers: 0,
    focus: '',
    type: '',
    pricing_model: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'agency',
    direction: 'asc'
  });

  // Debounced search
  const { debouncedQuery, setQuery } = useSearch(searchQuery);
  useEffect(() => { setQuery(searchQuery); }, [searchQuery, setQuery]);

  // Memoized filtered and sorted data
  const filteredAndSortedCreators = useMemo(() => {
    if (!creators.length) return [];

    const filtered = filterCreators(creators, debouncedQuery, filters);
    return sortCreators(filtered, sortConfig.field, sortConfig.direction);
  }, [creators, debouncedQuery, filters, sortConfig]);

  const handleSort = useCallback((field: keyof Creator) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      platform: '',
      status: '',
      minFollowers: 0,
      focus: '',
      type: '',
      pricing_model: ''
    });
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '' && value !== 0) || searchQuery !== '';
  }, [filters, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters: handleFilterChange,
    sortConfig,
    handleSort,
    filteredAndSortedCreators,
    clearFilters,
    hasActiveFilters
  };
};

// Custom hook for local storage with type safety
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.get(key, initialValue);
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error: any) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Custom hook for window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Custom hook for intersection observer (for lazy loading)
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
};

// Custom hook for keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifiers = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey
      };

      Object.entries(shortcuts).forEach(([shortcut, callback]) => {
        const parts = shortcut.toLowerCase().split('+');
        const targetKey = parts[parts.length - 1];
        const requiredModifiers = parts.slice(0, -1);

        if (key === targetKey) {
          const modifierMatch = requiredModifiers.every(mod => {
            switch (mod) {
              case 'ctrl': return modifiers.ctrl;
              case 'alt': return modifiers.alt;
              case 'shift': return modifiers.shift;
              case 'meta': return modifiers.meta;
              default: return false;
            }
          });

          if (modifierMatch) {
            event.preventDefault();
            callback();
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Custom hook for previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
