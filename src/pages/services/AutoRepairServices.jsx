import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Car } from "lucide-react";

export default function AutoRepairServices() {
  return (
    <ServicePageTemplate
      serviceType="auto-repair"
      serviceTitle="Auto Repair Services"
      serviceDescription="Trusted auto mechanics for all vehicle repairs and maintenance. Oil changes, brakes, engine repair, diagnostics, and more."
      metaDescription="Find auto repair shops near you for car maintenance and repair. Oil changes, brake repair, engine diagnostics, transmission service, and tire services."
      metaKeywords="auto repair, car mechanic, oil change, brake repair, engine repair, transmission, auto shop, mechanic near me"
      icon={Car}
      iconColor="blue"
      category="automotive"
      subcategory="auto_repair"
      faqs={[
        {
          question: "How often should I change my oil?",
          answer: "Most modern vehicles need oil changes every 5,000-7,500 miles with synthetic oil, or every 3,000-5,000 miles with conventional oil. Check your owner's manual for specific recommendations."
        },
        {
          question: "How do I know if I need new brakes?",
          answer: "Warning signs include squealing or grinding noises, vibration when braking, longer stopping distances, brake warning light, and a spongy brake pedal. Have brakes inspected if you notice any of these."
        },
        {
          question: "What does a check engine light mean?",
          answer: "The check engine light can indicate issues ranging from a loose gas cap to serious engine problems. A diagnostic scan can read the trouble codes and identify the specific problem."
        },
        {
          question: "Should I go to a dealer or independent shop?",
          answer: "Independent shops often charge less while providing quality service. They can perform most repairs and maintenance. Dealers may be preferred for warranty work or specialized manufacturer issues."
        }
      ]}
      relatedSearches={[
        "oil change",
        "brake repair",
        "tire shop",
        "engine repair",
        "transmission repair",
        "auto AC repair"
      ]}
      seoContent={`
        <h2>Professional Auto Repair Services</h2>
        <p>Regular maintenance keeps your vehicle running safely and reliably. Local auto repair shops provide quality service at competitive prices for all makes and models.</p>
        
        <h3>Routine Maintenance</h3>
        <ul>
          <li><strong>Oil Changes:</strong> Conventional and synthetic oil services</li>
          <li><strong>Fluid Services:</strong> Coolant, transmission, brake, and power steering</li>
          <li><strong>Filters:</strong> Air, cabin air, fuel, and oil filters</li>
          <li><strong>Inspections:</strong> Multi-point and state inspections</li>
          <li><strong>Tune-Ups:</strong> Spark plugs, belts, and hoses</li>
        </ul>
        
        <h3>Repair Services</h3>
        <ul>
          <li><strong>Brakes:</strong> Pads, rotors, calipers, and brake lines</li>
          <li><strong>Engine:</strong> Diagnostics, repair, and replacement</li>
          <li><strong>Transmission:</strong> Service, repair, and rebuilds</li>
          <li><strong>Electrical:</strong> Battery, alternator, starter, and wiring</li>
          <li><strong>Suspension:</strong> Shocks, struts, and alignment</li>
          <li><strong>AC & Heating:</strong> Climate control repair</li>
        </ul>
        
        <h3>Tire Services</h3>
        <ul>
          <li><strong>Tire Sales:</strong> New and used tires</li>
          <li><strong>Mounting & Balancing:</strong> Professional installation</li>
          <li><strong>Rotation:</strong> Extend tire life evenly</li>
          <li><strong>Flat Repair:</strong> Patch and plug services</li>
        </ul>
        
        <h3>Choosing a Mechanic</h3>
        <p>Look for ASE-certified technicians, check online reviews, ask about warranties, and get written estimates before authorizing repairs.</p>
      `}
    />
  );
}
