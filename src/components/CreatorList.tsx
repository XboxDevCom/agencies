import React from 'react';
import { Creator } from '../types/Creator';

interface CreatorListProps {
  creators: Creator[];
  onSort: (field: keyof Creator) => void;
  sortField: keyof Creator;
  sortDirection: 'asc' | 'desc';
}

const CreatorList: React.FC<CreatorListProps> = ({
  creators,
  onSort,
  sortField,
  sortDirection
}) => {
  const renderSortIcon = (field: keyof Creator) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-900">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
              onClick={() => onSort('agency')}
            >
              Agency {renderSortIcon('agency')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
              onClick={() => onSort('focus')}
            >
              Focus {renderSortIcon('focus')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
              onClick={() => onSort('platforms')}
            >
              Platforms {renderSortIcon('platforms')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
              onClick={() => onSort('references')}
            >
              References {renderSortIcon('references')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
              onClick={() => onSort('conditions')}
            >
              Conditions {renderSortIcon('conditions')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
              onClick={() => onSort('followers')}
            >
              Followers {renderSortIcon('followers')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
              onClick={() => onSort('status')}
            >
              Status {renderSortIcon('status')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {creators.map((creator, index) => (
            <tr key={index} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                <a 
                  href={creator.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors duration-200"
                >
                  {creator.agency}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex flex-wrap gap-1">
                  {creator.focus.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex flex-wrap gap-1">
                  {creator.platforms.map((platform, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex flex-wrap gap-1">
                  {creator.references.map((reference, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200"
                    >
                      {reference}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex flex-wrap gap-1">
                  {creator.conditions.map((condition, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {creator.followers.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    creator.status === 'active'
                      ? 'bg-green-900 text-green-200'
                      : 'bg-red-900 text-red-200'
                  }`}
                >
                  {creator.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreatorList; 