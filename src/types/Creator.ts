export interface Creator {
  agency: string;
  focus: string[];
  platforms: string[];
  references: string[];
  conditions: string[];
  followers: number;
  status: 'active' | 'inactive';
  type: 'exclusive' | 'mass';
  pricing_model: 'commission' | 'base_fee';
  notes?: string;
  url: string;
} 