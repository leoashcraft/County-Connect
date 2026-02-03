
import React, { useState, useEffect } from "react";
import { Service, Store, Wishlist, WishlistCollection, Town } from "@/api/entities";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import LocationFilter from "@/components/LocationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Briefcase,
  Filter,
  Heart,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  MessageSquare,
  Store as StoreIcon
} from "lucide-react";

export default function ServiceDirectory() {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceWishlist, setServiceWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const { state: filterState } = useLocationFilter();
  const [towns, setTowns] = useState([]);

  // Wishlist collections
  const [collections, setCollections] = useState([]);
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [addingItemId, setAddingItemId] = useState(null);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    loadServiceDirectory();
  }, []);

  const loadServiceDirectory = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load user's preferred town if they have one
      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
      }

      // Load all towns for the filter modal
      const allTowns = await Town.list('name');
      setTowns(allTowns);

      const userWishlist = await Wishlist.filter({ user_email: userData.email });
      setServiceWishlist(userWishlist.filter(w => w.service_id).map(w => w.service_id));

      // Load collections
      const userCollections = await WishlistCollection.filter({ user_email: userData.email });
      setCollections(userCollections.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.log("User not authenticated");
    }

    const [allServices, allStores] = await Promise.all([
      Service.filter({ is_available: true }),
      Store.filter({ is_active: true })
    ]);

    setServices(allServices);

    // Create store-to-town mapping for service location filtering
    window.storeTownMap = window.storeTownMap || {};
    allStores.forEach(store => {
      if (store.town_id) {
        window.storeTownMap[store.id] = store.town_id;
      }
    });

    // Store stores in window for service detail lookup
    window.storesCache = allStores;

    setLoading(false);
  };

  const handleServiceWishlistToggle = async (serviceId) => {
    if (!user) {
      await User.login();
      return;
    }

    if (serviceWishlist.includes(serviceId)) {
      const items = await Wishlist.filter({ user_email: user.email, service_id: serviceId });
      if (items.length > 0) {
        await Wishlist.delete(items[0].id);
        setServiceWishlist(serviceWishlist.filter(id => id !== serviceId));
        toast({
          title: "Removed from wishlist",
          description: "Service has been removed from your wishlist.",
        });
      }
    } else {
      // Show dialog to select collection if collections exist
      if (collections.length > 0) {
        setAddingItemId(serviceId);
        setShowAddToListDialog(true);
      } else {
        // Add directly to uncategorized
        setAddingItemId(serviceId);
        await addToWishlistWithCollection(null);
      }
    }
  };

  const addToWishlistWithCollection = async (collectionId) => {
    try {
      const serviceId = addingItemId;
      let finalCollectionId = collectionId;
      let collectionName = "Uncategorized";

      // If creating a new list, create it first
      if (isCreatingNewList) {
        if (!newListName.trim()) {
          throw new Error("Please enter a list name");
        }

        const newCollection = await WishlistCollection.create({
          user_email: user.email,
          name: newListName.trim(),
          order: collections.length
        });

        if (!newCollection || !newCollection.id) {
          throw new Error("Failed to create collection");
        }

        finalCollectionId = newCollection.id;
        collectionName = newCollection.name;

        // Update collections list
        setCollections([...collections, newCollection]);
      } else if (finalCollectionId) {
        collectionName = collections.find(c => c.id === finalCollectionId)?.name || "Uncategorized";
      }

      const wishlistData = {
        user_email: user.email,
        service_id: serviceId
      };

      // Only include collection_id if it's not null
      if (finalCollectionId) {
        wishlistData.collection_id = finalCollectionId;
      }

      const newItem = await Wishlist.create(wishlistData);

      if (!newItem || !newItem.id) {
        throw new Error("Failed to create wishlist item");
      }

      setServiceWishlist([...serviceWishlist, serviceId]);

      setShowAddToListDialog(false);
      setSelectedCollectionId(null);
      setAddingItemId(null);
      setIsCreatingNewList(false);
      setNewListName("");

      toast({
        title: "Added to wishlist",
        description: `Service has been added to ${collectionName}.`,
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add service to wishlist.",
        variant: "destructive",
      });
    }
  };

  // Filter services
  const searchAndCategoryFiltered = services.filter(service => {
    const matchesSearch = !searchTerm ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;

    const matchesPrice = (!priceRange.min || service.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || service.price <= parseFloat(priceRange.max));

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Apply location filter - services belong to stores, so use custom getTownId function
  const filteredServices = applyLocationFilter(
    searchAndCategoryFiltered,
    filterState,
    userTown,
    (service) => service.store_id ? window.storeTownMap?.[service.store_id] : null
  );

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch(sortBy) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "name_asc": return a.name.localeCompare(b.name);
      case "name_desc": return b.name.localeCompare(a.name);
      case "-created_date": return new Date(b.created_date) - new Date(a.created_date);
      default: return 0;
    }
  });

  const serviceCategories = [
    { value: "all", label: "All Categories" },
    { value: "home_repair", label: "Home Repair" },
    { value: "cleaning", label: "Cleaning" },
    { value: "landscaping", label: "Landscaping" },
    { value: "tutoring", label: "Tutoring" },
    { value: "pet_care", label: "Pet Care" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty_wellness", label: "Beauty & Wellness" },
    { value: "photography", label: "Photography" },
    { value: "catering", label: "Catering" },
    { value: "event_planning", label: "Event Planning" },
    { value: "tech_support", label: "Tech Support" },
    { value: "handyman", label: "Handyman" },
    { value: "moving", label: "Moving" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-orange-600 animate-pulse" />
        <p className="text-gray-600">Loading service directory...</p>
      </div>
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Services Directory in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find local services in ${settings.county_name || 'Navarro'} County, Texas. Home services, professional services, and more.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-orange-600" />
                Services & Rentals
              </h1>
              <p className="text-gray-600 mt-2">Find local services and rentals in your community</p>
            </div>
            <Button
              onClick={async () => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', createPageUrl("AddService"));
                  await User.login();
                  return;
                }
                window.location.href = createPageUrl("AddService");
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Post a Service or Rental
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for local services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-4 py-6 text-lg border-2 border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="services"
        />

        {/* Services Section */}
        <div className="mt-8">
        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">Filters</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min $"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Max $"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-created_date">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name: A to Z</SelectItem>
                  <SelectItem value="name_desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange({ min: "", max: "" });
                  setSortBy("-created_date");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        {sortedServices.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No services found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedServices.map(service => {
                const store = window.storesCache?.find(s => s.id === service.store_id);
                const serviceUrl = store?.slug && service.slug
                  ? `/ServiceView?store=${store.slug}&service=${service.slug}`
                  : null;

                const priceDisplay = service.price_type === 'hourly' ? `$${service.price.toFixed(2)}/hr` :
                                   service.price_type === 'per_project' ? `Starting at $${service.price.toFixed(2)}` :
                                   service.price_type === 'negotiable' ? 'Request Quote' :
                                   `$${service.price.toFixed(2)}`;

                return (
                  <div key={service.id} className="relative">
                    <Link
                      to={serviceUrl || '#'}
                      className={serviceUrl ? '' : 'pointer-events-none'}
                    >
                      <Card className="border-2 border-orange-100 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                          {service.image_url ? (
                            <img
                              src={service.image_url}
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Briefcase className="w-16 h-16 text-orange-300" />
                            </div>
                          )}
                          {service.is_available ? (
                            <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                              Available
                            </Badge>
                          ) : (
                            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                              Unavailable
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <div className="mb-3">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                              {service.name}
                            </h3>
                            {store && (
                              <p className="text-sm text-gray-500">by {store.name}</p>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {service.description || "Professional service available in your area"}
                          </p>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-orange-600" />
                                <span className="text-lg font-bold text-orange-600">
                                  {priceDisplay}
                                </span>
                              </div>
                              <Badge variant="outline" className="border-orange-200 text-orange-700">
                                {service.category.replace(/_/g, ' ')}
                              </Badge>
                            </div>

                            {service.availability && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <span>{service.availability}</span>
                              </div>
                            )}

                            {store?.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-orange-600" />
                                <span className="truncate">{store.location}</span>
                              </div>
                            )}

                            {service.rating && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold">{service.rating.toFixed(1)}</span>
                                </div>
                                {service.review_count && (
                                  <span className="text-sm text-gray-500">
                                    ({service.review_count} review{service.review_count !== 1 ? 's' : ''})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                            onClick={(e) => {
                              e.preventDefault();
                              if (serviceUrl) {
                                window.location.href = serviceUrl;
                              }
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Request Quote
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleServiceWishlistToggle(service.id);
                      }}
                      className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${serviceWishlist.includes(service.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
        </div>
      </div>

      {/* Add to List Dialog */}
      <Dialog open={showAddToListDialog} onOpenChange={(open) => {
        setShowAddToListDialog(open);
        if (!open) {
          setIsCreatingNewList(false);
          setNewListName("");
          setSelectedCollectionId(null);
          setAddingItemId(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Wishlist</DialogTitle>
            <DialogDescription>
              {isCreatingNewList ? "Create a new list for this service." : "Choose a list for this service or add it to Uncategorized."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isCreatingNewList ? (
              <>
                <Select value={selectedCollectionId || "uncategorized"} onValueChange={(value) => setSelectedCollectionId(value === "uncategorized" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    {collections.map(collection => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingNewList(true)}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New List
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="new-list-name">List Name</Label>
                <Input
                  id="new-list-name"
                  placeholder="e.g., Home Projects, Future Services"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newListName.trim()) {
                      addToWishlistWithCollection(null);
                    }
                  }}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreatingNewList(false);
                    setNewListName("");
                  }}
                  className="text-sm"
                >
                  Back to list selection
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddToListDialog(false);
                  setSelectedCollectionId(null);
                  setAddingItemId(null);
                  setIsCreatingNewList(false);
                  setNewListName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => addToWishlistWithCollection(selectedCollectionId)}
                disabled={isCreatingNewList && !newListName.trim()}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                {isCreatingNewList ? "Create & Add" : "Add to List"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
