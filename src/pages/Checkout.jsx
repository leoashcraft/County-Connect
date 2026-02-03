import React, { useState, useEffect } from "react";
import { Cart, Product, Store, Order, Coupon } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, CreditCard, Loader2, Tag, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [stores, setStores] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    payment_method: "cash",
    notes: ""
  });

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData(prev => ({ ...prev, full_name: userData.full_name || "" }));
      
      const items = await Cart.filter({ user_email: userData.email });
      if (items.length === 0) {
        navigate(createPageUrl("Cart"));
        return;
      }
      setCartItems(items);

      const productIds = [...new Set(items.map(item => item.product_id))];
      const allProducts = await Product.list();
      const productsMap = {};
      allProducts.forEach(p => {
        if (productIds.includes(p.id)) productsMap[p.id] = p;
      });
      setProducts(productsMap);

      const storeIds = [...new Set(Object.values(productsMap).map(p => p.store_id))];
      const allStores = await Store.list();
      const storesMap = {};
      allStores.forEach(s => {
        if (storeIds.includes(s.id)) storesMap[s.id] = s;
      });
      setStores(storesMap);
    } catch (error) {
      navigate(createPageUrl("Marketplace"));
    }
    setLoading(false);
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products[item.product_id];
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const applyCoupon = async () => {
    setCouponError("");
    if (!couponCode) return;
    
    const coupons = await Coupon.filter({ code: couponCode.toUpperCase(), is_active: true });
    if (coupons.length === 0) {
      setCouponError("Invalid coupon code");
      return;
    }
    
    const coupon = coupons[0];
    const subtotal = getSubtotal();
    
    if (coupon.minimum_purchase && subtotal < coupon.minimum_purchase) {
      setCouponError(`Minimum purchase of $${coupon.minimum_purchase} required`);
      return;
    }
    
    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      setCouponError("Coupon usage limit reached");
      return;
    }
    
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      setCouponError("Coupon has expired");
      return;
    }
    
    setAppliedCoupon(coupon);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    if (appliedCoupon.discount_type === "percentage") {
      return (subtotal * appliedCoupon.discount_value) / 100;
    }
    return Math.min(appliedCoupon.discount_value, subtotal);
  };

  const getTotal = () => {
    return Math.max(0, getSubtotal() - getDiscount());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const orderNumber = `ORD-${Date.now()}`;
    const orderItems = cartItems.map(item => {
      const product = products[item.product_id];
      const store = stores[product.store_id];
      return {
        product_id: product.id,
        product_name: product.name,
        store_id: store.id,
        store_name: store.name,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity
      };
    });

    await Order.create({
      order_number: orderNumber,
      buyer_email: user.email,
      items: orderItems,
      subtotal: getSubtotal(),
      discount_amount: getDiscount(),
      coupon_code: appliedCoupon?.code,
      total: getTotal(),
      payment_method: formData.payment_method,
      shipping_address: {
        full_name: formData.full_name,
        phone: formData.phone,
        address_line: formData.address_line,
        city: formData.city,
        postal_code: formData.postal_code
      },
      notes: formData.notes
    });

    if (appliedCoupon) {
      await Coupon.update(appliedCoupon.id, {
        times_used: (appliedCoupon.times_used || 0) + 1
      });
    }

    for (const item of cartItems) {
      await Cart.delete(item.id);
    }

    navigate(createPageUrl(`OrderConfirmation?order=${orderNumber}`));
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-orange-100">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address_line}
                      onChange={(e) => setFormData({...formData, address_line: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal Code *</Label>
                      <Input
                        id="postal"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                    <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="font-medium">Cash Payment</div>
                        <div className="text-sm text-gray-500">Pay with cash upon pickup/delivery</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors mt-3">
                      <RadioGroupItem value="bank_transfer" id="bank" />
                      <Label htmlFor="bank" className="flex-1 cursor-pointer">
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Transfer to seller's bank account</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors mt-3">
                      <RadioGroupItem value="cash_on_delivery" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-500">Pay when you receive your order</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100">
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-2 border-orange-200 sticky top-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    {cartItems.map(item => {
                      const product = products[item.product_id];
                      return (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {product?.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ${((product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon}
                      />
                      {!appliedCoupon ? (
                        <Button type="button" onClick={applyCoupon} variant="outline">
                          <Tag className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button type="button" onClick={() => {setAppliedCoupon(null); setCouponCode("");}} variant="outline">
                          Remove
                        </Button>
                      )}
                    </div>
                    {couponError && <p className="text-sm text-red-600 mb-2">{couponError}</p>}
                    {appliedCoupon && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                        <CheckCircle className="w-4 h-4" />
                        Coupon applied!
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${getDiscount().toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">${getTotal().toFixed(2)}</span>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 h-12 text-base"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}