import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings, getCountyDisplayName } from "@/hooks/useSiteSettings";
import {
  Building2, FileText, Scale, DollarSign, Shield, Landmark,
  Heart, GraduationCap, Truck, Users, Phone, ExternalLink,
  MapPin, Clock
} from "lucide-react";

export default function PublicServices() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  const countyName = settings.county_name || "Your County";
  const countyState = settings.county_state || "TX";
  const countySeat = settings.county_seat || "Your City";
  const countyDisplayName = getCountyDisplayName(settings);

  const governmentOffices = [
    {
      name: `${countyName} County Courthouse`,
      description: "Main county government building housing multiple offices and services",
      address: `${countySeat}, ${countyState}`,
      phone: "",
      website: "",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      icon: Landmark,
      services: ["County Clerk", "District Clerk", "County Judge", "Commissioners Court"]
    },
    {
      name: `${countyName} County Tax Office`,
      description: "Property tax payments, vehicle registration, and title services",
      address: `${countySeat}, ${countyState}`,
      phone: "",
      website: "",
      hours: "Mon-Fri: 8:00 AM - 4:30 PM",
      icon: DollarSign,
      services: ["Property Tax Payments", "Vehicle Registration", "Title Transfers", "Disabled Veteran Exemptions"]
    },
    {
      name: `${countyName} County Appraisal District`,
      description: "Property appraisals, exemptions, and property records",
      address: `${countySeat}, ${countyState}`,
      phone: "",
      website: "",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      icon: FileText,
      services: ["Property Appraisals", "Homestead Exemptions", "Property Records Search", "Appeals"]
    },
    {
      name: `${countyName} County Sheriff's Office`,
      description: "Law enforcement, jail services, and public safety",
      address: `${countySeat}, ${countyState}`,
      phone: "",
      website: "",
      hours: "24/7 Emergency Services",
      icon: Shield,
      services: ["Emergency Response", "Jail Services", "Sex Offender Registry", "Warrants"]
    },
    {
      name: "District Court Clerk",
      description: "Civil and criminal court records, jury duty, and legal filings",
      address: `${countySeat}, ${countyState}`,
      phone: "",
      website: "",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      icon: Scale,
      services: ["Court Records", "Case Filings", "Jury Duty", "Child Support"]
    },
    {
      name: "County Clerk's Office",
      description: "Vital records, marriage licenses, and official documents",
      address: `${countySeat}, ${countyState}`,
      phone: "",
      website: "",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      icon: FileText,
      services: ["Birth Certificates", "Marriage Licenses", "Death Certificates", "Property Records"]
    }
  ];

  const communityServices = [
    {
      name: "Community Resources",
      description: `Food pantries, shelters, and assistance programs in ${countyDisplayName}`,
      icon: Heart,
      link: "CommunityResources",
      color: "rose"
    },
    {
      name: "Local Churches",
      description: "Find churches and places of worship throughout the county",
      icon: Landmark,
      link: "Churches",
      color: "indigo"
    },
    {
      name: "Jobs & Employment",
      description: "Local job listings and employment opportunities",
      icon: Users,
      link: "Jobs",
      color: "blue"
    },
    {
      name: "Local Events",
      description: "Community events, festivals, and gatherings",
      icon: Users,
      link: "Events",
      color: "purple"
    },
    {
      name: "Business Directory",
      description: "Local businesses and service providers",
      icon: Building2,
      link: "BusinessDirectory",
      color: "emerald"
    },
    {
      name: "Sports Teams",
      description: "Local sports teams and athletics programs",
      icon: Users,
      link: "SportsTeams",
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <MetaTags
        title={`${countyDisplayName} Public Services & Government Offices`}
        description={`Complete guide to ${countyDisplayName} public services, government offices, and local resources in ${countySeat}, ${countyState}. Find property records, tax information, court services, and community assistance programs.`}
        keywords={`${countyName} County public services, ${countySeat} government offices, ${countyName} County courthouse, property tax ${countySeat} ${countyState}, birth certificate ${countyName} County, marriage license ${countySeat}, ${countyName} County sheriff, court records ${countyState}`}
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {countyDisplayName} Public Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your complete guide to government offices, public records, and community services
            in {countyDisplayName}.
          </p>
        </div>

        {/* Government Offices Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            Government Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {governmentOffices.map((office, idx) => {
              const IconComponent = office.icon;
              return (
                <Card key={idx} className="border-2 border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{office.name}</h3>
                        <p className="text-sm text-gray-600 font-normal">{office.description}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm mb-4">
                      <p className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {office.address}
                      </p>
                      <p className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${office.phone}`} className="text-blue-600 hover:underline">
                          {office.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {office.hours}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {office.services.map((service, sidx) => (
                        <span key={sidx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                    <a
                      href={office.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                    >
                      Visit Official Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Community Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-600" />
            Community Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {communityServices.map((service, idx) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={idx}
                  className="border-2 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(createPageUrl(service.link))}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-${service.color}-100 flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 text-${service.color}-600`} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="bg-white rounded-xl p-8 border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Property & Tax</h3>
              <ul className="space-y-1 text-gray-600">
                <li>Property Search</li>
                <li>Pay Property Taxes</li>
                <li>Exemptions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Vital Records</h3>
              <ul className="space-y-1 text-gray-600">
                <li>Birth Certificates</li>
                <li>Marriage Licenses</li>
                <li>Death Certificates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Courts & Legal</h3>
              <ul className="space-y-1 text-gray-600">
                <li>Court Records</li>
                <li>Warrant Search</li>
                <li>Jury Duty</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Emergency</h3>
              <ul className="space-y-1 text-gray-600">
                <li><span className="font-semibold text-red-600">911</span> - Emergency</li>
                <li>Sheriff's Office</li>
                <li>Courthouse</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mt-12 prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {countyDisplayName} Services</h2>
          <p className="text-gray-600 mb-4">
            {countyDisplayName}, with {countySeat} as its county seat,
            provides comprehensive public services to residents. Whether you need to
            pay property taxes, obtain vital records, search court documents, or find community
            assistance programs, this guide connects you with the right resources.
          </p>
          <p className="text-gray-600 mb-4">
            The {countyName} County Courthouse houses most county offices including the County Clerk, District Clerk,
            and Tax Assessor-Collector. The {countyName} County Appraisal District maintains property
            records and handles exemption applications.
          </p>
          <p className="text-gray-600">
            For community assistance including food pantries, utility help, and social services,
            visit our <button onClick={() => navigate(createPageUrl("CommunityResources"))} className="text-blue-600 hover:underline">Community Resources</button> section.
            Local churches and religious organizations can be found in our <button onClick={() => navigate(createPageUrl("Churches"))} className="text-blue-600 hover:underline">Churches Directory</button>.
          </p>
        </section>
      </div>
    </div>
  );
}
