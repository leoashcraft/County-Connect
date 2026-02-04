import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Camera } from "lucide-react";

export default function PhotographyServices() {
  return (
    <ServicePageTemplate
      serviceType="photography"
      serviceTitle="Photography Services"
      serviceDescription="Professional photographers for weddings, portraits, events, and commercial photography. Capture your special moments beautifully."
      metaDescription="Find photographers near you for weddings, portraits, family photos, events, and commercial photography. Professional photography services."
      metaKeywords="photographer, wedding photography, portrait photography, family photos, event photographer, commercial photography, photographer near me"
      icon={Camera}
      iconColor="purple"
      category="professional_services"
      subcategory="photography"
      faqs={[
        {
          question: "How much does wedding photography cost?",
          answer: "Wedding photography typically ranges from $1,500-$5,000+ depending on coverage time, number of photographers, albums, and experience level. Budget photographers start around $800, while premium photographers charge $6,000+."
        },
        {
          question: "How far in advance should I book a photographer?",
          answer: "For weddings, book 9-12 months ahead, especially for popular dates. Portrait sessions can often be booked 2-4 weeks out. Event photographers should be booked as soon as you have a date."
        },
        {
          question: "How long until I receive my photos?",
          answer: "Turnaround varies by photographer: portraits typically 1-2 weeks, events 2-4 weeks, weddings 4-8 weeks. Rush delivery may be available for an additional fee."
        },
        {
          question: "Do I get the digital files?",
          answer: "Most photographers include digital files in their packages, though some charge extra. Clarify what's included: high-resolution files, print release, online gallery, and how files are delivered."
        }
      ]}
      relatedSearches={[
        "wedding photographer",
        "family portraits",
        "senior photos",
        "headshots",
        "event photography",
        "newborn photography"
      ]}
      seoContent={`
        <h2>Professional Photography Services</h2>
        <p>Whether it's your wedding day, a family portrait, or a corporate event, professional photographers capture moments that last a lifetime. Find the perfect photographer for your needs.</p>
        
        <h3>Photography Services</h3>
        <ul>
          <li><strong>Wedding Photography:</strong> Full-day coverage, engagement sessions, albums</li>
          <li><strong>Portrait Photography:</strong> Family, individual, senior, and headshots</li>
          <li><strong>Event Photography:</strong> Parties, corporate events, reunions</li>
          <li><strong>Newborn & Maternity:</strong> Capture those precious early moments</li>
          <li><strong>Commercial Photography:</strong> Products, real estate, food, branding</li>
        </ul>
        
        <h3>What to Look For</h3>
        <ul>
          <li><strong>Portfolio:</strong> Review their work to ensure style match</li>
          <li><strong>Experience:</strong> Especially important for weddings and events</li>
          <li><strong>Personality:</strong> You'll spend hours together; make sure you click</li>
          <li><strong>Reviews:</strong> Check testimonials and ratings</li>
          <li><strong>Contract:</strong> Clear terms on deliverables, timeline, rights</li>
        </ul>
        
        <h3>Questions to Ask</h3>
        <ul>
          <li>What's your shooting style?</li>
          <li>What equipment do you use?</li>
          <li>Do you have backup equipment?</li>
          <li>What's included in the package?</li>
          <li>What's your cancellation policy?</li>
        </ul>
        
        <h3>Preparing for Your Session</h3>
        <p>Communicate your vision, coordinate outfits, choose meaningful locations, get rest beforehand, and relax - the best photos come from genuine moments.</p>
      `}
    />
  );
}
