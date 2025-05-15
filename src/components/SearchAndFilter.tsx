import React, { useMemo } from 'react';
import { Creator } from '../types/Creator';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    platform: string;
    status: string;
    minFollowers: number;
    focus: string;
  }) => void;
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
    <div className="space-y-4">
      <div>
        <label htmlFor="search" className="sr-only">
          Suche
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            placeholder="Suche nach Namen oder E-Mail..."
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-300">
            Plattform
          </label>
          <select
            id="platform"
            name="platform"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">Alle Plattformen</option>
            {uniquePlatforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="focus" className="block text-sm font-medium text-gray-300">
            Fokus
          </label>
          <select
            id="focus"
            name="focus"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">Alle Fokus-Bereiche</option>
            {uniqueFocus.map((focus) => (
              <option key={focus} value={focus}>
                {focus}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          >
            <option value="">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
        </div>

        <div>
          <label htmlFor="minFollowers" className="block text-sm font-medium text-gray-300">
            Min. Follower
          </label>
          <input
            type="number"
            name="minFollowers"
            id="minFollowers"
            min="0"
            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-600 rounded-md bg-gray-700 text-gray-200"
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter; 