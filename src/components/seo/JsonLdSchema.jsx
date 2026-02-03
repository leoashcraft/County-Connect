import React, { useEffect, useRef } from "react";

export default function JsonLdSchema({ type, data }) {
  const scriptRef = useRef(null);
  let schema = {};

  if (type === "product") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": data.name,
      "description": data.description,
      "image": data.images || [],
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "USD",
        "price": data.price,
        "availability": data.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": `https://schema.org/${data.condition === 'new' ? 'NewCondition' : 'UsedCondition'}`
      },
      "brand": data.brand_name ? {
        "@type": "Brand",
        "name": data.brand_name
      } : undefined,
      "seller": {
        "@type": "Organization",
        "name": data.store_name
      }
    };
  } else if (type === "store") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "Store",
      "name": data.name,
      "description": data.description,
      "image": data.logo_url,
      "telephone": data.contact_phone,
      "email": data.contact_email,
      "address": data.location
    };
  } else if (type === "service") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "Service",
      "name": data.name,
      "description": data.description,
      "image": data.image_url,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": data.price,
        "availability": data.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      },
      "provider": {
        "@type": "Organization",
        "name": data.store_name
      }
    };
  } else if (type === "localBusiness") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "LocalBusiness",
      "name": data.name,
      "description": data.description,
      "image": data.image_url,
      "telephone": data.phone,
      "email": data.email,
      "url": data.website,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.address,
        "addressLocality": data.town || "Corsicana",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "geo": data.lat && data.lng ? {
        "@type": "GeoCoordinates",
        "latitude": data.lat,
        "longitude": data.lng
      } : undefined,
      "openingHoursSpecification": data.operating_hours?.filter(h => !h.is_closed).map(h => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": h.day.charAt(0).toUpperCase() + h.day.slice(1),
        "opens": h.open_time,
        "closes": h.close_time
      }))
    };
  } else if (type === "church") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "PlaceOfWorship",
      "name": data.name,
      "description": data.description,
      "image": data.image_url,
      "telephone": data.phone,
      "email": data.email,
      "url": data.website,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.address,
        "addressLocality": data.town || "Corsicana",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "geo": data.lat && data.lng ? {
        "@type": "GeoCoordinates",
        "latitude": data.lat,
        "longitude": data.lng
      } : undefined
    };
  } else if (type === "restaurant") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "Restaurant",
      "name": data.name,
      "description": data.description,
      "image": data.logo_url,
      "telephone": data.phone,
      "servesCuisine": data.cuisine_types,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.address,
        "addressLocality": data.town || "Corsicana",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "geo": data.lat && data.lng ? {
        "@type": "GeoCoordinates",
        "latitude": data.lat,
        "longitude": data.lng
      } : undefined,
      "openingHoursSpecification": data.operating_hours?.filter(h => !h.is_closed).map(h => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": h.day.charAt(0).toUpperCase() + h.day.slice(1),
        "opens": h.open_time,
        "closes": h.close_time
      }))
    };
  } else if (type === "event") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "Event",
      "name": data.title,
      "description": data.description,
      "image": data.image_url,
      "startDate": data.event_date,
      "endDate": data.end_date,
      "location": {
        "@type": "Place",
        "name": data.venue_name,
        "address": data.address
      },
      "organizer": {
        "@type": "Organization",
        "name": data.organizer_name
      },
      "eventStatus": "https://schema.org/EventScheduled"
    };
  } else if (type === "sportsTeam") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "SportsTeam",
      "name": data.name,
      "description": data.description,
      "image": data.logo_url,
      "sport": data.sport,
      "coach": data.coach_name ? {
        "@type": "Person",
        "name": data.coach_name
      } : undefined,
      "location": {
        "@type": "Place",
        "name": data.home_field,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.town,
          "addressRegion": "TX"
        }
      }
    };
  } else if (type === "communityResource") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "NGO",
      "name": data.name,
      "description": data.description,
      "image": data.image_url,
      "telephone": data.phone,
      "email": data.email,
      "url": data.website,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.address,
        "addressLocality": data.town || "Corsicana",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Navarro County, Texas"
      }
    };
  } else if (type === "website") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": data.name || "Navarro County Community Hub",
      "description": data.description || "Your local community resource for Navarro County, Texas - find local businesses, events, restaurants, churches, and community services in Corsicana and surrounding areas.",
      "url": data.url || window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Navarro County Community Hub",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Corsicana",
          "addressRegion": "TX",
          "addressCountry": "US"
        },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Navarro County, Texas"
        }
      }
    };
  } else if (type === "governmentService") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "GovernmentService",
      "name": data.name,
      "description": data.description,
      "serviceType": data.serviceType,
      "provider": {
        "@type": "GovernmentOrganization",
        "name": data.provider || "Navarro County",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Corsicana",
          "addressRegion": "TX",
          "addressCountry": "US"
        }
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Navarro County, Texas"
      }
    };
  } else if (type === "breadcrumb") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      "itemListElement": data.items?.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  } else if (type === "city") {
    schema = {
      "@context": "https://schema.org/",
      "@type": "City",
      "name": data.name,
      "description": data.description,
      "image": data.image_url,
      "url": data.url,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": `${data.county}, ${data.state}`
      },
      "geo": data.lat && data.lng ? {
        "@type": "GeoCoordinates",
        "latitude": data.lat,
        "longitude": data.lng
      } : undefined,
      "population": data.population ? {
        "@type": "QuantitativeValue",
        "value": data.population
      } : undefined
    };
  }

  // Filter out undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  // Use useEffect to safely set the script content without dangerouslySetInnerHTML
  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.textContent = JSON.stringify(cleanSchema);
    }
  }, [cleanSchema]);

  return (
    <script
      ref={scriptRef}
      type="application/ld+json"
    />
  );
}