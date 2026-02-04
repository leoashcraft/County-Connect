import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Wrench } from "lucide-react";

export default function PlumberServices() {
  return (
    <ServicePageTemplate
      serviceType="plumber"
      serviceTitle="Plumbing Services"
      serviceDescription="Licensed plumbers for repairs, installations, and emergency services. Fixing leaks, clogs, water heaters, and more."
      metaDescription="Find licensed plumbers near you for all your plumbing needs. Emergency plumbing, drain cleaning, water heater repair, leak detection, and pipe repair."
      metaKeywords="plumber, plumbing services, drain cleaning, water heater repair, leak repair, clogged drain, emergency plumber, plumber near me"
      icon={Wrench}
      iconColor="sky"
      category="home_services"
      subcategory="plumbing"
      faqs={[
        {
          question: "How much does a plumber charge per hour?",
          answer: "Plumber rates typically range from $75-$150 per hour, with many charging a service call fee of $50-$100. Emergency and after-hours service usually costs more. Always request written estimates."
        },
        {
          question: "When should I call an emergency plumber?",
          answer: "Call an emergency plumber for burst pipes, major water leaks, sewage backups, no water in the house, or gas line issues. These situations can cause significant damage if not addressed immediately."
        },
        {
          question: "How often should I have my drains cleaned?",
          answer: "For preventive maintenance, professional drain cleaning is recommended every 1-2 years. If you experience slow drains or frequent clogs, more frequent cleaning may be necessary."
        },
        {
          question: "How long do water heaters last?",
          answer: "Traditional tank water heaters typically last 8-12 years, while tankless water heaters can last 15-20 years with proper maintenance. Signs of failure include rust-colored water, strange noises, and inconsistent temperatures."
        }
      ]}
      relatedSearches={[
        "emergency plumber",
        "drain cleaning",
        "water heater repair",
        "leak detection",
        "toilet repair",
        "pipe repair"
      ]}
      seoContent={`
        <h2>Professional Plumbing Services</h2>
        <p>From minor repairs to major installations, professional plumbers provide essential services to keep your home's water systems running smoothly. Always hire licensed plumbers to ensure quality work and code compliance.</p>
        
        <h3>Common Plumbing Services</h3>
        <ul>
          <li><strong>Drain Cleaning:</strong> Clear clogged sinks, tubs, toilets, and main sewer lines</li>
          <li><strong>Leak Repair:</strong> Fix dripping faucets, running toilets, and pipe leaks</li>
          <li><strong>Water Heater Services:</strong> Installation, repair, and maintenance</li>
          <li><strong>Pipe Repair:</strong> Fix burst, frozen, or corroded pipes</li>
          <li><strong>Fixture Installation:</strong> Sinks, faucets, toilets, and showers</li>
        </ul>
        
        <h3>Signs You Need a Plumber</h3>
        <ul>
          <li>Slow-draining sinks or tubs</li>
          <li>Low water pressure throughout the house</li>
          <li>Discolored or smelly water</li>
          <li>Water stains on walls or ceilings</li>
          <li>Unexplained increase in water bill</li>
          <li>Gurgling sounds from drains</li>
        </ul>
        
        <h3>Emergency Plumbing</h3>
        <p>Plumbing emergencies don't wait for business hours. Many local plumbers offer 24/7 emergency services for urgent issues like burst pipes, major leaks, and sewage backups.</p>
      `}
    />
  );
}
