import React, { useState, useEffect } from 'react';
import { Creator } from './types/Creator';
import CreatorList from './components/CreatorList.tsx';
import SearchAndFilter from './components/SearchAndFilter.tsx';
import Papa from 'papaparse';

function App() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [sortField, setSortField] = useState<keyof Creator>('agency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    minFollowers: 0,
    focus: ''
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

  const handleSearch = (query: string) => {
    // Implement search functionality if needed
    console.log('Search query:', query);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredAndSortedCreators = [...creators]
    .filter(creator => {
      if (!creator) return false;
      
      return (
        (filters.platform === '' || (creator.platforms || []).some(platform => 
          platform.toLowerCase().includes(filters.platform.toLowerCase())
        )) &&
        (filters.focus === '' || (creator.focus || []).some(f => 
          f.toLowerCase().includes(filters.focus.toLowerCase())
        )) &&
        (filters.status === '' || creator.status === filters.status) &&
        (filters.minFollowers === 0 || creator.followers >= filters.minFollowers)
      );
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
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
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-500 mb-8">Creator Agencies</h1>
        
        {/* Filter Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Filter</h2>
          <SearchAndFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            data={creators}
          />
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