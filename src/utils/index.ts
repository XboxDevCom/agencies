import { Creator } from '../types/Creator';

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
    new URL(url);
    return true;
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
  filters: {
    platform: string;
    status: string;
    minFollowers: number;
    focus: string;
    type: string;
    pricing_model: string;
  }
): Creator[] => {
  return creators.filter(creator => {
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
};

// Parse CSV data to Creator objects
export const parseCreatorData = (csvData: any[]): Creator[] => {
  return csvData
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

  const csvContent = [
    headers.join(','),
    ...creators.map(creator => 
      headers.map(header => {
        const value = creator[header as keyof Creator];
        if (Array.isArray(value)) {
          return `"${value.join(', ')}"`;
        }
        return `"${value || ''}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
      console.log('Analytics Event:', eventName, properties);
    }
  },
  
  trackPageView: (pageName: string) => {
    // Placeholder for page view tracking
    if (process.env.NODE_ENV === 'development') {
      console.log('Page View:', pageName);
    }
  }
};
