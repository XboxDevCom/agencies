import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation, SupportedLanguage } from '../i18n/I18nProvider';
import { useDirectoryCopy } from '../i18n/directory';
export default function Navigation() {
  const { language, setLanguage, t } = useTranslation();
  const c = useDirectoryCopy();
  const { pathname } = useLocation();
  return <header className="site-header"><div className="nav-inner"><Link to="/" className="brand" aria-label="DACH Agency Directory"><span className="brand-mark" aria-hidden="true">a<span>.</span></span><span>agency<span className="brand-sub">DIRECTORY BY XBOXDEV</span></span></Link><nav aria-label={c.directory} className="primary-nav"><Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>{c.directory}</Link><details className="tools-menu"><summary>{c.tools}</summary><div><Link to="/investor-tips">{c.investors}</Link><Link to="/dividend-calculator">{c.calculator}</Link></div></details></nav><div className="language-control"><label className="sr-only" htmlFor="language">{t('language.switch', { language: t(`language.${language}`) })}</label><select id="language" value={language} onChange={e => setLanguage(e.target.value as SupportedLanguage)}><option value="de">Deutsch</option><option value="en">English</option><option value="fr">Français</option><option value="it">Italiano</option></select></div></div></header>;
}
