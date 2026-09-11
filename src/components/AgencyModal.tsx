import React, { useEffect, useRef } from 'react';
import { Creator } from '../types/Creator';
import { useTranslation } from '../i18n/I18nProvider';
import { useDirectoryCopy } from '../i18n/directory';
import { extractDomain, isValidUrl } from '../utils';
interface Props { agency: Creator | null; onClose: () => void; }
export default function AgencyModal({ agency, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t, language } = useTranslation();
  const c = useDirectoryCopy();
  useEffect(() => {
    if (!agency || !ref.current) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [agency]);
  if (!agency) return null;
  const unknown = c.unknown;
  const text = (items: string[]) => items.length ? items.join(', ') : unknown;
  const details: [string, React.ReactNode][] = [
    [t('modal.location'), agency.location || unknown], [t('modal.legalForm'), agency.legal_form || unknown],
    [t('modal.founded'), agency.founding_year ?? unknown],
    [t('modal.type'), agency.type === 'exclusive' ? t('agency.type.exclusive') : agency.type === 'mass' ? t('agency.type.mass') : unknown],
    [t('modal.pricingModel'), agency.pricing_model === 'commission' ? t('agency.pricing.commission') : agency.pricing_model === 'base_fee' ? t('agency.pricing.baseFee') : unknown],
    [t('modal.status'), agency.status === 'active' ? t('agency.status.active') : agency.status === 'inactive' ? t('agency.status.inactive') : unknown],
    [t('modal.followerReach'), agency.followers === null ? unknown : agency.followers.toLocaleString(language)],
    [t('modal.platforms'), text(agency.platforms)], [t('modal.departments'), text(agency.departments)],
    [t('modal.references'), text(agency.references)], [t('modal.conditions'), text(agency.conditions)],
  ];
  const fieldLabels: Record<string, string> = { agency: t('table.agency'), url: c.website, focus: t('table.focus'), description: t('modal.description'), notes: t('modal.notes'), platforms: t('table.platforms'), location: t('table.location'), country: c.country, status: t('table.status') };
  return <dialog className="agency-dialog" ref={ref} aria-labelledby="agency-dialog-title" onCancel={e => { e.preventDefault(); onClose(); }}>
    <div className="dialog-top"><span className="eyebrow">AGENCY PROFILE</span><button className="icon-button" onClick={onClose} aria-label={t('modal.close')}>×</button></div>
    <h2 id="agency-dialog-title">{agency.agency}</h2>
    <div className="dialog-focus">{agency.focus.map(f => <span className="tag" key={f}>{f}</span>)}</div>
    <p className="dialog-description">{agency.description || agency.notes || c.legacy}</p>
    {isValidUrl(agency.url) && <a className="button-primary" href={agency.url} target="_blank" rel="noopener noreferrer">{c.website} · {extractDomain(agency.url)} <span aria-hidden="true">↗</span></a>}
    <section className="source-panel"><h3>{c.sources}</h3>{agency.checked_at && agency.source_urls?.length ? <><p>{c.checked}: <time dateTime={agency.checked_at}>{new Date(`${agency.checked_at}T12:00:00Z`).toLocaleDateString(language)}</time></p><p>{c.fields}: {agency.verified_fields?.map(f => fieldLabels[f] || f).join(', ')}</p><ul>{agency.source_urls.filter(isValidUrl).map((url, i) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{c.source} {i + 1} · {extractDomain(url)} ↗</a></li>)}</ul></> : <p>{c.noSource} {c.legacy}</p>}</section>
    <h3 className="details-heading">{t('modal.basicInfo')}</h3><dl className="profile-facts">{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {agency.notes && agency.description && <p className="muted">{agency.notes}</p>}
    <p className="dialog-footnote">{c.unknownHelp} {c.dataLanguage}</p><button className="button-secondary" onClick={onClose}>{t('common.close')}</button>
  </dialog>;
}
