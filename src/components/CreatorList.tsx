import React, { useState } from 'react';
import { Creator } from '../types/Creator';
import { useTranslation } from '../i18n/I18nProvider';
import { useDirectoryCopy } from '../i18n/directory';
import AgencyModal from './AgencyModal';
export default function CreatorList({ creators }: { creators: Creator[] }) {
  const [selected, setSelected] = useState<Creator | null>(null);
  const { t } = useTranslation();
  const c = useDirectoryCopy();
  return <><div className="agency-list" id="results-table"><div className="list-head" aria-hidden="true"><span>{t('table.agency')}</span><span>{t('table.focus')}</span><span>{t('table.platforms')}</span><span>{c.profile}</span></div><ul>{creators.map((a, i) => <li className="agency-row" key={a.agency}><div className="agency-identity"><span className={`agency-monogram tone-${i % 4}`} aria-hidden="true">{a.agency.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase()}</span><div><h3><button onClick={() => setSelected(a)}>{a.agency}</button></h3><p>{a.location || (a.country && a.country !== 'unknown' ? a.country : c.unknown)}{a.status === 'inactive' && <span className="inactive-label"> · {t('agency.status.inactive')}</span>}</p><span className={`review-label ${a.checked_at && a.source_urls?.length ? 'reviewed' : ''}`}>{a.checked_at && a.source_urls?.length ? c.reviewed : c.unverified}</span></div></div><div className="focus-tags">{a.focus.length ? a.focus.slice(0, 3).map(f => <span key={f} className="tag">{f}</span>) : <span className="muted">{c.unknown}</span>}</div><p className="platform-list">{a.platforms.length ? a.platforms.join(' · ') : c.unknown}</p><button className="profile-button" onClick={() => setSelected(a)} aria-label={`${c.profile}: ${a.agency}`}><span>{c.profile}</span><span aria-hidden="true">↗</span></button></li>)}</ul></div><AgencyModal agency={selected} onClose={() => setSelected(null)} /></>;
}
