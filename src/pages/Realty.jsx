import React, { useState, useEffect } from "react";
import { RealtyListing, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, MapPin, Plus, Bed, Bath, Square, DollarSign } from "lucide-react";
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Realty() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { state: filterState } = useLocationFilter();
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
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

      const allListings = await RealtyListing.filter({ status: "active" }, '-created_date');
      setListings(allListings);

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading listings:", error);
    }
    setLoading(false);
  };

  const searchFiltered = listings.filter(listing => {
    const matchesSearch = !searchTerm ||
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" ||
      listing.listing_type === typeFilter;

    let matchesPrice = true;
    if (priceFilter !== "all" && listing.price) {
      const price = listing.price;
      switch (priceFilter) {
        case "under100k": matchesPrice = price < 100000; break;
        case "100k-200k": matchesPrice = price >= 100000 && price < 200000; break;
        case "200k-300k": matchesPrice = price >= 200000 && price < 300000; break;
        case "300k-500k": matchesPrice = price >= 300000 && price < 500000; break;
        case "500k+": matchesPrice = price >= 500000; break;
      }
    }

    return matchesSearch && matchesType && matchesPrice;
  });

  const filteredListings = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const listingTypes = [
    { value: "all", label: "All Types" },
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" }
  ];

  const priceRanges = [
    { value: "all", label: "Any Price" },
    { value: "under100k", label: "Under $100K" },
    { value: "100k-200k", label: "$100K - $200K" },
    { value: "200k-300k", label: "$200K - $300K" },
    { value: "300k-500k", label: "$300K - $500K" },
    { value: "500k+", label: "$500K+" }
  ];

  const formatPrice = (price, listingType) => {
    if (!price) return "Contact for price";
    if (listingType === "rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getTypeColor = (type) => {
    const colors = {
      sale: "bg-green-100 text-green-800",
      rent: "bg-blue-100 text-blue-800",
      land: "bg-amber-100 text-amber-800",
      commercial: "bg-purple-100 text-purple-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type) => {
    const labels = {
      sale: "For Sale",
      rent: "For Rent",
      land: "Land",
      commercial: "Commercial"
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <Home className="w-12 h-12 text-green-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Real Estate in ${settings.county_name || 'Navarro'} County - Homes for Sale & Rent`}
        description={`Find homes for sale, rentals, and land in ${settings.county_name || 'Navarro'} County, Texas. Browse local real estate listings in Corsicana and surrounding areas.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Home className="w-8 h-8 text-green-600" />
                  Real Estate
                </h1>
                <p className="text-gray-600 mt-2">Find homes for sale, rentals, and land in {settings.county_name || 'Navarro'} County</p>
              </div>
              {user && (
                <Button
                  onClick={() => navigate(createPageUrl("AddRealtyListing"))}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List Property
                </Button>
              )}
            </div>
          </div>

          {/* Location Filter */}
          <LocationFilter
            userTown={userTown}
            towns={towns}
            itemName="listings"
          />

          {/* Filters */}
          <Card className="border-2 border-green-100 mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search listings..."
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
                    {listingTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Listings Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.length === 0 ? (
              <div className="col-span-3">
                <Card className="border-2 border-green-100">
                  <CardContent className="p-12 text-center">
                    <Home className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No listings available</h3>
                    <p className="text-gray-600 mb-4">Check back soon for new real estate listings in {settings.county_name || 'Navarro'} County.</p>
                    {user && (
                      <Button
                        onClick={() => navigate(createPageUrl("AddRealtyListing"))}
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        List Your Property
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredListings.map(listing => (
                <Card
                  key={listing.id}
                  className="border-2 border-green-100 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => navigate(createPageUrl(`RealtyDetail?id=${listing.id}`))}
                >
                  {listing.image_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!listing.image_url && (
                    <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <Home className="w-16 h-16 text-green-300" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getTypeColor(listing.listing_type)}>
                        {getTypeLabel(listing.listing_type)}
                      </Badge>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(listing.price, listing.listing_type)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">{listing.title}</h3>

                    {(listing.address || listing.city || listing.town) && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {listing.address}
                        {listing.address && (listing.city || listing.town) && ', '}
                        {listing.city || listing.town}
                        {(listing.city || listing.town) && ', '}
                        {listing.state || 'TX'}
                        {listing.zip_code && ` ${listing.zip_code}`}
                      </p>
                    )}

                    {/* Property Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {listing.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {listing.bedrooms} bed
                        </span>
                      )}
                      {listing.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {listing.bathrooms} bath
                        </span>
                      )}
                      {listing.square_feet && (
                        <span className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          {listing.square_feet.toLocaleString()} sqft
                        </span>
                      )}
                    </div>
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
