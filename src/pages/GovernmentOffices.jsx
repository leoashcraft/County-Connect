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
  Landmark, FileText, Scale, DollarSign, Phone, MapPin, Clock, ExternalLink, Vote, Users
} from "lucide-react";

export default function GovernmentOffices() {
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
      const filtered = allResources.filter(r => r.category === 'government');
      setServices(filtered);
    } catch (error) {
      console.error("Error loading services:", error);
    }
    setLoading(false);
  };

  const getIcon = (subcategory) => {
    const icons = {
      courthouse: Landmark,
      district_clerk: FileText,
      county_clerk: FileText,
      district_attorney: Scale,
      justice_of_peace: Scale,
      tax_office: DollarSign,
      appraisal_district: FileText,
      elections: Vote,
      social_services: Users,
    };
    return icons[subcategory] || Landmark;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Landmark className="w-12 h-12 text-slate-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <MetaTags
        title={`${countyDisplayName} Government Offices - Courthouse, Clerk, Tax Office`}
        description={`${countyDisplayName} government offices directory. Find the courthouse, county clerk, district clerk, tax office, and other county services in ${countySeat}, ${countyState}.`}
        keywords={`${countyName} County courthouse, ${countySeat} county clerk, ${countyName} County tax office, birth certificate ${countyName} County, marriage license ${countySeat}, property tax ${countyName} County ${countyState}`}
      />
      <JsonLdSchema
        type="governmentOffice"
        data={{
          name: `${countyDisplayName} Government Offices`,
          description: `County government offices for ${countyDisplayName}`,
          address: { addressLocality: countySeat, addressRegion: countyState }
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Landmark className="w-10 h-10 text-slate-600" />
            {countyDisplayName} Government Offices
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            County courthouse, clerk offices, tax services, and administrative offices.
          </p>
        </div>

        {/* Quick Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Birth Certificates", icon: FileText },
            { label: "Marriage Licenses", icon: FileText },
            { label: "Property Records", icon: FileText },
            { label: "Pay Taxes", icon: DollarSign },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border text-center">
              <item.icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => {
            const ServiceIcon = getIcon(service.subcategory);
            return (
              <Card 
                key={service.id} 
                className="border-2 border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${service.id}`))}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg flex-shrink-0">
                      <ServiceIcon className="w-6 h-6 text-slate-600" />
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
                        {service.hours && (
                          <p className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {service.hours}
                          </p>
                        )}
                      </div>

                      {service.services && service.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {service.services.map((svc, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
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

        {/* SEO Content */}
        <section className="mt-12 bg-white rounded-xl p-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{countyDisplayName} Government Services</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              The {countyName} County Courthouse, located in {countySeat}, houses most county government offices 
              and provides essential services to residents.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">County Clerk</h3>
            <p className="mb-4">
              The County Clerk's office handles vital records including birth certificates, death certificates, 
              and marriage licenses. They also maintain property records and assumed name certificates (DBAs).
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">District Clerk</h3>
            <p className="mb-4">
              The District Clerk maintains records for district court proceedings, including civil and criminal cases. 
              They also handle jury duty information and child support services.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Tax Assessor-Collector</h3>
            <p className="mb-4">
              Pay property taxes, register vehicles, and obtain title transfers at the Tax Assessor-Collector's office. 
              They also process disabled veteran exemptions.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Appraisal District</h3>
            <p>
              The {countyName} Central Appraisal District handles property valuations, homestead exemptions, 
              agricultural valuations, and property tax protests.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
