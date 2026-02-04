import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Key } from "lucide-react";

export default function LocksmithServices() {
  return (
    <ServicePageTemplate
      serviceType="locksmith"
      serviceTitle="Locksmith Services"
      serviceDescription="Professional locksmith services for residential, commercial, and automotive needs. Available for lockouts, rekeying, and security upgrades."
      metaDescription="Find reliable locksmith services near you. 24/7 emergency lockout service, lock rekeying, key duplication, and security system installation."
      metaKeywords="locksmith, lockout service, car lockout, house lockout, lock repair, key duplication, rekey locks, locksmith near me"
      icon={Key}
      iconColor="amber"
      category="professional_services"
      subcategory="locksmith"
      faqs={[
        {
          question: "How much does a locksmith charge for a lockout?",
          answer: "Lockout service typically ranges from $50-$150 depending on the time of day, type of lock, and location. Emergency after-hours service may cost more. Always ask for a quote before service begins."
        },
        {
          question: "Can a locksmith make a key without the original?",
          answer: "Yes, professional locksmiths can create new keys without the original using various methods including impressioning, decoding, or picking the lock to create a working key."
        },
        {
          question: "How long does it take to rekey a lock?",
          answer: "Rekeying a standard lock typically takes 10-15 minutes per lock. This is faster and more affordable than replacing the entire lock, while still ensuring old keys no longer work."
        },
        {
          question: "Should I rekey or replace my locks?",
          answer: "Rekeying is usually sufficient if you want to prevent old keys from working (after moving, lost keys, etc.). Lock replacement is recommended if locks are old, damaged, or you want to upgrade security."
        }
      ]}
      relatedSearches={[
        "24 hour locksmith",
        "car lockout",
        "house lockout",
        "lock rekey",
        "key copy",
        "emergency locksmith"
      ]}
      seoContent={`
        <h2>Professional Locksmith Services</h2>
        <p>Whether you're locked out of your car, home, or business, a professional locksmith can help you regain access quickly and safely. Modern locksmiths offer a wide range of services beyond emergency lockouts.</p>
        
        <h3>Residential Locksmith Services</h3>
        <ul>
          <li><strong>Home Lockouts:</strong> Regain access when you're locked out</li>
          <li><strong>Lock Rekeying:</strong> Change locks to work with new keys</li>
          <li><strong>Lock Installation:</strong> Install new deadbolts and entry locks</li>
          <li><strong>Security Upgrades:</strong> High-security locks and smart locks</li>
        </ul>
        
        <h3>Automotive Locksmith Services</h3>
        <ul>
          <li><strong>Car Lockouts:</strong> Unlock vehicles without damage</li>
          <li><strong>Key Replacement:</strong> Create new car keys, including transponder keys</li>
          <li><strong>Ignition Repair:</strong> Fix or replace damaged ignitions</li>
          <li><strong>Key Fob Programming:</strong> Program remote entry and smart keys</li>
        </ul>
        
        <h3>Commercial Locksmith Services</h3>
        <p>Businesses can benefit from master key systems, high-security locks, access control systems, and emergency commercial lockout services.</p>
      `}
    />
  );
}
