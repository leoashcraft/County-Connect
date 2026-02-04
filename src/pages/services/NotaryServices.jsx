import React from "react";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { FileSignature } from "lucide-react";

export default function NotaryServices() {
  return (
    <ServicePageTemplate
      serviceType="notary"
      serviceTitle="Notary Services"
      serviceDescription="Find certified notary publics in your area for document notarization, oaths, affidavits, and legal document witnessing."
      metaDescription="Find notary services near you. Certified notary publics available for document notarization, oaths, affidavits, acknowledgments, and legal document witnessing."
      metaKeywords="notary public, notary services, document notarization, mobile notary, notary near me, certified notary, legal documents"
      icon={FileSignature}
      iconColor="blue"
      category="professional_services"
      subcategory="notary"
      faqs={[
        {
          question: "What documents can a notary notarize?",
          answer: "Notaries can notarize a wide variety of documents including real estate deeds, power of attorney forms, wills, trusts, contracts, affidavits, loan documents, and many other legal documents requiring verification of identity and signature."
        },
        {
          question: "What do I need to bring to a notary?",
          answer: "You'll need to bring valid government-issued photo identification (driver's license, passport, or state ID), the document(s) to be notarized, and any required witnesses if applicable. Do NOT sign the document beforehand - you must sign in front of the notary."
        },
        {
          question: "How much does notary service cost?",
          answer: "In Texas, notary fees are regulated by state law. Most acknowledgments and jurats are $6 per signature. Mobile notaries may charge additional travel fees. Contact local notaries for specific pricing."
        },
        {
          question: "Can a notary provide legal advice?",
          answer: "No. Unless they are also a licensed attorney, notaries cannot provide legal advice, prepare legal documents, or explain legal documents. They can only verify identity and witness signatures."
        }
      ]}
      relatedSearches={[
        "mobile notary",
        "24 hour notary",
        "notary near me",
        "document notarization",
        "real estate notary",
        "loan signing agent"
      ]}
      seoContent={`
        <h2>Professional Notary Services</h2>
        <p>A notary public is a state-commissioned official who serves as an impartial witness to the signing of important documents. Notarization helps prevent fraud and ensures that the parties involved are who they claim to be.</p>
        
        <h3>Common Documents Requiring Notarization</h3>
        <ul>
          <li><strong>Real Estate Documents:</strong> Deeds, mortgages, and property transfers</li>
          <li><strong>Legal Documents:</strong> Power of attorney, wills, and trusts</li>
          <li><strong>Financial Documents:</strong> Loan documents and bank forms</li>
          <li><strong>Business Documents:</strong> Contracts, partnership agreements, and corporate minutes</li>
          <li><strong>Personal Documents:</strong> Affidavits, declarations, and sworn statements</li>
        </ul>
        
        <h3>Mobile Notary Services</h3>
        <p>Many notaries offer mobile services and will travel to your home, office, hospital, or other location. This is especially convenient for real estate closings, elderly clients, or busy professionals.</p>
      `}
    />
  );
}
