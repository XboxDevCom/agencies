import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Creator } from '../types/Creator';
import AgencyModal from './AgencyModal.tsx';
import { TableCaption } from './Accessibility.tsx';

interface CreatorListProps {
  creators: Creator[];
  onSort: (field: keyof Creator) => void;
  sortField: keyof Creator;
  sortDirection: 'asc' | 'desc';
}

// Column configuration for better maintainability
const COLUMNS = [
  { key: 'agency' as keyof Creator, label: 'Agentur', alwaysVisible: true, sortable: true },
  { key: 'type' as keyof Creator, label: 'Typ', hiddenOn: 'mobile', sortable: true },
  { key: 'pricing_model' as keyof Creator, label: 'Preismodell', hiddenOn: 'mobile', sortable: true },
  { key: 'legal_form' as keyof Creator, label: 'Rechtsform', hiddenOn: 'tablet', sortable: true },
  { key: 'location' as keyof Creator, label: 'Standort', hiddenOn: 'tablet', sortable: true },
  { key: 'founding_year' as keyof Creator, label: 'Gegründet', hiddenOn: 'desktop', sortable: true },
  { key: 'departments' as keyof Creator, label: 'Abteilungen', hiddenOn: 'mobile', sortable: false },
  { key: 'focus' as keyof Creator, label: 'Fokus', hiddenOn: 'mobile', sortable: false },
  { key: 'platforms' as keyof Creator, label: 'Plattformen', hiddenOn: 'tablet', sortable: false },
  { key: 'references' as keyof Creator, label: 'Referenzen', hiddenOn: 'desktop', sortable: false },
  { key: 'conditions' as keyof Creator, label: 'Bedingungen', hiddenOn: 'desktop', sortable: false },
  { key: 'followers' as keyof Creator, label: 'Follower', alwaysVisible: true, sortable: true },
  { key: 'status' as keyof Creator, label: 'Status', alwaysVisible: true, sortable: true },
];

const getColumnClasses = (hiddenOn?: string) => {
  const baseClasses = 'px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider transition-colors duration-200';
  
  if (!hiddenOn) return baseClasses;
  
  const hiddenClasses = {
    mobile: 'hidden sm:table-cell',
    tablet: 'hidden md:table-cell',
    desktop: 'hidden lg:table-cell'
  };
  
  return `${hiddenClasses[hiddenOn as keyof typeof hiddenClasses]} ${baseClasses}`;
};

const getCellClasses = (hiddenOn?: string) => {
  const baseClasses = 'px-3 sm:px-6 py-2 sm:py-4 text-sm text-gray-300';
  
  if (!hiddenOn) return baseClasses;
  
  const hiddenClasses = {
    mobile: 'hidden sm:table-cell',
    tablet: 'hidden md:table-cell',
    desktop: 'hidden lg:table-cell'
  };
  
  return `${hiddenClasses[hiddenOn as keyof typeof hiddenClasses]} ${baseClasses}`;
};

// Badge component for consistent styling
const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant: 'type' | 'pricing' | 'legal' | 'department' | 'focus' | 'platform' | 'reference' | 'condition' | 'status';
  status?: 'active' | 'inactive' | 'exclusive' | 'mass' | 'commission' | 'base_fee';
}> = ({ children, variant, status }) => {
  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
    
    switch (variant) {
      case 'type':
        return status === 'exclusive' 
          ? `${baseClasses} bg-indigo-900 text-indigo-200`
          : `${baseClasses} bg-orange-900 text-orange-200`;
      case 'pricing':
        return status === 'commission'
          ? `${baseClasses} bg-teal-900 text-teal-200`
          : `${baseClasses} bg-cyan-900 text-cyan-200`;
      case 'legal':
        return `${baseClasses} bg-blue-900 text-blue-200`;
      case 'department':
        return `${baseClasses} bg-pink-900 text-pink-200`;
      case 'focus':
        return `${baseClasses} bg-purple-900 text-purple-200`;
      case 'platform':
        return `${baseClasses} bg-blue-900 text-blue-200`;
      case 'reference':
        return `${baseClasses} bg-green-900 text-green-200`;
      case 'condition':
        return `${baseClasses} bg-yellow-900 text-yellow-200`;
      case 'status':
        return status === 'active'
          ? `${baseClasses} bg-green-900 text-green-200`
          : `${baseClasses} bg-red-900 text-red-200`;
      default:
        return `${baseClasses} bg-gray-900 text-gray-200`;
    }
  };

  return <span className={getVariantClasses()}>{children}</span>;
};

