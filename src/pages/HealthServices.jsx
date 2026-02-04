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
  Stethoscope, Brain, Heart, Phone, MapPin, Clock, ExternalLink, AlertTriangle
} from "lucide-react";

export default function HealthServices() {
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
      const healthCategories = ['medical', 'mental_health'];
      const filtered = allResources.filter(r => healthCategories.includes(r.category));
      setServices(filtered);
    } catch (error) {
      console.error("Error loading services:", error);
    }
    setLoading(false);
  };

  const getIcon = (subcategory, category) => {
    const icons = {
      hospital: Stethoscope,
      public_health: Heart,
      urgent_care: Stethoscope,
      mental_health_services: Brain,
    };
    if (category === 'mental_health') return Brain;
    return icons[subcategory] || Stethoscope;
  };

  const getColor = (category) => {
    return category === 'mental_health' 
      ? { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" }
      : { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" };
  };

  // Group services
  const medicalServices = services.filter(s => s.category === 'medical');
  const mentalHealthServices = services.filter(s => s.category === 'mental_health');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <Stethoscope className="w-12 h-12 text-rose-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <MetaTags
        title={`Health Services in ${countyDisplayName} - Hospitals, Urgent Care, Mental Health`}
        description={`Healthcare services in ${countyDisplayName}. Find hospitals, urgent care clinics, mental health services, and public health resources in ${countySeat}, ${countyState}.`}
        keywords={`${countySeat} hospital, Navarro Regional Hospital, urgent care ${countySeat}, mental health ${countyName} County, ${countyState} healthcare, doctors ${countySeat}`}
      />
      <JsonLdSchema
        type="medicalOrganization"
        data={{
          name: `${countyDisplayName} Health Services`,
          description: `Healthcare providers and services in ${countyDisplayName}`,
          address: { addressLocality: countySeat, addressRegion: countyState }
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Emergency Banner */}
        <div className="bg-red-600 text-white rounded-xl p-4 mb-8 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">Medical Emergency? Call 911</p>
            <p className="text-sm text-red-100">For life-threatening emergencies, go to the nearest emergency room.</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Stethoscope className="w-10 h-10 text-rose-600" />
            {countyDisplayName} Health Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hospitals, urgent care, mental health services, and public health resources.
          </p>
        </div>

        {/* Medical Services */}
        {medicalServices.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Stethoscope className="w-6 h-6 text-rose-600" />
              </div>
              Medical Services
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {medicalServices.map((service) => {
                const ServiceIcon = getIcon(service.subcategory, service.category);
                const color = getColor(service.category);
                
                return (
                  <Card 
                    key={service.id} 
                    className={`border-2 ${color.border} hover:shadow-lg transition-shadow cursor-pointer`}
                    onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${service.id}`))}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 ${color.bg} rounded-lg flex-shrink-0`}>
                          <ServiceIcon className={`w-6 h-6 ${color.text}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                          {service.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            {service.address && (
                              <p className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {service.address}
                              </p>
                            )}
                            {service.phone && (
                              <p className="flex items-center gap-2 text-gray-700">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <a 
                                  href={`tel:${service.phone}`} 
                                  className="text-blue-600 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {service.phone}
                                </a>
                              </p>
                            )}
                            {service.emergency_phone && (
                              <p className="flex items-center gap-2 text-red-700">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="font-medium">Emergency: {service.emergency_phone}</span>
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
                                <Badge key={idx} variant="secondary" className={`text-xs ${color.bg} ${color.text}`}>
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
        )}

        {/* Mental Health Services */}
        {mentalHealthServices.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Brain className="w-6 h-6 text-pink-600" />
              </div>
              Mental Health Services
            </h2>
            
            {/* Crisis Banner */}
            <div className="bg-pink-100 border-2 border-pink-300 rounded-xl p-4 mb-4">
              <p className="font-semibold text-pink-800">In Crisis? Help is Available 24/7</p>
              <p className="text-sm text-pink-700">
                National Suicide Prevention Lifeline: <strong>988</strong> | 
                Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong>
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {mentalHealthServices.map((service) => {
                const ServiceIcon = getIcon(service.subcategory, service.category);
                const color = getColor(service.category);
                
                return (
                  <Card 
                    key={service.id} 
                    className={`border-2 ${color.border} hover:shadow-lg transition-shadow cursor-pointer`}
                    onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${service.id}`))}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 ${color.bg} rounded-lg flex-shrink-0`}>
                          <ServiceIcon className={`w-6 h-6 ${color.text}`} />
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
                                  className="text-blue-600 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {service.phone}
                                </a>
                              </p>
                            )}
                            {service.crisis_phone && (
                              <p className="flex items-center gap-2 text-pink-700">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="font-semibold">24/7 Crisis: {service.crisis_phone}</span>
                              </p>
                            )}
                            {service.address && (
                              <p className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {service.address}
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
                                <Badge key={idx} variant="secondary" className={`text-xs ${color.bg} ${color.text}`}>
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
              })}
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="mt-12 bg-white rounded-xl p-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Healthcare in {countyDisplayName}</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              {countyDisplayName} offers a range of healthcare services to meet the needs of residents, 
              from emergency care to mental health support.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Hospital & Emergency Care</h3>
            <p className="mb-4">
              <strong>Navarro Regional Hospital</strong> is the primary hospital serving {countyDisplayName}, 
              offering 24/7 emergency services, surgical care, diagnostic imaging, and specialty services.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Urgent Care</h3>
            <p className="mb-4">
              For non-life-threatening illnesses and injuries, urgent care clinics offer convenient walk-in 
              appointments with extended hours.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Mental Health Services</h3>
            <p className="mb-4">
              <strong>Lakes Regional Community Center</strong> provides mental health counseling, crisis intervention, 
              and support services for individuals with intellectual and developmental disabilities. 
              Their 24/7 crisis line is available for emergencies.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Public Health</h3>
            <p>
              The {countyName} County Health Department offers immunizations, disease prevention programs, 
              and environmental health services including food service inspections and septic permits.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
