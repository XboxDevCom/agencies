import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock the CSV data fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('agency,url,type,pricing_model,legal_form,location,founding_year,departments,focus,platforms,references,conditions,followers,status,description,notes\nTest Agency,https://test.com,exclusive,commission,GmbH,Berlin,2020,Marketing,Gaming,YouTube,TestRef,TestCondition,10000,active,Test Description,Test Notes'),
  })
) as jest.Mock;

describe('App Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
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
