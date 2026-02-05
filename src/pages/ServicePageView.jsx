import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ServicePage, Store } from "@/api/entities";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Home,
  Wrench,
  Briefcase,
  Heart,
  Car,
  Music,
  Utensils,
  Leaf,
  Hammer,
  Scissors,
  GraduationCap,
  ShoppingBag,
  Bed,
  Factory
} from "lucide-react";

// Custom ReactMarkdown components for proper styling
const markdownComponents = {
  p: ({ children }) => {
    // Check if children is a single <strong> element (bold-only line = subheading)
    const childArray = React.Children.toArray(children);
    if (childArray.length === 1 && childArray[0]?.type === 'strong') {
      return <h4 className="font-semibold text-gray-900 mt-6 mb-2 first:mt-0">{childArray[0].props.children}</h4>;
    }
    return <p className="mb-3">{children}</p>;
  },
  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
  li: ({ children }) => <li className="text-gray-700">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
};

// Icon mapping for dynamic icons
const ICON_MAP = {
  Home, Wrench, Briefcase, Heart, Car, Music, Utensils, Leaf, Hammer, Scissors,
  GraduationCap, ShoppingBag, Bed, Factory, CheckCircle, Star, MapPin, Clock
};

// Color mapping for icon colors
const COLOR_MAP = {
  slate: "text-slate-600",
  gray: "text-gray-600",
  red: "text-red-600",
  orange: "text-orange-600",
  amber: "text-amber-600",
  yellow: "text-yellow-600",
  lime: "text-lime-600",
  green: "text-green-600",
  emerald: "text-emerald-600",
  teal: "text-teal-600",
  cyan: "text-cyan-600",
  sky: "text-sky-600",
  blue: "text-blue-600",
  indigo: "text-indigo-600",
  violet: "text-violet-600",
  purple: "text-purple-600",
  fuchsia: "text-fuchsia-600",
  pink: "text-pink-600",
  rose: "text-rose-600"
};

const BG_COLOR_MAP = {
  slate: "bg-slate-100",
  gray: "bg-gray-100",
  red: "bg-red-100",
  orange: "bg-orange-100",
  amber: "bg-amber-100",
  yellow: "bg-yellow-100",
  lime: "bg-lime-100",
  green: "bg-green-100",
  emerald: "bg-emerald-100",
  teal: "bg-teal-100",
  cyan: "bg-cyan-100",
  sky: "bg-sky-100",
  blue: "bg-blue-100",
  indigo: "bg-indigo-100",
  violet: "bg-violet-100",
  purple: "bg-purple-100",
  fuchsia: "bg-fuchsia-100",
  pink: "bg-pink-100",
  rose: "bg-rose-100"
};

