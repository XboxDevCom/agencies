import React, { useState } from 'react';
import { Creator } from '../types/Creator';
import AgencyModal from './AgencyModal';

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
  const [selectedAgency, setSelectedAgency] = useState<Creator | null>(null);

  const renderSortIcon = (field: keyof Creator) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <>
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('agency')}
                >
                  Agency {renderSortIcon('agency')}
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('type')}
                >
                  Type {renderSortIcon('type')}
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('pricing_model')}
                >
                  Pricing {renderSortIcon('pricing_model')}
                </th>
                <th
                  scope="col"
                  className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('legal_form')}
                >
                  Legal Form {renderSortIcon('legal_form')}
                </th>
                <th
                  scope="col"
                  className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('location')}
                >
                  Location {renderSortIcon('location')}
                </th>
                <th
                  scope="col"
                  className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('founding_year')}
                >
                  Founded {renderSortIcon('founding_year')}
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('departments')}
                >
                  Departments {renderSortIcon('departments')}
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('focus')}
                >
                  Focus {renderSortIcon('focus')}
                </th>
                <th
                  scope="col"
                  className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('platforms')}
                >
                  Platforms {renderSortIcon('platforms')}
                </th>
                <th
                  scope="col"
                  className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('references')}
                >
                  References {renderSortIcon('references')}
                </th>
                <th
                  scope="col"
                  className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('conditions')}
                >
                  Conditions {renderSortIcon('conditions')}
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('followers')}
                >
                  Followers {renderSortIcon('followers')}
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
                  onClick={() => onSort('status')}
                >
                  Status {renderSortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {creators.map((creator, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    <button
                      onClick={() => setSelectedAgency(creator)}
                      className="text-green-400 hover:text-green-300 transition-colors duration-200 text-left"
                    >
                      {creator.agency}
                    </button>
                    <div className="sm:hidden mt-1">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            creator.type === 'exclusive'
                              ? 'bg-indigo-900 text-indigo-200'
                              : 'bg-orange-900 text-orange-200'
                          }`}
                        >
                          {creator.type}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            creator.pricing_model === 'commission'
                              ? 'bg-teal-900 text-teal-200'
                              : 'bg-cyan-900 text-cyan-200'
                          }`}
                        >
                          {creator.pricing_model === 'commission' ? 'Commission' : 'Base Fee'}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                          {creator.legal_form}
                        </span>
                        <span className="text-gray-400 text-xs">{creator.location}</span>
                        <span className="text-gray-400 text-xs">Founded {creator.founding_year}</span>
                        {creator.departments.map((dept, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-900 text-pink-200"
                          >
                            {dept}
                          </span>
                        ))}
                        {creator.focus.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        creator.type === 'exclusive'
                          ? 'bg-indigo-900 text-indigo-200'
                          : 'bg-orange-900 text-orange-200'
                      }`}
                    >
                      {creator.type}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        creator.pricing_model === 'commission'
                          ? 'bg-teal-900 text-teal-200'
                          : 'bg-cyan-900 text-cyan-200'
                      }`}
                    >
                      {creator.pricing_model === 'commission' ? 'Commission' : 'Base Fee'}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                      {creator.legal_form}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    {creator.location}
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    {creator.founding_year}
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {creator.departments.map((department, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-900 text-pink-200"
                        >
                          {department}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {creator.focus.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {creator.platforms.map((platform, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {creator.references.map((reference, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200"
                        >
                          {reference}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {creator.conditions.map((condition, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    {creator.followers.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
      </div>

      <AgencyModal
        agency={selectedAgency}
        onClose={() => setSelectedAgency(null)}
      />
    </>
  );
};

export default CreatorList; 