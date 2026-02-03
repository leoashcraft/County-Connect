import React, { useState, useEffect } from "react";
import { Store, Order, UserEntity } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Clock, CheckCircle, XCircle, Truck, Search, ShoppingCart } from "lucide-react";

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState({});
  const [users, setUsers] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const loadingRef = React.useRef(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log("Admin orders load already in progress, skipping");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        navigate(createPageUrl("Marketplace"));
        return;
      }
      await loadOrders();
    } catch (error) {
      console.error("Error loading admin orders:", error);
      // Only redirect if authentication failed
      if (error.message?.includes('Authentication required') || error.message?.includes('not authenticated')) {
        navigate(createPageUrl("Marketplace"));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const loadOrders = async () => {
    try {
      const [allOrders, allStores, allUsers] = await Promise.all([
        Order.list('-created_date'),
        Store.list(),
        UserEntity.list()
      ]);

      const storesMap = {};
      allStores.forEach(s => storesMap[s.id] = s);

      const usersMap = {};
      allUsers.forEach(u => usersMap[u.email] = u);

      setOrders(allOrders);
      setStores(storesMap);
      setUsers(usersMap);
    } catch (error) {
      console.error("Error loading orders list:", error);
      throw error; // Re-throw to be caught by checkAdminAccess
    }
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

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.order_status === filter;
    const matchesSearch = !searchTerm ||
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <ShoppingCart className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600 mt-2">View and manage all marketplace orders</p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
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

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <ShoppingCart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? `No orders match "${searchTerm}"`
                    : "No orders in the system yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map(order => {
              const orderTotal = order.items.reduce((sum, item) => sum + item.total_price, 0);

              return (
                <Card key={order.id} className="border-2 border-orange-100">
                  <CardHeader className="border-b border-orange-100 bg-orange-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.order_status)}
                        <div>
                          <CardTitle className="text-lg">{order.order_number}</CardTitle>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_date).toLocaleDateString()} at {new Date(order.created_date).toLocaleTimeString()}
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
                          <p className="font-medium">{order.shipping_address?.full_name}</p>
                          <p>{order.shipping_address?.phone}</p>
                          <p>{order.buyer_email}</p>
                          <p className="mt-2">{order.shipping_address?.address_line}</p>
                          <p>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payment & Shipping</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Payment Method: <span className="font-medium capitalize">{order.payment_method.replace(/_/g, ' ')}</span></p>
                          <p>Payment Status: <Badge className={
                            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {order.payment_status}
                          </Badge></p>
                          <p className="pt-2">Shipping Method: <span className="font-medium capitalize">{order.shipping_method.replace(/_/g, ' ')}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => {
                          const store = stores[item.store_id];
                          return (
                            <div key={idx} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                <p className="text-sm text-gray-500">
                                  Store: {store?.name || item.store_name} • Qty: {item.quantity} • ${item.unit_price.toFixed(2)} each
                                </p>
                              </div>
                              <p className="font-bold text-orange-600">${item.total_price.toFixed(2)}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-end mt-3 pt-3 border-t border-orange-100">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Order Total</p>
                          <p className="text-2xl font-bold text-orange-600">${orderTotal.toFixed(2)}</p>
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
