import React, { useState, useEffect } from "react";
import { Order } from "@/api/entities";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const orderNumber = urlParams.get('order');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  const loadOrder = async () => {
    const orders = await Order.filter({ order_number: orderNumber });
    if (orders.length > 0) {
      setOrder(orders[0]);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <p className="text-gray-600">Loading order...</p>
    </div>;
  }

  if (!order) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <p className="text-gray-600">Order not found</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-green-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-12 text-center text-white">
            <CheckCircle className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl opacity-90">Thank you for your purchase</p>
          </div>
          
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">{order.order_number}</p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5" />
                What's Next?
              </h3>
              <p className="text-blue-800 text-sm">
                {order.payment_method === "cash_on_delivery" 
                  ? "Your order has been placed! You'll pay when you receive your items. The sellers will contact you shortly to arrange delivery."
                  : order.payment_method === "bank_transfer"
                  ? "Your order is pending payment. Please check your email for bank transfer details. Once payment is confirmed, sellers will process your order."
                  : "Your order has been placed! The sellers will contact you shortly to coordinate pickup or delivery."}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-500">{item.store_name} • Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">${item.total_price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold pt-4 border-t-2 border-gray-200">
                <span>Total Paid</span>
                <span className="text-green-600">${order.total.toFixed(2)}</span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>{order.shipping_address?.full_name}</p>
                  <p>{order.shipping_address?.phone}</p>
                  <p>{order.shipping_address?.address_line}</p>
                  <p>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to={createPageUrl("Marketplace")} className="flex-1">
                <Button variant="outline" className="w-full border-orange-200">
                  Continue Shopping
                </Button>
              </Link>
              <Link to={createPageUrl("MyOrders")} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  View My Orders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}