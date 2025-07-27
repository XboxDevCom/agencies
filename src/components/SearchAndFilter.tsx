import React, { useMemo, useCallback, useState, useId } from 'react';
import { Creator } from '../types/Creator';
import { AccessibleButton, AccessibleFormField } from './Accessibility.tsx';
import { useTranslation, useNumberFormat } from '../i18n/I18nProvider.tsx';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    platform: string;
    status: string;
    minFollowers: number;
    focus: string;
    type: string;
    pricing_model: string;
  }) => void;
  data: Creator[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch, onFilterChange, data }) => {
  const { t } = useTranslation();
  const formatNumber = useNumberFormat();
  
  const [localFilters, setLocalFilters] = useState({
    platform: '',
    status: '',
    minFollowers: 0,
    focus: '',
    type: '',
    pricing_model: ''
  });
  const [searchValue, setSearchValue] = useState('');

  // Generate unique IDs for form elements
  const searchId = useId();
  const typeId = useId();
  const pricingId = useId();
  const platformId = useId();
  const focusId = useId();
  const statusId = useId();
  const followersId = useId();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name === 'minFollowers' ? parseInt(value) || 0 : value;
    
    const newFilters = {
      ...localFilters,
      [name]: numericValue,
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  }, [localFilters, onFilterChange]);

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      platform: '',
      status: '',
      minFollowers: 0,
      focus: '',
      type: '',
      pricing_model: ''
    };
    setLocalFilters(clearedFilters);
    setSearchValue('');
    onFilterChange(clearedFilters);
    onSearch('');
    
    // Focus zurück auf Suchfeld
    document.getElementById(searchId)?.focus();
  }, [onFilterChange, onSearch, searchId]);

  // Memoized unique values for dropdowns
  const filterOptions = useMemo(() => {
    const platforms = new Set<string>();
    const focus = new Set<string>();
    const locations = new Set<string>();
    const legalForms = new Set<string>();

    data.forEach(agency => {
      agency.platforms?.forEach(platform => platforms.add(platform));
      agency.focus?.forEach(f => focus.add(f));
      if (agency.location) locations.add(agency.location);
      if (agency.legal_form) legalForms.add(agency.legal_form);
    });

    return {
      platforms: Array.from(platforms).sort(),
      focus: Array.from(focus).sort(),
      locations: Array.from(locations).sort(),
      legalForms: Array.from(legalForms).sort()
    };
  }, [data]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(localFilters).some(value => 
      value !== '' && value !== 0
    ) || searchValue !== '';
  }, [localFilters, searchValue]);

  const activeFilterCount = useMemo(() => {
    return Object.values(localFilters).filter(value => value !== '' && value !== 0).length + 
           (searchValue ? 1 : 0);
  }, [localFilters, searchValue]);

  return (
    <div className="space-y-4" role="search" aria-labelledby="search-heading">
      <h3 id="search-heading" className="sr-only">
        {t('filters.title')}
      </h3>

      {/* Search Bar */}
      <AccessibleFormField
        id={searchId}
        label={t('search.label')}
        helpText={t('search.helpText')}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="search"
            value={searchValue}
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            placeholder={t('search.placeholder')}
            onChange={handleSearchChange}
            autoComplete="off"
          />
        </div>
      </AccessibleFormField>

      {/* Filter Controls */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-gray-300 mb-3">
          {t('filters.title')}
          {activeFilterCount > 0 && (
            <span className="ml-2 text-xs text-green-400">
              {t('filters.activeCount', { count: activeFilterCount })}
            </span>
          )}
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Agency Type */}
          <AccessibleFormField
            id={typeId}
            label={t('filters.agencyType')}
            helpText={t('filters.agencyType.help')}
          >
            <select
              name="type"
              value={localFilters.type}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
              onChange={handleFilterChange}
            >
              <option value="">{t('common.all')} {t('filters.agencyType')}</option>
              <option value="exclusive">{t('agency.type.exclusive')}</option>
              <option value="mass">{t('agency.type.mass')}</option>
            </select>
          </AccessibleFormField>

          {/* Pricing Model */}
          <AccessibleFormField
            id={pricingId}
            label={t('filters.pricingModel')}
            helpText={t('filters.pricingModel.help')}
          >
            <select
              name="pricing_model"
              value={localFilters.pricing_model}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
              onChange={handleFilterChange}
            >
              <option value="">{t('common.all')} {t('filters.pricingModel')}</option>
              <option value="commission">{t('agency.pricing.commission')}</option>
              <option value="base_fee">{t('agency.pricing.baseFee')}</option>
            </select>
          </AccessibleFormField>

          {/* Platform */}
          <AccessibleFormField
            id={platformId}
            label={t('filters.platform')}
            helpText={t('filters.platform.help')}
          >
            <select
              name="platform"
              value={localFilters.platform}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
              onChange={handleFilterChange}
            >
              <option value="">{t('common.all')} {t('filters.platform')}</option>
              {filterOptions.platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </AccessibleFormField>

          {/* Focus */}
          <AccessibleFormField
            id={focusId}
            label={t('filters.focus')}
            helpText={t('filters.focus.help')}
          >
            <select
              name="focus"
              value={localFilters.focus}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
              onChange={handleFilterChange}
            >
              <option value="">{t('common.all')} {t('filters.focus')}</option>
              {filterOptions.focus.map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </AccessibleFormField>

          {/* Status */}
          <AccessibleFormField
            id={statusId}
            label={t('filters.status')}
            helpText={t('filters.status.help')}
          >
            <select
              name="status"
              value={localFilters.status}
              className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
              onChange={handleFilterChange}
            >
              <option value="">{t('common.all')} {t('filters.status')}</option>
              <option value="active">{t('agency.status.active')}</option>
              <option value="inactive">{t('agency.status.inactive')}</option>
            </select>
          </AccessibleFormField>

          {/* Min Followers */}
          <AccessibleFormField
            id={followersId}
            label={t('filters.minFollowers')}
            helpText={t('filters.minFollowers.help')}
          >
            <input
              type="number"
              name="minFollowers"
              min="0"
              step="1000"
              value={localFilters.minFollowers || ''}
              placeholder="z.B. 10000"
              className="block w-full pl-3 pr-3 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
              onChange={handleFilterChange}
            />
          </AccessibleFormField>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end pt-2">
            <AccessibleButton
              onClick={clearFilters}
              variant="secondary"
              size="sm"
              ariaLabel={t('filters.clearAll') + ` (${activeFilterCount})`}
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t('filters.clearAll')} ({activeFilterCount})
            </AccessibleButton>
          </div>
        )}
      </fieldset>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="bg-gray-700 rounded-md p-3" role="status" aria-live="polite">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            {t('filters.activeFilters')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {searchValue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                {t('search.label')}: "{searchValue}"
              </span>
            )}
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === 0) return null;
              
              let displayValue: string;
              
              switch (key) {
                case 'type':
                  displayValue = value === 'exclusive' ? t('agency.type.exclusive') : t('agency.type.mass');
                  break;
                case 'pricing_model':
                  displayValue = value === 'commission' ? t('agency.pricing.commission') : t('agency.pricing.baseFee');
                  break;
                case 'status':
                  displayValue = value === 'active' ? t('agency.status.active') : t('agency.status.inactive');
                  break;
                case 'minFollowers':
                  displayValue = `Min. ${formatNumber(value as number)} Follower`;
                  break;
                default:
                  displayValue = String(value);
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                >
                  {t(`filters.${key}` as any)}: {displayValue}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
