import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Heart } from "lucide-react";

export default function WeddingVenueServices() {
  return (
    <ServicePageTemplate
      serviceType="wedding-venues"
      serviceTitle="Wedding Venues"
      serviceDescription="Beautiful wedding venues for ceremonies and receptions. Barns, estates, gardens, banquet halls, and unique event spaces."
      metaDescription="Find wedding venues near you. Beautiful ceremony and reception venues including barns, estates, gardens, banquet halls, and unique event spaces."
      metaKeywords="wedding venue, wedding reception, ceremony venue, barn wedding, outdoor wedding, event venue, wedding venue near me"
      icon={Heart}
      iconColor="pink"
      category="event_venue"
      subcategory="wedding"
      faqs={[
        {
          question: "How much do wedding venues cost?",
          answer: "Venue costs vary widely: budget venues $1,000-$3,000, mid-range $3,000-$8,000, and premium venues $8,000-$20,000+. Prices depend on location, amenities, day of week, and what's included."
        },
        {
          question: "How far in advance should I book a venue?",
          answer: "Popular venues book 12-18 months ahead for prime dates (Saturdays, May-October). Less popular dates may be available with 6-9 months notice. Start looking early for best selection."
        },
        {
          question: "What should I ask when touring venues?",
          answer: "Ask about capacity, catering requirements, alcohol policies, vendor restrictions, setup/cleanup times, rain backup plans, parking, accessibility, and what's included in the rental fee."
        },
        {
          question: "Are there hidden costs with venues?",
          answer: "Watch for service fees, gratuity, rentals (tables, chairs, linens), liability insurance requirements, cleaning fees, and overtime charges. Get a complete breakdown before signing."
        }
      ]}
      relatedSearches={[
        "barn wedding",
        "outdoor wedding venue",
        "reception hall",
        "garden wedding",
        "estate wedding",
        "banquet hall"
      ]}
      seoContent={`
        <h2>Wedding Venues</h2>
        <p>The perfect venue sets the stage for your dream wedding. From rustic barns to elegant estates, find the ideal backdrop for your special day.</p>
        
        <h3>Venue Types</h3>
        <ul>
          <li><strong>Barns & Farms:</strong> Rustic charm with country character</li>
          <li><strong>Estates & Mansions:</strong> Elegant, classic settings</li>
          <li><strong>Gardens & Parks:</strong> Natural beauty outdoors</li>
          <li><strong>Banquet Halls:</strong> Traditional reception spaces</li>
          <li><strong>Hotels:</strong> Convenience for guests, built-in catering</li>
          <li><strong>Wineries & Vineyards:</strong> Romantic atmosphere</li>
          <li><strong>Country Clubs:</strong> Manicured grounds, upscale service</li>
          <li><strong>Unique Venues:</strong> Museums, rooftops, historic sites</li>
        </ul>
        
        <h3>What to Consider</h3>
        <ul>
          <li><strong>Capacity:</strong> Comfortable space for your guest count</li>
          <li><strong>Indoor/Outdoor:</strong> Weather backup options</li>
          <li><strong>Catering:</strong> In-house, preferred list, or open vendor</li>
          <li><strong>Overnight:</strong> Accommodations for guests</li>
          <li><strong>Logistics:</strong> Parking, accessibility, load-in</li>
        </ul>
        
        <h3>All-Inclusive vs. Venue-Only</h3>
        <ul>
          <li><strong>All-Inclusive:</strong> Venue, catering, coordination, rentals included. Simpler planning but less flexibility.</li>
          <li><strong>Venue-Only:</strong> Rent the space and bring your own vendors. More work but more customization.</li>
        </ul>
        
        <h3>Touring Tips</h3>
        <ul>
          <li>Visit at the same time of day as your wedding</li>
          <li>See the venue set up for an event if possible</li>
          <li>Bring your photographer to scout photo spots</li>
          <li>Ask about day-of coordination</li>
          <li>Read reviews from recent couples</li>
        </ul>
      `}
    />
  );
}
