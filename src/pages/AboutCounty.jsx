import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings, getCountyDisplayName } from "@/hooks/useSiteSettings";
import { Town } from "@/api/entities";
import {
  MapPin, Users, Building2, GraduationCap, TreePine, History,
  Utensils, Calendar, ShoppingBag, Heart, ChevronDown, ChevronUp
} from "lucide-react";

export default function AboutCounty() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [towns, setTowns] = useState([]);
  const [showAllTowns, setShowAllTowns] = useState(false);

  const countyName = settings.county_name || "Your County";
  const countyState = settings.county_state || "TX";
  const countySeat = settings.county_seat || "Your City";
  const countyDisplayName = getCountyDisplayName(settings);

  useEffect(() => {
    loadTowns();
  }, []);

  const loadTowns = async () => {
    try {
      const townData = await Town.list('-population', 50);
      setTowns(townData || []);
    } catch (error) {
      console.error("Error loading towns:", error);
    }
  };

  const displayedTowns = showAllTowns ? towns : towns.slice(0, 8);

  const quickLinks = [
    { name: "Local Restaurants", icon: Utensils, link: "Restaurants", color: "orange" },
    { name: "Community Events", icon: Calendar, link: "Events", color: "purple" },
    { name: "Local Businesses", icon: ShoppingBag, link: "BusinessDirectory", color: "emerald" },
    { name: "Community Resources", icon: Heart, link: "CommunityResources", color: "rose" },
    { name: "Jobs & Careers", icon: Users, link: "Jobs", color: "blue" },
    { name: "Public Services", icon: Building2, link: "PublicServices", color: "slate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <MetaTags
        title={`About ${countyDisplayName} - History, Towns & Community Guide`}
        description={`Discover ${countyDisplayName} - home to ${countySeat} and more. Learn about local history, towns, population, and what makes this ${countyState} county special.`}
        keywords={`${countyName} County ${countyState}, ${countySeat} ${countyState}, ${countyState} counties, ${countyName} County population, things to do ${countySeat}`}
      />
      <JsonLdSchema
        type="website"
        data={{
          name: `About ${countyDisplayName}`,
          description: `Community guide for ${countyDisplayName}`
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {countyDisplayName}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A thriving community full of opportunity and charm.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">{settings.county_population || "~50,000"}</p>
              <p className="text-sm text-gray-600">Population</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">{settings.county_area || "1,000"}</p>
              <p className="text-sm text-gray-600">Square Miles</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <History className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">{settings.county_founded || "1846"}</p>
              <p className="text-sm text-gray-600">Year Founded</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">{countySeat}</p>
              <p className="text-sm text-gray-600">County Seat</p>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <section className="mb-12">
          <Card className="border-2 border-amber-100">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {countyDisplayName}</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  {countyDisplayName} is a vibrant community that balances rural charm with modern amenities.
                  With {countySeat} as the county seat, residents enjoy small-town hospitality alongside
                  convenient access to services and opportunities.
                </p>
                <p>
                  The county offers a diverse economy and maintains the friendly atmosphere that makes
                  our community special. Whether you're looking to raise a family, start a business,
                  or simply enjoy a slower pace of life, {countyDisplayName} has something for everyone.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Towns Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-amber-600" />
            Towns & Communities
          </h2>
          {towns.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedTowns.map((town) => (
                  <Card key={town.id} className="border-2 border-amber-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900">{town.name}</h3>
                      {town.population && (
                        <p className="text-sm text-amber-700 mb-1">Pop: {town.population.toLocaleString()}</p>
                      )}
                      {town.description && (
                        <p className="text-xs text-gray-600">{town.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {towns.length > 8 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllTowns(!showAllTowns)}
                    className="gap-2"
                  >
                    {showAllTowns ? (
                      <>View Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>View All {towns.length} Towns <ChevronDown className="w-4 h-4" /></>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="border-2 border-amber-100">
              <CardContent className="p-6 text-center text-gray-600">
                <p>Town information coming soon. Check back later for details about communities in {countyDisplayName}.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quick Navigation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore {countyDisplayName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={idx}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => navigate(createPageUrl(item.link))}
                >
                  <IconComponent className={`w-6 h-6 text-${item.color}-600`} />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
