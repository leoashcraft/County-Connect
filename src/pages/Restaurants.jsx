import React, { useState, useEffect } from "react";
import { Restaurant, FoodTruck, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Search, MapPin, DollarSign, Plus, Star, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { FeaturedSpotSection } from "@/components/FeaturedSpot";

// Fix for default marker icons in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Restaurants() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { state: filterState } = useLocationFilter();
  const [restaurants, setRestaurants] = useState([]);
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [townFilter, setTownFilter] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState("all");
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [showFoodTrucks, setShowFoodTrucks] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      // Load user's preferred town if they have one
      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
      }

      const allRestaurants = await Restaurant.filter({ status: "active" }, '-created_date');
      // Separate featured restaurants
      const featured = allRestaurants.filter(r => r.is_featured);
      const regular = allRestaurants.filter(r => !r.is_featured);
      setRestaurants([...featured, ...regular]); // Featured first, then regular

      // Load food trucks for toggle feature
      const allTrucks = await FoodTruck.filter({ status: "active" }, '-created_date');
      setFoodTrucks(allTrucks);

      // Load all towns for the filter modal
      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading restaurants:", error);
    }
    setLoading(false);
  };

  // Parse time string like "8:00 AM" to 24-hour format for comparison
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes; // Return minutes since midnight
  };

  // Check if a day matches a day range like "Mon-Fri" or single day "Sun"
  const dayMatchesRange = (currentDay, rangeStr) => {
    const dayOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayMap = {
      'sunday': 'sun', 'monday': 'mon', 'tuesday': 'tue', 'wednesday': 'wed',
      'thursday': 'thu', 'friday': 'fri', 'saturday': 'sat',
      'sun': 'sun', 'mon': 'mon', 'tue': 'tue', 'wed': 'wed',
      'thu': 'thu', 'fri': 'fri', 'sat': 'sat'
    };

    const normalizedCurrent = dayMap[currentDay.toLowerCase()];
    const parts = rangeStr.toLowerCase().split('-').map(d => dayMap[d.trim()]);

    if (parts.length === 1) {
      return normalizedCurrent === parts[0];
    }

    const startIdx = dayOrder.indexOf(parts[0]);
    const endIdx = dayOrder.indexOf(parts[1]);
    const currentIdx = dayOrder.indexOf(normalizedCurrent);

    if (startIdx <= endIdx) {
      return currentIdx >= startIdx && currentIdx <= endIdx;
    } else {
      // Wraps around (e.g., Fri-Sun)
      return currentIdx >= startIdx || currentIdx <= endIdx;
    }
  };

  // Check if restaurant is currently open based on operating hours or hours string
  const isOpenNow = (restaurant) => {
    // First check structured operating_hours
    if (restaurant.operating_hours && restaurant.operating_hours.length > 0) {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const currentTime = now.toTimeString().slice(0, 5);
      const todayHours = restaurant.operating_hours.find(h => h.day === currentDay);
      if (!todayHours || todayHours.is_closed) return false;
      return currentTime >= todayHours.open_time && currentTime <= todayHours.close_time;
    }

    // Then check hours string format
    if (restaurant.hours) {
      const hoursStr = restaurant.hours;

      // Handle "Open 24 Hours"
      if (hoursStr.toLowerCase().includes('open 24 hours')) {
        return true;
      }

      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Parse hours string like "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM"
      const segments = hoursStr.split(',').map(s => s.trim());

      for (const segment of segments) {
        const colonIdx = segment.indexOf(':');
        if (colonIdx === -1) continue;

        const dayPart = segment.substring(0, colonIdx).trim();
        const timePart = segment.substring(colonIdx + 1).trim();

        if (dayMatchesRange(currentDay, dayPart)) {
          // Check if closed
          if (timePart.toLowerCase() === 'closed') {
            return false;
          }

          // Parse time range like "11:00 AM - 9:00 PM"
          const timeMatch = timePart.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
          if (timeMatch) {
            const openTime = parseTime(timeMatch[1]);
            const closeTime = parseTime(timeMatch[2]);
            if (openTime !== null && closeTime !== null) {
              // Handle overnight hours (close time is next day)
              if (closeTime < openTime) {
                return currentMinutes >= openTime || currentMinutes <= closeTime;
              }
              return currentMinutes >= openTime && currentMinutes <= closeTime;
            }
          }
        }
      }
    }

    return false;
  };

  // Check if restaurant has any hours data
  const hasHoursData = (restaurant) => {
    return (restaurant.operating_hours && restaurant.operating_hours.length > 0) || restaurant.hours;
  };

  // Format category labels (convert "gluten_free" to "Gluten-Free")
  const formatLabel = (str) => {
    if (!str) return '';
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  // Combine restaurants and food trucks when toggle is on
  const getCombinedList = () => {
    if (!showFoodTrucks) return restaurants;

    // Convert food trucks to restaurant-like format for unified display
    const trucksAsRestaurants = foodTrucks.map(truck => ({
      ...truck,
      type: 'food_truck',
      address: truck.base_town,
      town: truck.base_town
    }));

    return [...restaurants, ...trucksAsRestaurants];
  };

  const searchFiltered = getCombinedList().filter(place => {
    const matchesSearch = !searchTerm ||
      place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.cuisine_types?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCuisine = cuisineFilter === "all" ||
      place.cuisine_types?.includes(cuisineFilter);

    const matchesTown = townFilter === "all" ||
      place.town === townFilter ||
      place.base_town === townFilter ||
      place.address?.includes(townFilter);

    const matchesDietary = dietaryFilter === "all" ||
      place.dietary_flags?.includes(dietaryFilter);

    const matchesOpenNow = !openNowFilter || isOpenNow(place);

    return matchesSearch && matchesCuisine && matchesTown && matchesDietary && matchesOpenNow;
  });

  const filteredEstablishments = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const cuisines = [
    { value: "all", label: "All Cuisines" },
    { value: "american", label: "American" },
    { value: "mexican", label: "Mexican" },
    { value: "italian", label: "Italian" },
    { value: "asian", label: "Asian" },
    { value: "bbq", label: "BBQ" },
    { value: "seafood", label: "Seafood" },
    { value: "desserts", label: "Desserts" },
    { value: "coffee", label: "Coffee & Drinks" },
    { value: "other", label: "Other" }
  ];

  const dietaryOptions = [
    { value: "all", label: "All Dietary" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten_free", label: "Gluten-Free" }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Utensils className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Restaurants in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find the best restaurants in ${settings.county_name || 'Navarro'} County, Texas. Browse local dining options, menus, and reviews.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Utensils className="w-8 h-8 text-orange-600" />
                Restaurants
              </h1>
              <p className="text-gray-600 mt-2">Find local restaurants near you</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("MyRestaurants"))}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                My Restaurants
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="restaurants"
        />

        {/* Featured Restaurants */}
        <FeaturedSpotSection
          title="Featured Restaurants"
          spotType="restaurant"
          featuredItems={restaurants.filter(r => r.is_featured).slice(0, 3)}
          icon={Utensils}
          renderItem={(restaurant) => (
            <Card
              className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer h-full"
              onClick={() => navigate(createPageUrl(`RestaurantDetail?id=${restaurant.id}`))}
            >
              {restaurant.logo_url && (
                <div className="h-32 bg-gray-200 overflow-hidden">
                  <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                {restaurant.cuisine_types && (
                  <p className="text-sm text-gray-600">{restaurant.cuisine_types.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</p>
                )}
                {restaurant.address && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {restaurant.address}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        />

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search restaurants or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map(cuisine => (
                    <SelectItem key={cuisine.value} value={cuisine.value}>{cuisine.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={townFilter} onValueChange={setTownFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Towns</SelectItem>
                  {towns.map(town => (
                    <SelectItem key={town.id} value={town.name}>{town.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietaryOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="openNow"
                  checked={openNowFilter}
                  onChange={(e) => setOpenNowFilter(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="openNow" className="text-sm font-medium cursor-pointer">
                  Open Now
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showFoodTrucks"
                  checked={showFoodTrucks}
                  onChange={(e) => setShowFoodTrucks(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showFoodTrucks" className="text-sm font-medium cursor-pointer">
                  Include Food Trucks
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List & Map Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list">
            <div className="grid md:grid-cols-3 gap-4">
              {filteredEstablishments.length === 0 ? (
                <div className="col-span-3">
                  <Card className="border-2 border-orange-100">
                    <CardContent className="p-12 text-center">
                      <Utensils className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No restaurants found</h3>
                      <p className="text-gray-600">Try adjusting your filters</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredEstablishments.map(place => {
                  const isFoodTruck = place.type === 'food_truck';
                  const detailPage = isFoodTruck ? 'FoodTruckDetail' : 'RestaurantDetail';

                  return (
                    <Card
                      key={place.id}
                      className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(createPageUrl(`${detailPage}?id=${place.id}`))}
                    >
                      {place.logo_url && (
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={place.logo_url}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex gap-1">
                            {isFoodTruck && (
                              <Badge variant="secondary" className="text-xs">
                                Food Truck
                              </Badge>
                            )}
                            {hasHoursData(place) ? (
                              isOpenNow(place) ? (
                                <Badge className="bg-green-100 text-green-800">Open Now</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">Closed</Badge>
                              )
                            ) : (
                              <Badge className="bg-gray-100 text-gray-500">Unknown Hours</Badge>
                            )}
                          </div>
                          {place.rating_avg > 0 && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{place.rating_avg.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{place.name}</h3>

                        {place.cuisine_types && place.cuisine_types.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2">
                            {place.cuisine_types.map(formatLabel).join(', ')}
                          </p>
                        )}

                        {place.address && (
                          <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" />
                            {place.address}
                          </p>
                        )}

                        {place.dietary_flags && place.dietary_flags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {place.dietary_flags.map(flag => (
                              <Badge key={flag} variant="outline" className="text-xs">
                                {formatLabel(flag)}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {place.payment_methods && place.payment_methods.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <DollarSign className="w-3 h-3 inline mr-1" />
                            {place.payment_methods.map(formatLabel).join(', ')}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map">
            <Card className="border-2 border-orange-100">
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <MapContainer
                    center={[32.0954, -96.4689]} // Corsicana, TX
                    zoom={11}
                    className="h-full w-full rounded-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredEstablishments
                      .filter(place => place.lat && place.lng)
                      .map(place => {
                        const isFoodTruck = place.type === 'food_truck';

                        return (
                          <Marker key={place.id} position={[place.lat, place.lng]}>
                            <Popup>
                              <div className="text-sm">
                                <h3 className="font-bold">{place.name}</h3>
                                {isFoodTruck && (
                                  <Badge variant="secondary" className="text-xs mb-1">
                                    Food Truck
                                  </Badge>
                                )}
                                <p className="text-xs text-gray-600">{place.address}</p>
                                {hasHoursData(place) ? (
                                  isOpenNow(place) ? (
                                    <Badge className="mt-1 text-xs bg-green-100 text-green-800">Open Now</Badge>
                                  ) : (
                                    <Badge className="mt-1 text-xs bg-red-100 text-red-800">Closed</Badge>
                                  )
                                ) : (
                                  <Badge className="mt-1 text-xs bg-gray-100 text-gray-500">Unknown Hours</Badge>
                                )}
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
}
