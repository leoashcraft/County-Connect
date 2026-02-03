
import React, { useState, useEffect } from "react";
import { Store, Product, Order } from "@/api/entities";
import { User } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createStoreUrl, createProductUrl } from "@/components/utils/slugUtils"; // Added imports for store/product URL creation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingOrders: 0,
    totalProducts: 0,
    activeProducts: 0
  });
  const [topProducts, setTopProducts] = useState([]); // New state for top products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const userStores = await Store.filter({ created_by: userData.email });
      setStores(userStores);

      const storeIds = userStores.map(s => s.id);
      const allProducts = await Product.list();
      const vendorProducts = allProducts.filter(p => storeIds.includes(p.store_id));
      setProducts(vendorProducts);

      // Determine top products (e.g., first 5 products for demonstration)
      // In a real app, this would be based on sales, views, or ratings.
      // Assuming 'views' property for sorting if available, otherwise just taking a slice.
      const sortedVendorProducts = [...vendorProducts].sort((a, b) => (b.views || 0) - (a.views || 0));
      setTopProducts(sortedVendorProducts.slice(0, 5));

      const allOrders = await Order.list();
      const vendorOrders = allOrders.filter(order =>
        order.items.some(item => storeIds.includes(item.store_id))
      );
      setOrders(vendorOrders);

      const totalEarnings = vendorOrders
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, order) => {
          const vendorTotal = order.items
            .filter(item => storeIds.includes(item.store_id))
            .reduce((itemSum, item) => itemSum + item.total_price, 0);
          return sum + vendorTotal;
        }, 0);

      const pendingOrders = vendorOrders.filter(o =>
        o.order_status === 'pending' || o.order_status === 'confirmed'
      ).length;

      setStats({
        totalEarnings,
        pendingOrders,
        totalProducts: vendorProducts.length,
        activeProducts: vendorProducts.filter(p => p.status === 'active').length
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      navigate(createPageUrl("Marketplace"));
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <p className="text-gray-600">Loading dashboard...</p>
    </div>;
  }

  const recentOrders = orders.slice(0, 5);
  const pendingProducts = products.filter(p => p.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Vendor Dashboard
              {user?.is_verified_vendor && (
                <Badge className="bg-blue-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-2">Manage your stores, products, and orders</p>
          </div>
          {!user?.is_verified_vendor && !user?.verification_requested && (
            <Button
              onClick={async () => {
                await User.updateMyUserData({ verification_requested: true });
                window.location.reload();
              }}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Request Verification
            </Button>
          )}
          {user?.verification_requested && !user?.is_verified_vendor && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
              <Clock className="w-3 h-3 mr-1" />
              Verification Pending
            </Badge>
          )}
        </div>

        {/* Stats Grid - Updated classes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                  <p className="text-xs text-gray-500">Need attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  <p className="text-xs text-gray-500">{stats.activeProducts} active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">My Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
                  <p className="text-xs text-gray-500">Active stores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Orders</span>
                <Link to={createPageUrl("VendorOrders")}>
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">${order.total.toFixed(2)}</p>
                        <Badge className={
                          order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {order.order_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products - NEW CARD */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products yet</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map(product => {
                    const store = stores.find(s => s.id === product.store_id); // Find the store object
                    return (
                      <a
                        key={product.id}
                        href={store ? createProductUrl(store.slug, product.slug) : '#'}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <img
                          src={product.image_url || '/placeholder-image.jpg'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.price ? product.price.toFixed(2) : '0.00'}</p>
                        </div>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </a>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions (Moved to be a separate block below the two-column grid) */}
        <div className="mb-6">
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={createPageUrl("AddProduct")} className="block">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
              <Link to={createPageUrl("MyStores")} className="block">
                <Button variant="outline" className="w-full border-orange-200">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Manage Stores
                </Button>
              </Link>
              <Link to={createPageUrl("VendorOrders")} className="block">
                <Button variant="outline" className="w-full border-orange-200">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {pendingProducts.length > 0 && (
          <Card className="border-2 border-yellow-200 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                Pending Products ({pendingProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                These products are awaiting admin approval before they become visible on the marketplace.
              </p>
              <div className="space-y-2">
                {pendingProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
