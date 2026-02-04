import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Bug } from "lucide-react";

export default function PestControlServices() {
  return (
    <ServicePageTemplate
      serviceType="pest-control"
      serviceTitle="Pest Control Services"
      serviceDescription="Professional pest control for homes and businesses. Eliminate and prevent ants, roaches, spiders, rodents, termites, and more."
      metaDescription="Find pest control services near you. Eliminate ants, roaches, spiders, rodents, termites, and other pests. Residential and commercial pest control."
      metaKeywords="pest control, exterminator, termite control, rodent control, ant control, roach control, pest removal, pest control near me"
      icon={Bug}
      iconColor="green"
      category="home_services"
      subcategory="pest_control"
      faqs={[
        {
          question: "How much does pest control cost?",
          answer: "One-time treatments typically cost $150-$300. Monthly or quarterly service plans range from $30-$60 per month. Specialty treatments like termite control or bed bugs cost more."
        },
        {
          question: "How often should I have pest control?",
          answer: "For ongoing protection, quarterly treatments are most common. Monthly service may be needed for severe infestations. One-time treatments work for isolated problems but don't provide long-term prevention."
        },
        {
          question: "Are pest control products safe for pets and children?",
          answer: "Professional pest control uses products safely when applied correctly. Technicians can advise on precautions. Many companies offer pet-safe and eco-friendly treatment options."
        },
        {
          question: "How do I know if I have termites?",
          answer: "Signs include mud tubes on walls/foundations, hollow-sounding wood, discarded wings, frass (termite droppings), and sagging floors or ceilings. Annual termite inspections are recommended."
        }
      ]}
      relatedSearches={[
        "termite control",
        "rodent control",
        "ant exterminator",
        "roach control",
        "bed bug treatment",
        "mosquito control"
      ]}
      seoContent={`
        <h2>Professional Pest Control Services</h2>
        <p>Texas homes face a variety of pest challenges year-round. Professional pest control services can eliminate current infestations and prevent future problems.</p>
        
        <h3>Common Pests in Texas</h3>
        <ul>
          <li><strong>Ants:</strong> Fire ants, carpenter ants, sugar ants</li>
          <li><strong>Roaches:</strong> German, American, and Oriental cockroaches</li>
          <li><strong>Spiders:</strong> Brown recluse, black widow, wolf spiders</li>
          <li><strong>Rodents:</strong> Mice, rats, and squirrels</li>
          <li><strong>Termites:</strong> Subterranean and drywood termites</li>
          <li><strong>Mosquitoes:</strong> Yard treatment and prevention</li>
        </ul>
        
        <h3>Specialty Services</h3>
        <ul>
          <li><strong>Termite Treatment:</strong> Liquid barriers, bait stations, fumigation</li>
          <li><strong>Bed Bug Treatment:</strong> Heat treatment and chemical solutions</li>
          <li><strong>Wildlife Removal:</strong> Raccoons, opossums, squirrels</li>
          <li><strong>Mosquito Control:</strong> Yard spraying and prevention</li>
        </ul>
        
        <h3>Prevention Tips</h3>
        <p>Reduce pest attraction by sealing entry points, eliminating standing water, storing food properly, keeping yards clean, and addressing moisture issues. Regular pest control service provides the best long-term protection.</p>
      `}
    />
  );
}
