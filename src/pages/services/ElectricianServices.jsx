import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Zap } from "lucide-react";

export default function ElectricianServices() {
  return (
    <ServicePageTemplate
      serviceType="electrician"
      serviceTitle="Electrical Services"
      serviceDescription="Licensed electricians for residential and commercial electrical work. Repairs, installations, panel upgrades, and safety inspections."
      metaDescription="Find licensed electricians near you for all electrical needs. Wiring, panel upgrades, outlet installation, ceiling fans, lighting, and 24/7 emergency service."
      metaKeywords="electrician, electrical services, wiring, panel upgrade, outlet installation, ceiling fan, lighting installation, electrician near me"
      icon={Zap}
      iconColor="yellow"
      category="home_services"
      subcategory="electrical"
      faqs={[
        {
          question: "How much does an electrician charge?",
          answer: "Electricians typically charge $75-$150 per hour, with most also charging a service call fee. Small jobs may have a minimum charge of $100-$200. Always get written estimates for larger projects."
        },
        {
          question: "Do I need a permit for electrical work?",
          answer: "In Texas, permits are required for most electrical work beyond simple repairs. This includes new circuits, panel upgrades, and major installations. Licensed electricians can pull permits and ensure code compliance."
        },
        {
          question: "When should I upgrade my electrical panel?",
          answer: "Consider upgrading if you have a fuse box, your panel is over 25 years old, you're adding major appliances, you experience frequent breaker trips, or you're planning a home addition."
        },
        {
          question: "What are signs of electrical problems?",
          answer: "Warning signs include flickering lights, buzzing outlets, warm switch plates, burning smells, frequent breaker trips, sparking outlets, and two-prong outlets throughout the home."
        }
      ]}
      relatedSearches={[
        "emergency electrician",
        "panel upgrade",
        "ceiling fan installation",
        "outlet repair",
        "lighting installation",
        "home rewiring"
      ]}
      seoContent={`
        <h2>Professional Electrical Services</h2>
        <p>Electrical work requires specialized training and licensing to ensure safety and code compliance. Never attempt major electrical repairs yourself - always hire a licensed electrician.</p>
        
        <h3>Residential Electrical Services</h3>
        <ul>
          <li><strong>Outlet & Switch Installation:</strong> New outlets, GFCI outlets, USB outlets, dimmers</li>
          <li><strong>Lighting:</strong> Indoor/outdoor fixtures, recessed lighting, landscape lighting</li>
          <li><strong>Ceiling Fans:</strong> Installation and replacement</li>
          <li><strong>Panel Upgrades:</strong> Upgrade from fuse box or increase capacity</li>
          <li><strong>Home Rewiring:</strong> Update old or unsafe wiring</li>
          <li><strong>EV Charger Installation:</strong> Level 2 charging stations</li>
        </ul>
        
        <h3>Safety Inspections</h3>
        <p>Electrical inspections are recommended before buying a home, after major storms, if you're experiencing electrical issues, or if your home is over 40 years old. An inspection can identify potential fire hazards and code violations.</p>
        
        <h3>Emergency Electrical Services</h3>
        <p>Electrical emergencies require immediate attention to prevent fire or injury. Call an emergency electrician for power outages affecting only your home, burning smells from outlets, sparking, or exposed wires.</p>
      `}
    />
  );
}
