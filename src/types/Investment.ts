/**
 * Investment Company Types
 */

export interface InvestmentCompany {
  id: string;
  name: string;
  ticker: string;
  sector: 'gaming' | 'tech' | 'infrastructure';
  category: string;
  country: string;
  marketCap: number; // in billions USD
  dividendYield: number; // percentage
  price: number; // current stock price in USD
  currency: string;
  description: string;
  website: string;
  isin?: string;
  exchange: string;
  dividendFrequency: 'quarterly' | 'annual' | 'monthly';
  payoutRatio: number; // percentage
  dividendGrowth5Y: number; // 5 year dividend growth rate
  analystRating?: 'buy' | 'hold' | 'sell';
}

export interface TaxConfig {
  country: 'DE' | 'US' | 'CH';
  incomeTax: number; // percentage
  capitalGainsTax: number; // percentage
  dividendTax: number; // percentage
  solidaritySurcharge?: number; // only for DE
  churchTax?: number; // optional for DE
  healthInsurance?: number; // only for DE, percentage of gross
  socialSecurity?: number; // percentage
  deductions?: number; // standard deductions
}

export interface PortfolioCalculation {
  targetMonthlyNet: number;
  country: 'DE' | 'US' | 'CH';
  grossMonthlyRequired: number;
  annualDividendRequired: number;
  totalInvestmentRequired: number;
  averageDividendYield: number;
  taxes: {
    incomeTax: number;
    healthInsurance?: number;
    socialSecurity?: number;
    solidaritySurcharge?: number;
    churchTax?: number;
    total: number;
  };
  suggestedPortfolio: PortfolioPosition[];
}

export interface PortfolioPosition {
  company: InvestmentCompany;
  shares: number;
  investment: number;
  annualDividend: number;
  monthlyDividend: number;
  percentageOfPortfolio: number;
}

/**
 * Tax calculation utilities
 */
export const TAX_CONFIGS: Record<string, TaxConfig> = {
  DE: {
    country: 'DE',
    incomeTax: 25, // Kapitalertragsteuer (capital gains tax)
    capitalGainsTax: 25,
    dividendTax: 25,
    solidaritySurcharge: 5.5, // on top of capital gains tax
    healthInsurance: 14.6, // if not employed, percentage of income
    socialSecurity: 18.6, // pension insurance for self-employed
    deductions: 1000, // Sparer-Pauschbetrag (tax-free allowance)
  },
  US: {
    country: 'US',
    incomeTax: 22, // average federal income tax
    capitalGainsTax: 15, // long-term capital gains
    dividendTax: 15, // qualified dividends
    socialSecurity: 15.3, // self-employment tax (if applicable)
    deductions: 13850, // standard deduction (2023)
  },
  CH: {
    country: 'CH',
    incomeTax: 20, // varies by canton, average
    capitalGainsTax: 0, // no capital gains tax for private investors
    dividendTax: 35, // withholding tax (partially reclaimable)
    socialSecurity: 10.55, // AHV/IV/EO contributions
    deductions: 0,
  },
};

/**
 * Calculate required gross income to achieve target net income
 */
export function calculateGrossFromNet(
  netMonthly: number,
  config: TaxConfig
): number {
  const annualNet = netMonthly * 12;
  
  // For dividends, we need to account for dividend tax
  let effectiveTaxRate = config.dividendTax;
  
  // Add solidarity surcharge for Germany
  if (config.solidaritySurcharge) {
    effectiveTaxRate += config.dividendTax * (config.solidaritySurcharge / 100);
  }
  
  // For self-employed in Germany, add health insurance and social security
  if (config.healthInsurance && config.socialSecurity) {
    effectiveTaxRate += config.healthInsurance + config.socialSecurity;
  }
  
  // Calculate gross needed
  const grossAnnual = annualNet / (1 - effectiveTaxRate / 100);
  
  return grossAnnual;
}

/**
 * Calculate investment amount needed for target dividend income
 */
export function calculateInvestmentNeeded(
  annualDividendGross: number,
  averageDividendYield: number
): number {
  return annualDividendGross / (averageDividendYield / 100);
}

/**
 * Validate investment company data
 */
export function validateInvestmentCompany(
  company: unknown
): company is InvestmentCompany {
  if (!company || typeof company !== 'object') return false;
  
  const c = company as Record<string, unknown>;
  
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.ticker === 'string' &&
    ['gaming', 'tech', 'infrastructure'].includes(c.sector as string) &&
    typeof c.marketCap === 'number' &&
    typeof c.dividendYield === 'number' &&
    typeof c.price === 'number'
  );
}
