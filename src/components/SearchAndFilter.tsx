import React, { useMemo } from 'react';
import { Creator, FilterOptions } from '../types/Creator';
import { useTranslation } from '../i18n/I18nProvider';
import { useDirectoryCopy } from '../i18n/directory';
import { getUniqueFilterOptions } from '../utils';
interface Props { data: Creator[]; filters: FilterOptions; onFilterChange: (filters: Partial<FilterOptions>) => void; onReset: () => void; }
export default function SearchAndFilter({ data, filters, onFilterChange, onReset }: Props) {
  const { t } = useTranslation();
  const c = useDirectoryCopy();
  const options = useMemo(() => getUniqueFilterOptions(data), [data]);
  const select = (field: keyof FilterOptions, label: string, values: [string, string][]) => <div className="filter-field"><label htmlFor={`filter-${field}`}>{label}</label><select id={`filter-${field}`} value={filters[field] || ''} onChange={e => onFilterChange({ [field]: e.target.value })}><option value="">{c.all}</option>{values.map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select></div>;
  return <div className="filter-content"><div className="filter-title"><h2>{t('filters.title')}</h2><button onClick={onReset} className="text-button">{t('common.reset')}</button></div><div className="primary-filters">
    {select('focus', t('filters.focus'), options.focus.map(x => [x, x]))}
    {select('platform', t('filters.platform'), options.platforms.map(x => [x, x]))}
    {select('country', c.country, [['DE', 'Deutschland'], ['AT', 'Österreich'], ['CH', 'Schweiz'], ['International', 'International'], ['unknown', c.unknown]])}
    {select('status', t('filters.status'), [['active', t('agency.status.active')], ['inactive', t('agency.status.inactive')], ['unknown', c.unknown]])}
  </div><details className="advanced-filters"><summary>{c.moreFilters}</summary>
    {select('type', t('filters.agencyType'), [['exclusive', t('agency.type.exclusive')], ['mass', t('agency.type.mass')], ['unknown', c.unknown]])}
    {select('pricing_model', t('filters.pricingModel'), [['commission', t('agency.pricing.commission')], ['base_fee', t('agency.pricing.baseFee')], ['unknown', c.unknown]])}
    <div className="filter-field"><label htmlFor="filter-followers">{c.reach}</label><input id="filter-followers" type="number" min="0" step="1" inputMode="numeric" value={filters.minFollowers || ''} onChange={e => onFilterChange({ minFollowers: Math.max(0, Number(e.target.value) || 0) })} aria-describedby="reach-help"/><p id="reach-help">{c.reachHelp}</p></div>
  </details></div>;
}
