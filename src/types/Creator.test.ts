import { Creator, AgencyType, AgencyStatus, PricingModel } from './Creator';

describe('Creator Types', () => {
  test('should create a valid Creator object', () => {
    const creator: Creator = {
      agency: 'Test Agency',
      url: 'https://test.com',
      type: 'exclusive' as AgencyType,
      pricing_model: 'commission' as PricingModel,
      legal_form: 'GmbH',
      location: 'Berlin',
      founding_year: 2020,
      departments: ['Marketing', 'Sales'],
      focus: ['Gaming', 'Tech'],
      platforms: ['YouTube', 'Twitch'],
      references: ['TestRef1', 'TestRef2'],
      conditions: ['TestCondition1'],
      followers: 10000,
      status: 'active' as AgencyStatus,
      description: 'Test Description',
      notes: 'Test Notes'
    };

    expect(creator.agency).toBe('Test Agency');
    expect(creator.type).toBe('exclusive');
    expect(creator.status).toBe('active');
    expect(creator.followers).toBe(10000);
    expect(Array.isArray(creator.focus)).toBe(true);
    expect(Array.isArray(creator.platforms)).toBe(true);
  });

  test('should handle array properties correctly', () => {
    const creator: Creator = {
      agency: 'Test Agency',
      url: 'https://test.com',
      type: 'mass' as AgencyType,
      pricing_model: 'base_fee' as PricingModel,
      legal_form: 'UG',
      location: 'Munich',
      founding_year: 2021,
      departments: [],
      focus: ['Lifestyle'],
      platforms: ['Instagram'],
      references: [],
      conditions: ['Exclusive contract'],
      followers: 5000,
      status: 'inactive' as AgencyStatus,
      description: 'Another test',
      notes: 'More notes'
    };

    expect(creator.departments).toEqual([]);
    expect(creator.focus).toEqual(['Lifestyle']);
    expect(creator.platforms).toEqual(['Instagram']);
    expect(creator.references).toEqual([]);
    expect(creator.conditions).toEqual(['Exclusive contract']);
  });

  test('should validate enum values', () => {
    const validTypes: AgencyType[] = ['exclusive', 'mass'];
    const validStatuses: AgencyStatus[] = ['active', 'inactive'];
    const validPricingModels: PricingModel[] = ['commission', 'base_fee'];

    expect(validTypes).toContain('exclusive');
    expect(validTypes).toContain('mass');
    expect(validStatuses).toContain('active');
    expect(validStatuses).toContain('inactive');
    expect(validPricingModels).toContain('commission');
    expect(validPricingModels).toContain('base_fee');
  });
});
