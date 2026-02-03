import React, { useState, useEffect } from "react";
import { CommunityResource, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Search, MapPin, Plus, Phone, Clock, Globe, Users } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Fix for default marker icons in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function CommunityResources() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { state: filterState } = useLocationFilter();
  const [resources, setResources] = useState([]);
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

      const allResources = await CommunityResource.filter({ status: "active" }, '-created_date');
      setResources(allResources);

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading resources:", error);
    }
    setLoading(false);
  };

  const isOpenNow = (resource) => {
    if (!resource.operating_hours || resource.operating_hours.length === 0) return false;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = resource.operating_hours.find(h => h.day === currentDay);
    if (!todayHours || todayHours.is_closed) return false;

    return currentTime >= todayHours.open_time && currentTime <= todayHours.close_time;
  };

  const searchFiltered = resources.filter(resource => {
    const matchesSearch = !searchTerm ||
      resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.services_offered?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === "all" ||
      resource.category === categoryFilter;

    const matchesTown = townFilter === "all" ||
      resource.town === townFilter ||
      resource.address?.includes(townFilter);

    return matchesSearch && matchesCategory && matchesTown;
  });

  const filteredResources = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "food_pantry", label: "Food Pantry" },
    { value: "food_bank", label: "Food Bank" },
    { value: "soup_kitchen", label: "Soup Kitchen / Meal Service" },
    { value: "shelter", label: "Shelter / Housing" },
    { value: "clothing", label: "Clothing Assistance" },
    { value: "utility_assistance", label: "Utility Assistance" },
    { value: "medical", label: "Medical / Health Services" },
    { value: "mental_health", label: "Mental Health Services" },
    { value: "senior_services", label: "Senior Services" },
    { value: "youth_services", label: "Youth Services" },
    { value: "veterans", label: "Veterans Services" },
    { value: "job_assistance", label: "Job Training / Employment" },
    { value: "education", label: "Education / Tutoring" },
    { value: "legal_aid", label: "Legal Aid" },
    { value: "crisis", label: "Crisis Hotline / Support" },
    { value: "government", label: "Government" },
    { value: "other", label: "Other" }
  ];

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getCategoryLabel = (value) => {
    const cat = categories.find(c => c.value === value);
    return cat ? cat.label : toTitleCase(value);
  };

  const getCategoryColor = (category) => {
    const colors = {
      food_pantry: "bg-green-100 text-green-800",
      food_bank: "bg-green-100 text-green-800",
      soup_kitchen: "bg-orange-100 text-orange-800",
      shelter: "bg-blue-100 text-blue-800",
      clothing: "bg-purple-100 text-purple-800",
      utility_assistance: "bg-yellow-100 text-yellow-800",
      medical: "bg-red-100 text-red-800",
      mental_health: "bg-pink-100 text-pink-800",
      senior_services: "bg-indigo-100 text-indigo-800",
      youth_services: "bg-cyan-100 text-cyan-800",
      veterans: "bg-slate-100 text-slate-800",
      job_assistance: "bg-teal-100 text-teal-800",
      education: "bg-amber-100 text-amber-800",
      legal_aid: "bg-gray-100 text-gray-800",
      crisis: "bg-rose-100 text-rose-800",
      government: "bg-blue-100 text-blue-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-rose-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Community Resources in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find community resources and assistance programs in ${settings.county_name || 'Navarro'} County, Texas. Food banks, shelters, and support services.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-rose-600" />
                Community Resources
              </h1>
              <p className="text-gray-600 mt-2">Find food pantries, assistance programs, and support services</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("MyCommunityResources"))}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manage Resources
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="resources"
        />

        {/* Filters */}
        <Card className="border-2 border-rose-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search resources or services..."
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

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Button
            variant={categoryFilter === "food_pantry" ? "default" : "outline"}
            onClick={() => setCategoryFilter(categoryFilter === "food_pantry" ? "all" : "food_pantry")}
            className="justify-start"
          >
            <span className="mr-2">🍎</span> Food Pantries
          </Button>
          <Button
            variant={categoryFilter === "shelter" ? "default" : "outline"}
            onClick={() => setCategoryFilter(categoryFilter === "shelter" ? "all" : "shelter")}
            className="justify-start"
          >
            <span className="mr-2">🏠</span> Shelters
          </Button>
          <Button
            variant={categoryFilter === "medical" ? "default" : "outline"}
            onClick={() => setCategoryFilter(categoryFilter === "medical" ? "all" : "medical")}
            className="justify-start"
          >
            <span className="mr-2">🏥</span> Medical
          </Button>
          <Button
            variant={categoryFilter === "crisis" ? "default" : "outline"}
            onClick={() => setCategoryFilter(categoryFilter === "crisis" ? "all" : "crisis")}
            className="justify-start"
          >
            <span className="mr-2">📞</span> Crisis Support
          </Button>
        </div>

        {/* List & Map Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.length === 0 ? (
                <div className="col-span-3">
                  <Card className="border-2 border-rose-100">
                    <CardContent className="p-12 text-center">
                      <Heart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No resources found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                      {user && (
                        <Button
                          onClick={() => navigate(createPageUrl("AddCommunityResource"))}
                          className="bg-gradient-to-r from-rose-500 to-pink-500"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add a Resource
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredResources.map(resource => (
                  <Card
                    key={resource.id}
                    className="border-2 border-rose-100 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${resource.id}`))}
                  >
                    {resource.image_url && (
                      <div className="h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={resource.image_url}
                          alt={resource.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getCategoryColor(resource.category)}>
                          {getCategoryLabel(resource.category)}
                        </Badge>
                        {resource.operating_hours && (
                          isOpenNow(resource) ? (
                            <Badge className="bg-green-100 text-green-800">Open Now</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
                          )
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.name}</h3>

                      {resource.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {resource.description}
                        </p>
                      )}

                      {resource.address && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {resource.address}
                        </p>
                      )}

                      {resource.phone && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <Phone className="w-3 h-3" />
                          {resource.phone}
                        </p>
                      )}

                      {resource.services_offered && resource.services_offered.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.services_offered.slice(0, 3).map((service, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {resource.services_offered.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{resource.services_offered.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {resource.eligibility_requirements && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>Eligibility requirements apply</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map">
            {/* Notice about resources not on map */}
            {(() => {
              const mappableResources = filteredResources.filter(r => r.lat && r.lng);
              const unmappableCount = filteredResources.length - mappableResources.length;
              if (unmappableCount > 0) {
                return (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-800">
                        <span className="font-semibold">{unmappableCount} resource{unmappableCount !== 1 ? 's' : ''}</span> {unmappableCount !== 1 ? 'are' : 'is'} not shown on the map.
                        These include statewide programs, hotlines, and resources without specific addresses.
                        {mappableResources.length > 0 ? ` Showing ${mappableResources.length} mappable resource${mappableResources.length !== 1 ? 's' : ''} below.` : ' Use the List View to see all resources.'}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            <Card className="border-2 border-rose-100">
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <MapContainer
                    center={[32.0954, -96.4689]} // Corsicana, TX (Navarro County seat)
                    zoom={11}
                    className="h-full w-full rounded-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredResources
                      .filter(resource => resource.lat && resource.lng)
                      .map(resource => (
                        <Marker key={resource.id} position={[resource.lat, resource.lng]}>
                          <Popup>
                            <div className="text-sm">
                              <h3 className="font-bold">{resource.name}</h3>
                              <Badge className={`${getCategoryColor(resource.category)} text-xs mb-1`}>
                                {getCategoryLabel(resource.category)}
                              </Badge>
                              <p className="text-xs text-gray-600">{resource.address}</p>
                              {resource.phone && (
                                <p className="text-xs text-gray-600 mt-1">{resource.phone}</p>
                              )}
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
