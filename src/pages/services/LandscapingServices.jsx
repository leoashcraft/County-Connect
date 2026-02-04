import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Trees } from "lucide-react";

export default function LandscapingServices() {
  return (
    <ServicePageTemplate
      serviceType="landscaping"
      serviceTitle="Landscaping Services"
      serviceDescription="Professional lawn care and landscaping services. Mowing, trimming, design, installation, irrigation, and seasonal maintenance."
      metaDescription="Find landscaping services near you. Lawn care, mowing, tree trimming, landscape design, irrigation systems, and seasonal yard maintenance."
      metaKeywords="landscaping, lawn care, lawn mowing, tree trimming, landscape design, irrigation, yard maintenance, landscaper near me"
      icon={Trees}
      iconColor="emerald"
      category="home_services"
      subcategory="landscaping"
      faqs={[
        {
          question: "How much does lawn care cost per month?",
          answer: "Basic lawn mowing for an average yard typically costs $30-$80 per visit or $120-$200 monthly. Full-service lawn care with fertilization, weed control, and trimming ranges from $200-$500+ monthly."
        },
        {
          question: "How often should I mow my lawn?",
          answer: "During growing season, mow weekly or every 10 days. Never remove more than 1/3 of the grass blade height at once. In Texas, warm-season grasses need mowing from March through November."
        },
        {
          question: "What's included in landscape maintenance?",
          answer: "Services typically include mowing, edging, trimming, leaf removal, bed maintenance, and seasonal cleanup. Additional services may include fertilization, weed control, and irrigation management."
        },
        {
          question: "When should I aerate my lawn?",
          answer: "Aerate warm-season grasses (St. Augustine, Bermuda) in late spring to early summer. Aeration reduces soil compaction and improves water and nutrient absorption."
        }
      ]}
      relatedSearches={[
        "lawn mowing",
        "tree trimming",
        "landscape design",
        "irrigation repair",
        "sod installation",
        "mulch delivery"
      ]}
      seoContent={`
        <h2>Professional Landscaping Services</h2>
        <p>A well-maintained landscape enhances curb appeal, increases property value, and provides outdoor enjoyment. Professional landscapers keep your yard looking its best year-round.</p>
        
        <h3>Lawn Care Services</h3>
        <ul>
          <li><strong>Mowing & Edging:</strong> Regular cutting and clean edges</li>
          <li><strong>Fertilization:</strong> Scheduled feeding for healthy growth</li>
          <li><strong>Weed Control:</strong> Pre and post-emergent treatments</li>
          <li><strong>Aeration & Overseeding:</strong> Improve lawn health and density</li>
          <li><strong>Pest & Disease Treatment:</strong> Protect against lawn problems</li>
        </ul>
        
        <h3>Landscape Services</h3>
        <ul>
          <li><strong>Design & Installation:</strong> Create beautiful outdoor spaces</li>
          <li><strong>Planting:</strong> Trees, shrubs, flowers, and groundcovers</li>
          <li><strong>Hardscaping:</strong> Patios, walkways, retaining walls</li>
          <li><strong>Irrigation:</strong> Installation, repair, and winterization</li>
          <li><strong>Outdoor Lighting:</strong> Landscape and security lighting</li>
        </ul>
        
        <h3>Tree & Shrub Care</h3>
        <ul>
          <li><strong>Pruning & Trimming:</strong> Shape and maintain health</li>
          <li><strong>Tree Removal:</strong> Safe removal of dead or hazardous trees</li>
          <li><strong>Stump Grinding:</strong> Remove stumps below ground level</li>
        </ul>
        
        <h3>Seasonal Services</h3>
        <p>Spring cleanup, fall leaf removal, winter preparation, and holiday lighting installation are seasonal services many landscapers provide.</p>
      `}
    />
  );
}
