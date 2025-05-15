import React from 'react';
import { Creator } from '../types/Creator';

interface AgencyModalProps {
  agency: Creator | null;
  onClose: () => void;
}

const AgencyModal: React.FC<AgencyModalProps> = ({ agency, onClose }) => {
  if (!agency) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{agency.agency}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-400">{agency.location}</p>
                <span className="text-gray-500">•</span>
                <p className="text-gray-400">Founded {agency.founding_year}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  agency.type === 'exclusive'
                    ? 'bg-indigo-900 text-indigo-200'
                    : 'bg-orange-900 text-orange-200'
                }`}
              >
                {agency.type}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  agency.pricing_model === 'commission'
                    ? 'bg-teal-900 text-teal-200'
                    : 'bg-cyan-900 text-cyan-200'
                }`}
              >
                {agency.pricing_model === 'commission' ? 'Commission' : 'Base Fee'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-200">
                {agency.legal_form}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Departments</h3>
              <div className="flex flex-wrap gap-2">
                {agency.departments.map((department, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-900 text-pink-200"
                  >
                    {department}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {agency.focus.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900 text-purple-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{agency.description}</p>
            </div>

            <div className="flex justify-end">
              <a
                href={agency.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Visit Website
                <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyModal; 