import React, { useState, useMemo } from 'react';
import { TAX_CONFIGS, calculateInvestmentNeeded, PortfolioCalculation } from '../types/Investment';
import { getHighDividendCompanies } from '../data/investmentCompanies';

const DividendCalculator: React.FC = () => {
  const [targetMonthlyNet, setTargetMonthlyNet] = useState<number>(1200);
  const [country, setCountry] = useState<'DE' | 'US' | 'CH'>('DE');
  const [includeHealthInsurance, setIncludeHealthInsurance] = useState<boolean>(true);
  const [includeSocialSecurity, setIncludeSocialSecurity] = useState<boolean>(true);

  const calculation = useMemo((): PortfolioCalculation | null => {
    if (targetMonthlyNet <= 0) return null;

    const taxConfig = { ...TAX_CONFIGS[country] };
    
    // Adjust for optional insurances
    if (country === 'DE') {
      if (!includeHealthInsurance) taxConfig.healthInsurance = 0;
      if (!includeSocialSecurity) taxConfig.socialSecurity = 0;
    }

    // Calculate gross annual dividend needed
    const annualNet = targetMonthlyNet * 12;
    let effectiveTaxRate = taxConfig.dividendTax;
    
    if (taxConfig.solidaritySurcharge) {
      effectiveTaxRate += taxConfig.dividendTax * (taxConfig.solidaritySurcharge / 100);
    }
    
    if (taxConfig.healthInsurance && includeHealthInsurance) {
      effectiveTaxRate += taxConfig.healthInsurance;
    }
    
    if (taxConfig.socialSecurity && includeSocialSecurity) {
      effectiveTaxRate += taxConfig.socialSecurity;
    }
    
    const grossAnnualRequired = annualNet / (1 - effectiveTaxRate / 100);
    
    // Get high dividend companies for portfolio
    const companies = getHighDividendCompanies(2.0);
    const avgYield = companies.reduce((sum, c) => sum + c.dividendYield, 0) / companies.length;
    
    // Calculate investment needed
    const totalInvestment = calculateInvestmentNeeded(grossAnnualRequired, avgYield);
    
    // Build suggested portfolio (top 5-10 companies)
    const portfolioCompanies = companies.slice(0, 8);
    const suggestedPortfolio = portfolioCompanies.map((company, idx) => {
      // Diversify portfolio weights
      const weight = idx === 0 ? 0.20 : idx === 1 ? 0.18 : 0.62 / (portfolioCompanies.length - 2);
      const investment = totalInvestment * weight;
      const shares = Math.floor(investment / company.price);
      const actualInvestment = shares * company.price;
      const annualDividend = actualInvestment * (company.dividendYield / 100);
      
      return {
        company,
        shares,
        investment: actualInvestment,
        annualDividend,
        monthlyDividend: annualDividend / 12,
        percentageOfPortfolio: weight * 100,
      };
    });
    
    // Calculate taxes
    const dividendTax = grossAnnualRequired * (taxConfig.dividendTax / 100);
    const solidaritySurcharge = taxConfig.solidaritySurcharge 
      ? dividendTax * (taxConfig.solidaritySurcharge / 100) 
      : 0;
    const healthInsurance = (taxConfig.healthInsurance && includeHealthInsurance)
      ? grossAnnualRequired * (taxConfig.healthInsurance / 100)
      : 0;
    const socialSecurity = (taxConfig.socialSecurity && includeSocialSecurity)
      ? grossAnnualRequired * (taxConfig.socialSecurity / 100)
      : 0;
    
    return {
      targetMonthlyNet,
      country,
      grossMonthlyRequired: grossAnnualRequired / 12,
      annualDividendRequired: grossAnnualRequired,
      totalInvestmentRequired: totalInvestment,
      averageDividendYield: avgYield,
      taxes: {
        incomeTax: dividendTax,
        healthInsurance,
        socialSecurity,
        solidaritySurcharge,
        total: dividendTax + solidaritySurcharge + healthInsurance + socialSecurity,
      },
      suggestedPortfolio,
    };
  }, [targetMonthlyNet, country, includeHealthInsurance, includeSocialSecurity]);

  const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (amount: number): string => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-green-400 mb-6">
          💰 Dividenden-Rendite-Rechner
        </h2>
        
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="monthly-net-input" className="block text-sm font-medium text-gray-300 mb-2">
              Gewünschtes Netto-Einkommen pro Monat
            </label>
            <div className="relative">
              <input
                id="monthly-net-input"
                type="number"
                value={targetMonthlyNet}
                onChange={(e) => setTargetMonthlyNet(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="100"
              />
              <span className="absolute right-3 top-3 text-gray-400">€</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="country-select" className="block text-sm font-medium text-gray-300 mb-2">
              Land
            </label>
            <select
              id="country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value as 'DE' | 'US' | 'CH')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="DE">🇩🇪 Deutschland</option>
              <option value="US">🇺🇸 USA</option>
              <option value="CH">🇨🇭 Schweiz</option>
            </select>
          </div>
        </div>

        {country === 'DE' && (
          <div className="space-y-3 mb-6">
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                checked={includeHealthInsurance}
                onChange={(e) => setIncludeHealthInsurance(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm">Krankenversicherung einbeziehen (14,6%)</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                checked={includeSocialSecurity}
                onChange={(e) => setIncludeSocialSecurity(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm">Rentenversicherung einbeziehen (18,6%)</span>
            </label>
          </div>
        )}
      </div>

      {calculation && (
        <>
          {/* Results Overview */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              📊 Berechnungsergebnis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Brutto-Dividenden (Monat)</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(calculation.grossMonthlyRequired)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Brutto-Dividenden (Jahr)</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(calculation.annualDividendRequired)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Benötigtes Kapital</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(calculation.totalInvestmentRequired)}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="text-sm text-blue-300">
                <strong>Durchschnittliche Dividendenrendite:</strong>{' '}
                {formatNumber(calculation.averageDividendYield)}%
              </div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              💸 Steuer- und Abgabenübersicht
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Kapitalertragsteuer</span>
                <span className="text-white font-semibold">
                  {formatCurrency(calculation.taxes.incomeTax)}
                </span>
              </div>
              
              {calculation.taxes.solidaritySurcharge && calculation.taxes.solidaritySurcharge > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Solidaritätszuschlag</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(calculation.taxes.solidaritySurcharge)}
                  </span>
                </div>
              )}
              
              {calculation.taxes.healthInsurance && calculation.taxes.healthInsurance > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Krankenversicherung</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(calculation.taxes.healthInsurance)}
                  </span>
                </div>
              )}
              
              {calculation.taxes.socialSecurity && calculation.taxes.socialSecurity > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Rentenversicherung</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(calculation.taxes.socialSecurity)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3 bg-gray-700 px-4 rounded-lg">
                <span className="text-gray-200 font-bold">Gesamt Abzüge (Jahr)</span>
                <span className="text-red-400 font-bold text-lg">
                  {formatCurrency(calculation.taxes.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Suggestion */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              📈 Beispiel-Portfolio
            </h3>
            
            <div className="mb-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-200">
                <strong>Hinweis:</strong> Dies ist ein Beispiel-Portfolio zur Veranschaulichung. 
                Es stellt keine Anlageberatung dar. Bitte konsultieren Sie einen Finanzberater.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2 text-gray-300 font-semibold">Unternehmen</th>
                    <th className="text-left py-3 px-2 text-gray-300 font-semibold">Ticker</th>
                    <th className="text-right py-3 px-2 text-gray-300 font-semibold">Aktien</th>
                    <th className="text-right py-3 px-2 text-gray-300 font-semibold">Investition</th>
                    <th className="text-right py-3 px-2 text-gray-300 font-semibold">Dividende/Jahr</th>
                    <th className="text-right py-3 px-2 text-gray-300 font-semibold">Dividende/Monat</th>
                    <th className="text-right py-3 px-2 text-gray-300 font-semibold">Anteil</th>
                  </tr>
                </thead>
                <tbody>
                  {calculation.suggestedPortfolio.map((position, idx) => (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-2 text-white">{position.company.name}</td>
                      <td className="py-3 px-2 text-green-400 font-mono">{position.company.ticker}</td>
                      <td className="py-3 px-2 text-right text-white">{position.shares}</td>
                      <td className="py-3 px-2 text-right text-white">
                        {formatCurrency(position.investment, position.company.currency)}
                      </td>
                      <td className="py-3 px-2 text-right text-green-300">
                        {formatCurrency(position.annualDividend)}
                      </td>
                      <td className="py-3 px-2 text-right text-green-300">
                        {formatCurrency(position.monthlyDividend)}
                      </td>
                      <td className="py-3 px-2 text-right text-gray-300">
                        {formatNumber(position.percentageOfPortfolio)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-700 font-bold">
                    <td colSpan={3} className="py-3 px-2 text-white">Gesamt</td>
                    <td className="py-3 px-2 text-right text-white">
                      {formatCurrency(calculation.suggestedPortfolio.reduce((sum, p) => sum + p.investment, 0))}
                    </td>
                    <td className="py-3 px-2 text-right text-green-400">
                      {formatCurrency(calculation.suggestedPortfolio.reduce((sum, p) => sum + p.annualDividend, 0))}
                    </td>
                    <td className="py-3 px-2 text-right text-green-400">
                      {formatCurrency(calculation.suggestedPortfolio.reduce((sum, p) => sum + p.monthlyDividend, 0))}
                    </td>
                    <td className="py-3 px-2 text-right text-white">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DividendCalculator;
