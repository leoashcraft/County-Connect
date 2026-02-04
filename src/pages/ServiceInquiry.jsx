import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ServicePage, SupportTicket, User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Phone,
  Mail,
  Building2,
  MapPin,
  Globe,
  Send,
  Shield,
  Star,
  Users,
  TrendingUp
} from "lucide-react";

export default function ServiceInquiry() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const serviceSlug = urlParams.get('service');

  const [user, setUser] = useState(null);
  const [servicePage, setServicePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    yearsInBusiness: "",
    description: "",
    whyChooseUs: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [serviceSlug]);

  const loadData = async () => {
    try {
      // Try to get logged in user
      try {
        const userData = await User.me();
        setUser(userData);
        // Pre-fill email if user is logged in
        if (userData.email) {
          setFormData(prev => ({ ...prev, email: userData.email }));
        }
        if (userData.full_name) {
          setFormData(prev => ({ ...prev, contactName: userData.full_name }));
        }
      } catch (e) {
        // User not logged in, that's fine
      }

      // Load service page if slug provided
      if (serviceSlug) {
        const pages = await ServicePage.filter({ slug: serviceSlug });
        if (pages && pages.length > 0) {
          setServicePage(pages[0]);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please describe your business";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Create a support ticket for the claim request
      const ticketNum = `CLAIM-${Date.now()}`;
      
      // Build the description with all the business info
      const description = `
SERVICE PAGE CLAIM REQUEST
==========================

Service Page: ${servicePage?.title || 'General Inquiry'}
Service Slug: ${servicePage?.slug || 'N/A'}

BUSINESS INFORMATION
--------------------
Business Name: ${formData.businessName}
Contact Name: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone}
Website: ${formData.website || 'Not provided'}
Address: ${formData.address || 'Not provided'}
City: ${formData.city}
Years in Business: ${formData.yearsInBusiness || 'Not specified'}

BUSINESS DESCRIPTION
--------------------
${formData.description}

WHY CHOOSE THIS BUSINESS
------------------------
${formData.whyChooseUs || 'Not provided'}

ADDITIONAL NOTES
----------------
- Submitted by: ${user ? `${user.full_name || user.email} (logged in)` : 'Guest user'}
- Service Page ID: ${servicePage?.id || 'N/A'}
- Page Currently Claimed: ${servicePage?.claimedBusinessId ? 'Yes' : 'No'}
      `.trim();

      await SupportTicket.create({
        ticket_number: ticketNum,
        user_email: formData.email,
        subject: `Service Page Claim: ${formData.businessName} - ${servicePage?.title || 'General'}`,
        category: "service_page_claim",
        priority: "medium",
        description: description,
        status: "open",
        // Store structured data for easy access
        metadata: {
          type: "service_page_claim",
          servicePageId: servicePage?.id,
          servicePageSlug: servicePage?.slug,
          servicePageTitle: servicePage?.title,
          businessName: formData.businessName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          city: formData.city,
          yearsInBusiness: formData.yearsInBusiness
        }
      });

      setTicketNumber(ticketNum);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      alert("Failed to submit inquiry. Please try again.");
    }

    setSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  // Success screen
  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Inquiry Submitted | Navarro County</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-green-200">
              <CardContent className="pt-12 pb-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Inquiry Submitted Successfully!
                </h1>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Thank you for your interest in claiming the <strong>{servicePage?.title}</strong> service page.
                  Our team will review your inquiry and contact you within 1-2 business days.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-8 max-w-sm mx-auto">
                  <p className="text-sm text-gray-500 mb-1">Your Reference Number</p>
                  <p className="font-mono font-bold text-lg text-gray-900">{ticketNumber}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    A confirmation email has been sent to <strong>{formData.email}</strong>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {servicePage && (
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/service/${servicePage.slug}`)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to {servicePage.title}
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate(createPageUrl("ServiceDirectory"))}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      Browse More Services
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {servicePage 
            ? `Claim ${servicePage.title} Service Page | Navarro County` 
            : 'Service Page Inquiry | Navarro County'}
        </title>
        <meta name="description" content="Inquire about claiming exclusive sponsorship of a service page on Navarro County." />
        <meta name="robots" content="noindex" /> {/* Don't index the form page */}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => servicePage ? navigate(`/service/${servicePage.slug}`) : navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {servicePage ? `Back to ${servicePage.title}` : 'Back'}
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <Briefcase className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {servicePage 
                          ? `Claim the ${servicePage.title} Page` 
                          : 'Service Page Inquiry'}
                      </CardTitle>
                      <p className="text-gray-600 text-sm mt-1">
                        Feature your business exclusively on this high-visibility page
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business Information */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-orange-600" />
                        Business Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name *</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                            placeholder="Your Business Name"
                            className={errors.businessName ? 'border-red-500' : ''}
                          />
                          {errors.businessName && (
                            <p className="text-sm text-red-500">{errors.businessName}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="yearsInBusiness">Years in Business</Label>
                          <Input
                            id="yearsInBusiness"
                            value={formData.yearsInBusiness}
                            onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                            placeholder="e.g., 15 years"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-orange-600" />
                        Contact Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Name *</Label>
                          <Input
                            id="contactName"
                            value={formData.contactName}
                            onChange={(e) => handleInputChange('contactName', e.target.value)}
                            placeholder="Your full name"
                            className={errors.contactName ? 'border-red-500' : ''}
                          />
                          {errors.contactName && (
                            <p className="text-sm text-red-500">{errors.contactName}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="you@yourbusiness.com"
                            className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(903) 555-0123"
                            className={errors.phone ? 'border-red-500' : ''}
                          />
                          {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            placeholder="https://yourbusiness.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        Location
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="123 Main Street"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Corsicana"
                            className={errors.city ? 'border-red-500' : ''}
                          />
                          {errors.city && (
                            <p className="text-sm text-red-500">{errors.city}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>County</Label>
                          <Input value="Navarro County, TX" disabled className="bg-gray-50" />
                        </div>
                      </div>
                    </div>

                    {/* Business Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">About Your Business</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="description">Business Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe your business, services offered, and what sets you apart..."
                            rows={4}
                            className={errors.description ? 'border-red-500' : ''}
                          />
                          {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="whyChooseUs">Why Should Customers Choose You?</Label>
                          <Textarea
                            id="whyChooseUs"
                            value={formData.whyChooseUs}
                            onChange={(e) => handleInputChange('whyChooseUs', e.target.value)}
                            placeholder="Share your unique value proposition, certifications, awards, or guarantees..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                          className={errors.agreeToTerms ? 'border-red-500' : ''}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
                            I agree to the{' '}
                            <Link to="/TermsOfService" className="text-orange-600 hover:underline">
                              Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link to="/PrivacyPolicy" className="text-orange-600 hover:underline">
                              Privacy Policy
                            </Link>
                            . I understand that claiming a service page involves a sponsorship agreement.
                          </Label>
                          {errors.agreeToTerms && (
                            <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-lg py-6"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Page Info */}
              {servicePage && (
                <Card className="border-2 border-orange-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Page You're Claiming</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Briefcase className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{servicePage.title}</p>
                        <p className="text-sm text-gray-500">/{servicePage.slug}</p>
                      </div>
                    </div>
                    {servicePage.claimedBusinessId ? (
                      <Badge className="bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Currently Claimed
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              <Card className="border-2 border-green-100 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-600" />
                    Benefits of Claiming
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Exclusive Placement</p>
                      <p className="text-sm text-gray-600">You're the only business featured on this page</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">SEO Benefits</p>
                      <p className="text-sm text-gray-600">High-quality, locally-focused content drives organic traffic</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Local Visibility</p>
                      <p className="text-sm text-gray-600">Connect with customers in Navarro County</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Direct Contact</p>
                      <p className="text-sm text-gray-600">Prominent call-to-action buttons for your business</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Notice */}
              <Card className="border-2 border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Your Privacy</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Your information is only used to process this inquiry. 
                        We never sell or share your data with third parties.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border-2 border-gray-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Questions?</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(createPageUrl("Support"))}
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
