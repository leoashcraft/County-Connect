
import React, { useState, useEffect } from "react";
import { Product, Store, Brand, Cart } from "@/api/entities";
import { User } from "@/api/entities";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createStoreUrl, createProductUrl } from "@/components/utils/slugUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
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
  Share2
} from "lucide-react";
import JsonLdSchema from "../components/seo/JsonLdSchema";
import MetaTags from "../components/seo/MetaTags";

export default function ProductDetail() {
  const { storeSlug, productSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (storeSlug && productSlug) {
      loadProduct();
    }
  }, [storeSlug, productSlug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
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
      } else {
        setProduct(null); // Product not found within this store
        setStore(storeData); // Still set store if found
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
    setAdding(true);
    try {
      const user = await User.me();
      await Cart.create({
        user_email: user.email,
        product_id: product.id,
        quantity: 1,
        price_at_add: product.price
      });
      // Dispatch event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));

      // Show success toast
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
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
    }
    setAdding(false);
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
                <Button variant="outline" size="icon" onClick={shareProduct}>
                  <Share2 className="w-4 h-4" />
                </Button>
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
                    <span className="text-green-600 font-medium">{product.stock_quantity} in stock</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={addToCart}
                  disabled={adding || !product.is_available}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 h-12 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {adding ? "Adding..." : "Add to Cart"}
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
    </div>
  );
}
