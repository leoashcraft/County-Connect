import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const lastUpdated = "January 2026";
  const appName = "County Connect";
  const contactEmail = "privacy@countyconnect.com";

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
            <Shield className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to {appName} ("we", "us", or "our"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p className="text-gray-600">
                By using {appName}, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-medium text-gray-700 mb-2">2.1 Personal Information</h3>
              <p className="text-gray-600 mb-4">When you create an account or use our services, we may collect:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Name and email address</li>
                <li>Profile information</li>
                <li>Account credentials</li>
                <li>Authentication data from third-party providers (e.g., Google)</li>
                <li>Phone number (if provided)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-700 mb-2">2.2 Usage Data</h3>
              <p className="text-gray-600 mb-4">We automatically collect certain information when you use our services:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and approximate location</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-700 mb-2">2.3 Content You Provide</h3>
              <p className="text-gray-600 mb-4">
                We collect information you voluntarily provide, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Marketplace listings and product information</li>
                <li>Business directory entries</li>
                <li>Community posts and messages</li>
                <li>Reviews and ratings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and manage your account</li>
                <li>Facilitate marketplace transactions</li>
                <li>Personalize your experience</li>
                <li>Send service-related communications</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">We may share your information in the following circumstances:</p>

              <h3 className="text-lg font-medium text-gray-700 mb-2">4.1 Service Providers</h3>
              <p className="text-gray-600 mb-4">
                We may share data with third-party vendors who assist in operating our services, including hosting, analytics, and payment processing providers.
              </p>

              <h3 className="text-lg font-medium text-gray-700 mb-2">4.2 Other Users</h3>
              <p className="text-gray-600 mb-4">
                When you create listings or posts, certain information may be visible to other users of the platform as part of the service functionality.
              </p>

              <h3 className="text-lg font-medium text-gray-700 mb-2">4.3 Legal Requirements</h3>
              <p className="text-gray-600">
                We may disclose your information if required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience. For detailed information, please see our{" "}
                <Link to={createPageUrl("CookiePolicy")} className="text-orange-600 hover:underline">
                  Cookie Policy
                </Link>.
              </p>
              <p className="text-gray-600">
                We use two types of analytics:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mt-2">
                <li><strong>Google Analytics 4:</strong> Requires your consent and uses cookies</li>
                <li><strong>Umami:</strong> Privacy-focused analytics that doesn't use cookies or track personal data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Your Privacy Rights</h2>
              <p className="text-gray-600 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-gray-600">
                To exercise these rights, please contact us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-orange-600 hover:underline">
                  {contactEmail}
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">7. California Privacy Rights (CCPA/CPRA)</h2>
              <p className="text-gray-600 mb-4">
                California residents have additional rights under the California Consumer Privacy Act and California Privacy Rights Act:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to equal service and price</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Data Retention</h2>
              <p className="text-gray-600">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at{" "}
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
