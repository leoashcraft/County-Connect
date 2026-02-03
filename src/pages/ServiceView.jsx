
import React, { useState, useEffect } from "react";
import { Service, Store, Wishlist, WishlistCollection } from "@/api/entities";
import { User } from "@/api/entities";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Briefcase,
  ArrowLeft,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Store as StoreIcon,
  Share2,
  Heart,
  Plus
} from "lucide-react";
import MetaTags from "../components/seo/MetaTags";
import JsonLdSchema from "../components/seo/JsonLdSchema";

export default function ServiceView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(location.search);
  const serviceSlug = urlParams.get('service');
  const storeSlug = urlParams.get('store');

  const [service, setService] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [collections, setCollections] = useState([]);
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    loadServiceData();
  }, [serviceSlug, storeSlug]);

  const loadServiceData = async () => {
    let userData = null;
    try {
      userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log("User not authenticated");
    }

    const [allServices, allStores] = await Promise.all([
      Service.list(),
      Store.list()
    ]);

    let foundStore = null;
    if (storeSlug) {
      foundStore = allStores.find(s => s.slug === storeSlug);
    }

    let foundService = null;
    if (serviceSlug && foundStore) {
      foundService = allServices.find(s => s.slug === serviceSlug && s.store_id === foundStore.id);
    }

    setService(foundService);
    setStore(foundStore);

    // Check if service is in wishlist
    if (userData && foundService) {
      const wishlistItems = await Wishlist.filter({
        user_email: userData.email,
        service_id: foundService.id
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
    }

    setLoading(false);
  };

  const handleContactStore = () => {
    if (!user) {
      User.login();
      return;
    }
    navigate(createPageUrl(`Messages?to=${store.created_by}`));
  };

  const shareService = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: service.description,
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
        description: `${service.name} has been removed from your wishlist.`,
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
        service_id: service.id
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
        description: `${service.name} has been added to ${collectionName}.`,
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

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Briefcase className="w-12 h-12 text-purple-600 animate-pulse" />
    </div>;
  }

  if (!service || !store) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-600 mb-4">Service not found</p>
        <Link to={createPageUrl("Marketplace")}>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
            Back to Marketplace
          </Button>
        </Link>
      </div>
    </div>;
  }

  const priceDisplay = service.price_type === 'hourly' ? `$${service.price.toFixed(2)}/hr` :
                       service.price_type === 'per_project' ? `$${service.price.toFixed(2)}/project` :
                       service.price_type === 'negotiable' ? 'Negotiable' :
                       `$${service.price.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <MetaTags
        title={service.name}
        description={service.description || `${service.name} - Professional service offered by ${store.name}`}
        image={service.image_url}
        type="service"
        price={service.price}
        availability={service.is_available ? "in_stock" : "out_of_stock"}
      />
      <JsonLdSchema
        type="service"
        data={{
          ...service,
          store_name: store.name
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to={createPageUrl(`StoreView?store=${store.slug}`)}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {store.name}
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Service Image */}
          <Card className="border-2 border-purple-200 overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-purple-50 to-pink-50">
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Briefcase className="w-32 h-32 text-purple-300" />
                </div>
              )}
            </div>
          </Card>

          {/* Service Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{service.name}</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlistToggle}
                  className={isInWishlist ? "border-red-300" : ""}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={shareService}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Link to={createPageUrl(`StoreView?store=${store.slug}`)}>
              <div className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-white rounded-lg border-2 border-purple-200 overflow-hidden flex-shrink-0">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <StoreIcon className="w-6 h-6 text-purple-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Offered by</p>
                  <p className="font-semibold text-gray-900">{store.name}</p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl font-bold text-purple-600">
                {priceDisplay}
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {service.category.replace(/_/g, ' ')}
              </Badge>
              {service.is_available ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
              )}
            </div>

            {service.availability && (
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>{service.availability}</span>
              </div>
            )}

            <Button
              onClick={handleContactStore}
              disabled={!service.is_available}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mb-6"
              size="lg"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Request Quote
            </Button>

            {/* Store Contact Info */}
            <Card className="border-2 border-purple-100">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-gray-900 mb-3">Contact Information</h3>
                {store.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    {store.location}
                  </div>
                )}
                {store.contact_phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-purple-600" />
                    {store.contact_phone}
                  </div>
                )}
                {store.contact_email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-purple-600" />
                    {store.contact_email}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Description */}
        {service.description && (
          <Card className="border-2 border-purple-200 mb-8">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">About This Service</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {service.description}
              </p>
            </CardContent>
          </Card>
        )}
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
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
