import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Thermometer } from "lucide-react";

export default function HvacServices() {
  return (
    <ServicePageTemplate
      serviceType="hvac"
      serviceTitle="HVAC Services"
      serviceDescription="Heating, ventilation, and air conditioning services. Installation, repair, and maintenance for all HVAC systems."
      metaDescription="Find HVAC contractors near you for heating and cooling needs. AC repair, furnace service, heat pump installation, and 24/7 emergency HVAC service."
      metaKeywords="HVAC, air conditioning, heating, AC repair, furnace repair, heat pump, HVAC installation, HVAC near me"
      icon={Thermometer}
      iconColor="red"
      category="home_services"
      subcategory="hvac"
      faqs={[
        {
          question: "How often should I service my HVAC system?",
          answer: "HVAC systems should be serviced twice a year - in spring for AC and fall for heating. Regular maintenance extends equipment life, improves efficiency, and catches problems early."
        },
        {
          question: "How long does an HVAC system last?",
          answer: "With proper maintenance, air conditioners last 15-20 years and furnaces last 15-30 years. Heat pumps typically last 10-15 years. Older systems become less efficient and more expensive to repair."
        },
        {
          question: "Why is my AC not cooling?",
          answer: "Common causes include dirty filters, low refrigerant, frozen evaporator coils, faulty compressor, or thermostat issues. Try changing your filter first, then call a professional if the problem persists."
        },
        {
          question: "What size AC unit do I need?",
          answer: "AC size is measured in tons. A professional should perform a load calculation based on your home's square footage, insulation, windows, and climate to determine the correct size."
        }
      ]}
      relatedSearches={[
        "AC repair",
        "furnace repair",
        "heat pump",
        "HVAC maintenance",
        "ductwork",
        "thermostat installation"
      ]}
      seoContent={`
        <h2>Professional HVAC Services</h2>
        <p>Your HVAC system is essential for year-round comfort in Texas. Professional HVAC technicians can keep your system running efficiently through hot summers and cold winters.</p>
        
        <h3>Air Conditioning Services</h3>
        <ul>
          <li><strong>AC Repair:</strong> Diagnose and fix cooling problems</li>
          <li><strong>AC Installation:</strong> New system installation and replacement</li>
          <li><strong>AC Maintenance:</strong> Annual tune-ups and inspections</li>
          <li><strong>Refrigerant Recharge:</strong> Fix low refrigerant issues</li>
        </ul>
        
        <h3>Heating Services</h3>
        <ul>
          <li><strong>Furnace Repair:</strong> Gas and electric furnace service</li>
          <li><strong>Heat Pump Service:</strong> Installation and repair</li>
          <li><strong>Heating Maintenance:</strong> Pre-season inspections</li>
        </ul>
        
        <h3>Additional Services</h3>
        <ul>
          <li><strong>Ductwork:</strong> Cleaning, sealing, and installation</li>
          <li><strong>Indoor Air Quality:</strong> Air purifiers, humidifiers, UV lights</li>
          <li><strong>Smart Thermostats:</strong> Installation and programming</li>
          <li><strong>Zoning Systems:</strong> Customized comfort control</li>
        </ul>
        
        <h3>Emergency HVAC Service</h3>
        <p>When your AC fails on the hottest day of summer or your heat goes out in winter, many HVAC companies offer 24/7 emergency service to restore your comfort quickly.</p>
      `}
    />
  );
}
