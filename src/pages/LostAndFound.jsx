import React, { useState, useEffect } from "react";
import { LostAndFound as LostAndFoundEntity, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, MapPin, Calendar, Award, Plus, Heart } from "lucide-react";
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function LostAndFound() {
  const navigate = useNavigate();
  const { state: filterState } = useLocationFilter();
  const { settings } = useSiteSettings();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      // Load user's preferred town if they have one
      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
      }

      // Load all towns for the filter modal
      const allTowns = await Town.list('name');
      setTowns(allTowns);

      const allItems = await LostAndFoundEntity.list('-created_date');
      setItems(allItems);
    } catch (error) {
      console.error("Error loading lost & found items:", error);
    }
    setLoading(false);
  };

  const searchFiltered = items.filter(item => {
    const matchesSearch = !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pet_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.breed?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredItems = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const types = [
    { value: "all", label: "All Types" },
    { value: "lost_pet", label: "Lost Pet" },
    { value: "found_pet", label: "Found Pet" },
    { value: "lost_item", label: "Lost Item" },
    { value: "found_item", label: "Found Item" }
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "reunited", label: "Reunited/Found" }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'lost_pet': return 'bg-red-100 text-red-800';
      case 'found_pet': return 'bg-green-100 text-green-800';
      case 'lost_item': return 'bg-orange-100 text-orange-800';
      case 'found_item': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      lost_pet: "Lost Pet",
      found_pet: "Found Pet",
      lost_item: "Lost Item",
      found_item: "Found Item"
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Lost & Found - ${settings.county_name || 'Navarro'} County, TX`}
        description={`Lost and found listings for ${settings.county_name || 'Navarro'} County, Texas. Report lost items or help reunite found items with their owners.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-orange-600" />
                Lost & Found
              </h1>
              <p className="text-gray-600 mt-2">Help reunite lost pets and items with their owners</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("AddLostAndFound"))}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Report Lost/Found
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="lost & found items"
        />

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search pets, items, breeds..."
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
                  {types.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-3">
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <Heart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No items found</h3>
                  <p className="text-gray-600">
                    {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Be the first to report a lost or found item"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredItems.map(item => (
              <Card
                key={item.id}
                className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => navigate(createPageUrl(`LostAndFoundDetail?id=${item.id}`))}
              >
                {item.photo_url && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={item.photo_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getTypeColor(item.type)}>
                      {getTypeLabel(item.type)}
                    </Badge>
                    {item.has_reward && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Award className="w-3 h-3 mr-1" />
                        Reward
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.pet_name || item.title}
                  </h3>

                  {item.breed && (
                    <p className="text-sm text-gray-600 mb-2">{item.breed}</p>
                  )}

                  {item.description && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.description}</p>
                  )}

                  <div className="space-y-1 text-xs text-gray-600">
                    {item.last_seen_location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.last_seen_location}
                      </div>
                    )}
                    {item.last_seen_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.last_seen_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {item.status === 'reunited' && (
                    <div className="mt-3 pt-3 border-t border-orange-100">
                      <Badge className="bg-green-100 text-green-800 w-full justify-center">
                        ✓ Reunited/Found
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
