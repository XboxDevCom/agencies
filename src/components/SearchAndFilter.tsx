import React, { useMemo } from 'react';
import { Creator } from '../types/Creator';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Partial<{
    platform: string;
    status: string;
    minFollowers: number;
    focus: string;
    type: string;
    pricing_model: string;
  }>) => void;
  data: Creator[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch, onFilterChange, data }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      [name]: value,
    } as any);
  };

  // Extract unique values for dropdowns
  const uniquePlatforms = useMemo(() => {
    const platforms = data.flatMap(agency => agency.platforms || []);
    return Array.from(new Set(platforms)).sort();
  }, [data]);

  const uniqueFocus = useMemo(() => {
    const focus = data.flatMap(agency => agency.focus || []);
    return Array.from(new Set(focus)).sort();
  }, [data]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative rounded-md shadow-sm">
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
            type="text"
            name="search"
            id="search"
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            placeholder="Search by name or email..."
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            Agency Type
          </label>
          <select
            id="type"
            name="type"
            className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="exclusive">Exclusive</option>
            <option value="mass">Mass</option>
          </select>
        </div>

        <div>
          <label htmlFor="pricing_model" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            Pricing Model
          </label>
          <select
            id="pricing_model"
            name="pricing_model"
            className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">All Pricing Models</option>
            <option value="commission">Commission</option>
            <option value="base_fee">Base Fee</option>
          </select>
        </div>

        <div>
          <label htmlFor="platform" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            Platform
          </label>
          <select
            id="platform"
            name="platform"
            className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">All Platforms</option>
            {uniquePlatforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="focus" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            Focus
          </label>
          <select
            id="focus"
            name="focus"
            className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">All Focus Areas</option>
            {uniqueFocus.map((focus) => (
              <option key={focus} value={focus}>
                {focus}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="block w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="minFollowers" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
            Min. Followers
          </label>
          <input
            type="number"
            name="minFollowers"
            id="minFollowers"
            min="0"
            className="block w-full pl-3 pr-3 py-1.5 sm:py-2 text-sm border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter; 