import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Music } from "lucide-react";

export default function DjServices() {
  return (
    <ServicePageTemplate
      serviceType="dj"
      serviceTitle="DJ Services"
      serviceDescription="Professional DJs for weddings, parties, corporate events, and celebrations. Quality sound, lighting, and entertainment."
      metaDescription="Find DJs near you for weddings, parties, and events. Professional DJ services with sound systems, lighting, MC services, and custom playlists."
      metaKeywords="DJ, wedding DJ, party DJ, event DJ, mobile DJ, DJ services, disc jockey near me"
      icon={Music}
      iconColor="violet"
      category="entertainment"
      subcategory="dj"
      faqs={[
        {
          question: "How much does a DJ cost for a wedding?",
          answer: "Wedding DJs typically cost $800-$2,500 for 4-6 hours of service. Price varies based on experience, equipment quality, lighting packages, and additional services like MC duties."
        },
        {
          question: "What's included in DJ services?",
          answer: "Standard packages include professional sound system, DJ equipment, music library, setup/teardown, and basic MC services. Lighting, uplighting, photo booths, and extended hours are often additional."
        },
        {
          question: "How far in advance should I book a DJ?",
          answer: "Book wedding DJs 6-12 months ahead, especially for popular dates. Party and event DJs can often be booked 2-4 weeks out, but earlier is better for scheduling flexibility."
        },
        {
          question: "Can I request specific songs?",
          answer: "Absolutely! Most DJs encourage song requests and do-not-play lists. Provide your must-play songs in advance and discuss any songs you want avoided."
        }
      ]}
      relatedSearches={[
        "wedding DJ",
        "party DJ",
        "mobile DJ",
        "karaoke DJ",
        "corporate event DJ",
        "quinceanera DJ"
      ]}
      seoContent={`
        <h2>Professional DJ Services</h2>
        <p>The right DJ can make or break your event. From setting the mood to keeping the dance floor packed, professional DJs bring the energy and expertise to create unforgettable celebrations.</p>
        
        <h3>DJ Services</h3>
        <ul>
          <li><strong>Wedding DJ:</strong> Ceremony, cocktail hour, reception, and dancing</li>
          <li><strong>Party DJ:</strong> Birthdays, anniversaries, graduations</li>
          <li><strong>Corporate DJ:</strong> Company events, galas, holiday parties</li>
          <li><strong>School Events:</strong> Prom, homecoming, dances</li>
          <li><strong>Club DJ:</strong> Bars, nightclubs, special events</li>
        </ul>
        
        <h3>What to Expect</h3>
        <ul>
          <li><strong>Professional Equipment:</strong> Quality sound systems and speakers</li>
          <li><strong>Extensive Music Library:</strong> All genres and eras</li>
          <li><strong>MC Services:</strong> Announcements and event coordination</li>
          <li><strong>Lighting:</strong> Dance floor lighting and effects</li>
          <li><strong>Planning Consultation:</strong> Discuss your vision and timeline</li>
        </ul>
        
        <h3>Add-On Services</h3>
        <ul>
          <li>Uplighting for venue ambiance</li>
          <li>Photo booth rental</li>
          <li>Karaoke equipment</li>
          <li>Live mixing and remixes</li>
          <li>Wireless microphones</li>
        </ul>
        
        <h3>Choosing a DJ</h3>
        <ul>
          <li>Watch videos of them performing</li>
          <li>Meet in person to check personality fit</li>
          <li>Verify they have backup equipment</li>
          <li>Get references from recent events</li>
          <li>Review the contract carefully</li>
        </ul>
      `}
    />
  );
}
