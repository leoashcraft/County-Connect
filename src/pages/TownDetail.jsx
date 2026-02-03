import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Town, Restaurant, School, Church, FoodTruck, Job, Event,
  CommunityResource, Store, User
} from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Category section component
import TownCategorySection from "@/components/town/TownCategorySection";

// Card components
import TownRestaurantCard from "@/components/town/TownRestaurantCard";
import TownSchoolCard from "@/components/town/TownSchoolCard";
import TownChurchCard from "@/components/town/TownChurchCard";
import TownFoodTruckCard from "@/components/town/TownFoodTruckCard";
import TownJobCard from "@/components/town/TownJobCard";
import TownEventCard from "@/components/town/TownEventCard";
import TownBusinessCard from "@/components/town/TownBusinessCard";

// Icons
import {
  MapPin, Users, Building2, Utensils, GraduationCap, Church as ChurchIcon,
  Briefcase, Calendar, Heart, Truck, ShoppingBag, Star, ArrowLeft, Home,
  ExternalLink, Car, History, Tag
} from "lucide-react";

// Leaflet map
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to convert strings to Title Case
const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export default function TownDetail() {
  // Support both townSlug and pageSlug for flexibility (when rendered from CustomPage)
  const params = useParams();
  const townSlug = params.townSlug || params.pageSlug;
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  // Default county from site settings
  const defaultCounty = settings.county_name ? `${settings.county_name} County` : 'the county';

  const [town, setTown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Entity data by category
  const [restaurants, setRestaurants] = useState([]);
  const [schools, setSchools] = useState([]);
  const [churches, setChurches] = useState([]);
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [resources, setResources] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);

  useEffect(() => {
    loadTownData();
  }, [townSlug]);

  const loadTownData = async () => {
    setLoading(true);
    try {
      // Find town by slug
      const towns = await Town.list('name');
      const townData = towns.find(t => t.slug === townSlug);

      if (!townData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setTown(townData);

      // Load all entities for this town in parallel
      // Filter by town name since not all entities may have town_id
      const [
        allRestaurants,
        allSchools,
        allChurches,
        allFoodTrucks,
        allJobs,
        allEvents,
        allStores,
        allResources
      ] = await Promise.all([
        Restaurant.list('-created_date'),
        School.list('name'),
        Church.list('name'),
        FoodTruck.list('-created_date'),
        Job.list('-created_date'),
        Event.list('event_date'),
        Store.list('name'),
        CommunityResource.list('name')
      ]);

      // Filter by town name or town_id
      const filterByTown = (items) => items.filter(item =>
        item.town === townData.name ||
        item.town_id === townData.id ||
        item.base_town === townData.name
      );

      // Only include active/open items
      const filterActive = (items) => items.filter(item =>
        item.status === 'active' || !item.status
      );

      setRestaurants(filterActive(filterByTown(allRestaurants)));
      setSchools(filterActive(filterByTown(allSchools)));
      setChurches(filterActive(filterByTown(allChurches)));
      setFoodTrucks(filterActive(filterByTown(allFoodTrucks)));
      setJobs(filterActive(filterByTown(allJobs)));
      setEvents(filterActive(filterByTown(allEvents)));
      setBusinesses(filterActive(filterByTown(allStores)));
      setResources(filterActive(filterByTown(allResources)));

      // Load featured restaurants (manually selected, can be from any town)
      if (townData.featured_restaurant_ids && townData.featured_restaurant_ids.length > 0) {
        const featured = allRestaurants.filter(r =>
          townData.featured_restaurant_ids.includes(r.id) &&
          (r.status === 'active' || !r.status)
        );
        setFeaturedRestaurants(featured);
      } else {
        setFeaturedRestaurants([]);
      }

    } catch (error) {
      console.error("Error loading town:", error);
      setNotFound(true);
    }
    setLoading(false);
  };

  // Get upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);

  // Calculate total listings
  const totalListings = restaurants.length + schools.length + churches.length +
    foodTrucks.length + jobs.length + events.length + businesses.length + resources.length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <MapPin className="w-12 h-12 text-green-600 animate-pulse" />
      </div>
    );
  }

  // 404 Not Found
  if (notFound || !town) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or may have been moved.
            </p>
            <Button onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default coordinates for Navarro County if town doesn't have them
  const townLat = town.lat || 32.0954;
  const townLng = town.lng || -96.4689;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* SEO Meta Tags */}
      <MetaTags
        title={`${town.name}, Texas - Local Guide`}
        description={
          town.description ||
          `Explore ${town.name}, Texas - discover local restaurants, schools, churches, jobs, events and community resources. Your complete guide to ${town.name} in ${town.county || defaultCounty}.`
        }
        keywords={`${town.name} Texas, ${town.name} restaurants, ${town.name} schools, ${town.name} churches, ${town.name} jobs, things to do in ${town.name}, ${town.county || defaultCounty}`}
        canonicalUrl={`${window.location.origin}/${town.slug}`}
      />

      {/* JSON-LD Schema */}
      <JsonLdSchema
        type="city"
        data={{
          name: town.name,
          description: town.description,
          image_url: town.image_url,
          county: town.county || defaultCounty,
          state: 'Texas',
          lat: townLat,
          lng: townLng,
          population: town.population,
          url: `${window.location.origin}/${town.slug}`
        }}
      />

      {/* Hero Section */}
      <div className="relative">
        {town.image_url ? (
          <div className="h-64 md:h-80 w-full overflow-hidden">
            <img
              src={town.image_url}
              alt={town.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-48 md:h-64 w-full bg-gradient-to-r from-green-600 to-emerald-600" />
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{town.name}</h1>
            <p className="text-white/90 text-lg">{town.county || defaultCounty}, Texas</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {town.population && (
            <Card className="border-2 border-green-100">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">{town.population.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Population</p>
              </CardContent>
            </Card>
          )}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-4 text-center">
              <Utensils className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
              <p className="text-sm text-gray-600">Restaurants</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-100">
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              <p className="text-sm text-gray-600">Schools</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-100">
            <CardContent className="p-4 text-center">
              <ChurchIcon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">{churches.length}</p>
              <p className="text-sm text-gray-600">Churches</p>
            </CardContent>
          </Card>
        </div>

        {/* About Section - Always show, with dynamic content if no description */}
        <Card className="border-2 border-green-100 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About {town.name}</h2>

            {/* Population and location summary */}
            {town.population && (
              <p className="text-gray-600 mb-3">
                <span className="font-semibold text-gray-800">{town.name}</span> is a {town.population >= 10000 ? 'city' : town.population >= 1000 ? 'town' : 'community'} of <span className="font-semibold text-gray-800">{town.population.toLocaleString()} residents</span> in {town.county || defaultCounty}, Texas.
              </p>
            )}

            {/* Main description or auto-generated intro */}
            <p className="text-gray-700 leading-relaxed mb-4">
              {town.description || `${restaurants.length > 0 || schools.length > 0 || churches.length > 0 ? `The area offers ${[restaurants.length > 0 ? `${restaurants.length} local dining option${restaurants.length !== 1 ? 's' : ''}` : '', schools.length > 0 ? `${schools.length} school${schools.length !== 1 ? 's' : ''}` : '', churches.length > 0 ? `${churches.length} place${churches.length !== 1 ? 's' : ''} of worship` : ''].filter(Boolean).join(', ')}.` : `Discover what ${town.name} has to offer.`}`}
            </p>

            {/* Known For tags */}
            {town.known_for && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Known for:
                </span>
                {town.known_for.split(',').map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700">
                    {item.trim()}
                  </Badge>
                ))}
              </div>
            )}

            {/* Zip codes */}
            {town.zip_codes && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Zip Code{town.zip_codes.includes(',') ? 's' : ''}:</span> {town.zip_codes}
              </p>
            )}
          </CardContent>
        </Card>

        {/* History Section */}
        {town.history && (
          <Card className="border-2 border-amber-100 mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                History of {town.name}
              </h2>
              <p className="text-gray-700 leading-relaxed">{town.history}</p>
            </CardContent>
          </Card>
        )}

        {/* Getting Around Section */}
        {town.getting_around && (
          <Card className="border-2 border-blue-100 mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Getting Around
              </h2>
              <p className="text-gray-700 leading-relaxed">{town.getting_around}</p>
            </CardContent>
          </Card>
        )}

        {/* Official Links */}
        {(town.official_website || town.chamber_website) && (
          <Card className="border-2 border-purple-100 mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Official Resources</h2>
              <div className="flex flex-wrap gap-3">
                {town.official_website && (
                  <a
                    href={town.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Official City Website
                  </a>
                )}
                {town.chamber_website && (
                  <a
                    href={town.chamber_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Chamber of Commerce
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Restaurants Nearby (only shows if manually selected) */}
        {featuredRestaurants.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Featured Restaurants Nearby</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {featuredRestaurants.map(restaurant => (
                <TownRestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingEvents.map(event => (
                <TownEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* All Category Sections */}
        <TownCategorySection
          title="Restaurants & Dining"
          icon={Utensils}
          iconColor="text-orange-500"
          items={restaurants}
          renderCard={(restaurant) => (
            <TownRestaurantCard key={restaurant.id} restaurant={restaurant} />
          )}
          onViewAll={() => navigate(createPageUrl(`Restaurants?town=${town.name}`))}
          maxItems={6}
        />

        <TownCategorySection
          title="Schools & Education"
          icon={GraduationCap}
          iconColor="text-blue-500"
          items={schools}
          renderCard={(school) => (
            <TownSchoolCard key={school.id} school={school} />
          )}
          onViewAll={() => navigate(createPageUrl(`Schools?town=${town.name}`))}
          maxItems={6}
        />

        <TownCategorySection
          title="Churches & Places of Worship"
          icon={ChurchIcon}
          iconColor="text-purple-500"
          items={churches}
          renderCard={(church) => (
            <TownChurchCard key={church.id} church={church} />
          )}
          onViewAll={() => navigate(createPageUrl(`Churches?town=${town.name}`))}
          maxItems={6}
        />

        <TownCategorySection
          title="Food Trucks"
          icon={Truck}
          iconColor="text-amber-500"
          items={foodTrucks}
          renderCard={(foodTruck) => (
            <TownFoodTruckCard key={foodTruck.id} foodTruck={foodTruck} />
          )}
          onViewAll={() => navigate(createPageUrl(`FoodTrucks?town=${town.name}`))}
          maxItems={6}
        />

        <TownCategorySection
          title="Local Businesses"
          icon={ShoppingBag}
          iconColor="text-teal-500"
          items={businesses}
          renderCard={(business) => (
            <TownBusinessCard key={business.id} business={business} />
          )}
          onViewAll={() => navigate(createPageUrl("Marketplace"))}
          maxItems={6}
        />

        <TownCategorySection
          title="Jobs & Employment"
          icon={Briefcase}
          iconColor="text-green-500"
          items={jobs}
          renderCard={(job) => (
            <TownJobCard key={job.id} job={job} />
          )}
          onViewAll={() => navigate(createPageUrl(`Jobs?town=${town.name}`))}
          maxItems={6}
        />

        <TownCategorySection
          title="Events & Activities"
          icon={Calendar}
          iconColor="text-indigo-500"
          items={events}
          renderCard={(event) => (
            <TownEventCard key={event.id} event={event} />
          )}
          onViewAll={() => navigate(createPageUrl(`Events?town=${town.name}`))}
          maxItems={6}
        />

        <TownCategorySection
          title="Community Resources"
          icon={Heart}
          iconColor="text-rose-500"
          items={resources}
          renderCard={(resource) => (
            <Card
              key={resource.id}
              className="border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${resource.id}`))}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{resource.name}</h3>
                {resource.category && (
                  <Badge variant="secondary" className="text-xs mt-2 bg-rose-50 text-rose-700">
                    {toTitleCase(resource.category)}
                  </Badge>
                )}
                {resource.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{resource.description}</p>
                )}
              </CardContent>
            </Card>
          )}
          onViewAll={() => navigate(createPageUrl("CommunityResources"))}
          maxItems={6}
        />

        {/* Town Map */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            Location
          </h2>
          <Card className="border-2 border-green-100 overflow-hidden">
            <div className="h-80">
              <MapContainer
                center={[townLat, townLng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[townLat, townLng]}>
                  <Popup>
                    <strong>{town.name}</strong><br />
                    {town.county || defaultCounty}, Texas
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Card>
        </section>

        {/* No listings message */}
        {totalListings === 0 && (
          <Card className="border-2 border-green-100">
            <CardContent className="p-12 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to add a business, restaurant, or organization in {town.name}!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
