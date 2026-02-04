import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommunityResource } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings, getCountyDisplayName } from "@/hooks/useSiteSettings";
import {
  Building2, FileText, Scale, DollarSign, Shield, Landmark,
  Heart, GraduationCap, Truck, Users, Phone, ExternalLink,
  MapPin, Clock, Search, Zap, Droplets, Flame, Trash2,
  AlertTriangle, Stethoscope, Brain, Car, Book, Vote,
  Dog, Plane, TreePine, Briefcase
} from "lucide-react";

export default function PublicServices() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const countyName = settings.county_name || "Your County";
  const countyState = settings.county_state || "TX";
  const countySeat = settings.county_seat || "Your City";
  const countyDisplayName = getCountyDisplayName(settings);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      // Load all community resources that are public services
      const allResources = await CommunityResource.filter({ status: "active" }, 'name');
      // Filter to only public services (those with is_public_service flag or specific categories)
      const publicServiceCategories = [
        'law_enforcement', 'emergency_services', 'animal_services',
        'government', 'utility', 'transportation', 'medical', 'mental_health',
        'education', 'employment', 'recreation', 'veteran'
      ];
      const publicServices = allResources.filter(r => 
        r.is_public_service || publicServiceCategories.includes(r.category)
      );
      setServices(publicServices);
    } catch (error) {
      console.error("Error loading services:", error);
    }
    setLoading(false);
  };

  // Category definitions with icons and colors
  const categoryConfig = {
    law_enforcement: { label: "Law Enforcement", icon: Shield, color: "blue", bgColor: "bg-blue-100", textColor: "text-blue-700" },
    emergency_services: { label: "Emergency Services", icon: AlertTriangle, color: "red", bgColor: "bg-red-100", textColor: "text-red-700" },
    animal_services: { label: "Animal Services", icon: Dog, color: "amber", bgColor: "bg-amber-100", textColor: "text-amber-700" },
    government: { label: "Government Offices", icon: Landmark, color: "slate", bgColor: "bg-slate-100", textColor: "text-slate-700" },
    utility: { label: "Utilities", icon: Zap, color: "yellow", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
    transportation: { label: "Transportation", icon: Car, color: "sky", bgColor: "bg-sky-100", textColor: "text-sky-700" },
    medical: { label: "Health & Medical", icon: Stethoscope, color: "rose", bgColor: "bg-rose-100", textColor: "text-rose-700" },
    mental_health: { label: "Mental Health", icon: Brain, color: "pink", bgColor: "bg-pink-100", textColor: "text-pink-700" },
    education: { label: "Education", icon: GraduationCap, color: "indigo", bgColor: "bg-indigo-100", textColor: "text-indigo-700" },
    employment: { label: "Employment Services", icon: Briefcase, color: "teal", bgColor: "bg-teal-100", textColor: "text-teal-700" },
    recreation: { label: "Parks & Recreation", icon: TreePine, color: "emerald", bgColor: "bg-emerald-100", textColor: "text-emerald-700" },
    veteran: { label: "Veterans Services", icon: Shield, color: "slate", bgColor: "bg-slate-100", textColor: "text-slate-700" },
  };

  // Subcategory icons
  const subcategoryIcons = {
    sheriff: Shield,
    police: Shield,
    fire_department: Flame,
    emergency_management: AlertTriangle,
    animal_control: Dog,
    animal_shelter: Dog,
    hospital: Stethoscope,
    public_health: Stethoscope,
    urgent_care: Stethoscope,
    mental_health_services: Brain,
    courthouse: Landmark,
    district_clerk: FileText,
    county_clerk: FileText,
    district_attorney: Scale,
    justice_of_peace: Scale,
    tax_office: DollarSign,
    appraisal_district: FileText,
    electric: Zap,
    natural_gas: Flame,
    water: Droplets,
    waste_disposal: Trash2,
    college: GraduationCap,
    school_district: GraduationCap,
    library: Book,
    txdot: Car,
    airport: Plane,
    parks: TreePine,
    veterans_services: Shield,
    social_services: Heart,
    workforce: Briefcase,
    elections: Vote,
    extension: GraduationCap,
  };

  const getIcon = (resource) => {
    if (resource.subcategory && subcategoryIcons[resource.subcategory]) {
      return subcategoryIcons[resource.subcategory];
    }
    if (resource.category && categoryConfig[resource.category]) {
      return categoryConfig[resource.category].icon;
    }
    return Building2;
  };

  const getCategoryStyle = (category) => {
    return categoryConfig[category] || { bgColor: "bg-gray-100", textColor: "text-gray-700", label: category };
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = !searchTerm ||
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group services by category
  const groupedServices = filteredServices.reduce((acc, service) => {
    const cat = service.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  // Get unique categories from services
  const availableCategories = [...new Set(services.map(s => s.category))].filter(Boolean);

  // Quick links for SEO pages
  const quickLinks = [
    { name: "Emergency Services", link: "EmergencyServices", icon: AlertTriangle, color: "red" },
    { name: "Utilities", link: "Utilities", icon: Zap, color: "yellow" },
    { name: "Government Offices", link: "GovernmentOffices", icon: Landmark, color: "slate" },
    { name: "Courts & Legal", link: "CourtsLegal", icon: Scale, color: "blue" },
    { name: "Health Services", link: "HealthServices", icon: Stethoscope, color: "rose" },
    { name: "Community Resources", link: "CommunityResources", icon: Heart, color: "pink" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Building2 className="w-12 h-12 text-blue-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <MetaTags
        title={`${countyDisplayName} Public Services & Government Offices`}
        description={`Complete guide to ${countyDisplayName} public services, government offices, utilities, emergency services, and local resources in ${countySeat}, ${countyState}.`}
        keywords={`${countyName} County public services, ${countySeat} government offices, ${countyName} County courthouse, utilities ${countySeat}, emergency services ${countyName} County, ${countyState} public services`}
      />
      <JsonLdSchema
        type="governmentService"
        data={{
          name: `${countyDisplayName} Public Services`,
          description: `Government services and public resources for ${countyDisplayName}`,
          serviceType: "Government Services",
          provider: countyDisplayName
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {countyDisplayName} Public Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your complete guide to government offices, utilities, emergency services, and public resources.
          </p>
        </div>

        {/* Quick Category Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {quickLinks.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={idx}
                className="border hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => navigate(createPageUrl(item.link))}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card className="border-2 border-blue-100 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search public services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                {availableCategories.map(cat => {
                  const config = getCategoryStyle(cat);
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {config.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services by Category */}
        {Object.entries(groupedServices).map(([category, categoryServices]) => {
          const config = getCategoryStyle(category);
          const CategoryIcon = config.icon || Building2;
          
          return (
            <section key={category} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className={`p-2 ${config.bgColor} rounded-lg`}>
                  <CategoryIcon className={`w-6 h-6 ${config.textColor}`} />
                </div>
                {config.label}
                <Badge variant="secondary" className="ml-2">{categoryServices.length}</Badge>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {categoryServices.map((service) => {
                  const ServiceIcon = getIcon(service);
                  return (
                    <Card 
                      key={service.id} 
                      className="border hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${service.id}`))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${config.bgColor} rounded-lg flex-shrink-0`}>
                            <ServiceIcon className={`w-5 h-5 ${config.textColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                            {service.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{service.description}</p>
                            )}
                            
                            <div className="space-y-1 text-sm">
                              {service.address && (
                                <p className="flex items-center gap-1 text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">{service.address}</span>
                                </p>
                              )}
                              {service.phone && (
                                <p className="flex items-center gap-1 text-gray-500">
                                  <Phone className="w-3 h-3" />
                                  <a 
                                    href={`tel:${service.phone}`} 
                                    className="text-blue-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {service.phone}
                                  </a>
                                </p>
                              )}
                              {service.hours && (
                                <p className="flex items-center gap-1 text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span className="truncate">{service.hours}</span>
                                </p>
                              )}
                            </div>
                            
                            {service.services && service.services.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {service.services.slice(0, 3).map((svc, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {svc}
                                  </Badge>
                                ))}
                                {service.services.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{service.services.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* No Results */}
        {filteredServices.length === 0 && (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        )}

        {/* SEO Content */}
        <section className="mt-12 bg-white rounded-xl p-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {countyDisplayName} Public Services</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              {countyDisplayName}, with {countySeat} as its county seat, provides comprehensive public services 
              to residents. Whether you need to contact law enforcement, pay property taxes, register your vehicle, 
              set up utilities, or access healthcare services, this directory connects you with the right resources.
            </p>
            <p className="mb-4">
              <strong>Emergency Services:</strong> For life-threatening emergencies, always call 911. 
              The {countyName} County Sheriff's Office and local police departments provide law enforcement services, 
              while fire departments and EMS respond to fire and medical emergencies.
            </p>
            <p className="mb-4">
              <strong>Utilities:</strong> Residents can set up electric service through Navarro County Electric Cooperative 
              or Oncor (depending on location), natural gas through Atmos Energy, and water through local municipal utilities.
            </p>
            <p>
              For community assistance including food pantries, utility help, and social services, 
              visit our{" "}
              <button 
                onClick={() => navigate(createPageUrl("CommunityResources"))} 
                className="text-blue-600 hover:underline"
              >
                Community Resources
              </button>{" "}
              section.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
