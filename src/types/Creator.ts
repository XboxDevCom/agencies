export interface Creator {
  agency: string;
  focus: string[];
  platforms: string[];
  references: string[];
  conditions: string[];
  followers: number;
  status: 'active' | 'inactive';
  notes?: string;
  url: string;
} 