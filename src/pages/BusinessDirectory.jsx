import React, { useState, useEffect } from "react";
import { Store, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import LocationFilter from "@/components/LocationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Store as StoreIcon,
  Filter,
  Star,
  MapPin,
  Building2
} from "lucide-react";

export default function BusinessDirectory() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { state: filterState } = useLocationFilter();
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    loadBusinessDirectory();
  }, []);

  const loadBusinessDirectory = async () => {
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
    } catch (error) {
      console.log("User not authenticated");
    }

    const allStores = await Store.filter({ is_active: true });
    setStores(allStores);

    setLoading(false);
  };

  const searchFiltered = stores.filter(store => {
    const matchesSearch = !searchTerm ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredStores = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (store) => store.town_id
  );

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "retail", label: "Retail Store" },
    { value: "food_beverage", label: "Food & Beverage" },
    { value: "services", label: "Professional Services" },
    { value: "home_services", label: "Home Services" },
    { value: "automotive", label: "Automotive Services" },
    { value: "health_beauty", label: "Health & Beauty" },
    { value: "business_services", label: "Business Services" },
    { value: "technology", label: "Technology & IT" },
    { value: "education", label: "Education & Training" },
    { value: "construction", label: "Construction & Trades" },
    { value: "creative", label: "Creative & Design" },
    { value: "legal_financial", label: "Legal & Financial" },
    { value: "hospitality", label: "Hospitality & Events" },
    { value: "healthcare", label: "Healthcare" },
    { value: "real_estate", label: "Real Estate" },
    { value: "home_garden", label: "Home & Garden" },
    { value: "sports_fitness", label: "Sports & Fitness" },
    { value: "transportation", label: "Transportation & Logistics" },
    { value: "other", label: "Other" }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Building2 className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Business Directory - ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find local businesses in ${settings.county_name || 'Navarro'} County, Texas. Browse the complete business directory.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Business Directory
                </h1>
              </div>
              <p className="text-gray-600">
                Discover local businesses in your community
              </p>
            </div>
            <Button
              onClick={async () => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', createPageUrl("AddStore"));
                  await User.login();
                  return;
                }
                navigate(createPageUrl("AddStore"));
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Add Your Business
            </Button>
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="businesses"
        />

        {/* Search and Filter */}
        <Card className="border-2 border-orange-100 mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredStores.length}</span> {filteredStores.length === 1 ? 'business' : 'businesses'}
          </p>
        </div>

        {/* Business Grid */}
        {filteredStores.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <Building2 className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No businesses found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => {
              const slug = store.slug ||
                (store.name ? store.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : store.id);
              const storeUrl = `/StoreView?store=${slug}`;

              return (
                <a key={store.id} href={storeUrl}>
                  <Card className="border-2 border-orange-100 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                    <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                      {store.banner_url ? (
                        <img
                          src={store.banner_url}
                          alt={store.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-orange-300" />
                        </div>
                      )}
                      {store.logo_url && (
                        <div className="absolute bottom-4 left-4 w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                          <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {store.is_verified && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {store.name}
                      </h3>
                      {store.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {store.description}
                        </p>
                      )}
                      {store.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          <span className="truncate">{store.location}</span>
                        </div>
                      )}
                      {store.category && (
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          {store.category.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
