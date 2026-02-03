import React from "react";
import { Helmet } from "react-helmet";

export default function MetaTags({
  title,
  description,
  image,
  url,
  type = "website",
  price,
  availability,
  keywords,
  canonicalUrl,
  noIndex = false
}) {
  const siteName = "Navarro County Community Hub";
  const defaultDescription = "Your local community resource for Navarro County, Texas - find local businesses, events, restaurants, churches, jobs, and community services in Corsicana and surrounding areas.";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const metaDescription = description || defaultDescription;
  const defaultKeywords = "Navarro County, Corsicana TX, local businesses, community events, restaurants Corsicana, churches Navarro County, jobs Corsicana, food pantry, community resources, Texas";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Corsicana, Texas" />
      <meta name="geo.position" content="32.0954;-96.4689" />
      <meta name="ICBM" content="32.0954, -96.4689" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title || siteName} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Product specific meta tags */}
      {price && <meta property="product:price:amount" content={price} />}
      {price && <meta property="product:price:currency" content="USD" />}
      {availability && <meta property="product:availability" content={availability} />}

      {/* Additional SEO */}
      <meta name="author" content="Navarro County Community Hub" />
      <meta name="publisher" content="Navarro County Community Hub" />
      <meta name="copyright" content="Navarro County Community Hub" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
    </Helmet>
  );
}