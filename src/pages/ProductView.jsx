import React, { useState, useEffect } from "react";
import { Product, Store, Brand, Cart, Wishlist, WishlistCollection } from "@/api/entities";
import { User } from "@/api/entities";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createStoreUrl, createProductUrl } from "@/components/utils/slugUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Store as StoreIcon,
  MapPin,
  Tag,
  Package,
  Download,
  Key,
  Video,
  Music,
  Star,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Plus,
  Minus
} from "lucide-react";
import JsonLdSchema from "../components/seo/JsonLdSchema";
import MetaTags from "../components/seo/MetaTags";

export default function ProductView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(location.search);

  const storeSlug = urlParams.get('store');
  const productSlug = urlParams.get('product');

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [collections, setCollections] = useState([]);
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (storeSlug && productSlug) {
      loadProduct();
    }
  }, [storeSlug, productSlug]);

  const loadProduct = async () => {
    setLoading(true);
    // Reset cart quantity when loading new product
    setCurrentCartQuantity(0);
    try {
      // Load user and check authentication
      let userData = null;
      try {
        userData = await User.me();
        setUser(userData);
      } catch (err) {
        console.log("User not authenticated");
      }

      // Find store by slug
      const stores = await Store.list();
      const storeData = stores.find(s => s.slug === storeSlug);

      if (!storeData) {
        setProduct(null);
        setStore(null);
        setLoading(false);
        return;
      }

      // Find product by slug and store
      const productsInStore = await Product.filter({ store_id: storeData.id });
      const prod = productsInStore.find(p => p.slug === productSlug);

      if (prod) {
        setProduct(prod);
        setStore(storeData);

        if (prod.brand_id) {
          const brands = await Brand.list();
          const br = brands.find(b => b.id === prod.brand_id);
          setBrand(br);
        }

        // Check if product is in wishlist and cart
        if (userData) {
          const wishlistItems = await Wishlist.filter({
            user_email: userData.email,
            product_id: prod.id
          });
          if (wishlistItems.length > 0) {
            setIsInWishlist(true);
            setWishlistItemId(wishlistItems[0].id);
          } else {
            setIsInWishlist(false);
            setWishlistItemId(null);
          }

          // Load collections
          const userCollections = await WishlistCollection.filter({ user_email: userData.email });
          setCollections(userCollections.sort((a, b) => a.order - b.order));

          // Check current cart quantity for this product
          const cartItems = await Cart.filter({
            user_email: userData.email,
            product_id: prod.id
          });
          const cartQty = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
          setCurrentCartQuantity(cartQty);
        }
      } else {
        setProduct(null);
        setStore(storeData);
      }
    } catch (error) {
      console.error("Failed to load product details:", error);
      setProduct(null);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    // Prevent concurrent additions
    if (isAddingToCart) {
      console.log("Already adding to cart, preventing duplicate request");
      return;
    }

    setAdding(true);
    setIsAddingToCart(true);

    try {
      const user = await User.me();

      // Get FRESH cart items for this product (don't rely on state)
      const cartItems = await Cart.filter({
        user_email: user.email,
        product_id: product.id
      });
      const currentCartQty = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

      console.log(`Stock check: stock=${product.stock_quantity}, currentInCart=${currentCartQty}, tryingToAdd=${quantity}`);

      // Check stock availability with fresh data
      if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
        const newTotal = currentCartQty + quantity;

        if (newTotal > product.stock_quantity) {
          const canAdd = Math.max(0, product.stock_quantity - currentCartQty);
          toast({
            title: "Insufficient stock",
            description: canAdd > 0
              ? `Only ${canAdd} more can be added. You have ${currentCartQty} in cart.`
              : `You already have all ${product.stock_quantity} available in your cart.`,
            variant: "destructive",
          });
          setAdding(false);
          setIsAddingToCart(false);
          return;
        }

        if (product.stock_quantity <= 0) {
          toast({
            title: "Out of stock",
            description: "This item is currently out of stock.",
            variant: "destructive",
          });
          setAdding(false);
          setIsAddingToCart(false);
          return;
        }
      }

      // If item already exists in cart, update the quantity
      if (cartItems.length > 0) {
        const existingItem = cartItems[0];
        const newQty = existingItem.quantity + quantity;

        // Double-check before updating
        if (product.stock_quantity !== undefined && newQty > product.stock_quantity) {
          toast({
            title: "Cannot add",
            description: `Would exceed stock limit of ${product.stock_quantity}.`,
            variant: "destructive",
          });
          setAdding(false);
          setIsAddingToCart(false);
          return;
        }

        await Cart.update(existingItem.id, {
          quantity: newQty
        });
      } else {
        // Create new cart item
        await Cart.create({
          user_email: user.email,
          product_id: product.id,
          quantity: quantity,
          price_at_add: product.price
        });
      }

      // Dispatch event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));

      // Update current cart quantity state
      setCurrentCartQuantity(currentCartQty + quantity);

      // Show success toast
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart.`,
      });

      // Reset quantity to 1 after adding
      setQuantity(1);
    } catch (error) {
      if (error.message?.includes('not authenticated')) {
        await User.login();
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart.",
          variant: "destructive",
        });
      }
    } finally {
      setAdding(false);
      setIsAddingToCart(false);
    }
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      await User.login();
      return;
    }

    if (isInWishlist && wishlistItemId) {
      // Remove from wishlist
      await Wishlist.delete(wishlistItemId);
      setIsInWishlist(false);
      setWishlistItemId(null);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      // Show dialog to select collection if collections exist
      if (collections.length > 0) {
        setShowAddToListDialog(true);
      } else {
        // Add directly to uncategorized
        await addToWishlistWithCollection(null);
      }
    }
  };

  const addToWishlistWithCollection = async (collectionId) => {
    try {
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
        product_id: product.id
      };

      // Only include collection_id if it's not null
      if (finalCollectionId) {
        wishlistData.collection_id = finalCollectionId;
      }

      const newItem = await Wishlist.create(wishlistData);

      if (!newItem || !newItem.id) {
        throw new Error("Failed to create wishlist item");
      }

      setIsInWishlist(true);
      setWishlistItemId(newItem.id);
      setShowAddToListDialog(false);
      setSelectedCollectionId(null);
      setIsCreatingNewList(false);
      setNewListName("");

      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to ${collectionName}.`,
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

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <p className="text-gray-600">Loading product...</p>
    </div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-600">Product not found</p>
      </div>
    </div>;
  }

  const conditionColors = {
    new: "bg-green-100 text-green-800",
    like_new: "bg-blue-100 text-blue-800",
    good: "bg-yellow-100 text-yellow-800",
    fair: "bg-orange-100 text-orange-800",
    for_parts: "bg-red-100 text-red-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <MetaTags
        title={product.name}
        description={product.description || `${product.name} - Available at ${store?.name}`}
        image={product.images?.[0]}
        type="product"
        price={product.price}
        availability={product.is_available ? "in stock" : "out of stock"}
      />
      <JsonLdSchema
        type="product"
        data={{
          ...product,
          store_name: store?.name,
          brand_name: brand?.name
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to={createPageUrl("Marketplace")}>
            <Button variant="outline" className="border-orange-200">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="border-2 border-orange-100 overflow-hidden">
              <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 aspect-square">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white shadow-lg"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white shadow-lg"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {product.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex ? 'bg-orange-600 w-6' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-orange-200" />
                  </div>
                )}
                {product.is_promoted && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-orange-500' : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={isInWishlist ? "border-red-300" : ""}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={shareProduct}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={conditionColors[product.condition]}>
                  {product.condition.replace(/_/g, ' ')}
                </Badge>
                <Badge variant="outline" className="border-orange-200">
                  {product.category.replace(/_/g, ' ')}
                </Badge>
                {product.product_type !== 'physical' && (
                  <Badge className="bg-purple-100 text-purple-800">
                    {product.product_type === 'digital' ? (
                      <><Download className="w-3 h-3 mr-1" /> Digital Download</>
                    ) : (
                      <><Key className="w-3 h-3 mr-1" /> License Key</>
                    )}
                  </Badge>
                )}
              </div>

              {brand && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>Brand:</span>
                  <span className="font-medium text-gray-900">{brand.name}</span>
                </div>
              )}

              <div className="text-4xl font-bold text-orange-600 mb-6">
                ${product.price.toFixed(2)}
              </div>

              {product.stock_quantity !== undefined && (
                <div className="text-sm text-gray-600 mb-6">
                  {product.stock_quantity > 0 ? (
                    <>
                      <span className="text-green-600 font-medium">{product.stock_quantity} in stock</span>
                      {currentCartQuantity > 0 && (
                        <span className="text-gray-500 ml-2">({currentCartQuantity} in cart, {product.stock_quantity - currentCartQuantity} available)</span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 border-orange-200 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || adding}
                        className="px-4 py-2 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                      >
                        <Minus className="w-5 h-5 text-gray-700" />
                      </button>
                      <span className="px-6 py-2 font-semibold text-lg min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={() => {
                          const availableToAdd = product.stock_quantity !== undefined
                            ? Math.max(0, product.stock_quantity - currentCartQuantity)
                            : 999;
                          const maxQuantity = Math.min(availableToAdd, 999);
                          setQuantity(Math.min(maxQuantity, quantity + 1));
                        }}
                        disabled={adding || (product.stock_quantity !== undefined && quantity >= (product.stock_quantity - currentCartQuantity))}
                        className="px-4 py-2 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                      >
                        <Plus className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={addToCart}
                  disabled={adding || !product.is_available || (product.stock_quantity !== undefined && (product.stock_quantity <= 0 || currentCartQuantity >= product.stock_quantity))}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 h-12 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {adding ? "Adding..." :
                   (product.stock_quantity !== undefined && product.stock_quantity <= 0) ? "Out of Stock" :
                   (product.stock_quantity !== undefined && currentCartQuantity >= product.stock_quantity) ? "All in Cart" :
                   "Add to Cart"}
                </Button>
              </div>
            </div>

            {/* Store Info */}
            {store && (
              <Card className="border-2 border-orange-100 bg-orange-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {store.logo_url ? (
                      <img src={store.logo_url} alt={store.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-lg flex items-center justify-center">
                        <StoreIcon className="w-8 h-8 text-orange-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <a href={createStoreUrl(store.slug)}>
                        <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                          {store.name}
                        </h3>
                      </a>
                      {store.location && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {store.location}
                        </p>
                      )}
                      {store.contact_phone && (
                        <p className="text-sm text-gray-600 mt-1">
                          📞 {store.contact_phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="border-orange-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="border-2 border-orange-100">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-orange-100 bg-orange-50/50 rounded-none p-0">
              <TabsTrigger value="description" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                Description
              </TabsTrigger>
              {product.video_url && (
                <TabsTrigger value="video" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </TabsTrigger>
              )}
              {product.audio_url && (
                <TabsTrigger value="audio" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  <Music className="w-4 h-4 mr-2" />
                  Audio
                </TabsTrigger>
              )}
              {(product.location_lat && product.location_lng) && (
                <TabsTrigger value="location" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description || "No description available."}
                </p>
              </div>
              {product.custom_fields && Object.keys(product.custom_fields).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(product.custom_fields).map(([key, value]) => (
                      <div key={key} className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">{key}</div>
                        <div className="font-medium text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {product.video_url && (
              <TabsContent value="video" className="p-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video controls className="w-full h-full" src={product.video_url}>
                    Your browser does not support the video tag.
                  </video>
                </div>
              </TabsContent>
            )}

            {product.audio_url && (
              <TabsContent value="audio" className="p-6">
                <div className="bg-orange-50 p-8 rounded-lg flex items-center justify-center">
                  <audio controls className="w-full max-w-md" src={product.audio_url}>
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              </TabsContent>
            )}

            {(product.location_lat && product.location_lng) && (
              <TabsContent value="location" className="p-6">
                <div className="bg-orange-50 p-8 rounded-lg text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                  <p className="text-gray-700">
                    Product location: {product.location_lat.toFixed(6)}, {product.location_lng.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Map integration coming soon
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </div>

      {/* Add to List Dialog */}
      <Dialog open={showAddToListDialog} onOpenChange={(open) => {
        setShowAddToListDialog(open);
        if (!open) {
          setIsCreatingNewList(false);
          setNewListName("");
          setSelectedCollectionId(null);
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
  );
}