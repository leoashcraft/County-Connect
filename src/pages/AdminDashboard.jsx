import React, { useState, useEffect } from "react";
import { User, UserEntity } from "@/api/entities";
import { Store, Product, Order, SupportTicket } from "@/api/entities";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Store as StoreIcon,
  Package,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  TrendingUp,
  LifeBuoy,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Utensils,
  Menu,
  Settings,
  Church,
  Heart,
  Trophy,
  Shield,
  GraduationCap,
  BarChart3,
  FileText
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingTickets: 0,
    verificationRequests: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = React.useRef(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log("Admin dashboard load already in progress, skipping");
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
      setUser(userData);
      await loadDashboardData();
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
      // Only redirect if authentication failed
      if (error.message?.includes('Authentication required') || error.message?.includes('not authenticated')) {
        navigate(createPageUrl("Marketplace"));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const loadDashboardData = async () => {
    try {
      const [users, stores, products, orders, tickets] = await Promise.all([
        UserEntity.list(),
        Store.list(),
        Product.list(),
        Order.list('-created_date'),
        SupportTicket.list()
      ]);

    const totalRevenue = orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingProds = products.filter(p => p.status === 'pending');
    const verificationReqs = users.filter(u => u.verification_requested && !u.is_verified_vendor).length;

      setStats({
        totalUsers: users.length,
        totalStores: stores.length,
        totalProducts: products.length,
        pendingProducts: pendingProds.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingTickets: tickets.filter(t => t.status === 'open').length,
        verificationRequests: verificationReqs
      });

      setRecentOrders(orders.slice(0, 5));
      setPendingProducts(pendingProds.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      throw error; // Re-throw to be caught by checkAdminAccess
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-gray-600">Loading admin dashboard...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
          <p className="text-gray-600 mt-2">Manage and monitor your marketplace</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500">Registered users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <StoreIcon className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
                  <p className="text-xs text-gray-500">Active stores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  <p className="text-xs text-gray-500">{stats.pendingProducts} pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{stats.totalOrders} orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {stats.pendingProducts > 0 && (
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-5 h-5" />
                  Pending Product Approvals ({stats.pendingProducts})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Products awaiting your review</p>
                <Link to={createPageUrl("AdminProducts")}>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Review Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {stats.verificationRequests > 0 && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="w-5 h-5" />
                  Vendor Verification Requests ({stats.verificationRequests})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Vendors requesting verification</p>
                <Link to={createPageUrl("AdminUsers")}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Review Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {stats.pendingTickets > 0 && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <LifeBuoy className="w-5 h-5" />
                  Open Support Tickets ({stats.pendingTickets})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Tickets need your attention</p>
                <Link to={createPageUrl("AdminSupport")}>
                  <Button className="bg-red-600 hover:bg-red-700">
                    View Tickets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Management Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to={createPageUrl("AdminUsers")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Manage Users</h3>
                <p className="text-sm text-gray-500">View, edit, and verify users</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminStores")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <StoreIcon className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Manage Stores</h3>
                <p className="text-sm text-gray-500">Oversee all vendor stores</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminProducts")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Manage Products</h3>
                <p className="text-sm text-gray-500">Review and approve products</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminOrders")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Manage Orders</h3>
                <p className="text-sm text-gray-500">View all marketplace orders</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminBrands")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Manage Brands</h3>
                <p className="text-sm text-gray-500">Add and edit brands</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminSupport")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <LifeBuoy className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Support Tickets</h3>
                <p className="text-sm text-gray-500">Handle customer support</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminFoodTrucks")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Truck className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Food Truck Moderation</h3>
                <p className="text-sm text-gray-500">Approve and manage food trucks</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminRestaurants")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Utensils className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Restaurant Moderation</h3>
                <p className="text-sm text-gray-500">Approve and manage restaurants</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminTowns")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Towns & Cities</h3>
                <p className="text-sm text-gray-500">Manage location data</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminNavigation")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Menu className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Navigation Settings</h3>
                <p className="text-sm text-gray-500">Reorder menu items</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminPages")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-cyan-600" />
                <h3 className="font-bold text-gray-900 mb-1">Page Management</h3>
                <p className="text-sm text-gray-500">Create & edit custom pages</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminSiteSettings")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-1">Site Settings</h3>
                <p className="text-sm text-gray-500">County name, state, branding</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminChurches")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Church className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
                <h3 className="font-bold text-gray-900 mb-1">Churches</h3>
                <p className="text-sm text-gray-500">Manage church listings</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminCommunityResources")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-3 text-rose-600" />
                <h3 className="font-bold text-gray-900 mb-1">Community Resources</h3>
                <p className="text-sm text-gray-500">Food pantries, assistance</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminSportsTeams")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                <h3 className="font-bold text-gray-900 mb-1">Sports Teams</h3>
                <p className="text-sm text-gray-500">Manage local athletics</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminSchools")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-gray-900 mb-1">Schools</h3>
                <p className="text-sm text-gray-500">Manage school listings</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminClaimRequests")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-gray-900 mb-1">Claim Requests</h3>
                <p className="text-sm text-gray-500">Review ownership claims</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminAnalytics")}>
            <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-teal-600" />
                <h3 className="font-bold text-gray-900 mb-1">Analytics</h3>
                <p className="text-sm text-gray-500">Website traffic & metrics</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-500">{order.buyer_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">${order.total.toFixed(2)}</p>
                        <Badge className="mt-1">{order.order_status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle>Pending Products</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending products</p>
              ) : (
                <div className="space-y-3">
                  {pendingProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}