export default function ServicePageView() {
  const params = useParams();
  // Support both /service/:serviceSlug and /:pageSlug routes
  const serviceSlug = params.serviceSlug || params.pageSlug;
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [claimedBusiness, setClaimedBusiness] = useState(null);
  const [relatedPages, setRelatedPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPage();
  }, [serviceSlug]);

  const loadPage = async () => {
    setLoading(true);
    try {
      // Find service page by slug
      const pages = await ServicePage.filter({ slug: serviceSlug });
      
      if (!pages || pages.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const pageData = pages[0];
      
      // Only show active pages publicly
      if (pageData.status !== 'active') {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPage(pageData);

      // Load claimed business if exists
      if (pageData.claimedBusinessId) {
        try {
          const business = await Store.get(pageData.claimedBusinessId);
          setClaimedBusiness(business);
        } catch (e) {
          console.log("Could not load claimed business");
        }
      }

      // Load related service pages
      if (pageData.relatedServices && pageData.relatedServices.length > 0) {
        try {
          const allPages = await ServicePage.list();
          const related = allPages.filter(p => 
            pageData.relatedServices.includes(p.slug) && p.status === 'active'
          ).slice(0, 4);
          setRelatedPages(related);
        } catch (e) {
          console.log("Could not load related pages");
        }
      }
    } catch (error) {
      console.error("Error loading service page:", error);
      setNotFound(true);
    }
    setLoading(false);
  };

  // Generate JSON-LD Schema
  const generateSchema = () => {
    const schemas = [];

    // Service schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": page.title,
      "description": page.metaDescription,
      "areaServed": {
        "@type": "County",
        "name": "Navarro County",
        "containedIn": {
          "@type": "State",
          "name": "Texas"
        }
      },
      "provider": claimedBusiness ? {
        "@type": "LocalBusiness",
        "name": claimedBusiness.name,
        "telephone": claimedBusiness.phone,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": claimedBusiness.city || "Corsicana",
          "addressRegion": "TX"
        }
      } : undefined
    });

    // FAQ schema if FAQs exist
    if (page.faqs && page.faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": page.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    // LocalBusiness schema if claimed
    if (claimedBusiness) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": claimedBusiness.name,
        "description": claimedBusiness.description,
        "telephone": claimedBusiness.phone,
        "email": claimedBusiness.email,
        "url": claimedBusiness.website,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": claimedBusiness.address,
          "addressLocality": claimedBusiness.city || "Corsicana",
          "addressRegion": "TX",
          "postalCode": claimedBusiness.zip
        }
      });
    }

    return schemas;
  };

  const IconComponent = page ? (ICON_MAP[page.icon] || Briefcase) : Briefcase;
  const iconColor = page ? (COLOR_MAP[page.iconColor] || "text-blue-600") : "text-blue-600";
  const bgColor = page ? (BG_COLOR_MAP[page.iconColor] || "bg-blue-100") : "bg-blue-100";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              This service page doesn't exist or is not yet available.
            </p>
            <Button onClick={() => navigate(createPageUrl("ServiceDirectory"))}>
              Browse Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render based on layout variant
  const renderLayout = () => {
    switch (page.layout) {
      case 2:
        return renderLayoutSplit();
      case 3:
        return renderLayoutCards();
      case 4:
        return renderLayoutTimeline();
      case 5:
        return renderLayoutMagazine();
      default:
        return renderLayoutStandard();
    }
  };

  // Layout 1: Standard (default)
  const renderLayoutStandard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-100">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-4 rounded-xl ${bgColor}`}>
            <IconComponent className={`w-8 h-8 ${iconColor}`} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{page.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Navarro County, Texas</span>
            </div>
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
        </div>
      </section>

      {/* Claimed Business Feature */}
      {claimedBusiness && renderClaimedBusiness()}

      {/* Local Context */}
      {page.localContext && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-600" />
            Why This Matters in Navarro County
          </h2>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* Content Sections */}
      {page.sections && page.sections.map((section, index) => (
        <section key={index} className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
          </div>
        </section>
      ))}

      {/* FAQs */}
      {page.faqs && page.faqs.length > 0 && renderFAQs()}

      {/* Claim CTA for unclaimed pages */}
      {!claimedBusiness && renderClaimCTA()}

      {/* Related Services */}
      {relatedPages.length > 0 && renderRelatedServices()}

      {/* External Resources */}
      {page.externalResources && page.externalResources.length > 0 && renderExternalResources()}
    </div>
  );

  // Layout 2: Split Content
  const renderLayoutSplit = () => (
    <div className="space-y-8">
      {/* Hero with side info */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-100">
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-4 rounded-xl ${bgColor}`}>
              <IconComponent className={`w-8 h-8 ${iconColor}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{page.title}</h1>
              <Badge className="bg-amber-100 text-amber-800">Navarro County, TX</Badge>
            </div>
          </div>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
          </div>
        </div>

        <div className="space-y-4">
          {claimedBusiness ? (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <Badge className="w-fit bg-green-600 text-white mb-2">Featured Provider</Badge>
                <CardTitle className="text-lg">{claimedBusiness.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {claimedBusiness.phone && (
                  <a href={`tel:${claimedBusiness.phone}`} className="flex items-center gap-2 text-green-700 hover:underline">
                    <Phone className="w-4 h-4" /> {claimedBusiness.phone}
                  </a>
                )}
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Contact Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="pt-6 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <p className="text-sm text-gray-700 mb-4">
                  Are you a {page.title.toLowerCase()} service provider in Navarro County?
                </p>
                <Button 
                  onClick={() => navigate(createPageUrl(`ServiceInquiry?service=${page.slug}`))}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Claim This Page
                </Button>
              </CardContent>
            </Card>
          )}

          {page.localContext && (
            <Card className="border-2 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Local Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 line-clamp-6">
                  <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Two-column sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {page.sections && page.sections.map((section, index) => (
          <section key={index} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
            </div>
          </section>
        ))}
      </div>

      {page.faqs && page.faqs.length > 0 && renderFAQs()}
      {relatedPages.length > 0 && renderRelatedServices()}
      {page.externalResources && page.externalResources.length > 0 && renderExternalResources()}
    </div>
  );

  // Layout 3: Cards Grid
  const renderLayoutCards = () => (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className={`${bgColor} rounded-2xl p-8 border-2 border-gray-200`}>
        <div className="max-w-3xl mx-auto text-center">
          <IconComponent className={`w-16 h-16 mx-auto mb-4 ${iconColor}`} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
          <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" /> Serving Navarro County, Texas
          </p>
        </div>
      </section>

      {/* Hero Content Card */}
      <Card className="border-2 border-orange-200">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none text-gray-700">
            <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {claimedBusiness && renderClaimedBusiness()}

      {/* Grid of Section Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {page.localContext && (
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                Local Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {page.sections && page.sections.map((section, index) => (
          <Card key={index} className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">{section.heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {page.faqs && page.faqs.length > 0 && renderFAQs()}
      {!claimedBusiness && renderClaimCTA()}
      {relatedPages.length > 0 && renderRelatedServices()}
      {page.externalResources && page.externalResources.length > 0 && renderExternalResources()}
    </div>
  );

  // Layout 4: Timeline
  const renderLayoutTimeline = () => (
    <div className="space-y-8">
      {/* Hero */}
      <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-100">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-full ${bgColor}`}>
            <IconComponent className={`w-10 h-10 ${iconColor}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            <p className="text-gray-600">Navarro County, Texas</p>
          </div>
        </div>
        <div className="prose max-w-none text-gray-700">
          <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
        </div>
      </section>

      {claimedBusiness && renderClaimedBusiness()}

      {/* Timeline Sections */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-orange-200" />
        
        {page.localContext && (
          <div className="relative pl-20 pb-8">
            <div className={`absolute left-6 w-5 h-5 rounded-full ${bgColor} border-4 border-white shadow`} />
            <Card className="border-2 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Local Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700">
                  <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {page.sections && page.sections.map((section, index) => (
          <div key={index} className="relative pl-20 pb-8">
            <div className={`absolute left-6 w-5 h-5 rounded-full bg-white border-4 border-orange-400 shadow`} />
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Step {index + 1}</Badge>
                <CardTitle>{section.heading}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700">
                  <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {page.faqs && page.faqs.length > 0 && renderFAQs()}
      {!claimedBusiness && renderClaimCTA()}
      {relatedPages.length > 0 && renderRelatedServices()}
      {page.externalResources && page.externalResources.length > 0 && renderExternalResources()}
    </div>
  );

  // Layout 5: Magazine
  const renderLayoutMagazine = () => (
    <div className="space-y-8">
      {/* Full-width Hero */}
      <section className={`relative ${bgColor} rounded-2xl overflow-hidden`}>
        <div className="p-12 md:p-16">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-white/80 text-gray-800">Navarro County Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{page.title}</h1>
            <div className="prose prose-lg max-w-none text-gray-700">
              <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
            </div>
          </div>
        </div>
        <IconComponent className={`absolute right-8 bottom-8 w-32 h-32 ${iconColor} opacity-10`} />
      </section>

      {claimedBusiness && renderClaimedBusiness()}

      {/* Magazine-style content */}
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {page.localContext && (
            <section className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Navarro County Difference</h2>
              <div className="prose max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
              </div>
            </section>
          )}

          {page.sections && page.sections.map((section, index) => (
            <section key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <div className="prose max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
              </div>
            </section>
          ))}
        </div>

        <aside className="md:col-span-4 space-y-6">
          {!claimedBusiness && (
            <Card className="border-2 border-orange-200 bg-orange-50 sticky top-6">
              <CardContent className="pt-6 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-2">Feature Your Business</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Claim this page to be featured as the exclusive provider
                </p>
                <Button 
                  onClick={() => navigate(createPageUrl(`ServiceInquiry?service=${page.slug}`))}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          )}

          {page.faqs && page.faqs.length > 0 && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Quick Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {page.faqs.slice(0, 3).map((faq, index) => (
                  <div key={index}>
                    <p className="font-medium text-sm text-gray-900">{faq.question}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {relatedPages.length > 0 && (
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Related Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatedPages.map((rp) => (
                  <Link 
                    key={rp.id}
                    to={`/service/${rp.slug}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-700">{rp.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      {page.externalResources && page.externalResources.length > 0 && renderExternalResources()}
    </div>
  );

  // Shared Components
  const renderClaimedBusiness = () => (
    <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <Badge className="bg-green-600 text-white">Featured Local Provider</Badge>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{claimedBusiness.name}</h2>
          <p className="text-gray-700 mb-4">{claimedBusiness.description}</p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {claimedBusiness.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{claimedBusiness.address}, {claimedBusiness.city}, TX</span>
              </div>
            )}
            {claimedBusiness.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href={`tel:${claimedBusiness.phone}`} className="text-green-700 hover:underline">
                  {claimedBusiness.phone}
                </a>
              </div>
            )}
            {claimedBusiness.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${claimedBusiness.email}`} className="text-green-700 hover:underline">
                  {claimedBusiness.email}
                </a>
              </div>
            )}
            {claimedBusiness.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <a href={claimedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center md:items-end gap-3">
          {claimedBusiness.phone && (
            <Button 
              size="lg" 
              className="w-full md:w-auto bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = `tel:${claimedBusiness.phone}`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full md:w-auto border-green-600 text-green-700 hover:bg-green-50"
            onClick={() => navigate(`/store/${claimedBusiness.slug}`)}
          >
            View Full Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );

  const renderFAQs = () => (
    <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-blue-600" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {page.faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderClaimCTA = () => (
    <section className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 border-2 border-orange-200">
      <div className="max-w-2xl mx-auto text-center">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Are You a {page.title} Provider in Navarro County?
        </h2>
        <p className="text-gray-700 mb-6">
          This page is available for exclusive sponsorship. Feature your business prominently 
          on this high-visibility local service page and connect with customers actively searching 
          for {page.title.toLowerCase()} services.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate(createPageUrl(`ServiceInquiry?service=${page.slug}`))}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          Inquire About This Page
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );

  const renderRelatedServices = () => (
    <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Services</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedPages.map((rp) => {
          const RelatedIcon = ICON_MAP[rp.icon] || Briefcase;
          const relatedColor = COLOR_MAP[rp.iconColor] || "text-gray-600";
          const relatedBg = BG_COLOR_MAP[rp.iconColor] || "bg-gray-100";
          
          return (
            <Link 
              key={rp.id}
              to={`/service/${rp.slug}`}
              className="group p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-lg ${relatedBg} flex items-center justify-center mb-3`}>
                <RelatedIcon className={`w-5 h-5 ${relatedColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {rp.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Learn more</p>
            </Link>
          );
        })}
      </div>
    </section>
  );

  const renderExternalResources = () => (
    <section className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
      <div className="flex flex-wrap gap-3">
        {page.externalResources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:border-orange-300 hover:shadow-sm transition-all text-sm"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
            {resource.name}
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        External links provided for informational purposes. We are not affiliated with these organizations.
      </p>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>{page.metaTitle || `${page.title} in Navarro County, TX`}</title>
        <meta name="description" content={page.metaDescription || `Find ${page.title.toLowerCase()} services in Navarro County, Texas.`} />
        {page.metaKeywords && <meta name="keywords" content={page.metaKeywords} />}
        <link rel="canonical" href={`https://navarrocounty.com/service/${page.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={page.metaTitle || page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://navarrocounty.com/service/${page.slug}`} />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(generateSchema())}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-orange-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/ServiceDirectory" className="hover:text-orange-600">Services</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{page.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {renderLayout()}
        </main>
      </div>
    </>
  );
}
