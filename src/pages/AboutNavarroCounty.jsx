import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import {
  MapPin, Users, Building2, GraduationCap, TreePine, History,
  Utensils, Calendar, ShoppingBag, Heart
} from "lucide-react";

export default function AboutNavarroCounty() {
  const navigate = useNavigate();

  const towns = [
    { name: "Corsicana", population: "~24,000", description: "County seat, historic downtown, and commercial center" },
    { name: "Kerens", population: "~1,600", description: "Small town charm with agricultural roots" },
    { name: "Blooming Grove", population: "~800", description: "Quiet community known for its pecan orchards" },
    { name: "Rice", population: "~900", description: "Small farming community" },
    { name: "Barry", population: "~250", description: "Rural community" },
    { name: "Dawson", population: "~800", description: "Historic town with strong community ties" },
    { name: "Frost", population: "~700", description: "Agricultural community" },
    { name: "Mildred", population: "~400", description: "Small rural town" }
  ];

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
        title="About Navarro County, Texas - History, Towns & Community Guide"
        description="Discover Navarro County, Texas - home to Corsicana, Kerens, Blooming Grove and more. Learn about local history, towns, population, and what makes this central Texas county special."
        keywords="Navarro County Texas, Corsicana TX, Kerens Texas, Blooming Grove TX, central Texas counties, Texas history, Navarro County population, things to do Corsicana"
      />
      <JsonLdSchema
        type="website"
        data={{
          name: "About Navarro County",
          description: "Community guide for Navarro County, Texas"
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Navarro County, Texas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A thriving community in the heart of North Central Texas, rich in history
            and full of opportunity.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">~50,000</p>
              <p className="text-sm text-gray-600">Population</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">1,086</p>
              <p className="text-sm text-gray-600">Square Miles</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <History className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">1846</p>
              <p className="text-sm text-gray-600">Year Founded</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-100 text-center">
            <CardContent className="p-6">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-gray-900">Corsicana</p>
              <p className="text-sm text-gray-600">County Seat</p>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <section className="mb-12">
          <Card className="border-2 border-amber-100">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Navarro County</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  Navarro County is located in north-central Texas, approximately 55 miles south of Dallas.
                  Named after Jose Antonio Navarro, a Texas patriot and signer of the Texas Declaration of
                  Independence, the county was established in 1846 and has grown into a vibrant community
                  that balances rural charm with modern amenities.
                </p>
                <p className="mb-4">
                  The county seat, <strong>Corsicana</strong>, is home to Navarro College and features a
                  beautifully preserved historic downtown district. The city is famous for being the birthplace
                  of the Texas oil industry - the first major oil discovery west of the Mississippi River
                  occurred here in 1894.
                </p>
                <p className="mb-4">
                  Corsicana is also known worldwide as the home of <strong>Collin Street Bakery</strong>,
                  famous for its DeLuxe Fruitcake since 1896, shipped to customers in nearly 200 countries.
                </p>
                <p>
                  Today, Navarro County offers a diverse economy including agriculture, manufacturing,
                  healthcare, and education, while maintaining the friendly, small-town atmosphere that
                  makes Texas communities special.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {towns.map((town, idx) => (
              <Card key={idx} className="border-2 border-amber-100 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900">{town.name}</h3>
                  <p className="text-sm text-amber-700 mb-1">Pop: {town.population}</p>
                  <p className="text-xs text-gray-600">{town.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Points of Interest */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TreePine className="w-7 h-7 text-amber-600" />
            Points of Interest
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Historic Downtown Corsicana</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Explore the beautifully preserved historic downtown with unique shops, restaurants,
                  and architecture dating back to the late 1800s. The courthouse square features the
                  stunning 1905 Navarro County Courthouse.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Richland Chambers Reservoir</h3>
                <p className="text-gray-600 text-sm mb-2">
                  One of the largest lakes in Texas, offering excellent fishing, boating, camping,
                  and waterfront recreation. Popular for bass fishing and family getaways.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Collin Street Bakery</h3>
                <p className="text-gray-600 text-sm mb-2">
                  World-famous bakery operating since 1896, known for its DeLuxe Fruitcake shipped
                  worldwide. A must-visit Corsicana landmark.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Navarro College</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Community college with a beautiful campus, known for its championship cheerleading
                  program featured in the Netflix documentary "Cheer."
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Navarro County</h2>
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

        {/* Education Section */}
        <section className="mb-12">
          <Card className="border-2 border-amber-100">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-amber-600" />
                Education
              </h2>
              <p className="text-gray-600 mb-4">
                Navarro County is served by several independent school districts including Corsicana ISD,
                Kerens ISD, Blooming Grove ISD, Rice ISD, Dawson ISD, Frost ISD, and Mildred ISD.
              </p>
              <p className="text-gray-600">
                <strong>Navarro College</strong>, headquartered in Corsicana, provides higher education
                opportunities including associate degrees, workforce training, and university transfer
                programs. The college is nationally recognized for its athletics programs, particularly
                its award-winning cheerleading team.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
