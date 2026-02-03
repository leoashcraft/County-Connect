import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  const lastUpdated = "January 2026";
  const appName = "County Connect";
  const contactEmail = "legal@countyconnect.com";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using {appName} ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
              </p>
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                {appName} is a community platform that provides:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Local marketplace for buying and selling goods</li>
                <li>Business and service directory</li>
                <li>Community bulletin board and events</li>
                <li>Restaurant, church, and school directories</li>
                <li>Job listings and employment resources</li>
                <li>Community resources and assistance programs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activity under your account</li>
              </ul>
              <p className="text-gray-600">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. User Content</h2>
              <p className="text-gray-600 mb-4">
                You retain ownership of content you post. By posting content, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content on the platform.
              </p>
              <p className="text-gray-600 mb-4">You agree not to post content that:</p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Is illegal, harmful, or fraudulent</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware or harmful code</li>
                <li>Is spam or deceptive advertising</li>
                <li>Violates the privacy of others</li>
                <li>Contains hate speech or harassment</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Marketplace Transactions</h2>
              <p className="text-gray-600 mb-4">
                {appName} facilitates transactions between buyers and sellers but is not a party to these transactions. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>The quality, safety, or legality of items listed</li>
                <li>The accuracy of listings</li>
                <li>The ability of sellers to sell or buyers to pay</li>
                <li>Disputes between users</li>
              </ul>
              <p className="text-gray-600">
                Users are responsible for complying with all applicable laws regarding their transactions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-600 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
                <li>Circumvent any security measures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The Service and its original content, features, and functionality are owned by {appName} and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-600">
                You may not copy, modify, distribute, or create derivative works from any part of the Service without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-600 mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
              <p className="text-gray-600">
                We do not endorse or guarantee the accuracy of any user-generated content, business listings, or community information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, {appName.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Indemnification</h2>
              <p className="text-gray-600">
                You agree to indemnify and hold harmless {appName}, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Governing Law</h2>
              <p className="text-gray-600">
                These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Dispute Resolution</h2>
              <p className="text-gray-600">
                Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">13. Termination</h2>
              <p className="text-gray-600">
                We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">14. Press & Partnerships</h2>
              <p className="text-gray-600 mb-4">
                For press inquiries, partnership opportunities, or media requests, please visit our{" "}
                <Link to={createPageUrl("PressPartnerships")} className="text-orange-600 hover:underline">
                  Press & Partnerships
                </Link>{" "}
                page or contact us directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">15. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-orange-600 hover:underline">
                  {contactEmail}
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
