import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Home } from "lucide-react";

export default function RoofingServices() {
  return (
    <ServicePageTemplate
      serviceType="roofing"
      serviceTitle="Roofing Services"
      serviceDescription="Professional roofing contractors for repairs, replacements, and inspections. Shingle, metal, and flat roof specialists."
      metaDescription="Find roofing contractors near you for roof repair, replacement, and inspection. Storm damage repair, shingle replacement, metal roofing, and free estimates."
      metaKeywords="roofing, roof repair, roof replacement, roofing contractor, shingle roof, metal roof, storm damage, roofer near me"
      icon={Home}
      iconColor="slate"
      category="home_services"
      subcategory="roofing"
      faqs={[
        {
          question: "How much does a new roof cost?",
          answer: "Roof replacement typically costs $5,000-$15,000 for an average home, depending on size, materials, and complexity. Asphalt shingles are most affordable, while metal and tile cost more but last longer."
        },
        {
          question: "How do I know if I need a new roof?",
          answer: "Signs include missing or curling shingles, granules in gutters, daylight through roof boards, sagging areas, age over 20-25 years, and multiple leaks. A professional inspection can assess your roof's condition."
        },
        {
          question: "Does homeowners insurance cover roof damage?",
          answer: "Most policies cover sudden damage from storms, hail, fallen trees, and other covered perils. Normal wear and tear is not covered. Document damage with photos and contact your insurance company promptly."
        },
        {
          question: "How long does roof replacement take?",
          answer: "Most residential roof replacements are completed in 1-3 days, depending on size, weather, and complexity. The roofing crew will protect your property during the work."
        }
      ]}
      relatedSearches={[
        "roof repair",
        "shingle replacement",
        "metal roofing",
        "storm damage repair",
        "roof inspection",
        "gutter installation"
      ]}
      seoContent={`
        <h2>Professional Roofing Services</h2>
        <p>Your roof is your home's first line of defense against the elements. Professional roofing contractors can repair damage, extend roof life, and provide quality replacements when needed.</p>
        
        <h3>Roofing Services</h3>
        <ul>
          <li><strong>Roof Repair:</strong> Fix leaks, replace damaged shingles, seal flashings</li>
          <li><strong>Roof Replacement:</strong> Complete tear-off and new installation</li>
          <li><strong>Roof Inspection:</strong> Assess condition and identify problems</li>
          <li><strong>Storm Damage Repair:</strong> Hail and wind damage restoration</li>
          <li><strong>Emergency Tarping:</strong> Temporary protection after damage</li>
        </ul>
        
        <h3>Roofing Materials</h3>
        <ul>
          <li><strong>Asphalt Shingles:</strong> Most popular, affordable, 15-30 year lifespan</li>
          <li><strong>Metal Roofing:</strong> Durable, energy-efficient, 40-70 year lifespan</li>
          <li><strong>Tile Roofing:</strong> Beautiful, long-lasting, ideal for Texas climate</li>
          <li><strong>Flat Roofing:</strong> TPO, EPDM, and modified bitumen options</li>
        </ul>
        
        <h3>Insurance Claims Assistance</h3>
        <p>Many roofing contractors can help with insurance claims for storm damage. They can document damage, provide estimates, and work directly with your insurance adjuster to ensure proper coverage.</p>
        
        <h3>Free Estimates</h3>
        <p>Most roofing contractors offer free estimates and inspections. Get multiple quotes to compare pricing, materials, warranties, and experience before choosing a contractor.</p>
      `}
    />
  );
}
