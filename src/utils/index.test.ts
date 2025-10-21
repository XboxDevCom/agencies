import { storage } from './index';

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should store and retrieve data', () => {
    const testData = { test: 'value' };
    storage.set('testKey', testData);
    
    const retrieved = storage.get('testKey', null);
    expect(retrieved).toEqual(testData);
  });

  test('should return default value when key does not exist', () => {
    const defaultValue = { default: true };
    const result = storage.get('nonExistentKey', defaultValue);
    
    expect(result).toEqual(defaultValue);
  });

  test('should remove data', () => {
    storage.set('testKey', { test: 'value' });
    storage.remove('testKey');
    
    const result = storage.get('testKey', null);
    expect(result).toBeNull();
  });
});
