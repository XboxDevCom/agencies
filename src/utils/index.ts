import { Creator, DEFAULT_CREATOR, FilterOptions } from '../types/Creator';
import Papa from 'papaparse';

// Debounce function for search input
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Format numbers with German locale
export const formatNumber = (num: number): string => {
  return num.toLocaleString('de-DE');
};

// Format currency
export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
};

// Extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

// Sort creators by field
export const sortCreators = (
  creators: Creator[],
  field: keyof Creator,
  direction: 'asc' | 'desc'
): Creator[] => {
  return [...creators].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    const missing = (value: unknown) => value === null || value === undefined || value === '' || value === 'unknown' || (Array.isArray(value) && value.length === 0);
    if (missing(aValue) || missing(bValue)) return Number(missing(aValue)) - Number(missing(bValue));

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue, 'de', { numeric: true })
        : bValue.localeCompare(aValue, 'de', { numeric: true });
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }

    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      const aString = aValue.join(',');
      const bString = bValue.join(',');
      return direction === 'asc' 
        ? aString.localeCompare(bString, 'de')
        : bString.localeCompare(aString, 'de');
    }

    return 0;
  });
};

// Filter creators based on search query and filters
export const filterCreators = (
  creators: Creator[],
  searchQuery: string,
  filters: FilterOptions
): Creator[] => {
  return creators.filter(creator => {
    if (!creator) return false;
    
    // Search functionality
    const searchLower = searchQuery.trim().toLocaleLowerCase();
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
      (!filters.country || (creator.country || 'unknown').split(',').map(country => country.trim()).includes(filters.country)) &&
      (filters.minFollowers === 0 || (creator.followers !== null && creator.followers >= filters.minFollowers))
    );
  });
};

// Parse CSV data to Creator objects
export const parseCreatorData = (csvData: unknown[]): Creator[] => {
  const list = (value: unknown, separator = ','): string[] => typeof value === 'string'
    ? Array.from(new Set(value.split(separator).map(item => item.trim()).filter(Boolean))) : [];
  const integer = (value: unknown): number | null => {
    if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) return null;
    const number = Number(value);
    return Number.isSafeInteger(number) ? number : null;
  };
  return csvData.filter((row): row is Record<string, string> => !!row && typeof row === 'object' &&
    'agency' in row && typeof (row as Record<string, unknown>).agency === 'string' && !!(row as Record<string, string>).agency.trim())
    .map(row => {
      const year = integer(row.founding_year);
      return {
        ...DEFAULT_CREATOR, ...row,
        agency: row.agency.trim(), url: isValidUrl(row.url || '') ? row.url.trim() : '',
        type: ['exclusive', 'mass'].includes(row.type) ? row.type as Creator['type'] : 'unknown',
        pricing_model: ['commission', 'base_fee'].includes(row.pricing_model) ? row.pricing_model as Creator['pricing_model'] : 'unknown',
        status: ['active', 'inactive'].includes(row.status) ? row.status as Creator['status'] : 'unknown',
        legal_form: (row.legal_form || '') as Creator['legal_form'],
        focus: list(row.focus), platforms: list(row.platforms), references: list(row.references),
        conditions: list(row.conditions), departments: list(row.departments),
        source_urls: list(row.source_urls, '|').filter(isValidUrl), verified_fields: list(row.verified_fields),
        checked_at: /^\d{4}-\d{2}-\d{2}$/.test(row.checked_at || '') && !Number.isNaN(Date.parse(row.checked_at)) ? row.checked_at : '',
        followers: integer(row.followers), founding_year: year && year >= 1800 && year <= new Date().getFullYear() ? year : null,
      };
    });
};

export const parseCreatorCSV = (csv: string): Creator[] => {
  const parsed = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: 'greedy', transformHeader: header => header.trim() });
  if (parsed.errors.length || !['agency', 'url', 'focus', 'platforms', 'status'].every(field => parsed.meta.fields?.includes(field))) {
    throw new Error('Invalid agency CSV schema');
  }
  const agencies = parseCreatorData(parsed.data);
  if (!agencies.length || agencies.length !== parsed.data.length || new Set(agencies.map(a => a.agency.toLowerCase())).size !== agencies.length) {
    throw new Error('Empty, unnamed or duplicate agency records');
  }
  return agencies;
};

// Get unique values from array of creators for filter options
export const getUniqueFilterOptions = (creators: Creator[]) => {
  const platforms = new Set<string>();
  const focus = new Set<string>();
  const locations = new Set<string>();
  const legalForms = new Set<string>();
  const departments = new Set<string>();

  creators.forEach(agency => {
    agency.platforms?.forEach(platform => platforms.add(platform));
    agency.focus?.forEach(f => focus.add(f));
    agency.departments?.forEach(dept => departments.add(dept));
    if (agency.location) locations.add(agency.location);
    if (agency.legal_form) legalForms.add(agency.legal_form);
  });

  return {
    platforms: Array.from(platforms).sort(),
    focus: Array.from(focus).sort(),
    locations: Array.from(locations).sort(),
    legalForms: Array.from(legalForms).sort(),
    departments: Array.from(departments).sort()
  };
};

// Export data to CSV
export const exportToCSV = (creators: Creator[], filename = 'agencies.csv'): void => {
  const headers = [
    'agency', 'url', 'type', 'pricing_model', 'focus', 'platforms', 
    'references', 'conditions', 'followers', 'status', 'notes', 
    'description', 'departments', 'legal_form', 'location', 'founding_year'
  ];

  const csvContent = Papa.unparse({ fields: headers, data: creators.map(creator => headers.map(header => {
    const value = creator[header as keyof Creator];
    return Array.isArray(value) ? value.join(', ') : value ?? '';
  })) }, { escapeFormulae: true });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

// Analytics helpers
export const analytics = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    // Placeholder for analytics implementation
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Analytics Event:', eventName, properties);
    }
  },
  
  trackPageView: (pageName: string) => {
    // Placeholder for page view tracking
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Page View:', pageName);
    }
  }
};
