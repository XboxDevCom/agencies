import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Creator Agencies - Find the Perfect Agency for Your Content',
  description = 'Discover and compare creator agencies. Find the perfect agency for your content creation needs with our comprehensive database of agencies, their focus areas, and requirements.',
  keywords = 'creator agencies, content creator, influencer marketing, agency database, content creation, social media agencies'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://agencies.xboxdev.com" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href="https://agencies.xboxdev.com" />
    </Helmet>
  );
};

export default SEO; 