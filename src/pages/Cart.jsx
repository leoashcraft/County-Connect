import React, { useState, useEffect } from "react";
import { Cart as CartEntity, Product, Store } from "@/api/entities";
import { User } from "@/api/entities";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createProductUrl } from "@/components/utils/slugUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [stores, setStores] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const loadingRef = React.useRef(false);

  useEffect(() => {
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Reload cart when navigating to this page (skip if already on cart page from initial load)
  const isFirstMount = React.useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (location.pathname.includes('/Cart')) {
      loadCart();
    }
  }, [location.pathname]);

  const loadCart = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log("Cart load already in progress, skipping");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const userData = await User.me();
      setUser(userData);

      const items = await CartEntity.filter({ user_email: userData.email });
      console.log("Cart items loaded:", items);

      const productIds = [...new Set(items.map(item => item.product_id))];
      console.log("Product IDs in cart:", productIds);

      const allProducts = await Product.list();
      console.log("All products loaded:", allProducts.length);

      const productsMap = {};
      allProducts.forEach(p => {
        if (productIds.includes(p.id)) {
          productsMap[p.id] = p;
        }
      });
      console.log("Products map:", productsMap);

      const storeIds = [...new Set(Object.values(productsMap).map(p => p.store_id))];
      const allStores = await Store.list();
      const storesMap = {};
      allStores.forEach(s => {
        if (storeIds.includes(s.id)) {
          storesMap[s.id] = s;
        }
      });

      // Set all states at once to avoid rendering issues
      setProducts(productsMap);
      setStores(storesMap);
      setCartItems(items);
    } catch (error) {
      console.error("Failed to load cart:", error);
      // Only redirect if authentication failed
      if (error.message?.includes('Authentication required') || error.message?.includes('not authenticated')) {
        navigate(createPageUrl("Marketplace"));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    // Prevent multiple simultaneous updates for the same item
    if (updatingItems.has(item.id)) {
      console.log("Already updating this item, skipping");
      return;
    }

    // Check stock availability before updating
    const product = products[item.product_id];
    console.log(`Updating quantity: product=${product?.name}, currentQty=${item.quantity}, newQty=${newQuantity}, stock=${product?.stock_quantity}`);

    if (product && product.stock_quantity !== undefined && product.stock_quantity !== null) {
      // Get total quantity for this product across all cart items (defensive check)
      const totalForProduct = cartItems
        .filter(ci => ci.product_id === item.product_id)
        .reduce((sum, ci) => sum + (ci.id === item.id ? newQuantity : ci.quantity), 0);

      console.log(`Total for product ${product.name}: ${totalForProduct} vs stock ${product.stock_quantity}`);

      if (totalForProduct > product.stock_quantity) {
        toast({
          title: "Insufficient stock",
          description: `Only ${product.stock_quantity} ${product.stock_quantity === 1 ? 'item' : 'items'} available in stock.`,
          variant: "destructive",
        });
        return;
      }

      if (newQuantity > product.stock_quantity) {
        toast({
          title: "Insufficient stock",
          description: `Only ${product.stock_quantity} ${product.stock_quantity === 1 ? 'item' : 'items'} available in stock.`,
          variant: "destructive",
        });
        return;
      }
    }

    // Optimistically update UI
    setCartItems(prev => prev.map(cartItem =>
      cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
    ));

    // Mark item as updating
    setUpdatingItems(prev => new Set(prev).add(item.id));

    try {
      await CartEntity.update(item.id, { quantity: newQuantity });
      // Dispatch event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Revert on error
      setCartItems(prev => prev.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: item.quantity } : cartItem
      ));
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove updating flag
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId) => {
    // Optimistically update UI
    setCartItems(prev => prev.filter(item => item.id !== itemId));

    // Then delete from database
    try {
      await CartEntity.delete(itemId);
      // Dispatch event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      // Reload on error to get correct state
      await loadCart();
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products[item.product_id];
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const groupByStore = () => {
    const grouped = {};
    console.log("Grouping cart items:", cartItems);
    console.log("Available products:", products);

    cartItems.forEach(item => {
      const product = products[item.product_id];
      console.log(`Item ${item.id}: product_id=${item.product_id}, product found=${!!product}`);

      if (product) {
        const storeId = product.store_id;
        if (!grouped[storeId]) {
          grouped[storeId] = [];
        }
        grouped[storeId].push({ ...item, product });
      } else {
        console.warn(`Product not found for cart item ${item.id} with product_id ${item.product_id}`);
      }
    });

    console.log("Grouped items:", grouped);
    return grouped;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-orange-600 animate-pulse" />
        <p className="text-gray-600">Loading your cart...</p>
      </div>
    </div>;
  }

  const groupedItems = groupByStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-orange-600" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
              <Link to={createPageUrl("Marketplace")}>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedItems).map(([storeId, items]) => (
                <Card key={storeId} className="border-2 border-orange-100">
                  <CardHeader className="border-b border-orange-100 bg-orange-50/50">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-orange-600" />
                      {stores[storeId]?.name || "Store"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {items.map(({ id, product, quantity }) => {
                        const store = stores[product.store_id];
                        const storeSlug = store?.slug || store?.id;
                        const productSlug = product.slug || product.id;
                        const productUrl = createProductUrl(storeSlug, productSlug);

                        return (
                          <div key={id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                            <Link to={productUrl} className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-8 h-8 text-orange-300" />
                                </div>
                              )}
                            </Link>
                            <div className="flex-1">
                              <Link to={productUrl}>
                                <h4 className="font-semibold text-gray-900 mb-1 hover:text-orange-600 transition-colors cursor-pointer">{product.name}</h4>
                              </Link>
                              <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity({ id, quantity }, quantity - 1)}
                                    disabled={updatingItems.has(id) || quantity <= 1}
                                    className="px-3 py-1 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-3 font-medium">{quantity}</span>
                                  <button
                                    onClick={() => updateQuantity({ id, quantity }, quantity + 1)}
                                    disabled={updatingItems.has(id) || (product.stock_quantity !== undefined && quantity >= product.stock_quantity)}
                                    className="px-3 py-1 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                {product.stock_quantity !== undefined && quantity >= product.stock_quantity && (
                                  <p className="text-xs text-gray-500 mt-1">Max quantity reached</p>
                                )}
                              </div>
                              <div className="text-lg font-bold text-orange-600">
                                ${(product.price * quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(id)}
                            className="text-red-500 hover:text-red-700 p-2 h-fit"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="border-2 border-orange-200 sticky top-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <Link to={createPageUrl("Checkout")} className="block">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 h-12 text-base">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Marketplace")}>
                    <Button variant="outline" className="w-full border-orange-200">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}