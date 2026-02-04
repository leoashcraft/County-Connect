import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommunityResource } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings, getCountyDisplayName } from "@/hooks/useSiteSettings";
import {
  Zap, Flame, Droplets, Trash2, Phone, MapPin, Clock, ExternalLink, AlertTriangle
} from "lucide-react";

export default function Utilities() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const countyName = settings.county_name || "Navarro";
  const countyState = settings.county_state || "TX";
  const countySeat = settings.county_seat || "Corsicana";
  const countyDisplayName = getCountyDisplayName(settings);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const allResources = await CommunityResource.filter({ status: "active" }, 'name');
      const filtered = allResources.filter(r => r.category === 'utility');
      setServices(filtered);
    } catch (error) {
      console.error("Error loading services:", error);
    }
    setLoading(false);
  };

  const getIcon = (subcategory) => {
    const icons = {
      electric: Zap,
      natural_gas: Flame,
      water: Droplets,
      waste_disposal: Trash2,
    };
    return icons[subcategory] || Zap;
  };

  const getColor = (subcategory) => {
    const colors = {
      electric: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
      natural_gas: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
      water: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
      waste_disposal: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    };
    return colors[subcategory] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
  };

  // Group by subcategory
  const groupedServices = {
    electric: services.filter(s => s.subcategory === 'electric'),
    natural_gas: services.filter(s => s.subcategory === 'natural_gas'),
    water: services.filter(s => s.subcategory === 'water'),
    waste_disposal: services.filter(s => s.subcategory === 'waste_disposal'),
  };

  const sections = [
    { key: 'electric', label: 'Electric Service', icon: Zap },
    { key: 'natural_gas', label: 'Natural Gas', icon: Flame },
    { key: 'water', label: 'Water & Sewer', icon: Droplets },
    { key: 'waste_disposal', label: 'Waste Disposal', icon: Trash2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
        <Zap className="w-12 h-12 text-yellow-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
      <MetaTags
        title={`Utilities in ${countyDisplayName} - Electric, Gas, Water, Trash`}
        description={`Utility providers for ${countyDisplayName}. Set up electric, natural gas, water, and trash service in ${countySeat}, ${countyState}. Navarro County Electric Cooperative, Atmos Energy, Oncor, and more.`}
        keywords={`${countyName} County utilities, ${countySeat} electric company, Navarro County Electric Cooperative, Atmos Energy ${countySeat}, water service ${countyName} County, trash pickup ${countySeat} ${countyState}`}
      />
      <JsonLdSchema
        type="localBusiness"
        data={{
          name: `${countyDisplayName} Utility Providers`,
          description: `Utility services for ${countyDisplayName}`,
          serviceType: "Utilities"
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Zap className="w-10 h-10 text-yellow-600" />
            {countyDisplayName} Utilities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Electric, natural gas, water, sewer, and waste disposal services.
          </p>
        </div>

        {/* Outage Alert Banner */}
        <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-4 mb-8 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Report Outages</p>
            <p className="text-sm text-amber-700">
              For power outages, gas leaks, or water emergencies, contact your utility provider's emergency line immediately.
            </p>
          </div>
        </div>

        {/* Services by Type */}
        {sections.map(({ key, label, icon: SectionIcon }) => {
          const sectionServices = groupedServices[key];
          if (sectionServices.length === 0) return null;
          
          const color = getColor(key);
          
          return (
            <section key={key} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className={`p-2 ${color.bg} rounded-lg`}>
                  <SectionIcon className={`w-6 h-6 ${color.text}`} />
                </div>
                {label}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {sectionServices.map((service) => {
                  const ServiceIcon = getIcon(service.subcategory);
                  const serviceColor = getColor(service.subcategory);
                  
                  return (
                    <Card 
                      key={service.id} 
                      className={`border-2 ${serviceColor.border} hover:shadow-lg transition-shadow cursor-pointer`}
                      onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${service.id}`))}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 ${serviceColor.bg} rounded-lg flex-shrink-0`}>
                            <ServiceIcon className={`w-6 h-6 ${serviceColor.text}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                            {service.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                            )}
                            
                            <div className="space-y-2 text-sm">
                              {service.phone && (
                                <p className="flex items-center gap-2 text-gray-700">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <a 
                                    href={`tel:${service.phone}`} 
                                    className="text-blue-600 font-medium hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {service.phone}
                                  </a>
                                </p>
                              )}
                              {service.outage_phone && (
                                <p className="flex items-center gap-2 text-gray-700">
                                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  <span className="font-medium">Outages: </span>
                                  <a 
                                    href={`tel:${service.outage_phone}`} 
                                    className="text-amber-600 font-semibold hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {service.outage_phone}
                                  </a>
                                </p>
                              )}
                              {service.emergency_phone && (
                                <p className="flex items-center gap-2 text-gray-700">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                  <span className="font-medium">Emergency: </span>
                                  <a 
                                    href={`tel:${service.emergency_phone}`} 
                                    className="text-red-600 font-semibold hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {service.emergency_phone}
                                  </a>
                                </p>
                              )}
                              {service.hours && (
                                <p className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  {service.hours}
                                </p>
                              )}
                            </div>

                            {service.services && service.services.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {service.services.slice(0, 4).map((svc, idx) => (
                                  <Badge key={idx} variant="secondary" className={`text-xs ${serviceColor.bg} ${serviceColor.text}`}>
                                    {svc}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {service.website && (
                              <a
                                href={service.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm mt-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Visit Website <ExternalLink className="w-3 h-3" />
                              </a>
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

        {/* SEO Content */}
        <section className="mt-12 bg-white rounded-xl p-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Utility Services in {countyDisplayName}</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Setting up utilities in {countyDisplayName}? Here's what you need to know about the main utility providers 
              serving {countySeat} and surrounding areas.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Electric Service</h3>
            <p className="mb-4">
              <strong>Navarro County Electric Cooperative</strong> serves rural areas throughout the county and is a 
              member-owned cooperative. In Corsicana and some surrounding areas, <strong>Oncor</strong> provides electric 
              delivery service. Since Texas has a deregulated electric market, you can choose your retail electric provider.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Natural Gas</h3>
            <p className="mb-4">
              <strong>Atmos Energy</strong> provides natural gas service to homes and businesses throughout {countyDisplayName}. 
              If you smell gas, leave the area immediately and call the emergency line.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Water & Sewer</h3>
            <p className="mb-4">
              Water and sewer services are provided by local municipalities. Contact your city hall or water department 
              to set up service. Rural residents may rely on private wells and septic systems.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Trash & Recycling</h3>
            <p>
              Garbage collection within Corsicana city limits is provided by the city's Solid Waste Services department. 
              Rural residents can contract with private waste haulers like Republic Services.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
