import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/I18nProvider';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'DACH Creator Agenturen - Finde die perfekte Agentur für deinen Content',
  description = 'Entdecke und vergleiche Creator-Agenturen im DACH-Raum. Finde die perfekte Agentur für deine Content Creation mit unserer umfassenden Datenbank von Agenturen, deren Schwerpunkten und Anforderungen.',
  keywords = 'creator agenturen, content creator, influencer marketing, agentur datenbank, content creation, social media agenturen, DACH, Deutschland, Österreich, Schweiz'
}) => {
  const { pathname } = useLocation();
  const { language } = useTranslation();
  const canonical = `https://agencies.xboxdev.com${pathname}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content={language} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
};

export default SEO; 