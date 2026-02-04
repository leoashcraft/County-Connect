import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Truck } from "lucide-react";

export default function TowingServices() {
  return (
    <ServicePageTemplate
      serviceType="towing"
      serviceTitle="Towing Services"
      serviceDescription="24/7 towing and roadside assistance. Flatbed towing, jump starts, lockouts, tire changes, and fuel delivery."
      metaDescription="Find towing services near you for 24/7 roadside assistance. Flatbed towing, accident recovery, jump starts, lockouts, tire changes, and fuel delivery."
      metaKeywords="towing, tow truck, roadside assistance, flatbed towing, jump start, lockout service, tire change, towing near me"
      icon={Truck}
      iconColor="orange"
      category="automotive"
      subcategory="towing"
      faqs={[
        {
          question: "How much does towing cost?",
          answer: "Basic towing typically costs $75-$125 for the first 5-10 miles, plus $2-$7 per additional mile. Flatbed towing, after-hours service, and heavy-duty towing cost more. Get a quote before authorizing service."
        },
        {
          question: "When do I need flatbed towing?",
          answer: "Flatbed towing is recommended for all-wheel drive vehicles, low-profile cars, luxury vehicles, motorcycles, and vehicles with transmission problems. It's the safest towing method for most vehicles."
        },
        {
          question: "Does my insurance cover towing?",
          answer: "Many auto insurance policies include roadside assistance as an add-on. AAA and similar memberships also cover towing. Check your policy for coverage limits and procedures."
        },
        {
          question: "What should I do if I break down?",
          answer: "Pull safely off the road, turn on hazard lights, set out warning triangles if you have them, stay in your vehicle if it's unsafe outside, and call for help. Don't attempt repairs on busy roads."
        }
      ]}
      relatedSearches={[
        "24 hour towing",
        "flatbed towing",
        "roadside assistance",
        "jump start",
        "tire change",
        "accident towing"
      ]}
      seoContent={`
        <h2>Professional Towing & Roadside Assistance</h2>
        <p>When you're stranded on the side of the road, you need fast, reliable help. Local towing companies provide 24/7 emergency service to get you back on the road or safely to a repair shop.</p>
        
        <h3>Towing Services</h3>
        <ul>
          <li><strong>Flatbed Towing:</strong> Safest method for most vehicles</li>
          <li><strong>Wheel-Lift Towing:</strong> Traditional towing for front or rear-wheel drive</li>
          <li><strong>Motorcycle Towing:</strong> Specialized equipment for bikes</li>
          <li><strong>Heavy-Duty Towing:</strong> Trucks, RVs, and large vehicles</li>
          <li><strong>Accident Recovery:</strong> Remove vehicles from accident scenes</li>
          <li><strong>Winch-Out Service:</strong> Recover stuck vehicles</li>
        </ul>
        
        <h3>Roadside Assistance</h3>
        <ul>
          <li><strong>Jump Starts:</strong> Battery boost service</li>
          <li><strong>Lockout Service:</strong> Unlock your vehicle</li>
          <li><strong>Flat Tire Change:</strong> Mount your spare</li>
          <li><strong>Fuel Delivery:</strong> Emergency gas delivery</li>
        </ul>
        
        <h3>What to Know</h3>
        <ul>
          <li>Get an estimate before authorizing towing</li>
          <li>Confirm they have proper insurance and licensing</li>
          <li>Know where your vehicle will be taken</li>
          <li>Remove valuables before leaving your vehicle</li>
          <li>Get a receipt with all charges itemized</li>
        </ul>
        
        <h3>24/7 Emergency Service</h3>
        <p>Vehicle breakdowns don't follow business hours. Most towing companies offer round-the-clock service for emergencies, though after-hours rates may be higher.</p>
      `}
    />
  );
}
