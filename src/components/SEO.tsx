import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation, type SupportedLanguage } from '../i18n/I18nProvider';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  /** Path of the current route, e.g. "/investor-tips". Defaults to "/". */
  path?: string;
}

const SITE_URL = 'https://agencies.xboxdev.com';

const OG_LOCALES: Record<SupportedLanguage, string> = {
  de: 'de_DE',
  en: 'en_US',
  fr: 'fr_FR',
  it: 'it_IT',
};

const SEO: React.FC<SEOProps> = ({
  title = 'DACH Creator Agenturen - Finde die perfekte Agentur für deinen Content',
  description = 'Entdecke und vergleiche Creator-Agenturen im DACH-Raum. Finde die perfekte Agentur für deine Content Creation mit unserer umfassenden Datenbank von Agenturen, deren Schwerpunkten und Anforderungen.',
  keywords = 'creator agenturen, content creator, influencer marketing, agentur datenbank, content creation, social media agenturen, DACH, Deutschland, Österreich, Schweiz',
  path = '/',
}) => {
  const { language, availableLanguages } = useTranslation();
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={OG_LOCALES[language]} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE_URL}/og-image.png`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={canonical} />

      {/* Language alternates */}
      {availableLanguages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${canonical}?lang=${lang}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonical} />
    </Helmet>
  );
};

export default SEO;
