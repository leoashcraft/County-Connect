import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { SprayCan } from "lucide-react";

export default function CleaningServices() {
  return (
    <ServicePageTemplate
      serviceType="cleaning"
      serviceTitle="Cleaning Services"
      serviceDescription="Professional house cleaning and janitorial services. Regular cleaning, deep cleaning, move-in/out cleaning, and commercial cleaning."
      metaDescription="Find cleaning services near you. House cleaning, maid service, deep cleaning, move-in/out cleaning, commercial cleaning, and office janitorial services."
      metaKeywords="cleaning service, house cleaning, maid service, deep cleaning, commercial cleaning, janitorial, cleaning near me"
      icon={SprayCan}
      iconColor="cyan"
      category="home_services"
      subcategory="cleaning"
      faqs={[
        {
          question: "How much does house cleaning cost?",
          answer: "House cleaning typically costs $120-$250 for a standard cleaning, depending on home size and condition. Deep cleaning costs more. Regular recurring service (weekly, bi-weekly) usually offers discounted rates."
        },
        {
          question: "What's included in a standard cleaning?",
          answer: "Standard cleaning typically includes dusting, vacuuming, mopping floors, bathroom cleaning, kitchen cleaning, and general tidying. Deep cleaning adds baseboards, inside appliances, windows, and more thorough work."
        },
        {
          question: "Should I be home during cleaning?",
          answer: "It's your preference. Many clients give cleaners a key or code for access. Reputable cleaning companies are bonded and insured. Be sure to secure valuables and discuss access arrangements upfront."
        },
        {
          question: "Do I need to provide cleaning supplies?",
          answer: "Most professional cleaners bring their own supplies and equipment. If you prefer specific products (eco-friendly, allergen-free), discuss this when booking and they may use your supplies."
        }
      ]}
      relatedSearches={[
        "house cleaning",
        "maid service",
        "deep cleaning",
        "move out cleaning",
        "office cleaning",
        "carpet cleaning"
      ]}
      seoContent={`
        <h2>Professional Cleaning Services</h2>
        <p>Whether you need regular house cleaning, a one-time deep clean, or commercial janitorial services, professional cleaners can help you maintain a spotless space.</p>
        
        <h3>Residential Cleaning</h3>
        <ul>
          <li><strong>Regular Cleaning:</strong> Weekly, bi-weekly, or monthly service</li>
          <li><strong>Deep Cleaning:</strong> Thorough top-to-bottom cleaning</li>
          <li><strong>Move-In/Out Cleaning:</strong> Get your deposit back or start fresh</li>
          <li><strong>Post-Construction:</strong> Remove dust and debris after renovations</li>
          <li><strong>One-Time Cleaning:</strong> Before events or seasonal cleaning</li>
        </ul>
        
        <h3>Commercial Cleaning</h3>
        <ul>
          <li><strong>Office Cleaning:</strong> Regular janitorial service</li>
          <li><strong>Retail Cleaning:</strong> Maintain a welcoming store</li>
          <li><strong>Medical Office:</strong> Sanitization and compliance</li>
          <li><strong>Restaurant Cleaning:</strong> Kitchen and dining area</li>
        </ul>
        
        <h3>Specialty Services</h3>
        <ul>
          <li><strong>Carpet Cleaning:</strong> Deep extraction cleaning</li>
          <li><strong>Window Cleaning:</strong> Interior and exterior</li>
          <li><strong>Pressure Washing:</strong> Driveways, patios, siding</li>
          <li><strong>Organizing:</strong> Decluttering and organization</li>
        </ul>
        
        <h3>Hiring Tips</h3>
        <p>Look for bonded and insured cleaners, check reviews, get written estimates, and discuss expectations clearly. Many offer satisfaction guarantees.</p>
      `}
    />
  );
}