// Horizontal Scrollbar Component
const HorizontalScrollbar: React.FC<{
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  position: 'top' | 'bottom';
}> = ({ scrollContainerRef, position }) => {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollbarId = `horizontal-scrollbar-${position}`;
  const tableId = 'creator-table';

  // Update scrollbar dimensions
  const updateScrollbar = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setScrollWidth(container.scrollWidth);
      setClientWidth(container.clientWidth);
      setScrollLeft(container.scrollLeft);
    }
  }, [scrollContainerRef]);

  // Sync scroll position
  const handleScrollbarScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, [scrollContainerRef]);

  // Listen to container scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleContainerScroll = () => {
      if (scrollbarRef.current) {
        scrollbarRef.current.scrollLeft = container.scrollLeft;
      }
      setScrollLeft(container.scrollLeft);
    };

    const handleResize = () => {
      updateScrollbar();
    };

    container.addEventListener('scroll', handleContainerScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial update
    updateScrollbar();

    return () => {
      container.removeEventListener('scroll', handleContainerScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollContainerRef, updateScrollbar]);

  // Don't render if no horizontal scroll is needed
  if (scrollWidth <= clientWidth + 5) return null; // +5px tolerance for rounding

  const maxScroll = scrollWidth - clientWidth;

  return (
    <div 
      className={`w-full ${
        position === 'top' 
          ? 'bg-gray-800 border-b border-gray-600 rounded-t-lg' 
          : 'bg-gray-800 border-t border-gray-600 rounded-b-lg'
      }`}
      aria-label={`Horizontaler Scrollbalken ${position === 'top' ? 'oben' : 'unten'}`}
    >
      <div
        id={scrollbarId}
        ref={scrollbarRef}
        className={`overflow-x-auto overflow-y-hidden bg-gray-700 ${
          position === 'top' 
            ? 'h-6 rounded-t-lg' 
            : 'h-6 rounded-b-lg'
        } mx-3 my-2`}
        onScroll={handleScrollbarScroll}
        tabIndex={0}
        role="scrollbar"
        aria-orientation="horizontal"
        aria-controls={tableId}
        aria-valuenow={scrollLeft}
        aria-valuemin={0}
        aria-valuemax={maxScroll}
        aria-valuetext={`${Math.round((scrollLeft / maxScroll) * 100)}% horizontal gescrollt`}
        onKeyDown={(e) => {
          const container = scrollContainerRef.current;
          if (!container) return;

          const scrollStep = 50;
          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              container.scrollLeft = Math.max(0, container.scrollLeft - scrollStep);
              break;
            case 'ArrowRight':
              e.preventDefault();
              container.scrollLeft = Math.min(maxScroll, container.scrollLeft + scrollStep);
              break;
            case 'Home':
              e.preventDefault();
              container.scrollLeft = 0;
              break;
            case 'End':
              e.preventDefault();
              container.scrollLeft = maxScroll;
              break;
          }
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 transition-all duration-200 rounded-full my-1 shadow-md border border-green-600"
          style={{ width: scrollWidth }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

const CreatorList: React.FC<CreatorListProps> = ({
  creators,
  onSort,
  sortField,
  sortDirection
}) => {
  const [selectedAgency, setSelectedAgency] = useState<Creator | null>(null);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const handleAgencyClick = useCallback((creator: Creator) => {
    setSelectedAgency(creator);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAgency(null);
    // Return focus to the button that opened the modal
    if (focusedRowIndex >= 0 && rowRefs.current[focusedRowIndex]) {
      const button = rowRefs.current[focusedRowIndex]?.querySelector('button');
      button?.focus();
    }
  }, [focusedRowIndex]);

  const handleSort = useCallback((field: keyof Creator) => {
    onSort(field);
    // Announce sort change
    const direction = sortField === field && sortDirection === 'asc' ? 'absteigend' : 'aufsteigend';
    const announcement = `Tabelle nach ${field} ${direction} sortiert`;
    
    // Create temporary live region for announcement
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = announcement;
    document.body.appendChild(liveRegion);
    
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, [onSort, sortField, sortDirection]);

  const renderSortIcon = useCallback((field: keyof Creator, sortable: boolean) => {
    if (!sortable) return null;
    
    if (field !== sortField) {
      return (
        <svg 
          className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg 
        className="w-3 h-3 ml-1" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg 
        className="w-3 h-3 ml-1" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  }, [sortField, sortDirection]);

  const renderCellContent = useCallback((creator: Creator, column: typeof COLUMNS[0], rowIndex: number) => {
    const value = creator[column.key];

    switch (column.key) {
      case 'agency':
        return (
          <div>
            <button
              onClick={() => {
                setFocusedRowIndex(rowIndex);
                handleAgencyClick(creator);
              }}
              className="text-green-400 hover:text-green-300 focus:text-green-300 transition-colors duration-200 text-left font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
              aria-label={`Details für ${creator.agency} anzeigen`}
              aria-describedby={`agency-${rowIndex}-summary`}
            >
              {creator.agency}
            </button>
            {/* Mobile summary */}
            <div id={`agency-${rowIndex}-summary`} className="sm:hidden mt-2 space-y-1">
              <div className="flex flex-wrap gap-1">
                <Badge variant="type" status={creator.type}>{creator.type}</Badge>
                <Badge variant="pricing" status={creator.pricing_model}>
                  {creator.pricing_model === 'commission' ? 'Provision' : 'Grundgebühr'}
                </Badge>
                <Badge variant="legal">{creator.legal_form}</Badge>
              </div>
              <div className="text-xs text-gray-400">
                {creator.location} • Gegründet {creator.founding_year}
              </div>
              {creator.focus && creator.focus.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {creator.focus.slice(0, 3).map((item, i) => (
                    <Badge key={i} variant="focus">{item}</Badge>
                  ))}
                  {creator.focus.length > 3 && (
                    <span className="text-xs text-gray-400">+{creator.focus.length - 3} weitere</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'type':
        return <Badge variant="type" status={value as any}>{value === 'exclusive' ? 'Exklusiv' : 'Masse'}</Badge>;

      case 'pricing_model':
        return (
          <Badge variant="pricing" status={value as any}>
            {value === 'commission' ? 'Provision' : 'Grundgebühr'}
          </Badge>
        );

      case 'legal_form':
        return <Badge variant="legal">{value}</Badge>;

      case 'departments':
        if (!Array.isArray(value) || value.length === 0) return <span className="text-gray-500">Keine Angabe</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, i) => (
              <Badge key={i} variant="department">{item}</Badge>
            ))}
          </div>
        );

      case 'focus':
        if (!Array.isArray(value) || value.length === 0) return <span className="text-gray-500">Keine Angabe</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, i) => (
              <Badge key={i} variant="focus">{item}</Badge>
            ))}
          </div>
        );

      case 'platforms':
        if (!Array.isArray(value) || value.length === 0) return <span className="text-gray-500">Keine Angabe</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, i) => (
              <Badge key={i} variant="platform">{item}</Badge>
            ))}
          </div>
        );

      case 'references':
        if (!Array.isArray(value) || value.length === 0) return <span className="text-gray-500">Keine Angabe</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, i) => (
              <Badge key={i} variant="reference">{item}</Badge>
            ))}
          </div>
        );

      case 'conditions':
        if (!Array.isArray(value) || value.length === 0) return <span className="text-gray-500">Keine Angabe</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, i) => (
              <Badge key={i} variant="condition">{item}</Badge>
            ))}
          </div>
        );

      case 'followers':
        return (
          <span aria-label={`${value} Follower`}>
            {typeof value === 'number' ? value.toLocaleString('de-DE') : 'Keine Angabe'}
          </span>
        );

      case 'status':
        return (
          <Badge variant="status" status={value as any}>
            {value === 'active' ? 'Aktiv' : 'Inaktiv'}
          </Badge>
        );

      default:
        return value || <span className="text-gray-500">Keine Angabe</span>;
    }
  }, [handleAgencyClick]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tableRef.current) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedRowIndex(prev => Math.min(prev + 1, creators.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedRowIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          setFocusedRowIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedRowIndex(creators.length - 1);
          break;
        case 'Enter':
        case ' ':
          if (focusedRowIndex >= 0 && creators[focusedRowIndex]) {
            e.preventDefault();
            handleAgencyClick(creators[focusedRowIndex]);
          }
          break;
      }
    };

    if (focusedRowIndex >= 0) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [focusedRowIndex, creators, handleAgencyClick]);

  if (creators.length === 0) {
    return (
      <div 
        className="bg-gray-800 shadow-lg rounded-lg p-8 text-center border border-gray-700"
        role="status"
        aria-live="polite"
      >
        <div className="text-gray-400 text-4xl mb-4" role="img" aria-label="Keine Ergebnisse">🔍</div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Keine Agenturen gefunden</h3>
        <p className="text-gray-400">
          Versuche deine Suchkriterien zu ändern oder Filter zurückzusetzen.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="shadow-lg overflow-hidden border border-gray-700 rounded-lg">
        {/* Top Horizontal Scrollbar */}
        <HorizontalScrollbar 
          scrollContainerRef={scrollContainerRef} 
          position="top" 
        />
        
        {/* Table Container */}
        <div 
          ref={scrollContainerRef}
          className="table-container bg-gray-800"
        >
          <table 
            id="creator-table"
            ref={tableRef}
            className="min-w-full divide-y divide-gray-700"
            role="table"
            aria-label="Creator Agencies Tabelle"
          >
            <TableCaption 
              totalItems={creators.length} 
              filteredItems={creators.length}
            >
              Creator Agencies im DACH-Raum
            </TableCaption>
            
            <thead className="bg-gray-900">
              <tr role="row">
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`group ${getColumnClasses(column.hiddenOn)} ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-800' : ''
                    }`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    role="columnheader"
                    tabIndex={column.sortable ? 0 : -1}
                    onKeyDown={column.sortable ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(column.key);
                      }
                    } : undefined}
                    aria-sort={
                      column.sortable && sortField === column.key
                        ? sortDirection === 'asc' ? 'ascending' : 'descending'
                        : column.sortable ? 'none' : undefined
                    }
                    aria-label={
                      column.sortable 
                        ? `${column.label} - ${sortField === column.key 
                            ? `Aktuell ${sortDirection === 'asc' ? 'aufsteigend' : 'absteigend'} sortiert. Klicken zum ${sortDirection === 'asc' ? 'absteigend' : 'aufsteigend'} sortieren.`
                            : 'Klicken zum Sortieren'}`
                        : column.label
                    }
                  >
                    <div className="flex items-center">
                      {column.label}
                      {renderSortIcon(column.key, column.sortable)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {creators.map((creator, index) => (
                <tr 
                  key={`${creator.agency}-${index}`} 
                  ref={el => rowRefs.current[index] = el}
                  className={`transition-colors duration-150 ${
                    focusedRowIndex === index ? 'bg-gray-600' : 'hover:bg-gray-700'
                  }`}
                  role="row"
                  aria-rowindex={index + 2} // +2 because header is row 1
                >
                  {COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      className={getCellClasses(column.hiddenOn)}
                      role="gridcell"
                    >
                      {renderCellContent(creator, column, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Horizontal Scrollbar */}
        <HorizontalScrollbar 
          scrollContainerRef={scrollContainerRef} 
          position="bottom" 
        />
      </div>

      {selectedAgency && (
        <AgencyModal
          agency={selectedAgency}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CreatorList;
