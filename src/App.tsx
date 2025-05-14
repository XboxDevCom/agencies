import React, { useState, useEffect } from 'react';
import { Creator } from './types/Creator';
import CreatorList from './components/CreatorList.tsx';
import Papa from 'papaparse';

function App() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [sortField, setSortField] = useState<keyof Creator>('agency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    agency: '',
    focus: '',
    platforms: '',
    references: '',
    status: ''
  });

  useEffect(() => {
    // Load data.csv directly from public directory
    fetch('/data.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any) => ({
              ...row,
              focus: row.focus ? row.focus.split(',').map((item: string) => item.trim()) : [],
              platforms: row.platforms ? row.platforms.split(',').map((item: string) => item.trim()) : [],
              references: row.references ? row.references.split(',').map((item: string) => item.trim()) : [],
              conditions: row.conditions ? row.conditions.split(',').map((item: string) => item.trim()) : [],
              followers: parseInt(row.followers) || 0
            })) as Creator[];
            setCreators(parsedData);
          }
        });
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }, []);

  const handleSort = (field: keyof Creator) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredAndSortedCreators = [...creators]
    .filter(creator => {
      return (
        creator.agency.toLowerCase().includes(filters.agency.toLowerCase()) &&
        creator.focus.some(f => f.toLowerCase().includes(filters.focus.toLowerCase())) &&
        creator.platforms.some(platform => 
          platform.toLowerCase().includes(filters.platforms.toLowerCase())
        ) &&
        creator.references.some(reference => 
          reference.toLowerCase().includes(filters.references.toLowerCase())
        ) &&
        (filters.status === '' || creator.status === filters.status)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
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
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Creator Agencies</h1>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="agency-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Agency
              </label>
              <input
                type="text"
                id="agency-filter"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Filter by agency..."
                value={filters.agency}
                onChange={(e) => handleFilterChange('agency', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="focus-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Focus
              </label>
              <input
                type="text"
                id="focus-filter"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Filter by focus..."
                value={filters.focus}
                onChange={(e) => handleFilterChange('focus', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="platforms-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Platforms
              </label>
              <input
                type="text"
                id="platforms-filter"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Filter by platforms..."
                value={filters.platforms}
                onChange={(e) => handleFilterChange('platforms', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="references-filter" className="block text-sm font-medium text-gray-700 mb-1">
                References
              </label>
              <input
                type="text"
                id="references-filter"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Filter by references..."
                value={filters.references}
                onChange={(e) => handleFilterChange('references', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <CreatorList 
          creators={filteredAndSortedCreators}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>
    </div>
  );
}

export default App; 