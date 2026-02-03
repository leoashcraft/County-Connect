import React, { useState, useEffect } from "react";
import { User, Restaurant, Event, Job, Church, CommunityResource, SportsTeam, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings, getCountyDisplayName, createCountyPageUrl } from "@/hooks/useSiteSettings";
import {
  MapPin, Utensils, Calendar, Briefcase, Heart, Building2,
  ShoppingBag, Users, Trophy, Church as ChurchIcon, Search,
  ArrowRight, Clock, TrendingUp, ChevronDown, ChevronUp, Star
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [user, setUser] = useState(null);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [towns, setTowns] = useState([]);
  const [showAllTowns, setShowAllTowns] = useState(false);
  const [loading, setLoading] = useState(true);

  const countyName = settings.county_name || "Your County";
  const countyState = settings.county_state || "TX";
  const countySeat = settings.county_seat || "Your City";
  const countyDisplayName = getCountyDisplayName(settings);
  const siteName = settings.site_name || "County Connect";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      // Load featured content for the homepage
      const [restaurants, events, jobs, townData] = await Promise.all([
        Restaurant.filter({ status: "active" }, '-created_date', 4),
        Event.filter({ status: "active" }, 'event_date', 3),
        Job.filter({ status: "active" }, '-created_date', 4),
        Town.list('-population', 50)
      ]);

      setFeaturedRestaurants(restaurants);
      setUpcomingEvents(events);
      setRecentJobs(jobs);
      setTowns(townData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const displayedTowns = showAllTowns ? towns : towns.slice(0, 4);

  const quickLinks = [
    { name: "Restaurants", icon: Utensils, link: "Restaurants", color: "bg-orange-500", desc: "Local dining & food trucks" },
    { name: "Events", icon: Calendar, link: "Events", color: "bg-purple-500", desc: "Community gatherings" },
    { name: "Jobs", icon: Briefcase, link: "Jobs", color: "bg-blue-500", desc: "Local employment" },
    { name: "Churches", icon: ChurchIcon, link: "Churches", color: "bg-indigo-500", desc: "Places of worship" },
    { name: "Explore", icon: MapPin, link: "Attractions", color: "bg-amber-500", desc: "Parks, landmarks & things to do" },
    { name: "Community Resources", icon: Heart, link: "CommunityResources", color: "bg-rose-500", desc: "Food pantries & assistance" },
    { name: "Sports Teams", icon: Trophy, link: "SportsTeams", color: "bg-emerald-500", desc: "Local athletics" },
    { name: "Business Directory", icon: Building2, link: "BusinessDirectory", color: "bg-slate-500", desc: "Local businesses" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MetaTags
        title={`${countyDisplayName} Community Hub - ${countySeat}, ${countyState} Local Guide`}
        description={`Your complete guide to ${countyDisplayName}. Find local restaurants, events, jobs, churches, community resources, and businesses in ${countySeat} and surrounding areas.`}
        keywords={`${countyName} County, ${countySeat} ${countyState}, local restaurants, community events, jobs ${countySeat}, churches ${countyName} County, food pantry, local businesses, ${countyState} community`}
      />
      <JsonLdSchema
        type="website"
        data={{
          name: `${countyDisplayName} Community Hub`,
          description: `Your complete guide to ${countyDisplayName} - local restaurants, events, jobs, churches, and community resources.`
        }}
      />

      {/* Hero Section */}
      <section className={`relative text-white ${settings.hero_image_url ? 'overflow-hidden' : 'bg-gradient-to-br from-amber-600 via-orange-500 to-red-500'}`}>
        {settings.hero_image_url && (
          <>
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${settings.hero_image_url})` }}
            />
            {/* Color Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 opacity-95" />
          </>
        )}
        <div className={`${settings.hero_image_url ? 'relative' : ''} max-w-6xl mx-auto px-6 py-16 md:py-24`}>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to {countyDisplayName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto">
              Your community hub for {countySeat} and surrounding areas.
              Discover local restaurants, events, jobs, and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-amber-50 font-semibold"
                onClick={() => navigate(createPageUrl("BusinessDirectory"))}
              >
                <Search className="w-5 h-5 mr-2" />
                Explore Local Businesses
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-orange-600"
                onClick={() => navigate(createCountyPageUrl("about", settings))}
              >
                Learn About Our Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Explore {countyDisplayName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.name}
                  className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => navigate(createPageUrl(item.link))}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Utensils className="w-6 h-6 text-orange-500" />
                Local Restaurants
              </h2>
              <Button variant="ghost" onClick={() => navigate(createPageUrl("Restaurants"))}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {featuredRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(createPageUrl(`RestaurantDetail?id=${restaurant.id}`))}
                >
                  {restaurant.logo_url && (
                    <div className="h-32 bg-gray-100 overflow-hidden">
                      <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-gray-900 truncate">{restaurant.name}</h3>
                    {restaurant.cuisine_types && (
                      <p className="text-sm text-gray-500 truncate">{restaurant.cuisine_types.join(", ")}</p>
                    )}
                    {restaurant.town && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {restaurant.town}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-12 bg-purple-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                Upcoming Events
              </h2>
              <Button variant="ghost" onClick={() => navigate(createPageUrl("Events"))}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(createPageUrl(`EventDetail?id=${event.id}`))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-700 rounded-lg p-2 text-center min-w-[50px]">
                        <div className="text-xs font-medium">
                          {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }) : ''}
                        </div>
                        <div className="text-xl font-bold">
                          {event.event_date ? new Date(event.event_date).getDate() : ''}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                        {event.venue_name && (
                          <p className="text-sm text-gray-500 truncate">{event.venue_name}</p>
                        )}
                        {event.town && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {event.town}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-500" />
                Job Opportunities
              </h2>
              <Button variant="ghost" onClick={() => navigate(createPageUrl("Jobs"))}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {recentJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(createPageUrl(`JobDetail?id=${job.id}`))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        {job.company_name && (
                          <p className="text-sm text-gray-600">{job.company_name}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          {job.town && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.town}
                            </span>
                          )}
                          {job.job_type && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {job.job_type}
                            </span>
                          )}
                        </div>
                      </div>
                      {job.salary_range && (
                        <span className="text-sm font-medium text-green-600">{job.salary_range}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Resources CTA */}
      <section className="py-12 bg-rose-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Community Resources & Assistance
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Find food pantries, shelters, utility assistance, and other support services
            available to {countyDisplayName} residents.
          </p>
          <Button
            size="lg"
            className="bg-rose-500 hover:bg-rose-600"
            onClick={() => navigate(createPageUrl("CommunityResources"))}
          >
            Find Help & Resources
          </Button>
        </div>
      </section>

      {/* Cities & Communities */}
      {towns.filter(t => t.name !== 'County-wide').length > 0 && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                Cities & Communities
              </h2>
              <p className="text-gray-600 mt-2">
                Explore the towns and cities of {countyDisplayName}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {towns
                .filter(t => t.name !== 'County-wide')
                .sort((a, b) => (b.population || 0) - (a.population || 0))
                .slice(0, showAllTowns ? undefined : 12)
                .map((town) => (
                  <Card
                    key={town.id}
                    className="border hover:border-green-300 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => navigate(`/${town.slug}`)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{town.name}</h3>
                      {town.population && (
                        <p className="text-xs text-gray-500 mt-1">
                          {town.population.toLocaleString()} residents
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
            {towns.filter(t => t.name !== 'County-wide').length > 12 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAllTowns(!showAllTowns)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  {showAllTowns ? (
                    <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                  ) : (
                    <>View All {towns.filter(t => t.name !== 'County-wide').length} Communities <ChevronDown className="w-4 h-4 ml-1" /></>
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              About {countyDisplayName}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Located in the heart of Central Texas, {countyDisplayName} offers the perfect blend of
              small-town charm and modern conveniences. Just {settings.distance_to_major_city || "50 miles"} from Dallas,
              our county is home to {countySeat} and over 20 unique communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-1">{settings.county_population || "52,000+"}</div>
              <div className="text-gray-600">Residents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-1">{settings.county_area || "1,086"}</div>
              <div className="text-gray-600">Square Miles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-1">Since {settings.county_founded || "1846"}</div>
              <div className="text-gray-600">Established</div>
            </div>
          </div>
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate(createCountyPageUrl("about", settings))}>
              Learn More About Our Community
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 bg-amber-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Living in {countyDisplayName}</h3>
              <p className="text-gray-700 mb-4">
                {countyDisplayName} provides an exceptional quality of life with affordable housing,
                excellent schools, and a strong sense of community. Whether you're looking for a place to
                raise a family, start a business, or enjoy retirement, our welcoming communities offer
                something for everyone.
              </p>
              <p className="text-gray-700">
                From the historic downtown of {countySeat} to the peaceful countryside surrounding our
                smaller towns, residents enjoy access to local restaurants, community events, places of
                worship, and outdoor recreation at nearby lakes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose {countyDisplayName}?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Affordable Cost of Living</strong> — Lower housing costs and taxes compared to nearby metropolitan areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Easy Commute to Dallas</strong> — Interstate 45 provides quick access to DFW job markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quality Education</strong> — Multiple school districts and Navarro College for higher education</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Outdoor Recreation</strong> — World-class fishing at Richland-Chambers Reservoir and Navarro Mills Lake</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="py-12 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Create a free account to post jobs, list your business, share events,
              and connect with your neighbors.
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-amber-50 font-semibold"
              onClick={() => User.login()}
            >
              Sign Up Free
            </Button>
          </div>
        </section>
      )}

      {/* SEO Footer Content */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Popular Searches</h3>
              <ul className="space-y-1">
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("Restaurants")); }} className="hover:text-orange-600">Restaurants in {countySeat}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("Jobs")); }} className="hover:text-orange-600">Jobs in {countyDisplayName}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("Churches")); }} className="hover:text-orange-600">Churches near me</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("Events")); }} className="hover:text-orange-600">Events this weekend</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Services</h3>
              <ul className="space-y-1">
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("CommunityResources")); }} className="hover:text-orange-600">Food Pantries</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("PublicServices")); }} className="hover:text-orange-600">Government Offices</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("PublicServices")); }} className="hover:text-orange-600">Property Records</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("PublicServices")); }} className="hover:text-orange-600">Court Records</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Towns in {countyDisplayName}</h3>
              <ul className="space-y-1">
                {towns
                  .filter(t => t.name !== 'County-wide')
                  .sort((a, b) => (b.population || 0) - (a.population || 0))
                  .slice(0, 6)
                  .map((town) => (
                    <li key={town.id}>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate(`/${town.slug}`); }}
                        className="hover:text-orange-600"
                      >
                        {town.name}, {countyState}
                      </a>
                    </li>
                  ))}
                {towns.length === 0 && (
                  <>
                    <li>{countySeat}, {countyState}</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <ul className="space-y-1">
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createCountyPageUrl("about", settings)); }} className="hover:text-orange-600">About {countyDisplayName}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("BusinessDirectory")); }} className="hover:text-orange-600">Business Directory</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(createPageUrl("SportsTeams")); }} className="hover:text-orange-600">Local Sports</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
