import React, { useState, useEffect } from "react";
import { SportsTeam, User, Town, Event } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Search, MapPin, Plus, Users, Calendar, School } from "lucide-react";
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function SportsTeams() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { state: filterState } = useLocationFilter();
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
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

      const allTeams = await SportsTeam.filter({ status: "active" }, 'name');
      setTeams(allTeams);

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
    setLoading(false);
  };

  const searchFiltered = teams.filter(team => {
    const matchesSearch = !searchTerm ||
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.sport?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSport = sportFilter === "all" ||
      team.sport === sportFilter;

    const matchesLevel = levelFilter === "all" ||
      team.level === levelFilter;

    const matchesTown = townFilter === "all" ||
      team.town === townFilter;

    return matchesSearch && matchesSport && matchesLevel && matchesTown;
  });

  const filteredTeams = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const sports = [
    { value: "all", label: "All Sports" },
    { value: "football", label: "Football" },
    { value: "basketball", label: "Basketball" },
    { value: "baseball", label: "Baseball" },
    { value: "softball", label: "Softball" },
    { value: "soccer", label: "Soccer" },
    { value: "volleyball", label: "Volleyball" },
    { value: "tennis", label: "Tennis" },
    { value: "golf", label: "Golf" },
    { value: "track", label: "Track & Field" },
    { value: "cross_country", label: "Cross Country" },
    { value: "swimming", label: "Swimming" },
    { value: "wrestling", label: "Wrestling" },
    { value: "cheer", label: "Cheer/Dance" },
    { value: "esports", label: "eSports" },
    { value: "other", label: "Other" }
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "youth", label: "Youth League" },
    { value: "middle_school", label: "Middle School" },
    { value: "high_school", label: "High School" },
    { value: "college", label: "College" },
    { value: "adult", label: "Adult League" },
    { value: "recreational", label: "Recreational" },
    { value: "travel", label: "Travel/Select" },
    { value: "club", label: "Club" }
  ];

  const getSportLabel = (value) => {
    const sport = sports.find(s => s.value === value);
    return sport ? sport.label : value;
  };

  const getLevelLabel = (value) => {
    const level = levels.find(l => l.value === value);
    return level ? level.label : value;
  };

  const getLevelColor = (level) => {
    const colors = {
      youth: "bg-green-100 text-green-800",
      middle_school: "bg-blue-100 text-blue-800",
      high_school: "bg-purple-100 text-purple-800",
      college: "bg-orange-100 text-orange-800",
      adult: "bg-gray-100 text-gray-800",
      recreational: "bg-teal-100 text-teal-800",
      travel: "bg-red-100 text-red-800",
      club: "bg-indigo-100 text-indigo-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <Trophy className="w-12 h-12 text-emerald-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Sports Teams in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find local sports teams in ${settings.county_name || 'Navarro'} County, Texas. Discover youth leagues, high school teams, and recreational sports.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-emerald-600" />
                Local Sports Teams
              </h1>
              <p className="text-gray-600 mt-2">Support your local teams and find games to watch</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("MySportsTeams"))}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manage Teams
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="teams"
        />

        {/* Filters */}
        <Card className="border-2 border-emerald-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sports.map(sport => (
                    <SelectItem key={sport.value} value={sport.value}>{sport.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
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

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={sportFilter === "football" ? "default" : "outline"}
            size="sm"
            onClick={() => setSportFilter(sportFilter === "football" ? "all" : "football")}
          >
            Football
          </Button>
          <Button
            variant={sportFilter === "basketball" ? "default" : "outline"}
            size="sm"
            onClick={() => setSportFilter(sportFilter === "basketball" ? "all" : "basketball")}
          >
            Basketball
          </Button>
          <Button
            variant={sportFilter === "baseball" ? "default" : "outline"}
            size="sm"
            onClick={() => setSportFilter(sportFilter === "baseball" ? "all" : "baseball")}
          >
            Baseball
          </Button>
          <Button
            variant={sportFilter === "soccer" ? "default" : "outline"}
            size="sm"
            onClick={() => setSportFilter(sportFilter === "soccer" ? "all" : "soccer")}
          >
            Soccer
          </Button>
          <Button
            variant={levelFilter === "high_school" ? "default" : "outline"}
            size="sm"
            onClick={() => setLevelFilter(levelFilter === "high_school" ? "all" : "high_school")}
          >
            <School className="w-4 h-4 mr-1" />
            High School
          </Button>
          <Button
            variant={levelFilter === "youth" ? "default" : "outline"}
            size="sm"
            onClick={() => setLevelFilter(levelFilter === "youth" ? "all" : "youth")}
          >
            <Users className="w-4 h-4 mr-1" />
            Youth
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.length === 0 ? (
            <div className="col-span-3">
              <Card className="border-2 border-emerald-100">
                <CardContent className="p-12 text-center">
                  <Trophy className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No teams found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  {user && (
                    <Button
                      onClick={() => navigate(createPageUrl("AddSportsTeam"))}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add a Team
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredTeams.map(team => (
              <Card
                key={team.id}
                className="border-2 border-emerald-100 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(createPageUrl(`SportsTeamDetail?id=${team.id}`))}
              >
                {team.logo_url && (
                  <div className="h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={team.logo_url}
                      alt={team.name}
                      className="max-h-full max-w-full object-contain p-4"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-emerald-100 text-emerald-800">
                      {getSportLabel(team.sport)}
                    </Badge>
                    <Badge className={getLevelColor(team.level)}>
                      {getLevelLabel(team.level)}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{team.name}</h3>

                  {team.organization && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <School className="w-4 h-4" />
                      {team.organization}
                    </p>
                  )}

                  {team.town && (
                    <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {team.town}
                    </p>
                  )}

                  {team.season && (
                    <p className="text-xs text-gray-500">
                      Season: {team.season}
                    </p>
                  )}

                  {team.age_group && (
                    <p className="text-xs text-gray-500">
                      Age Group: {team.age_group}
                    </p>
                  )}

                  {team.record && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-sm">
                        Record: {team.record}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
}
