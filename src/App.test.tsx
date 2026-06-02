import { render } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import App from './App';

// Mock the CSV data fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () =>
      Promise.resolve(
        'agency,url,type,pricing_model,legal_form,location,founding_year,departments,focus,platforms,references,conditions,followers,status,description,notes\nTest Agency,https://test.com,exclusive,commission,GmbH,Berlin,2020,Marketing,Gaming,YouTube,TestRef,TestCondition,10000,active,Test Description,Test Notes'
      ),
  })
) as unknown as typeof fetch;

describe('App Component', () => {
  beforeEach(() => {
    vi.mocked(fetch).mockClear();
  });

  test('renders without crashing', () => {
    render(<App />);
    // Just test that the component renders without throwing
    expect(true).toBe(true);
  });

  test('calls fetch on mount', () => {
    render(<App />);
    expect(fetch).toHaveBeenCalled();
  });
});
