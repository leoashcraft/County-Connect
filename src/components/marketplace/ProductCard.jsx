
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Package, DollarSign, ShoppingCart, Star } from "lucide-react";
import { Cart, Store } from "@/api/entities";
import { User } from "@/api/entities";
import { createProductUrl } from "@/components/utils/slugUtils";

export default function ProductCard({ product, onAddedToCart }) {
  const { toast } = useToast();
  const [adding, setAdding] = React.useState(false);
  const [store, setStore] = React.useState(null);

  React.useEffect(() => {
    loadStore();
  }, [product.store_id]);

  const loadStore = async () => {
    const stores = await Store.list();
    const storeData = stores.find(s => s.id === product.store_id);
    setStore(storeData);
  };

  const conditionColors = {
    new: "bg-green-100 text-green-800",
    like_new: "bg-blue-100 text-blue-800",
    good: "bg-yellow-100 text-yellow-800",
    fair: "bg-orange-100 text-orange-800",
    for_parts: "bg-red-100 text-red-800"
  };

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      const user = await User.me();

      // Get existing cart items for this product
      const cartItems = await Cart.filter({
        user_email: user.email,
        product_id: product.id
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
          setAdding(false);
          return;
        }

        if (product.stock_quantity <= 0) {
          toast({
            title: "Out of stock",
            description: "This item is currently out of stock.",
            variant: "destructive",
          });
          setAdding(false);
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
          product_id: product.id,
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

      if (onAddedToCart) onAddedToCart();
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

  if (!store) return null;

  // Use slug if available, otherwise generate from name, fallback to ID
  // Added optional chaining for store.name to prevent errors if name is undefined
  const storeSlug = store.slug || (store.name ? store.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : null) || store.id;
  const productSlug = product.slug || (product.name ? product.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : null) || product.id;

  return (
    <a href={createProductUrl(storeSlug, productSlug)}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 border-orange-100 hover:border-orange-300 relative h-full">
        {product.is_promoted && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
              <Star className="w-3 h-3 mr-1 fill-white" />
              Featured
            </Badge>
          </div>
        )}
        <div className="relative h-64 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-orange-300" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge className={conditionColors[product.condition]}>
              {product.condition.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-2xl font-bold text-orange-600">
              <DollarSign className="w-5 h-5" />
              {product.price.toFixed(2)}
            </div>
            {product.stock_quantity && (
              <span className="text-sm text-gray-500">
                {product.stock_quantity} in stock
              </span>
            )}
          </div>
          <Button
            onClick={addToCart}
            disabled={adding || !product.is_available || (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {adding ? "Adding..." : (product.stock_quantity !== undefined && product.stock_quantity <= 0) ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </a>
  );
}
