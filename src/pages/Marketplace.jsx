
import React, { useState, useEffect } from "react";
import { Product, Store, Brand, Wishlist, WishlistCollection, Town } from "@/api/entities";
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
  Store as StoreIcon,
  Package,
  Filter,
  Heart,
  Star,
  MapPin,
  TrendingUp,
  Plus,
  ShoppingBag
} from "lucide-react";
import ProductCard from "../components/marketplace/ProductCard";

export default function Marketplace() {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const { state: filterState} = useLocationFilter();
  const [towns, setTowns] = useState([]);

  // Wishlist collections
  const [collections, setCollections] = useState([]);
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [addingItemId, setAddingItemId] = useState(null);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    loadMarketplace();
  }, []);

  const loadMarketplace = async () => {
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
      setWishlist(userWishlist.filter(w => w.product_id).map(w => w.product_id));

      // Load collections
      const userCollections = await WishlistCollection.filter({ user_email: userData.email });
      setCollections(userCollections.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.log("User not authenticated");
    }

    const [allProducts, allBrands, allStores] = await Promise.all([
      Product.filter({ status: "active" }, "-created_date"),
      Brand.filter({ is_active: true }),
      Store.filter({ is_active: true })
    ]);

    setProducts(allProducts);

    const brandsMap = {};
    allBrands.forEach(b => brandsMap[b.id] = b);
    setBrands(brandsMap);

    // Create store-to-town mapping for product location filtering
    window.storeTownMap = {};
    allStores.forEach(store => {
      if (store.town_id) {
        window.storeTownMap[store.id] = store.town_id;
      }
    });

    setLoading(false);
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      await User.login();
      return;
    }

    if (wishlist.includes(productId)) {
      const items = await Wishlist.filter({ user_email: user.email, product_id: productId });
      if (items.length > 0) {
        await Wishlist.delete(items[0].id);
        setWishlist(wishlist.filter(id => id !== productId));
        toast({
          title: "Removed from wishlist",
          description: "Product has been removed from your wishlist.",
        });
      }
    } else {
      // Show dialog to select collection if collections exist
      if (collections.length > 0) {
        setAddingItemId(productId);
        setShowAddToListDialog(true);
      } else {
        // Add directly to uncategorized
        await addToWishlistWithCollection(null);
      }
    }
  };

  const addToWishlistWithCollection = async (collectionId) => {
    try {
      const itemId = addingItemId;
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
        product_id: itemId
      };

      // Only include collection_id if it's not null
      if (finalCollectionId) {
        wishlistData.collection_id = finalCollectionId;
      }

      const newItem = await Wishlist.create(wishlistData);

      if (!newItem || !newItem.id) {
        throw new Error("Failed to create wishlist item");
      }

      setWishlist([...wishlist, itemId]);

      setShowAddToListDialog(false);
      setSelectedCollectionId(null);
      setAddingItemId(null);
      setIsCreatingNewList(false);
      setNewListName("");

      toast({
        title: "Added to wishlist",
        description: `Item has been added to ${collectionName}.`,
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to wishlist.",
        variant: "destructive",
      });
    }
  };

  // Filter products
  const searchAndCategoryFiltered = products.filter(product => {
    const matchesSearch = !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesCondition = selectedCondition === "all" || product.condition === selectedCondition;
    const matchesBrand = selectedBrand === "all" || product.brand_id === selectedBrand;

    const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseFloat(priceRange.max));

    return matchesSearch && matchesCategory && matchesCondition && matchesBrand && matchesPrice;
  });

  // Apply location filter - products belong to stores, so use custom getTownId function
  const filteredProducts = applyLocationFilter(
    searchAndCategoryFiltered,
    filterState,
    userTown,
    (product) => product.store_id ? window.storeTownMap?.[product.store_id] : null
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "name_asc": return a.name.localeCompare(b.name);
      case "name_desc": return b.name.localeCompare(a.name);
      case "-created_date": return new Date(b.created_date) - new Date(a.created_date);
      default: return 0;
    }
  });

  const productCategories = [
    { value: "all", label: "All Categories" },
    { value: "food", label: "Food" },
    { value: "beverages", label: "Beverages" },
    { value: "produce", label: "Produce" },
    { value: "baked_goods", label: "Baked Goods" },
    { value: "meat_fish", label: "Meat & Fish" },
    { value: "dairy", label: "Dairy" },
    { value: "crafts", label: "Crafts" },
    { value: "art", label: "Art" },
    { value: "furniture", label: "Furniture" },
    { value: "home_decor", label: "Home Decor" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "electronics", label: "Electronics" },
    { value: "books", label: "Books" },
    { value: "toys", label: "Toys" },
    { value: "sports_equipment", label: "Sports Equipment" },
    { value: "tools", label: "Tools" },
    { value: "plants", label: "Plants" },
    { value: "other", label: "Other" }
  ];

  const conditions = [
    { value: "all", label: "All Conditions" },
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "for_parts", label: "For Parts" }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-orange-600 animate-pulse" />
        <p className="text-gray-600">Loading products...</p>
      </div>
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Marketplace - Buy & Sell in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Buy and sell products in ${settings.county_name || 'Navarro'} County, Texas. Shop local businesses and find great deals.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-orange-600" />
                Products & Goods
              </h1>
              <p className="text-gray-600 mt-2">Discover and shop local products from your community</p>
            </div>
            <Button
              onClick={async () => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', createPageUrl("AddProduct"));
                  await User.login();
                  return;
                }
                window.location.href = createPageUrl("AddProduct");
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Post a Product or Good
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
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
          itemName="products"
        />

        {/* Products Section */}
        <div className="mt-8">
            {/* Filters */}
            <Card className="border-2 border-orange-100 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900">Filters</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(cond => (
                        <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {Object.values(brands).map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
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
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedCondition("all");
                      setSelectedBrand("all");
                      setPriceRange({ min: "", max: "" });
                      setSortBy("-created_date");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search term</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} onAddedToCart={loadMarketplace} />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWishlistToggle(product.id);
                      }}
                      className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              {isCreatingNewList ? "Create a new list for this item." : "Choose a list for this item or add it to Uncategorized."}
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
                  placeholder="e.g., Holiday Gifts, Future Purchases"
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
                  ← Back to list selection
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
    </div>
    </>
  );
}
