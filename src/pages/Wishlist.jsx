
import React, { useState, useEffect } from "react";
import { Wishlist as WishlistEntity, WishlistCollection, Product, Service, Store } from "@/api/entities";
import { User } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, ShoppingCart, Trash2, Package, Briefcase, MessageSquare, Plus, FolderHeart, MoreVertical, Edit, FolderOpen, AlertTriangle } from "lucide-react";
import { Cart } from "@/api/entities";
import { createProductUrl, createServiceUrl } from "@/components/utils/slugUtils";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState({});
  const [services, setServices] = useState({});
  const [stores, setStores] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollection, setEditingCollection] = useState(null);
  const [movingItem, setMovingItem] = useState(null);
  const [deletingCollection, setDeletingCollection] = useState(null);
  const [deleteAction, setDeleteAction] = useState('move'); // 'move' or 'delete'
  const [targetCollectionId, setTargetCollectionId] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load collections
      const userCollections = await WishlistCollection.filter({ user_email: userData.email });
      setCollections(userCollections.sort((a, b) => a.order - b.order));

      const items = await WishlistEntity.filter({ user_email: userData.email });
      setWishlistItems(items);

      // Load products
      const productIds = [...new Set(items.filter(i => i.product_id).map(item => item.product_id))];
      const allProducts = await Product.list();
      const productsMap = {};
      allProducts.forEach(p => {
        if (productIds.includes(p.id)) {
          productsMap[p.id] = p;
        }
      });
      setProducts(productsMap);

      // Load services
      const serviceIds = [...new Set(items.filter(i => i.service_id).map(item => item.service_id))];
      const allServices = await Service.list();
      const servicesMap = {};
      allServices.forEach(s => {
        if (serviceIds.includes(s.id)) {
          servicesMap[s.id] = s;
        }
      });
      setServices(servicesMap);

      // Load stores
      const productStoreIds = Object.values(productsMap).map(p => p.store_id);
      const serviceStoreIds = Object.values(servicesMap).map(s => s.store_id);
      const storeIds = [...new Set([...productStoreIds, ...serviceStoreIds])];
      const allStores = await Store.list();
      const storesMap = {};
      allStores.forEach(s => {
        if (storeIds.includes(s.id)) {
          storesMap[s.id] = s;
        }
      });
      setStores(storesMap);
    } catch (error) {
      navigate(createPageUrl("Marketplace"));
    }
    setLoading(false);
  };

  const removeFromWishlist = async (itemId) => {
    // Optimistically update UI
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));

    // Then delete from database
    try {
      await WishlistEntity.delete(itemId);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      // Reload on error to get correct state
      await loadWishlist();
    }
  };

  const addToCart = async (productId) => {
    const product = products[productId];
    try {
      // Get existing cart items for this product
      const cartItems = await Cart.filter({
        user_email: user.email,
        product_id: productId
      });
      const currentCartQty = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

      // Check stock availability
      if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
        if (currentCartQty >= product.stock_quantity) {
          toast({
            title: "Out of stock",
            description: `You already have the maximum available quantity (${product.stock_quantity}) in your cart.`,
            variant: "destructive",
          });
          return;
        }

        if (product.stock_quantity <= 0) {
          toast({
            title: "Out of stock",
            description: "This item is currently out of stock.",
            variant: "destructive",
          });
          return;
        }
      }

      // If item already exists in cart, update the quantity
      if (cartItems.length > 0) {
        const existingItem = cartItems[0];
        await Cart.update(existingItem.id, {
          quantity: existingItem.quantity + 1
        });
      } else {
        // Create new cart item
        await Cart.create({
          user_email: user.email,
          product_id: productId,
          quantity: 1,
          price_at_add: product.price
        });
      }

      // Dispatch event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));

      // Show success toast
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      await WishlistCollection.create({
        user_email: user.email,
        name: newCollectionName,
        order: collections.length
      });
      setNewCollectionName('');
      setIsCreateDialogOpen(false);
      await loadWishlist();
      toast({
        title: "Collection created",
        description: `"${newCollectionName}" has been created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection.",
        variant: "destructive",
      });
    }
  };

  const updateCollection = async () => {
    if (!editingCollection || !editingCollection.name.trim()) return;

    try {
      await WishlistCollection.update(editingCollection.id, {
        name: editingCollection.name
      });
      setEditingCollection(null);
      setIsEditDialogOpen(false);
      await loadWishlist();
      toast({
        title: "Collection updated",
        description: "Collection has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection.",
        variant: "destructive",
      });
    }
  };

  const deleteCollection = async () => {
    if (!deletingCollection) return;

    try {
      const itemsInCollection = wishlistItems.filter(item => item.collection_id === deletingCollection.id);

      if (deleteAction === 'move') {
        // Move items to target collection or uncategorized
        for (const item of itemsInCollection) {
          await WishlistEntity.update(item.id, { collection_id: targetCollectionId });
        }

        await WishlistCollection.delete(deletingCollection.id);
        await loadWishlist();

        const targetCollection = collections.find(c => c.id === targetCollectionId);
        const targetName = targetCollection ? targetCollection.name : 'Uncategorized';

        toast({
          title: "Collection deleted",
          description: `Items moved to ${targetName}.`,
        });
      } else {
        // Delete all items in the collection
        for (const item of itemsInCollection) {
          await WishlistEntity.delete(item.id);
        }

        await WishlistCollection.delete(deletingCollection.id);
        await loadWishlist();

        toast({
          title: "Collection deleted",
          description: `${itemsInCollection.length} item${itemsInCollection.length === 1 ? '' : 's'} deleted.`,
        });
      }

      setIsDeleteDialogOpen(false);
      setDeletingCollection(null);
      setDeleteAction('move');
      setTargetCollectionId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete collection.",
        variant: "destructive",
      });
    }
  };

  const moveItemToCollection = async (collectionId) => {
    if (!movingItem) return;

    try {
      await WishlistEntity.update(movingItem.id, {
        collection_id: collectionId || null
      });
      setMovingItem(null);
      setIsMoveDialogOpen(false);
      await loadWishlist();
      toast({
        title: "Item moved",
        description: "Item has been moved to the selected list.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move item.",
        variant: "destructive",
      });
    }
  };

  const getFilteredItems = () => {
    if (selectedCollection === 'all') {
      return wishlistItems;
    } else if (selectedCollection === 'uncategorized') {
      return wishlistItems.filter(item => !item.collection_id);
    } else {
      return wishlistItems.filter(item => item.collection_id === selectedCollection);
    }
  };

  const getCollectionItemCount = (collectionId) => {
    if (collectionId === 'all') {
      return wishlistItems.length;
    } else if (collectionId === 'uncategorized') {
      return wishlistItems.filter(item => !item.collection_id).length;
    } else {
      return wishlistItems.filter(item => item.collection_id === collectionId).length;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-2">{wishlistItems.length} items saved</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New List</DialogTitle>
                <DialogDescription>
                  Create a custom list to organize your wishlist items.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="collection-name">List Name</Label>
                  <Input
                    id="collection-name"
                    placeholder="e.g., Holiday Gifts, Future Purchases"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        createCollection();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={createCollection}
                  disabled={!newCollectionName.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  Create List
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Collections Tabs */}
        <Tabs value={selectedCollection} onValueChange={setSelectedCollection} className="mb-6">
          <TabsList className="bg-white border-2 border-orange-100">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              All ({getCollectionItemCount('all')})
            </TabsTrigger>
            <TabsTrigger value="uncategorized" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Uncategorized ({getCollectionItemCount('uncategorized')})
            </TabsTrigger>
            {collections.map(collection => (
              <TabsTrigger key={collection.id} value={collection.id} className="flex items-center gap-2">
                <FolderHeart className="w-4 h-4" />
                {collection.name} ({getCollectionItemCount(collection.id)})
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="ml-1 p-0.5 rounded hover:bg-gray-200">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCollection(collection);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCollection(collection);
                        setDeleteAction('move');
                        setTargetCollectionId(null);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Edit Collection Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename List</DialogTitle>
              <DialogDescription>
                Change the name of your list.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-collection-name">List Name</Label>
                <Input
                  id="edit-collection-name"
                  value={editingCollection?.name || ''}
                  onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateCollection();
                    }
                  }}
                />
              </div>
              <Button
                onClick={updateCollection}
                disabled={!editingCollection?.name?.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Move Item Dialog */}
        <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move to List</DialogTitle>
              <DialogDescription>
                Select a list to move this item to.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select onValueChange={moveItemToCollection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Uncategorized</SelectItem>
                  {collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Collection Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Delete "{deletingCollection?.name}"?
              </DialogTitle>
              <DialogDescription>
                This list has {wishlistItems.filter(item => item.collection_id === deletingCollection?.id).length} item(s). What would you like to do with them?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={deleteAction} onValueChange={setDeleteAction}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="move" id="move" />
                    <div className="space-y-1 leading-none flex-1">
                      <Label htmlFor="move" className="cursor-pointer">
                        Move items to another list
                      </Label>
                      {deleteAction === 'move' && (
                        <div className="pt-2">
                          <Select value={targetCollectionId || 'null'} onValueChange={(value) => setTargetCollectionId(value === 'null' ? null : value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a list" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="null">Uncategorized</SelectItem>
                              {collections.filter(c => c.id !== deletingCollection?.id).map(collection => (
                                <SelectItem key={collection.id} value={collection.id}>
                                  {collection.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="delete" id="delete" />
                    <Label htmlFor="delete" className="cursor-pointer text-red-600">
                      Delete all items in this list
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletingCollection(null);
                  setDeleteAction('move');
                  setTargetCollectionId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={deleteCollection}
                disabled={deleteAction === 'move' && targetCollectionId === null && collections.filter(c => c.id !== deletingCollection?.id).length > 0}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete List
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {wishlistItems.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <Heart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love for later</p>
              <Link to={createPageUrl("Marketplace")}>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No items in this list</h3>
              <p className="text-gray-600 mb-6">Move items here or browse the marketplace</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              // Check if it's a product or service
              const product = item.product_id ? products[item.product_id] : null;
              const service = item.service_id ? services[item.service_id] : null;
              const itemData = product || service;
              const store = stores[itemData?.store_id];

              if (!itemData || !store) return null;

              const isProduct = !!product;
              const borderColor = isProduct ? "border-orange-100" : "border-purple-100";
              const gradientBg = isProduct ? "from-orange-50 to-amber-50" : "from-purple-50 to-pink-50";
              const iconColor = isProduct ? "text-orange-300" : "text-purple-300";
              const textColor = isProduct ? "text-orange-600" : "text-purple-600";
              const buttonGradient = isProduct
                ? "from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                : "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600";
              const url = isProduct
                ? createProductUrl(store.slug, itemData.slug)
                : createServiceUrl(store.slug, itemData.slug);

              return (
                <Card key={item.id} className={`border-2 ${borderColor} hover:shadow-lg transition-all`}>
                  <a href={url}>
                    <div className={`relative h-48 bg-gradient-to-br ${gradientBg} overflow-hidden`}>
                      {(isProduct && itemData.images && itemData.images.length > 0) ? (
                        <img
                          src={itemData.images[0]}
                          alt={itemData.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (!isProduct && itemData.image_url) ? (
                        <img
                          src={itemData.image_url}
                          alt={itemData.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {isProduct ? (
                            <Package className={`w-12 h-12 ${iconColor}`} />
                          ) : (
                            <Briefcase className={`w-12 h-12 ${iconColor}`} />
                          )}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(item.id);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      </button>
                      {collections.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setMovingItem(item);
                            setIsMoveDialogOpen(true);
                          }}
                          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-lg hover:bg-orange-50 transition-colors"
                          title="Move to list"
                        >
                          <FolderHeart className="w-5 h-5 text-orange-600" />
                        </button>
                      )}
                    </div>
                  </a>
                  <CardContent className="p-4">
                    <a href={url}>
                      <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 hover:${textColor} transition-colors`}>
                        {itemData.name}
                      </h3>
                    </a>
                    {store && (
                      <p className="text-sm text-gray-500 mb-3">{store.name}</p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-2xl font-bold ${textColor}`}>
                        ${itemData.price.toFixed(2)}
                        {!isProduct && service.price_type && (
                          <span className="text-sm text-gray-500 font-normal ml-1">
                            {service.price_type === 'hourly' ? '/hr' :
                             service.price_type === 'per_project' ? '/project' :
                             service.price_type === 'negotiable' ? '(negotiable)' : ''}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {isProduct ? (
                        <Button
                          onClick={() => addToCart(itemData.id)}
                          className={`flex-1 bg-gradient-to-r ${buttonGradient}`}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate(createPageUrl(`Messages?to=${store.created_by}`))}
                          className={`flex-1 bg-gradient-to-r ${buttonGradient}`}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromWishlist(item.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
