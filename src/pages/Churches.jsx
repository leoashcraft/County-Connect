import React, { useState, useEffect } from "react";
import { Church, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Church as ChurchIcon, Search, MapPin, Plus, Clock, Globe, Users, Calendar } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Helper to generate SEO-friendly church URL
const getChurchUrl = (church) => {
  if (church.slug && church.town_slug) {
    return `/church/${church.town_slug}/${church.slug}`;
  }
  return createPageUrl(`ChurchDetail?id=${church.id}`);
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Churches() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { state: filterState } = useLocationFilter();
  const [churches, setChurches] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [denominationFilter, setDenominationFilter] = useState("all");
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

      const allChurches = await Church.filter({ status: "active" }, 'name');
      setChurches(allChurches);

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading churches:", error);
    }
    setLoading(false);
  };

  const searchFiltered = churches.filter(church => {
    const matchesSearch = !searchTerm ||
      church.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.denomination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.pastor_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDenomination = denominationFilter === "all" ||
      church.denomination === denominationFilter;

    const matchesTown = townFilter === "all" ||
      church.town === townFilter ||
      church.address?.includes(townFilter);

    return matchesSearch && matchesDenomination && matchesTown;
  });

  const filteredChurches = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const denominations = [
    { value: "all", label: "All Denominations" },
    { value: "baptist", label: "Baptist" },
    { value: "methodist", label: "Methodist" },
    { value: "catholic", label: "Catholic" },
    { value: "lutheran", label: "Lutheran" },
    { value: "presbyterian", label: "Presbyterian" },
    { value: "pentecostal", label: "Pentecostal" },
    { value: "church_of_christ", label: "Church of Christ" },
    { value: "assembly_of_god", label: "Assembly of God" },
    { value: "episcopal", label: "Episcopal" },
    { value: "non_denominational", label: "Non-Denominational" },
    { value: "other", label: "Other" }
  ];

  const getDenominationLabel = (value) => {
    const denom = denominations.find(d => d.value === value);
    return denom ? denom.label : value;
  };

  const formatServiceTime = (time) => {
    if (!time) return '';
    // If time already contains AM/PM, return as-is
    if (time.toUpperCase().includes('AM') || time.toUpperCase().includes('PM')) {
      return time;
    }
    // Otherwise convert from 24-hour format
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <ChurchIcon className="w-12 h-12 text-indigo-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Churches in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find churches and places of worship in ${settings.county_name || 'Navarro'} County, Texas. Browse local congregations by denomination.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ChurchIcon className="w-8 h-8 text-indigo-600" />
                Churches & Places of Worship
              </h1>
              <p className="text-gray-600 mt-2">Find local churches and religious organizations in your community</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("MyChurches"))}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manage Churches
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="churches"
        />

        {/* Filters */}
        <Card className="border-2 border-indigo-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search churches, pastors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={denominationFilter} onValueChange={setDenominationFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {denominations.map(denom => (
                    <SelectItem key={denom.value} value={denom.value}>{denom.label}</SelectItem>
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
              {filteredChurches.length === 0 ? (
                <div className="col-span-3">
                  <Card className="border-2 border-indigo-100">
                    <CardContent className="p-12 text-center">
                      <ChurchIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No churches found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                      {user && (
                        <Button
                          onClick={() => navigate(createPageUrl("AddChurch"))}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add a Church
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredChurches.map(church => (
                  <Card
                    key={church.id}
                    className="border-2 border-indigo-100 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(getChurchUrl(church))}
                  >
                    {church.image_url && (
                      <div className="h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={church.image_url}
                          alt={church.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-indigo-100 text-indigo-800">
                          {getDenominationLabel(church.denomination)}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1">{church.name}</h3>

                      {church.pastor_name && (
                        <p className="text-sm text-gray-600 mb-2">
                          Pastor: {church.pastor_name}
                        </p>
                      )}

                      {church.address && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {church.address}
                        </p>
                      )}

                      {church.service_times && church.service_times.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            Service Times:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {church.service_times.slice(0, 2).map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service.day}: {formatServiceTime(service.time)}
                              </Badge>
                            ))}
                            {church.service_times.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{church.service_times.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {church.ministries && church.ministries.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {church.ministries.slice(0, 2).map((ministry, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {ministry}
                            </Badge>
                          ))}
                          {church.ministries.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{church.ministries.length - 2}
                            </Badge>
                          )}
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
            <Card className="border-2 border-indigo-100">
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
                    {filteredChurches
                      .filter(church => church.lat && church.lng)
                      .map(church => (
                        <Marker key={church.id} position={[church.lat, church.lng]}>
                          <Popup>
                            <div className="text-sm">
                              <h3 className="font-bold">{church.name}</h3>
                              <Badge className="bg-indigo-100 text-indigo-800 text-xs mb-1">
                                {getDenominationLabel(church.denomination)}
                              </Badge>
                              <p className="text-xs text-gray-600">{church.address}</p>
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
