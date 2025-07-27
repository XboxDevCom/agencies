import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Creator, FilterOptions, SortConfig } from '../types/Creator';
import { debounce, filterCreators, sortCreators, parseCreatorData, storage } from '../utils';
import Papa from 'papaparse';

// Custom hook for data loading with error handling and caching
export const useCreatorData = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from cache first
        const cachedData = storage.get<{ data: Creator[]; timestamp: number }>('creators_cache', null);
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes

        if (cachedData && Date.now() - cachedData.timestamp < cacheExpiry) {
          setCreators(cachedData.data);
          setLastUpdated(new Date(cachedData.timestamp));
          setLoading(false);
          return;
        }

        const response = await fetch('/data.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvData = await response.text();
        
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            
            const parsedData = parseCreatorData(results.data);
            setCreators(parsedData);
            setLastUpdated(new Date());
            
            // Cache the data
            storage.set('creators_cache', {
              data: parsedData,
              timestamp: Date.now()
            });
            
            setError(null);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            setError('Failed to parse CSV data');
          }
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = useCallback(() => {
    storage.remove('creators_cache');
    window.location.reload();
  }, []);

  return { creators, loading, error, lastUpdated, refreshData };
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
  const { debouncedQuery } = useSearch(searchQuery);

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
    } catch (error) {
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
