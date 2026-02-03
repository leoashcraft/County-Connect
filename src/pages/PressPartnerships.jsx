import React from "react";
import { ArrowLeft, Newspaper, Handshake, Mail, Download, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PressPartnerships() {
  const appName = "County Connect";
  const pressEmail = "press@countyconnect.com";
  const partnershipsEmail = "partnerships@countyconnect.com";

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-orange-600" />
            Press & Partnerships
          </h1>
          <p className="text-gray-600 mt-2">
            Media inquiries, partnership opportunities, and press resources
          </p>
        </div>

        {/* About Section */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              About {appName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {appName} is a comprehensive community platform designed to connect residents of Navarro County, Texas. Our platform brings together local businesses, community resources, events, and neighbors to strengthen community bonds and support local commerce.
            </p>
            <p className="text-gray-600">
              Founded with the mission of building stronger, more connected communities, {appName} provides a digital town square where residents can discover local businesses, find community resources, buy and sell goods, and stay informed about local events.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Press Inquiries */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-orange-600" />
                Press & Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                For press inquiries, interview requests, or media information, please contact our press team.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Topics we cover:</strong>
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-600">
                  <li>Local community building and engagement</li>
                  <li>Small business support and local commerce</li>
                  <li>Rural community technology adoption</li>
                  <li>Community resource accessibility</li>
                </ul>
              </div>
              <div className="mt-4">
                <a
                  href={`mailto:${pressEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  <Mail className="w-4 h-4" />
                  Contact Press Team
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Partnership Inquiries */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-orange-600" />
                Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Interested in partnering with {appName}? We're always looking for ways to better serve our community.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Partnership opportunities:</strong>
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-600">
                  <li>Local business integrations</li>
                  <li>Community organization partnerships</li>
                  <li>County and municipal collaborations</li>
                  <li>Non-profit resource sharing</li>
                  <li>Educational institution partnerships</li>
                </ul>
              </div>
              <div className="mt-4">
                <a
                  href={`mailto:${partnershipsEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  <Mail className="w-4 h-4" />
                  Contact Partnerships
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Press Assets */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-orange-600" />
              Press Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Download official {appName} brand assets for use in media coverage.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Brand Guidelines</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Official colors, typography, and usage guidelines.
                </p>
                <p className="text-xs text-gray-500">Contact press team for access</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Logo Package</h4>
                <p className="text-sm text-gray-600 mb-3">
                  High-resolution logos in various formats.
                </p>
                <p className="text-xs text-gray-500">Contact press team for access</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Screenshots</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Approved platform screenshots and mockups.
                </p>
                <p className="text-xs text-gray-500">Contact press team for access</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Fact Sheet</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Key facts, statistics, and company information.
                </p>
                <p className="text-xs text-gray-500">Contact press team for access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Facts */}
        <Card className="border-2 border-orange-100">
          <CardHeader>
            <CardTitle>Quick Facts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service Area</p>
                <p className="font-medium text-gray-800">Navarro County, Texas</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Platform Type</p>
                <p className="font-medium text-gray-800">Community Platform</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Key Features</p>
                <p className="font-medium text-gray-800">Marketplace, Directory, Resources</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Founded</p>
                <p className="font-medium text-gray-800">2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            For general inquiries, please visit our support page or contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
}
