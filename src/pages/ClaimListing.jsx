import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings, getCountyDisplayName } from "@/hooks/useSiteSettings";
import {
  Building2, Star, CheckCircle, Send, Phone, Mail, MapPin,
  Briefcase, Utensils, GraduationCap, Landmark, Home, Calendar
} from "lucide-react";

export default function ClaimListing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  
  const listingType = searchParams.get("type") || "business";
  const listingName = searchParams.get("name") || "";
  const spotType = searchParams.get("spot") || "";
  
  const countyName = settings.county_name || "Navarro";
  const countyDisplayName = getCountyDisplayName(settings);
  
  const [formData, setFormData] = useState({
    businessName: listingName,
    contactName: "",
    email: "",
    phone: "",
    website: "",
    listingType: listingType,
    spotType: spotType,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const listingTypes = [
    { value: "featured_restaurant", label: "Featured Restaurant Spot", icon: Utensils },
    { value: "featured_foodtruck", label: "Featured Food Truck Spot", icon: Utensils },
    { value: "featured_school", label: "Featured School Spot", icon: GraduationCap },
    { value: "featured_attraction", label: "Featured Attraction Spot", icon: Landmark },
    { value: "featured_realty", label: "Featured Real Estate Spot", icon: Home },
    { value: "featured_event", label: "Featured Event Spot", icon: Calendar },
    { value: "service_page", label: "Dedicated Service Page", icon: Briefcase },
    { value: "business_page", label: "Dedicated Business Page", icon: Building2 },
    { value: "claim_existing", label: "Claim Existing Listing", icon: CheckCircle },
  ];

  const benefits = [
    "Dedicated page on NavarroCounty.com",
    "Prominent placement in search results",
    "Direct contact information displayed",
    "Professional business profile",
    "Mobile-friendly design",
    "Local SEO optimization included",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // In production, this would send to your backend/email service
    // For now, we'll simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Claim request submitted:", formData);
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <MetaTags
          title={`Request Received - ${countyDisplayName}`}
          description="Thank you for your interest in promoting your business."
          robots="noindex, nofollow"
        />
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in promoting your business on {countyDisplayName}. 
                We'll review your request and get back to you within 1-2 business days.
              </p>
              <Button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600">
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <MetaTags
        title={`Promote Your Business - ${countyDisplayName}`}
        description={`Get featured on ${countyDisplayName}. Claim your business listing or get a dedicated page to reach local customers.`}
        robots="noindex, nofollow"
      />
      
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Grow Your Local Business
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Featured on {countyDisplayName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reach thousands of local residents looking for services like yours.
            Get a dedicated page or featured placement on our community platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-orange-100 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Questions?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    We're happy to discuss options that work for your business.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      advertise@navarrocounty.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
                <p className="text-sm text-gray-600">
                  Tell us about your business and we'll get back to you with options.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleChange("businessName", e.target.value)}
                        placeholder="Your Business Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Your Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleChange("contactName", e.target.value)}
                        placeholder="John Smith"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="(903) 555-0123"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Current Website (if any)</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://yourbusiness.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="listingType">What are you interested in? *</Label>
                    <Select 
                      value={formData.listingType} 
                      onValueChange={(value) => handleChange("listingType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured_spot">Featured Spot on Directory Page</SelectItem>
                        <SelectItem value="service_page">Dedicated Service Page (e.g., /notary)</SelectItem>
                        <SelectItem value="business_page">Dedicated Business Page</SelectItem>
                        <SelectItem value="claim_existing">Claim/Enhance Existing Listing</SelectItem>
                        <SelectItem value="other">Other / Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us about your business</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="What services do you offer? What are you hoping to achieve?"
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to be contacted about advertising opportunities.
                    We respect your privacy and won't share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "What is a dedicated service page?",
                a: "A dedicated page like navarrocounty.com/notary that ranks for local searches. You control the content and get all the leads."
              },
              {
                q: "What is a featured spot?",
                a: "Premium placement at the top of directory pages (like Restaurants or Attractions) where your business stands out from regular listings."
              },
              {
                q: "How long does setup take?",
                a: "Most pages are live within 24-48 hours after we receive your business information and any photos/content."
              },
              {
                q: "Can I update my listing?",
                a: "Yes! You can request updates anytime, or we can give you direct access to manage your own page."
              },
            ].map((faq, idx) => (
              <Card key={idx} className="border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
