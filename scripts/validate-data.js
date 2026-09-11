const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const assert = require('node:assert/strict');
const file = path.join(__dirname, '../public/data.csv');
const { data, errors, meta } = Papa.parse(fs.readFileSync(file, 'utf8'), { header: true, skipEmptyLines: 'greedy' });
assert.equal(errors.length, 0, JSON.stringify(errors));
for (const field of ['agency', 'url', 'focus', 'platforms', 'status', 'country', 'source_urls', 'checked_at', 'verified_fields']) assert(meta.fields.includes(field), `Missing column ${field}`);
assert(data.length > 0, 'Empty directory');
const names = new Set();
const safeUrl = value => { const url = new URL(value); assert(['https:', 'http:'].includes(url.protocol) && !url.username && !url.password, `Unsafe URL: ${value}`); };
for (const row of data) {
  assert(row.agency.trim(), 'Unnamed agency');
  const key = row.agency.trim().toLowerCase();
  assert(!names.has(key), `Duplicate: ${row.agency}`); names.add(key);
  safeUrl(row.url);
  for (const [field, values] of Object.entries({ status: ['active', 'inactive', 'unknown'], type: ['exclusive', 'mass', 'unknown'], pricing_model: ['commission', 'base_fee', 'unknown'] })) assert(values.includes(row[field]), `${row.agency}: invalid ${field}`);
  for (const country of row.country.split(',').map(value => value.trim())) assert(['DE', 'AT', 'CH', 'International', 'unknown'].includes(country), `${row.agency}: invalid country`);
  for (const field of ['followers', 'founding_year']) assert(!row[field] || /^\d+$/.test(row[field]), `${row.agency}: invalid ${field}`);
  if (row.checked_at || row.source_urls || row.verified_fields) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(row.checked_at) && !Number.isNaN(Date.parse(row.checked_at)), `${row.agency}: missing/invalid review date`);
    assert(row.checked_at <= new Date().toISOString().slice(0, 10), `${row.agency}: future review date`);
    assert(row.source_urls && row.verified_fields, `${row.agency}: incomplete review evidence`);
    row.source_urls.split('|').forEach(safeUrl);
    for (const field of row.verified_fields.split(',').map(value => value.trim())) assert(meta.fields.includes(field) && row[field] && row[field] !== 'unknown', `${row.agency}: unsupported reviewed field ${field}`);
  }
  for (const field of ['followers', 'pricing_model', 'references', 'conditions']) {
    if (row[field] && row[field] !== 'unknown') assert(row.verified_fields.split(',').map(value => value.trim()).includes(field), `${row.agency}: unsourced ${field}`);
  }
}
console.log(`${data.length} valid agency records; ${data.filter(row => row.checked_at).length} have field-scoped source reviews.`);
