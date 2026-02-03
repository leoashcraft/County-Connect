import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageCookiesButton } from "@/components/CookieConsent";

export default function CookiePolicy() {
  const lastUpdated = "January 2026";
  const appName = "County Connect";

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
            <Cookie className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">
                {appName} uses cookies and similar technologies for the following purposes:
              </p>

              <h3 className="text-lg font-medium text-gray-700 mb-2">2.1 Essential Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure access, and session management.
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Authentication:</strong> Keep you logged in during your session</li>
                <li><strong>Security:</strong> Protect against cross-site request forgery</li>
                <li><strong>Session:</strong> Maintain your session state</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-700 mb-2">2.2 Analytics Cookies</h3>
              <p className="text-gray-600 mb-4">
                We use analytics to understand how visitors interact with our website:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>
                  <strong>Google Analytics 4:</strong> Uses cookies to collect information about how you use our site. This data helps us improve our services. GA4 cookies are only set if you accept our cookie consent banner.
                </li>
                <li>
                  <strong>Umami Analytics:</strong> A privacy-focused analytics service that does NOT use cookies. It collects anonymized data about page views and doesn't track personal information. No consent is required for Umami.
                </li>
              </ul>

              <h3 className="text-lg font-medium text-gray-700 mb-2">2.3 Preference Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies remember your preferences:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li><strong>Cookie Consent:</strong> Remembers your cookie preferences (stored for 12 months)</li>
                <li><strong>Location:</strong> Remembers your preferred town/location filter</li>
                <li><strong>Theme:</strong> Remembers display preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                Some cookies may be set by third-party services we use:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li><strong>Google (Authentication):</strong> If you sign in with Google</li>
                <li><strong>Google Analytics:</strong> Analytics cookies (with your consent)</li>
                <li><strong>OpenStreetMap/Leaflet:</strong> Map functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Cookie Duration</h2>
              <p className="text-gray-600 mb-4">
                Cookies can be either session cookies or persistent cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain on your device for a set period (e.g., cookie consent is stored for 12 months)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                You have several options to manage cookies:
              </p>

              <h3 className="text-lg font-medium text-gray-700 mb-2">5.1 Our Cookie Preferences</h3>
              <p className="text-gray-600 mb-4">
                You can change your cookie preferences at any time by clicking the button below:
              </p>
              <div className="mb-4">
                <ManageCookiesButton className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition" />
              </div>

              <h3 className="text-lg font-medium text-gray-700 mb-2">5.2 Browser Settings</h3>
              <p className="text-gray-600 mb-4">
                Most browsers allow you to control cookies through their settings:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies</li>
                <li><strong>Firefox:</strong> Settings &gt; Privacy & Security &gt; Cookies</li>
                <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies</li>
                <li><strong>Edge:</strong> Settings &gt; Privacy &gt; Cookies</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-700 mb-2">5.3 Opt-Out Links</h3>
              <p className="text-gray-600 mb-4">
                You can opt out of specific analytics services:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-gray-600 mb-4">
                If you disable cookies, some features of our website may not function properly:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>You may not be able to stay logged in</li>
                <li>Preferences may not be saved</li>
                <li>Some interactive features may not work</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about our use of cookies, please see our{" "}
                <Link to={createPageUrl("PrivacyPolicy")} className="text-orange-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                or contact us.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
