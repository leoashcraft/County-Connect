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
  Shield, AlertTriangle, Flame, Phone, MapPin, Clock, ExternalLink, Dog, Siren
} from "lucide-react";

export default function EmergencyServices() {
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
      const emergencyCategories = ['law_enforcement', 'emergency_services', 'animal_services'];
      const filtered = allResources.filter(r => emergencyCategories.includes(r.category));
      setServices(filtered);
    } catch (error) {
      console.error("Error loading services:", error);
    }
    setLoading(false);
  };

  const getIcon = (subcategory) => {
    const icons = {
      sheriff: Shield,
      police: Shield,
      fire_department: Flame,
      emergency_management: Siren,
      animal_control: Dog,
      animal_shelter: Dog,
    };
    return icons[subcategory] || AlertTriangle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-red-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <MetaTags
        title={`Emergency Services in ${countyDisplayName} - Police, Fire, EMS`}
        description={`Emergency services directory for ${countyDisplayName}. Find police departments, sheriff's office, fire departments, EMS, and animal control contacts in ${countySeat}, ${countyState}.`}
        keywords={`${countyName} County sheriff, ${countySeat} police department, ${countyName} County fire department, emergency services ${countyState}, animal control ${countySeat}, 911 ${countyName} County`}
      />
      <JsonLdSchema
        type="governmentService"
        data={{
          name: `${countyDisplayName} Emergency Services`,
          description: `Emergency services including law enforcement, fire, and EMS for ${countyDisplayName}`,
          serviceType: "Emergency Services"
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Emergency Banner */}
        <div className="bg-red-600 text-white rounded-xl p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">For Emergencies, Call 911</h2>
          <p className="text-red-100">Police, Fire, Medical Emergency</p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <AlertTriangle className="w-10 h-10 text-red-600" />
            {countyDisplayName} Emergency Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Law enforcement, fire departments, emergency medical services, and animal control.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => {
            const ServiceIcon = getIcon(service.subcategory);
            return (
              <Card 
                key={service.id} 
                className="border-2 border-red-100 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${service.id}`))}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
                      <ServiceIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                      {service.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        {service.phone && (
                          <p className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-red-500" />
                            <a 
                              href={`tel:${service.phone}`} 
                              className="text-red-600 font-semibold hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {service.phone}
                            </a>
                          </p>
                        )}
                        {service.emergency_phone && service.emergency_phone !== service.phone && (
                          <p className="flex items-center gap-2 text-gray-700">
                            <Siren className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-red-600">Emergency: {service.emergency_phone}</span>
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
                            <Badge key={idx} variant="secondary" className="text-xs bg-red-50 text-red-700">
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
                          className="inline-flex items-center gap-1 text-red-600 hover:underline text-sm mt-3"
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

        {/* SEO Content */}
        <section className="mt-12 bg-white rounded-xl p-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Services in {countyDisplayName}</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              <strong>In case of emergency, always dial 911.</strong> {countyDisplayName} is served by multiple 
              law enforcement agencies, fire departments, and emergency medical services to ensure the safety 
              and well-being of all residents.
            </p>
            <p className="mb-4">
              The <strong>{countyName} County Sheriff's Office</strong> provides law enforcement services to 
              unincorporated areas of the county and operates the county jail. The <strong>Corsicana Police Department</strong> 
              serves the city of Corsicana, the county seat.
            </p>
            <p className="mb-4">
              Fire protection and emergency medical services are provided by the <strong>Corsicana Fire Department</strong> 
              and volunteer fire departments serving rural communities throughout the county.
            </p>
            <p>
              For animal-related emergencies or to report stray animals, contact <strong>{countyName} County Animal Control</strong> 
              or the <strong>Corsicana Animal Shelter</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
