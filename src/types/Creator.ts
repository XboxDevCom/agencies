export interface Creator {
  agency: string;
  url: string;
  type: 'exclusive' | 'mass';
  pricing_model: 'commission' | 'base_fee';
  focus: string[];
  platforms: string[];
  references: string[];
  conditions: string[];
  followers: number;
  status: 'active' | 'inactive';
  notes?: string;
  description: string;
  departments: string[];
  legal_form: 'Einzelperson' | 'GmbH' | 'UG' | 'AG' | 'KG' | 'OHG' | 'GmbH & Co. KG';
  location: string;
  founding_year: number;
} 