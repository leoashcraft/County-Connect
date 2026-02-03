
import React, { useState, useEffect } from "react";
import { Order } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, XCircle, Truck, ShoppingBag, ArrowLeft } from "lucide-react";

export default function MyOrders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const userOrders = await Order.filter({ buyer_email: userData.email }, '-created_date');
      setOrders(userOrders);
    } catch (error) {
      navigate(createPageUrl("Marketplace"));
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'processing': return <Package className="w-5 h-5 text-purple-600" />;
      case 'shipped': return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <p className="text-gray-600">Loading your orders...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
              <p className="text-gray-600">Start shopping to see your orders here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="border-2 border-orange-100">
                <CardHeader className="border-b border-orange-100 bg-orange-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.order_status)}
                      <div>
                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Ordered on {new Date(order.created_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.order_status)}>
                      {order.order_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">
                            {item.store_name} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-orange-600">${item.total_price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.shipping_address?.full_name}</p>
                        <p>{order.shipping_address?.phone}</p>
                        <p>{order.shipping_address?.address_line}</p>
                        <p>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.discount_amount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span className="font-medium">-${order.discount_amount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                          <span>Total:</span>
                          <span className="text-orange-600">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="pt-2">
                          <p className="text-gray-600">Payment: <span className="font-medium">{order.payment_method.replace(/_/g, ' ')}</span></p>
                          <Badge className={
                            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
