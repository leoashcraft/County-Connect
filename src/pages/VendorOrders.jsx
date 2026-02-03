
import React, { useState, useEffect } from "react";
import { Store, Order } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

export default function VendorOrders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const userStores = await Store.filter({ created_by: userData.email });
      setStores(userStores);

      const storeIds = userStores.map(s => s.id);
      const allOrders = await Order.list('-created_date');
      const vendorOrders = allOrders.filter(order => 
        order.items.some(item => storeIds.includes(item.store_id))
      );
      setOrders(vendorOrders);
    } catch (error) {
      navigate(createPageUrl("Marketplace"));
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await Order.update(orderId, { order_status: newStatus });
    await loadOrders();
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
      <p className="text-gray-600">Loading orders...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Manage orders from your stores</p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
              <p className="text-gray-600">When customers purchase from your stores, orders will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const storeIds = stores.map(s => s.id);
              const vendorItems = order.items.filter(item => storeIds.includes(item.store_id));
              const vendorTotal = vendorItems.reduce((sum, item) => sum + item.total_price, 0);

              return (
                <Card key={order.id} className="border-2 border-orange-100">
                  <CardHeader className="border-b border-orange-100 bg-orange-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.order_status)}
                        <div>
                          <CardTitle className="text-lg">{order.order_number}</CardTitle>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.order_status)}>
                        {order.order_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.shipping_address?.full_name}</p>
                          <p>{order.shipping_address?.phone}</p>
                          <p>{order.buyer_email}</p>
                          <p className="mt-2">{order.shipping_address?.address_line}</p>
                          <p>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payment</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Method: <span className="font-medium">{order.payment_method.replace(/_/g, ' ')}</span></p>
                          <p>Status: <Badge className={
                            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {order.payment_status}
                          </Badge></p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Your Items in this Order</h4>
                      <div className="space-y-2">
                        {vendorItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{item.product_name}</p>
                              <p className="text-sm text-gray-500">
                                {item.store_name} • Qty: {item.quantity} • ${item.unit_price.toFixed(2)} each
                              </p>
                            </div>
                            <p className="font-bold text-orange-600">${item.total_price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Your earnings from this order</p>
                          <p className="text-2xl font-bold text-orange-600">${vendorTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Select 
                        value={order.order_status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
