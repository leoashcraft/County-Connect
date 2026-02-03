import React, { useState, useEffect } from "react";
import { FoodTruck, TruckStop, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Search, MapPin, DollarSign, Plus, Star, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function FoodTrucks() {
  const navigate = useNavigate();
  const { state: filterState } = useLocationFilter();
  const { settings } = useSiteSettings();
  const [trucks, setTrucks] = useState([]);
  const [stops, setStops] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [townFilter, setTownFilter] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState("all");
  const [openNowFilter, setOpenNowFilter] = useState(false);
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

      const allTrucks = await FoodTruck.filter({ status: "active" }, '-created_date');
      setTrucks(allTrucks);

      // Load all active stops for "open now" filtering
      const allStops = await TruckStop.list('-start_datetime');
      setStops(allStops);

      // Load all towns for the filter modal
      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading food trucks:", error);
    }
    setLoading(false);
  };

  // Check if truck is currently serving
  const isOpenNow = (truckId) => {
    const now = new Date();
    return stops.some(stop => {
      if (stop.truck_id !== truckId) return false;
      if (stop.status !== 'serving') return false;

      const start = new Date(stop.start_datetime);
      const end = new Date(stop.end_datetime);
      return now >= start && now <= end;
    });
  };

  // Get next stop for a truck
  const getNextStop = (truckId) => {
    const now = new Date();
    const futureStops = stops.filter(stop => {
      if (stop.truck_id !== truckId) return false;
      return new Date(stop.start_datetime) > now;
    });
    return futureStops[0]; // Already sorted by start_datetime descending
  };

  const searchFiltered = trucks.filter(truck => {
    const matchesSearch = !searchTerm ||
      truck.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.cuisine_types?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCuisine = cuisineFilter === "all" ||
      truck.cuisine_types?.includes(cuisineFilter);

    const matchesTown = townFilter === "all" ||
      truck.base_town === townFilter;

    const matchesDietary = dietaryFilter === "all" ||
      truck.dietary_flags?.includes(dietaryFilter);

    const matchesOpenNow = !openNowFilter || isOpenNow(truck.id);

    return matchesSearch && matchesCuisine && matchesTown && matchesDietary && matchesOpenNow;
  });

  const filteredTrucks = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (truck) => truck.town_id
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

  const getStatusColor = (truckId) => {
    if (!isOpenNow(truckId)) return 'bg-gray-100 text-gray-800';

    const currentStop = stops.find(stop => {
      if (stop.truck_id !== truckId) return false;
      const now = new Date();
      const start = new Date(stop.start_datetime);
      const end = new Date(stop.end_datetime);
      return now >= start && now <= end;
    });

    if (!currentStop) return 'bg-gray-100 text-gray-800';

    switch (currentStop.status) {
      case 'prepping': return 'bg-yellow-100 text-yellow-800';
      case 'serving': return 'bg-green-100 text-green-800';
      case 'sold_out': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (truckId) => {
    if (!isOpenNow(truckId)) return 'Closed';

    const currentStop = stops.find(stop => {
      if (stop.truck_id !== truckId) return false;
      const now = new Date();
      const start = new Date(stop.start_datetime);
      const end = new Date(stop.end_datetime);
      return now >= start && now <= end;
    });

    if (!currentStop) return 'Closed';

    switch (currentStop.status) {
      case 'prepping': return 'Prepping';
      case 'serving': return 'Serving Now!';
      case 'sold_out': return 'Sold Out';
      case 'closed': return 'Closed';
      default: return 'Scheduled';
    }
  };

  // Get current serving stops with location data for map
  const servingStops = stops.filter(stop => {
    const now = new Date();
    const start = new Date(stop.start_datetime);
    const end = new Date(stop.end_datetime);
    return now >= start && now <= end && stop.status === 'serving' && stop.lat && stop.lng;
  });

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Truck className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Food Trucks in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find food trucks in ${settings.county_name || 'Navarro'} County, Texas. Discover local mobile eateries, menus, and schedules.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Truck className="w-8 h-8 text-orange-600" />
                Food Trucks
              </h1>
              <p className="text-gray-600 mt-2">Find local food trucks near you</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("MyFoodTrucks"))}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                My Food Trucks
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="food trucks"
        />

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search trucks or cuisine..."
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
              {filteredTrucks.length === 0 ? (
                <div className="col-span-3">
                  <Card className="border-2 border-orange-100">
                    <CardContent className="p-12 text-center">
                      <Truck className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No trucks found</h3>
                      <p className="text-gray-600">Try adjusting your filters</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredTrucks.map(truck => {
                  const nextStop = getNextStop(truck.id);

                  return (
                    <Card
                      key={truck.id}
                      className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(createPageUrl(`FoodTruckDetail?id=${truck.id}`))}
                    >
                      {truck.logo_url && (
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={truck.logo_url}
                            alt={truck.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={getStatusColor(truck.id)}>
                            {getStatusLabel(truck.id)}
                          </Badge>
                          {truck.rating_avg > 0 && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{truck.rating_avg.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{truck.name}</h3>

                        {truck.cuisine_types && truck.cuisine_types.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2">
                            {truck.cuisine_types.join(', ')}
                          </p>
                        )}

                        {nextStop && (
                          <div className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                            <Clock className="w-3 h-3" />
                            Next: {new Date(nextStop.start_datetime).toLocaleDateString()} at {nextStop.location_name}
                          </div>
                        )}

                        {truck.dietary_flags && truck.dietary_flags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {truck.dietary_flags.map(flag => (
                              <Badge key={flag} variant="outline" className="text-xs">
                                {formatLabel(flag)}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {truck.payment_methods && truck.payment_methods.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <DollarSign className="w-3 h-3 inline mr-1" />
                            {truck.payment_methods.join(', ')}
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
                    {servingStops.map(stop => {
                      const truck = trucks.find(t => t.id === stop.truck_id);
                      if (!truck) return null;

                      return (
                        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                          <Popup>
                            <div className="text-sm">
                              <h3 className="font-bold">{truck.name}</h3>
                              <p className="text-xs text-gray-600">{stop.location_name}</p>
                              <Badge className="mt-1 text-xs" variant="secondary">
                                {getStatusLabel(truck.id)}
                              </Badge>
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
