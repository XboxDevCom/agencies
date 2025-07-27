import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Creator } from './types/Creator';
import CreatorList from './components/CreatorList';
import SearchAndFilter from './components/SearchAndFilter';
import Footer from './components/Footer';
import SEO from './components/SEO';
import LanguageSwitcher from './components/LanguageSwitcher';
import { SkipLink, LiveRegion, ProgressIndicator } from './components/Accessibility';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider, useTranslation, useNumberFormat } from './i18n/I18nProvider';
import Papa from 'papaparse';

// Custom hook for data loading
const useCreatorData = () => {
  const { t } = useTranslation();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadingProgress(10);

        const response = await fetch('/data.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setLoadingProgress(30);
        const csvData = await response.text();
        setLoadingProgress(50);
        
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setLoadingProgress(80);
            
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            
            const parsedData = results.data
              .filter((row: any) => row && Object.keys(row).length > 0)
              .map((row: any) => ({
                ...row,
                focus: row.focus ? row.focus.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
                platforms: row.platforms ? row.platforms.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
                references: row.references ? row.references.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
                conditions: row.conditions ? row.conditions.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
                departments: row.departments ? row.departments.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
                followers: parseInt(row.followers) || 0,
                founding_year: parseInt(row.founding_year) || new Date().getFullYear()
              })) as Creator[];
            
            setCreators(parsedData);
            setLoadingProgress(100);
            setError(null);
          },
          error: (error: Error) => {
            console.error('CSV parsing error:', error);
            setError(t('error.parsingData'));
          }
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(t('error.loadingData'));
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    };

    loadData();
  }, [t]);

  return { creators, loading, error, loadingProgress };
};

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const formatNumber = useNumberFormat();
  const { creators, loading, error, loadingProgress } = useCreatorData();
  const [sortField, setSortField] = useState<keyof Creator>('agency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    minFollowers: 0,
    focus: '',
    type: '',
    pricing_model: ''
  });
  const [announcements, setAnnouncements] = useState<string>('');

  const handleSort = useCallback((field: keyof Creator) => {
    setSortField(prevField => {
      if (field === prevField) {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        setAnnouncements(t('a11y.sortedBy', { 
          field: t(`table.${field}` as any), 
          direction: newDirection === 'asc' ? t('table.sortAsc') : t('table.sortDesc')
        }));
        return prevField;
      } else {
        setSortDirection('asc');
        setAnnouncements(t('a11y.sortedBy', { 
          field: t(`table.${field}` as any), 
          direction: t('table.sortAsc')
        }));
        return field;
      }
    });
  }, [sortDirection, t]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query) {
      setAnnouncements(t('a11y.searchResults', { count: 0 })); // Will be updated when results change
    }
  }, [t]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      const activeFilters = Object.entries(updatedFilters)
        .filter(([_, value]) => value !== '' && value !== 0)
        .map(([key, _]) => t(`filters.${key}` as any));
      
      if (activeFilters.length > 0) {
        setAnnouncements(t('a11y.filtersApplied', { filters: activeFilters.join(', ') }));
      } else {
        setAnnouncements(t('a11y.filtersCleared'));
      }
      
      return updatedFilters;
    });
  }, [t]);

  // Memoized filtering and sorting
  const filteredAndSortedCreators = useMemo(() => {
    if (!creators.length) return [];

    let filtered = creators.filter(creator => {
      if (!creator) return false;
      
      // Search functionality
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        creator.agency?.toLowerCase().includes(searchLower) ||
        creator.description?.toLowerCase().includes(searchLower) ||
        creator.location?.toLowerCase().includes(searchLower) ||
        creator.focus?.some(f => f.toLowerCase().includes(searchLower)) ||
        creator.platforms?.some(p => p.toLowerCase().includes(searchLower)) ||
        creator.references?.some(r => r.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
      
      return (
        (filters.platform === '' || (creator.platforms || []).some(platform => 
          platform.toLowerCase().includes(filters.platform.toLowerCase())
        )) &&
        (filters.focus === '' || (creator.focus || []).some(f => 
          f.toLowerCase().includes(filters.focus.toLowerCase())
        )) &&
        (filters.status === '' || creator.status === filters.status) &&
        (filters.type === '' || creator.type === filters.type) &&
        (filters.pricing_model === '' || creator.pricing_model === filters.pricing_model) &&
        (filters.minFollowers === 0 || creator.followers >= filters.minFollowers)
      );
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue, 'de', { numeric: true })
          : bValue.localeCompare(aValue, 'de', { numeric: true });
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const aString = aValue.join(',');
        const bString = bValue.join(',');
        return sortDirection === 'asc' 
          ? aString.localeCompare(bString, 'de')
          : bString.localeCompare(aString, 'de');
      }

      return 0;
    });
  }, [creators, searchQuery, filters, sortField, sortDirection]);

  // Update announcements when results change
  useEffect(() => {
    if (!loading && creators.length > 0) {
      const resultCount = filteredAndSortedCreators.length;
      const totalCount = creators.length;
      
      if (searchQuery && resultCount !== totalCount) {
        setAnnouncements(t('a11y.searchResults', { count: resultCount }));
      }
    }
  }, [filteredAndSortedCreators.length, creators.length, loading, searchQuery, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md w-full px-4">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"
            role="status"
            aria-label={t('loading.data')}
          />
          <h1 className="text-xl font-semibold text-gray-300 mb-4">
            {t('loading.data')}
          </h1>
          <ProgressIndicator
            value={loadingProgress}
            max={100}
            label={t('loading.progress')}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div 
            className="text-red-500 text-4xl mb-4" 
            role="img" 
            aria-label="Error symbol"
          >
            ⚠️
          </div>
          <h1 className="text-xl font-semibold text-gray-300 mb-4">
            {t('error.loadingData')}
          </h1>
          <p className="text-red-400 mb-6" role="alert">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <SEO />
      
      {/* Skip Links */}
      <SkipLink href="#main-content">
        {t('nav.skipToMain')}
      </SkipLink>
      <SkipLink href="#filter-section">
        {t('nav.skipToFilters')}
      </SkipLink>
      <SkipLink href="#results-table">
        {t('nav.skipToResults')}
      </SkipLink>

      {/* Live Region for announcements */}
      <LiveRegion politeness="polite">
        {announcements}
      </LiveRegion>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex-grow">
        <header className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-500 mb-2">
              {t('header.title')}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base" aria-live="polite">
              {filteredAndSortedCreators.length !== creators.length 
                ? t('header.resultsCountFiltered', { 
                    filtered: formatNumber(filteredAndSortedCreators.length), 
                    total: formatNumber(creators.length) 
                  })
                : t('header.resultsCount', { count: formatNumber(creators.length) })
              }
            </p>
          </div>
          
          {/* Language Switcher */}
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <LanguageSwitcher />
          </div>
        </header>
        
        {/* Filter Section */}
        <section 
          id="filter-section"
          className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8 border border-gray-700"
          aria-labelledby="filter-heading"
        >
          <h2 
            id="filter-heading" 
            className="text-base sm:text-lg font-semibold text-green-400 mb-3 sm:mb-4"
          >
            {t('filters.title')}
          </h2>
          <SearchAndFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            data={creators}
          />
        </section>

        <main id="main-content">
          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">
              {t('search.noResults')}
            </h2>
            <div id="results-table">
              <CreatorList 
                creators={filteredAndSortedCreators}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </HelmetProvider>
  );
}

export default App;
