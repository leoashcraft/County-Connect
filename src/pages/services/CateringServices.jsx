import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { ChefHat } from "lucide-react";

export default function CateringServices() {
  return (
    <ServicePageTemplate
      serviceType="catering"
      serviceTitle="Catering Services"
      serviceDescription="Professional catering for weddings, corporate events, parties, and special occasions. Delicious food for any size event."
      metaDescription="Find catering services near you for weddings, corporate events, parties, and special occasions. Full-service and drop-off catering options available."
      metaKeywords="catering, wedding catering, corporate catering, event catering, party catering, food catering, caterer near me"
      icon={ChefHat}
      iconColor="rose"
      category="food_service"
      subcategory="catering"
      faqs={[
        {
          question: "How much does catering cost per person?",
          answer: "Catering costs range widely: buffet-style $15-$40 per person, plated dinner $25-$75+, appetizers only $10-$25 per person. Wedding catering with full service typically costs $50-$150+ per person."
        },
        {
          question: "How far in advance should I book catering?",
          answer: "Book wedding caterers 6-12 months ahead. Corporate events 2-4 weeks minimum. Large parties 3-4 weeks. Small gatherings may be accommodated with less notice depending on availability."
        },
        {
          question: "What's the difference between full-service and drop-off catering?",
          answer: "Full-service includes setup, serving staff, and cleanup. Drop-off catering delivers prepared food for you to serve yourself. Full-service costs more but offers a seamless experience."
        },
        {
          question: "Can caterers accommodate dietary restrictions?",
          answer: "Yes, most caterers can accommodate vegetarian, vegan, gluten-free, kosher, halal, and allergy restrictions. Discuss all dietary needs during your consultation."
        }
      ]}
      relatedSearches={[
        "wedding catering",
        "BBQ catering",
        "corporate catering",
        "party platters",
        "food truck catering",
        "Mexican catering"
      ]}
      seoContent={`
        <h2>Professional Catering Services</h2>
        <p>Great food makes any event memorable. Local caterers offer everything from casual drop-off service to elegant full-service dining for weddings and corporate events.</p>
        
        <h3>Catering Options</h3>
        <ul>
          <li><strong>Full-Service Catering:</strong> Complete event staffing and service</li>
          <li><strong>Buffet Service:</strong> Self-serve stations with variety</li>
          <li><strong>Plated Dinner:</strong> Elegant sit-down service</li>
          <li><strong>Drop-Off Catering:</strong> Prepared food delivered to you</li>
          <li><strong>Food Truck Catering:</strong> Casual, fun option for events</li>
        </ul>
        
        <h3>Event Types</h3>
        <ul>
          <li><strong>Weddings:</strong> Rehearsal dinners to reception meals</li>
          <li><strong>Corporate:</strong> Meetings, conferences, holiday parties</li>
          <li><strong>Private Parties:</strong> Birthdays, anniversaries, graduations</li>
          <li><strong>Social Events:</strong> Fundraisers, galas, community events</li>
        </ul>
        
        <h3>Cuisine Options</h3>
        <ul>
          <li>Texas BBQ and smokehouse</li>
          <li>Mexican and Tex-Mex</li>
          <li>Italian and Mediterranean</li>
          <li>Southern comfort food</li>
          <li>International and fusion</li>
        </ul>
        
        <h3>Planning Tips</h3>
        <ul>
          <li>Get detailed quotes including all fees</li>
          <li>Schedule a tasting before booking</li>
          <li>Confirm headcount guarantee policies</li>
          <li>Discuss setup and cleanup requirements</li>
          <li>Review contracts carefully</li>
        </ul>
      `}
    />
  );
}
