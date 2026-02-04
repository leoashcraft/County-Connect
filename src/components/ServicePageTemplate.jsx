import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommunityResource, Town } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings, getCountyDisplayName } from "@/hooks/useSiteSettings";
import FeaturedSpot, { FeaturedSpotSection } from "@/components/FeaturedSpot";
import {
  Search, Phone, MapPin, Clock, ExternalLink, Star, Sparkles, CheckCircle
} from "lucide-react";

/**
 * ServicePageTemplate
 * 
 * A reusable template for service-specific pages (notary, plumber, etc.)
 * Can show claimed businesses or an empty state encouraging claims
 * 
 * @param {Object} props
 * @param {string} props.serviceType - The type of service (notary, plumber, etc.)
 * @param {string} props.serviceTitle - Display title (e.g., "Notary Services")
 * @param {string} props.serviceDescription - Short description of the service
 * @param {string} props.metaDescription - SEO meta description
 * @param {string} props.metaKeywords - SEO keywords
 * @param {React.Component} props.icon - Lucide icon component
 * @param {string} props.iconColor - Tailwind color class (e.g., "blue")
 * @param {Array} props.faqs - Array of {question, answer} objects
 * @param {string} props.seoContent - Additional SEO content (HTML allowed)
 * @param {string} props.category - Category to filter CommunityResources by
 * @param {string} props.subcategory - Subcategory to filter by
 */
export default function ServicePageTemplate({
  serviceType,
  serviceTitle,
  serviceDescription,
  metaDescription,
  metaKeywords,
  icon: ServiceIcon,
  iconColor = "blue",
  faqs = [],
  seoContent,
  category,
  subcategory,
  relatedSearches = []
}) {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [providers, setProviders] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [townFilter, setTownFilter] = useState("all");

  const countyName = settings.county_name || "Navarro";
  const countyState = settings.county_state || "TX";
  const countySeat = settings.county_seat || "Corsicana";
  const countyDisplayName = getCountyDisplayName(settings);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const allResources = await CommunityResource.filter({ status: "active" }, 'name');
      const allTowns = await Town.list('name');
      setTowns(allTowns);

      // Filter by category/subcategory if provided
      let filtered = allResources;
      if (category) {
        filtered = filtered.filter(r => r.category === category);
      }
      if (subcategory) {
        filtered = filtered.filter(r => r.subcategory === subcategory);
      }

      // Separate featured (those with is_featured flag) from regular
      const featured = filtered.filter(r => r.is_featured);
      const regular = filtered.filter(r => !r.is_featured);

      setFeaturedProviders(featured);
      setProviders(regular);
    } catch (error) {
      console.error("Error loading providers:", error);
    }
    setLoading(false);
  };

  // Filter providers
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = !searchTerm ||
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTown = townFilter === "all" || provider.town === townFilter;
    return matchesSearch && matchesTown;
  });

  const hasProviders = providers.length > 0 || featuredProviders.length > 0;
  const bgColorClass = `from-${iconColor}-50 to-${iconColor}-100`;
  const iconBgClass = `bg-${iconColor}-100`;
  const iconTextClass = `text-${iconColor}-600`;

  const renderProviderCard = (provider) => (
    <Card 
      key={provider.id}
      className="border hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${provider.id}`))}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 ${iconBgClass} rounded-lg flex-shrink-0`}>
            <ServiceIcon className={`w-5 h-5 ${iconTextClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900">{provider.name}</h3>
            {provider.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{provider.description}</p>
            )}
            <div className="mt-2 space-y-1 text-sm">
              {provider.phone && (
                <p className="flex items-center gap-1 text-gray-600">
                  <Phone className="w-3 h-3" />
                  <a 
                    href={`tel:${provider.phone}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {provider.phone}
                  </a>
                </p>
              )}
              {provider.address && (
                <p className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{provider.address}</span>
                </p>
              )}
              {provider.hours && (
                <p className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span className="truncate">{provider.hours}</span>
                </p>
              )}
            </div>
            {provider.services && provider.services.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {provider.services.slice(0, 3).map((svc, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {svc}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgColorClass} flex items-center justify-center`}>
        <ServiceIcon className={`w-12 h-12 ${iconTextClass} animate-pulse`} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${iconColor}-50 to-white p-6`}>
      <MetaTags
        title={`${serviceTitle} in ${countyDisplayName} - Find Local ${serviceTitle}`}
        description={metaDescription || `Find ${serviceTitle.toLowerCase()} in ${countyDisplayName}. ${serviceDescription}`}
        keywords={metaKeywords || `${serviceType} ${countySeat}, ${serviceType} ${countyName} County, ${serviceType} near me ${countyState}`}
      />
      <JsonLdSchema
        type="service"
        data={{
          name: `${serviceTitle} in ${countyDisplayName}`,
          description: serviceDescription,
          serviceType: serviceTitle,
          areaServed: countyDisplayName
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex p-4 ${iconBgClass} rounded-2xl mb-4`}>
            <ServiceIcon className={`w-12 h-12 ${iconTextClass}`} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {serviceTitle} in {countyDisplayName}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {serviceDescription}
          </p>
        </div>

        {/* Featured Section */}
        <FeaturedSpotSection
          title={`Featured ${serviceTitle}`}
          spotType={serviceType}
          featuredItems={featuredProviders}
          renderItem={renderProviderCard}
          icon={ServiceIcon}
          maxSpots={3}
        />

        {/* Search/Filter */}
        {hasProviders && (
          <Card className={`border-2 border-${iconColor}-100 mb-6`}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder={`Search ${serviceTitle.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={townFilter} onValueChange={setTownFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Towns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Towns</SelectItem>
                    {towns.filter(t => t.name !== 'County-wide').map(town => (
                      <SelectItem key={town.id} value={town.name}>{town.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provider Listings */}
        {filteredProviders.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {filteredProviders.map(renderProviderCard)}
          </div>
        ) : !hasProviders ? (
          /* Empty State - No providers yet */
          <Card className="border-2 border-dashed border-gray-300 mb-10">
            <CardContent className="p-12 text-center">
              <div className={`w-20 h-20 ${iconBgClass} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Sparkles className={`w-10 h-10 ${iconTextClass}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Be the First {serviceTitle} Listed!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We're looking for local {serviceTitle.toLowerCase()} providers in {countyDisplayName}. 
                Get your business featured on this page and reach local customers.
              </p>
              <Button
                onClick={() => navigate(createPageUrl(`ClaimListing?type=service_page&name=${serviceType}`))}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Star className="w-4 h-4 mr-2" />
                Claim This Page
              </Button>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-500 mb-10">No results match your search.</p>
        )}

        {/* Related Searches */}
        {relatedSearches.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Related Searches</h2>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((search, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => setSearchTerm(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="border">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* SEO Content */}
        {seoContent && (
          <section className="bg-white rounded-xl p-8 border mb-10">
            <div 
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: seoContent }}
            />
          </section>
        )}

        {/* CTA */}
        <section className={`bg-gradient-to-r from-${iconColor}-500 to-${iconColor}-600 rounded-xl p-8 text-center text-white`}>
          <h2 className="text-2xl font-bold mb-3">
            Are You a {serviceTitle.replace(' Services', '').replace(' Service', '')} Provider?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Get your business listed on this page and reach customers in {countyDisplayName} 
            who are actively looking for {serviceTitle.toLowerCase()}.
          </p>
          <Button
            onClick={() => navigate(createPageUrl(`ClaimListing?type=service_page&name=${serviceType}`))}
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            Get Listed Today
          </Button>
        </section>
      </div>
    </div>
  );
}
