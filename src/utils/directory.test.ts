import { parseCreatorCSV, filterCreators, sortCreators, isValidUrl } from './index';
import { DEFAULT_FILTERS } from '../types/Creator';
const header = 'agency,url,focus,platforms,status,followers,founding_year,country';
test('missing numbers and categories remain unknown instead of inventing values', () => {
  const [agency] = parseCreatorCSV(`${header}\nTest,https://example.com,Gaming,Twitch,,,,DE`);
  expect(agency.followers).toBeNull();
  expect(agency.founding_year).toBeNull();
  expect(agency.type).toBe('unknown');
  expect(agency.status).toBe('unknown');
});
test('rejects HTML, duplicates and malformed CSV', () => {
  expect(() => parseCreatorCSV('<html>404</html>')).toThrow();
  expect(() => parseCreatorCSV(`${header}\nA,https://a.example,Gaming,Twitch,unknown,,,DE\nA,https://a.example,Gaming,Twitch,unknown,,,DE`)).toThrow();
  expect(() => parseCreatorCSV(`${header}\nBroken,too,few`)).toThrow();
});
test('combines country, search, platform and reach filters without treating unknown reach as zero', () => {
  const records = parseCreatorCSV(`${header}\nAlpha,https://a.example,Gaming,Twitch,unknown,,,"AT, DE"\nBeta,https://b.example,Gaming,Twitch,active,100,2020,CH`);
  expect(filterCreators(records, ' alpha ', { ...DEFAULT_FILTERS, country: 'DE', platform: 'Twitch' })).toHaveLength(1);
  expect(filterCreators(records, '', { ...DEFAULT_FILTERS, minFollowers: 1 }).map(a => a.agency)).toEqual(['Beta']);
  expect(sortCreators(records, 'followers', 'desc').map(a => a.agency)).toEqual(['Beta', 'Alpha']);
  expect(sortCreators(records, 'followers', 'asc').map(a => a.agency)).toEqual(['Beta', 'Alpha']);
});
test('only opens HTTP(S) links without embedded credentials', () => {
  // eslint-disable-next-line no-script-url -- regression test for unsafe directory links
  expect(isValidUrl('javascript:alert(1)')).toBe(false);
  expect(isValidUrl('data:text/html,test')).toBe(false);
  expect(isValidUrl('https://user:secret@example.com')).toBe(false);
  expect(isValidUrl('https://example.com')).toBe(true);
});
