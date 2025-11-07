import React, { useState, useMemo } from 'react';
import { InvestmentCompany } from '../types/Investment';
import { ALL_INVESTMENT_COMPANIES, GAMING_COMPANIES, TECH_COMPANIES, INFRASTRUCTURE_COMPANIES } from '../data/investmentCompanies';

const InvestorTips: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<'all' | 'gaming' | 'tech' | 'infrastructure'>('all');
  const [sortBy, setSortBy] = useState<'dividendYield' | 'marketCap' | 'name'>('dividendYield');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredCompanies = useMemo(() => {
    let companies: InvestmentCompany[] = [];
    
    switch (selectedSector) {
      case 'gaming':
        companies = GAMING_COMPANIES;
        break;
      case 'tech':
        companies = TECH_COMPANIES;
        break;
      case 'infrastructure':
        companies = INFRASTRUCTURE_COMPANIES;
        break;
      default:
        companies = ALL_INVESTMENT_COMPANIES;
    }

    // Sort companies
    return [...companies].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dividendYield':
          comparison = a.dividendYield - b.dividendYield;
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [selectedSector, sortBy, sortOrder]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000) {
      return `$${(amount).toFixed(1)}B`;
    }
    return `$${amount.toFixed(1)}B`;
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const getSectorBadgeColor = (sector: string): string => {
    switch (sector) {
      case 'gaming':
        return 'bg-purple-600';
      case 'tech':
        return 'bg-blue-600';
      case 'infrastructure':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRatingBadge = (rating?: 'buy' | 'hold' | 'sell'): JSX.Element => {
    if (!rating) return <></>;
    
    const colors = {
      buy: 'bg-green-600 text-white',
      hold: 'bg-yellow-600 text-white',
      sell: 'bg-red-600 text-white',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[rating]}`}>
        {rating.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-500 mb-3">
          📊 Investoren-Tipps & Top Unternehmen
        </h1>
        <p className="text-gray-400 text-lg">
          Die besten Gaming-, Tech- und Infrastruktur-Unternehmen für Dividenden-Investoren
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-yellow-300 mb-2">⚠️ Wichtiger Hinweis</h3>
        <p className="text-yellow-200 text-sm">
          Die hier präsentierten Informationen dienen ausschließlich zu Bildungszwecken und stellen keine 
          Anlageberatung dar. Investitionen in Wertpapiere sind mit Risiken verbunden. Bitte konsultieren 
          Sie einen qualifizierten Finanzberater, bevor Sie Anlageentscheidungen treffen.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Gesamt Unternehmen</div>
          <div className="text-2xl font-bold text-white">{ALL_INVESTMENT_COMPANIES.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-purple-700">
          <div className="text-sm text-gray-400 mb-1">Gaming</div>
          <div className="text-2xl font-bold text-purple-400">{GAMING_COMPANIES.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-blue-700">
          <div className="text-sm text-gray-400 mb-1">Tech</div>
          <div className="text-2xl font-bold text-blue-400">{TECH_COMPANIES.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-orange-700">
          <div className="text-sm text-gray-400 mb-1">Infrastruktur</div>
          <div className="text-2xl font-bold text-orange-400">{INFRASTRUCTURE_COMPANIES.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sector-filter" className="block text-sm font-medium text-gray-300 mb-2">Sektor</label>
            <select
              id="sector-filter"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Alle Sektoren</option>
              <option value="gaming">🎮 Gaming</option>
              <option value="tech">💻 Tech</option>
              <option value="infrastructure">🏗️ Infrastruktur</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort-by-filter" className="block text-sm font-medium text-gray-300 mb-2">Sortieren nach</label>
            <select
              id="sort-by-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="dividendYield">Dividendenrendite</option>
              <option value="marketCap">Marktkapitalisierung</option>
              <option value="name">Name</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort-order-filter" className="block text-sm font-medium text-gray-300 mb-2">Reihenfolge</label>
            <select
              id="sort-order-filter"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="desc">Absteigend</option>
              <option value="asc">Aufsteigend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Unternehmen
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Ticker
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Sektor
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Marktkapital.
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Div.-Rendite
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Ausschüttung
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{company.name}</div>
                      <div className="text-xs text-gray-400">{company.category}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-mono text-green-400">{company.ticker}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getSectorBadgeColor(company.sector)} text-white`}>
                      {company.sector.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm text-white">{formatCurrency(company.marketCap)}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-semibold ${company.dividendYield >= 3 ? 'text-green-400' : company.dividendYield >= 1 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {formatPercent(company.dividendYield)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-xs text-gray-400 capitalize">
                      {company.dividendFrequency === 'quarterly' ? 'Vierteljährlich' : 
                       company.dividendFrequency === 'monthly' ? 'Monatlich' : 'Jährlich'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getRatingBadge(company.analystRating)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment Tips */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-green-400 mb-4">💡 Investitions-Tipps für Anfänger</h2>
        <div className="space-y-4 text-gray-300">
          <div className="flex items-start">
            <span className="text-green-500 mr-3 text-xl">✓</span>
            <div>
              <h3 className="font-semibold text-white mb-1">Diversifikation ist der Schlüssel</h3>
              <p className="text-sm">Verteilen Sie Ihr Kapital auf verschiedene Sektoren und Unternehmen, um das Risiko zu minimieren.</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-3 text-xl">✓</span>
            <div>
              <h3 className="font-semibold text-white mb-1">Langfristig denken</h3>
              <p className="text-sm">Dividenden-Investitionen sind eine langfristige Strategie. Erwarten Sie keine schnellen Gewinne.</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-3 text-xl">✓</span>
            <div>
              <h3 className="font-semibold text-white mb-1">Dividenden reinvestieren</h3>
              <p className="text-sm">Nutzen Sie den Zinseszinseffekt, indem Sie erhaltene Dividenden wieder anlegen.</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-3 text-xl">✓</span>
            <div>
              <h3 className="font-semibold text-white mb-1">Fundamentalanalyse durchführen</h3>
              <p className="text-sm">Achten Sie auf solide Unternehmenszahlen, stabile Dividendenhistorie und nachhaltige Geschäftsmodelle.</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-3 text-xl">✓</span>
            <div>
              <h3 className="font-semibold text-white mb-1">Steuern berücksichtigen</h3>
              <p className="text-sm">Informieren Sie sich über die steuerlichen Auswirkungen in Ihrem Land und nutzen Sie Freibeträge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorTips;
