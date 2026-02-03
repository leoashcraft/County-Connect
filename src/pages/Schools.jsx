import React, { useState, useEffect } from "react";
import { School, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Search, MapPin, Plus, Phone, Globe, Users } from "lucide-react";
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

export default function Schools() {
  const navigate = useNavigate();
  const { state: filterState } = useLocationFilter();
  const { settings } = useSiteSettings();
  const [schools, setSchools] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
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

      const allSchools = await School.filter({ status: "active" }, 'name');
      setSchools(allSchools);

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading schools:", error);
    }
    setLoading(false);
  };

  const searchFiltered = schools.filter(school => {
    const matchesSearch = !searchTerm ||
      school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.principal?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" ||
      school.school_type === typeFilter ||
      (school.school_types && school.school_types.includes(typeFilter));

    const matchesDistrict = districtFilter === "all" || school.district === districtFilter;

    const matchesTown = townFilter === "all" ||
      school.town === townFilter ||
      school.address?.includes(townFilter);

    return matchesSearch && matchesType && matchesDistrict && matchesTown;
  });

  const filteredSchools = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const schoolTypes = [
    { value: "all", label: "All Types" },
    { value: "daycare", label: "Daycare / Childcare" },
    { value: "pre_k", label: "Pre-K / Preschool" },
    { value: "elementary", label: "Elementary School" },
    { value: "middle", label: "Middle School" },
    { value: "high", label: "High School" },
    { value: "college", label: "College / University" },
    { value: "charter", label: "Charter School" },
    { value: "private", label: "Private School" },
    { value: "alternative", label: "Alternative School" },
    { value: "vocational", label: "Vocational / Trade School" }
  ];

  const getTypeLabel = (value) => {
    const type = schoolTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getTypeColor = (type) => {
    const colors = {
      daycare: "bg-rose-100 text-rose-800",
      pre_k: "bg-pink-100 text-pink-800",
      elementary: "bg-green-100 text-green-800",
      middle: "bg-blue-100 text-blue-800",
      high: "bg-purple-100 text-purple-800",
      college: "bg-orange-100 text-orange-800",
      charter: "bg-teal-100 text-teal-800",
      private: "bg-indigo-100 text-indigo-800",
      alternative: "bg-yellow-100 text-yellow-800",
      vocational: "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Get unique districts from schools
  const districts = [...new Set(schools.map(s => s.district).filter(Boolean))].sort();

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <GraduationCap className="w-12 h-12 text-blue-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Schools in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find schools and educational institutions in ${settings.county_name || 'Navarro'} County, Texas. Public schools, private schools, and childcare facilities.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                Schools & Childcare
              </h1>
              <p className="text-gray-600 mt-2">Find daycares, preschools, schools, and colleges in your community</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("MySchools"))}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manage Schools
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="schools"
        />

        {/* Filters */}
        <Card className="border-2 border-blue-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search schools, districts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schoolTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
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
              {filteredSchools.length === 0 ? (
                <div className="col-span-3">
                  <Card className="border-2 border-blue-100">
                    <CardContent className="p-12 text-center">
                      <GraduationCap className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No schools found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                      {user && (
                        <Button
                          onClick={() => navigate(createPageUrl("AddSchool"))}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add a School
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredSchools.map(school => (
                  <Card
                    key={school.id}
                    className="border-2 border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(createPageUrl(`SchoolDetail?id=${school.id}`))}
                  >
                    {school.image_url && (
                      <div className="h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={school.image_url}
                          alt={school.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(school.school_types || [school.school_type]).filter(Boolean).map(type => (
                          <Badge key={type} className={getTypeColor(type)}>
                            {getTypeLabel(type)}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1">{school.name}</h3>

                      {school.district && (
                        <p className="text-sm text-gray-600 mb-2">
                          {school.district}
                        </p>
                      )}

                      {school.address && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {school.address}
                        </p>
                      )}

                      {school.grades_served && (
                        <p className="text-xs text-gray-500 mb-2">
                          Grades: {school.grades_served}
                        </p>
                      )}

                      {school.enrollment && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          {school.enrollment.toLocaleString()} students
                        </div>
                      )}

                      {school.mascot && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {school.mascot}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map">
            <Card className="border-2 border-blue-100">
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
                    {filteredSchools
                      .filter(school => school.lat && school.lng)
                      .map(school => (
                        <Marker key={school.id} position={[school.lat, school.lng]}>
                          <Popup>
                            <div className="text-sm">
                              <h3 className="font-bold">{school.name}</h3>
                              <div className="flex flex-wrap gap-1 mb-1">
                                {(school.school_types || [school.school_type]).filter(Boolean).map(type => (
                                  <Badge key={type} className={`${getTypeColor(type)} text-xs`}>
                                    {getTypeLabel(type)}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-gray-600">{school.address}</p>
                              {school.district && (
                                <p className="text-xs text-gray-500">{school.district}</p>
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
