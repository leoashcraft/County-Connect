import React, { useState, useEffect } from "react";
import { Attraction, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Landmark, Search, MapPin, Plus, Clock, Globe, Camera, Star, Ticket, CheckCircle } from "lucide-react";

// Categories that represent businesses (can be claimed by owners)
const CLAIMABLE_CATEGORIES = ['golf_course', 'museum', 'entertainment', 'cultural'];
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Attractions() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { state: filterState } = useLocationFilter();
  const [attractions, setAttractions] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [townFilter, setTownFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
      }

      const allAttractions = await Attraction.filter({ status: "active" }, 'name');
      setAttractions(allAttractions);

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading attractions:", error);
    }
    setLoading(false);
  };

  const searchFiltered = attractions.filter(attraction => {
    const matchesSearch = !searchTerm ||
      attraction.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" ||
      attraction.category === categoryFilter;

    const matchesTown = townFilter === "all" ||
      attraction.town === townFilter ||
      attraction.address?.includes(townFilter);

    return matchesSearch && matchesCategory && matchesTown;
  });

  const filteredAttractions = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "park", label: "Park & Nature" },
    { value: "lake", label: "Lake & Waterway" },
    { value: "recreation", label: "Recreation Area" },
    { value: "golf_course", label: "Golf Course" },
    { value: "historic_site", label: "Historic Site" },
    { value: "historic_marker", label: "Texas Historical Marker" },
    { value: "museum", label: "Museum" },
    { value: "landmark", label: "Landmark" },
    { value: "monument", label: "Monument & Memorial" },
    { value: "architecture", label: "Notable Architecture" },
    { value: "entertainment", label: "Entertainment Venue" },
    { value: "cultural", label: "Cultural Center" },
    { value: "other", label: "Other" }
  ];

  const getCategoryLabel = (value) => {
    const cat = categories.find(c => c.value === value);
    return cat ? cat.label : value?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getCategoryColor = (category) => {
    const colors = {
      park: "bg-green-100 text-green-800",
      lake: "bg-cyan-100 text-cyan-800",
      recreation: "bg-teal-100 text-teal-800",
      golf_course: "bg-emerald-100 text-emerald-800",
      historic_site: "bg-amber-100 text-amber-800",
      historic_marker: "bg-red-100 text-red-800",
      museum: "bg-purple-100 text-purple-800",
      landmark: "bg-blue-100 text-blue-800",
      monument: "bg-slate-100 text-slate-800",
      architecture: "bg-indigo-100 text-indigo-800",
      entertainment: "bg-pink-100 text-pink-800",
      cultural: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
      <Landmark className="w-12 h-12 text-amber-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Explore ${settings.county_name || 'Navarro'} County - Parks, Landmarks & Things to Do`}
        description={`Discover parks, historic sites, museums, landmarks, and things to do in ${settings.county_name || 'Navarro'} County, Texas. Explore local attractions and points of interest.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Landmark className="w-8 h-8 text-amber-600" />
                  Explore {settings.county_name || 'Navarro'}
                </h1>
                <p className="text-gray-600 mt-2">Discover parks, historic sites, museums, and things to do</p>
              </div>
              {user && (
                <Button
                  onClick={() => navigate(createPageUrl("AddAttraction"))}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Attraction
                </Button>
              )}
            </div>
          </div>

          {/* Location Filter */}
          <LocationFilter
            userTown={userTown}
            towns={towns}
            itemName="attractions"
          />

          {/* Filters */}
          <Card className="border-2 border-amber-100 mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search attractions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttractions.length === 0 ? (
                  <div className="col-span-3">
                    <Card className="border-2 border-amber-100">
                      <CardContent className="p-12 text-center">
                        <Landmark className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No attractions found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                        {user && (
                          <Button
                            onClick={() => navigate(createPageUrl("AddAttraction"))}
                            className="bg-gradient-to-r from-amber-500 to-yellow-500"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add an Attraction
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  filteredAttractions.map(attraction => (
                    <Card
                      key={attraction.id}
                      className="border-2 border-amber-100 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(createPageUrl(`AttractionDetail?id=${attraction.id}`))}
                    >
                      {attraction.image_url && (
                        <div className="h-40 bg-gray-200 overflow-hidden">
                          <img
                            src={attraction.image_url}
                            alt={attraction.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={getCategoryColor(attraction.category)}>
                            {getCategoryLabel(attraction.category)}
                          </Badge>
                          {attraction.is_free && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              Free
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{attraction.name}</h3>

                        {attraction.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {attraction.description}
                          </p>
                        )}

                        {(attraction.address || attraction.town) && (
                          <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" />
                            {attraction.address}
                            {attraction.address && (attraction.city || attraction.town) && ', '}
                            {attraction.city || attraction.town}
                            {(attraction.city || attraction.town) && ', '}
                            {attraction.state || 'TX'}
                            {attraction.zip_code && ` ${attraction.zip_code}`}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          {attraction.year_established && (
                            <Badge variant="secondary" className="text-xs">
                              Est. {attraction.year_established}
                            </Badge>
                          )}
                          {attraction.adopted_by && CLAIMABLE_CATEGORIES.includes(attraction.category) && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {attraction.adopted_by && !CLAIMABLE_CATEGORIES.includes(attraction.category) && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              <Star className="w-3 h-3 mr-1" />
                              Adopted
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Map View */}
            <TabsContent value="map">
              <Card className="border-2 border-amber-100">
                <CardContent className="p-0">
                  <div className="h-[600px] w-full">
                    <MapContainer
                      center={[32.0954, -96.4689]}
                      zoom={11}
                      className="h-full w-full rounded-lg"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {filteredAttractions
                        .filter(attraction => attraction.lat && attraction.lng)
                        .map(attraction => (
                          <Marker key={attraction.id} position={[attraction.lat, attraction.lng]}>
                            <Popup>
                              <div className="text-sm">
                                <h3 className="font-bold">{attraction.name}</h3>
                                <Badge className={`${getCategoryColor(attraction.category)} text-xs mb-1`}>
                                  {getCategoryLabel(attraction.category)}
                                </Badge>
                                <p className="text-xs text-gray-600">{attraction.address}</p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
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
