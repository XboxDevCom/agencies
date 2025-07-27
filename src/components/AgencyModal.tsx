import React, { useEffect, useRef } from 'react';
import { Creator } from '../types/Creator';
import { FocusTrap, AccessibleButton } from './Accessibility.tsx';

interface AgencyModalProps {
  agency: Creator | null;
  onClose: () => void;
}

const AgencyModal: React.FC<AgencyModalProps> = ({ agency, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (agency) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = 'unset';
        
        // Restore focus to previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [agency]);

  if (!agency) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
        role="button"
        tabIndex={-1}
        aria-label="Modal schließen"
      >
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        {/* Modal positioning */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <FocusTrap active={true} onEscape={onClose}>
          <div
            ref={modalRef}
            className="inline-block align-bottom bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-green-400 mb-2"
                >
                  {agency.agency}
                </h2>
                {agency.url && (
                  <a
                    href={agency.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
                    aria-label={`Website von ${agency.agency} in neuem Tab öffnen`}
                  >
                    Website besuchen
                    <svg
                      className="inline w-3 h-3 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
              </div>
              
              <AccessibleButton
                onClick={onClose}
                variant="secondary"
                size="sm"
                ariaLabel="Modal schließen"
                className="ml-4"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </AccessibleButton>
            </div>

            {/* Content */}
            <div id="modal-description" className="space-y-4">
              {/* Basic Information */}
              <section aria-labelledby="basic-info-heading">
                <h3 id="basic-info-heading" className="text-lg font-medium text-gray-200 mb-3">
                  Grundinformationen
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="font-medium text-gray-300">Typ:</dt>
                    <dd className="text-gray-400">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          agency.type === 'exclusive'
                            ? 'bg-indigo-900 text-indigo-200'
                            : 'bg-orange-900 text-orange-200'
                        }`}
                      >
                        {agency.type === 'exclusive' ? 'Exklusiv' : 'Masse'}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-300">Preismodell:</dt>
                    <dd className="text-gray-400">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          agency.pricing_model === 'commission'
                            ? 'bg-teal-900 text-teal-200'
                            : 'bg-cyan-900 text-cyan-200'
                        }`}
                      >
                        {agency.pricing_model === 'commission' ? 'Provision' : 'Grundgebühr'}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-300">Rechtsform:</dt>
                    <dd className="text-gray-400">{agency.legal_form}</dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-300">Standort:</dt>
                    <dd className="text-gray-400">{agency.location}</dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-300">Gegründet:</dt>
                    <dd className="text-gray-400">{agency.founding_year}</dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-300">Status:</dt>
                    <dd className="text-gray-400">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          agency.status === 'active'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                        }`}
                      >
                        {agency.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Description */}
              {agency.description && (
                <section aria-labelledby="description-heading">
                  <h3 id="description-heading" className="text-lg font-medium text-gray-200 mb-2">
                    Beschreibung
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {agency.description}
                  </p>
                </section>
              )}

              {/* Departments */}
              {agency.departments && agency.departments.length > 0 && (
                <section aria-labelledby="departments-heading">
                  <h3 id="departments-heading" className="text-lg font-medium text-gray-200 mb-2">
                    Abteilungen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agency.departments.map((department, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-900 text-pink-200"
                      >
                        {department}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Focus Areas */}
              {agency.focus && agency.focus.length > 0 && (
                <section aria-labelledby="focus-heading">
                  <h3 id="focus-heading" className="text-lg font-medium text-gray-200 mb-2">
                    Fokus-Bereiche
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agency.focus.map((focus, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Platforms */}
              {agency.platforms && agency.platforms.length > 0 && (
                <section aria-labelledby="platforms-heading">
                  <h3 id="platforms-heading" className="text-lg font-medium text-gray-200 mb-2">
                    Unterstützte Plattformen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agency.platforms.map((platform, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {agency.references && agency.references.length > 0 && (
                <section aria-labelledby="references-heading">
                  <h3 id="references-heading" className="text-lg font-medium text-gray-200 mb-2">
                    Bekannte Referenzen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agency.references.map((reference, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200"
                      >
                        {reference}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Conditions */}
              {agency.conditions && agency.conditions.length > 0 && (
                <section aria-labelledby="conditions-heading">
                  <h3 id="conditions-heading" className="text-lg font-medium text-gray-200 mb-2">
                    Bedingungen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agency.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Follower Information */}
              <section aria-labelledby="followers-heading">
                <h3 id="followers-heading" className="text-lg font-medium text-gray-200 mb-2">
                  Follower-Reichweite
                </h3>
                <p className="text-gray-400 text-sm">
                  <span className="font-medium">
                    {agency.followers.toLocaleString('de-DE')}
                  </span>
                  {' '}Follower
                </p>
              </section>

              {/* Notes */}
              {agency.notes && (
                <section aria-labelledby="notes-heading">
                  <h3 id="notes-heading" className="text-lg font-medium text-gray-200 mb-2">
                    Zusätzliche Notizen
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {agency.notes}
                  </p>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <AccessibleButton
                onClick={onClose}
                variant="primary"
                ariaLabel="Modal schließen und zur Tabelle zurückkehren"
              >
                Schließen
              </AccessibleButton>
            </div>
          </div>
        </FocusTrap>
      </div>
    </div>
  );
};

export default AgencyModal;
