import React, { lazy, Suspense, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider, useTranslation } from './i18n/I18nProvider';
import { useDirectoryCopy } from './i18n/directory';
import { Creator, DEFAULT_FILTERS, FilterOptions, SortConfig } from './types/Creator';
import { useCreatorData } from './hooks';
import { filterCreators, sortCreators } from './utils';
import CreatorList from './components/CreatorList';
import SearchAndFilter from './components/SearchAndFilter';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import SEO from './components/SEO';
const InvestorTips = lazy(() => import('./components/InvestorTips'));
const DividendCalculator = lazy(() => import('./components/DividendCalculator'));

function Directory() {
  const { t } = useTranslation();
  const c = useDirectoryCopy();
  const { creators, loading, error, refreshData } = useCreatorData();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({ ...DEFAULT_FILTERS });
  const [sort, setSort] = useState<SortConfig>({ field: 'agency', direction: 'asc' });
  const results = useMemo(() => sortCreators(filterCreators(creators, query, filters), sort.field, sort.direction), [creators, query, filters, sort]);
  const reset = () => { setQuery(''); setFilters({ ...DEFAULT_FILTERS }); };
  const reviewed = creators.filter(a => a.source_urls?.length && a.checked_at).length;
  const fields: [keyof Creator, string][] = [
    ['agency', t('table.agency')], ['location', t('table.location')], ['focus', t('table.focus')],
    ['platforms', t('table.platforms')], ['type', t('table.type')], ['pricing_model', t('table.pricing')],
    ['legal_form', t('table.legalForm')], ['founding_year', t('table.founded')], ['departments', t('table.departments')],
    ['references', t('table.references')], ['conditions', t('table.conditions')], ['followers', t('table.followers')], ['status', t('table.status')],
  ];
  return <>
    <SEO title={`DACH Agency Directory · XboxDev`} description={c.subtitle} />
    <main id="main-content" className="directory-shell" tabIndex={-1}>
      <header className="directory-heading">
        <div><p className="eyebrow">DACH AGENCY DIRECTORY <span>/ 01</span></p><h1>{c.title}</h1><p className="intro">{c.subtitle}</p></div>
        <div className="region-label"><span>DE</span><span>AT</span><span>CH</span><p>{c.countries}</p></div>
      </header>
      <div className="directory-layout">
        <aside id="filter-section" className="filter-panel" aria-label={t('filters.title')}>
          <SearchAndFilter data={creators} filters={filters} onFilterChange={next => setFilters(previous => ({ ...previous, ...next }))} onReset={reset} />
          <div className="data-note"><span className="eyebrow">DATA / SOURCES</span><h3>{c.dataNote}</h3><p>{c.dataHelp}</p><p>{c.unknownHelp}</p></div>
        </aside>
        <section className="directory-results" aria-labelledby="results-heading" aria-busy={loading}>
          <div className="search-box"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><label className="sr-only" htmlFor="agency-search">{c.search}</label><input id="agency-search" type="search" placeholder={c.search} value={query} onChange={e => setQuery(e.target.value)} /></div>
          <div className="results-toolbar">
            <div><h2 id="results-heading">{c.results} <span className="count">{results.length}</span></h2><p className="results-meta">{creators.length} {c.entries} · {reviewed} {c.reviewed}</p></div>
            <div className="sort-controls"><label className="sr-only" htmlFor="sort-field">{c.sorting}</label><select id="sort-field" value={sort.field} onChange={e => setSort(previous => ({ ...previous, field: e.target.value as keyof Creator }))}>{fields.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="icon-button" onClick={() => setSort(previous => ({ ...previous, direction: previous.direction === 'asc' ? 'desc' : 'asc' }))} aria-label={sort.direction === 'asc' ? c.descending : c.ascending} title={sort.direction === 'asc' ? c.descending : c.ascending}>{sort.direction === 'asc' ? '↑' : '↓'}</button></div>
          </div>
          <p className="sr-only" role="status" aria-live="polite">{!loading && `${results.length} ${c.results}`}</p>
          {loading ? <div className="state-panel" role="status"><div className="loading-line"/><p>{t('loading.data')}</p></div>
            : error ? <div className="state-panel" role="alert"><h3>{t('error.loadingData')}</h3><p>{t('error.parsingData')}</p><button className="button-primary" onClick={refreshData}>{t('common.retry')}</button></div>
            : results.length ? <CreatorList creators={results} />
            : <div className="state-panel"><span className="empty-mark" aria-hidden="true">∅</span><h3>{c.noResults}</h3><p>{c.noResultsHelp}</p><button className="button-primary" onClick={reset}>{c.allResults}</button></div>}
        </section>
      </div>
    </main>
  </>;
}
function Archive({ children }: { children: React.ReactNode }) {
  return <main id="main-content" className="legacy-page"><div className="archive-note" lang="de"><strong>Archiv: historische Beispieldaten</strong><p>Diese Tools enthalten ungeprüfte Kurs-, Rendite- und Steuerangaben aus dem Altbestand. Berechnungen sind nicht als aktuelle Finanzplanung geeignet.</p></div><Suspense fallback={<p role="status">Loading…</p>}>{children}</Suspense></main>;
}
function NotFound() {
  const c = useDirectoryCopy();
  return <main id="main-content" className="directory-shell state-panel"><h1>{c.missingPage}</h1><Link className="button-primary" to="/">{c.back}</Link></main>;
}
function Shell() {
  const { t } = useTranslation();
  return <div className="app-shell"><a className="skip-link" href="#main-content">{t('nav.skipToMain')}</a><Navigation /><Routes><Route path="/" element={<Directory />} /><Route path="/investor-tips" element={<Archive><InvestorTips /></Archive>} /><Route path="/dividend-calculator" element={<Archive><DividendCalculator /></Archive>} /><Route path="*" element={<NotFound />} /></Routes><Footer /></div>;
}
export default function App() {
  return <HelmetProvider><I18nProvider><BrowserRouter><Shell /></BrowserRouter></I18nProvider></HelmetProvider>;
}
