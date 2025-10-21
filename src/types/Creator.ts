export type AgencyType = 'exclusive' | 'mass';
export type PricingModel = 'commission' | 'base_fee';
export type AgencyStatus = 'active' | 'inactive';
export type LegalForm = 'Einzelperson' | 'GmbH' | 'UG' | 'AG' | 'KG' | 'OHG' | 'GmbH & Co. KG';

export interface Creator {
  agency: string;
  url: string;
  type: AgencyType;
  pricing_model: PricingModel;
  focus: string[];
  platforms: string[];
  references: string[];
  conditions: string[];
  followers: number;
  status: AgencyStatus;
  notes?: string;
  description: string;
  departments: string[];
  legal_form: LegalForm;
  location: string;
  founding_year: number;
}

export interface FilterOptions {
  platform: string;
  status: string;
  minFollowers: number;
  focus: string;
  type: string;
  pricing_model: string;
}

export interface SortConfig {
  field: keyof Creator;
  direction: 'asc' | 'desc';
}

export interface SearchConfig {
  query: string;
  filters: FilterOptions;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  hiddenOn?: 'mobile' | 'tablet' | 'desktop';
  alwaysVisible?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

// Form types
export interface CreatorFormData {
  agency: string;
  url: string;
  type: AgencyType;
  pricing_model: PricingModel;
  focus: string;
  platforms: string;
  references: string;
  conditions: string;
  followers: string;
  status: AgencyStatus;
  notes: string;
  description: string;
  departments: string;
  legal_form: LegalForm;
  location: string;
  founding_year: string;
}

export interface ValidationError {
  field: keyof CreatorFormData;
  message: string;
}

// Utility types
export type CreatorKeys = keyof Creator;
export type CreatorValues = Creator[CreatorKeys];
export type PartialCreator = Partial<Creator>;
export type RequiredCreator = Required<Creator>;

// Event types
export interface SortEvent {
  field: keyof Creator;
  direction: 'asc' | 'desc';
}

export interface FilterEvent {
  filters: FilterOptions;
}

export interface SearchEvent {
  query: string;
}

// Constants
export const AGENCY_TYPES: Record<AgencyType, string> = {
  exclusive: 'Exklusiv',
  mass: 'Masse'
};

export const PRICING_MODELS: Record<PricingModel, string> = {
  commission: 'Provision',
  base_fee: 'Grundgebühr'
};

export const AGENCY_STATUS: Record<AgencyStatus, string> = {
  active: 'Aktiv',
  inactive: 'Inaktiv'
};

export const LEGAL_FORMS: Record<LegalForm, string> = {
  'Einzelperson': 'Einzelperson',
  'GmbH': 'GmbH',
  'UG': 'UG (haftungsbeschränkt)',
  'AG': 'Aktiengesellschaft',
  'KG': 'Kommanditgesellschaft',
  'OHG': 'Offene Handelsgesellschaft',
  'GmbH & Co. KG': 'GmbH & Co. KG'
};

// Default values
export const DEFAULT_CREATOR: Creator = {
  agency: '',
  url: '',
  type: 'mass',
  pricing_model: 'commission',
  focus: [],
  platforms: [],
  references: [],
  conditions: [],
  followers: 0,
  status: 'active',
  notes: '',
  description: '',
  departments: [],
  legal_form: 'GmbH',
  location: '',
  founding_year: new Date().getFullYear()
};

export const DEFAULT_FILTERS: FilterOptions = {
  platform: '',
  status: '',
  minFollowers: 0,
  focus: '',
  type: '',
  pricing_model: ''
};
