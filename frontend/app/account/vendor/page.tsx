import { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  BarChart3,
  Users,
  Star,
  AlertTriangle,
} from 'lucide-react';
import VerificationCard from './VerificationCard';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Vendor Dashboard',
};

interface Order {
  id: number;
  documentId: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  createdAt: string;
  buyer?: {
    username?: string;
    email?: string;
  };
}

// Fetch orders where the user is the seller
async function getVendorOrders(userId: number, token: string): Promise<Order[]> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/orders?filters[seller][id][$eq]=${userId}&populate=buyer&sort=createdAt:desc&pagination[pageSize]=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
  }
  return [];
}

// Fetch marketplace listings stats
async function getListingsStats(userId: number, token: string) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/marketplace-listings?filters[seller][id][$eq]=${userId}&pagination[pageSize]=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return {
        total: data.meta?.pagination?.total || 0,
      };
    }
  } catch (error) {
    console.error('Error fetching listings stats:', error);
  }
  return { total: 0 };
}

// Fetch user profile including verification fields
async function getUserProfile(token: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        is_verified_vendor: data.is_verified_vendor || false,
        verification_requested: data.verification_requested || false,
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
  return { is_verified_vendor: false, verification_requested: false };
}

interface PendingProduct {
  id: number;
  documentId: string;
  title: string;
}

// Fetch pending products awaiting approval
async function getPendingProducts(userId: number, token: string): Promise<PendingProduct[]> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/marketplace-listings?filters[seller][id][$eq]=${userId}&filters[status][$eq]=pending&fields[0]=title&pagination[pageSize]=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
  } catch (error) {
    console.error('Error fetching pending products:', error);
  }
  return [];
}

function calculateStats(orders: Order[]) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Current period (last 30 days)
  const currentPeriodOrders = orders.filter(
    (o) => new Date(o.createdAt) >= thirtyDaysAgo
  );

  // Previous period (30-60 days ago)
  const previousPeriodOrders = orders.filter(
    (o) => new Date(o.createdAt) >= sixtyDaysAgo && new Date(o.createdAt) < thirtyDaysAgo
  );

  // Calculate totals
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const currentRevenue = currentPeriodOrders.reduce(
    (sum, o) => sum + (Number(o.totalAmount) || 0),
    0
  );
  const previousRevenue = previousPeriodOrders.reduce(
    (sum, o) => sum + (Number(o.totalAmount) || 0),
    0
  );

  // Calculate percentage change
  const revenueChange =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : currentRevenue > 0
      ? 100
      : 0;

  const ordersChange =
    previousPeriodOrders.length > 0
      ? ((currentPeriodOrders.length - previousPeriodOrders.length) /
          previousPeriodOrders.length) *
        100
      : currentPeriodOrders.length > 0
      ? 100
      : 0;

  // Order status counts
  const statusCounts = {
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return {
    totalOrders: orders.length,
    totalRevenue,
    currentPeriodOrders: currentPeriodOrders.length,
    currentRevenue,
    revenueChange,
    ordersChange,
    statusCounts,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
  };
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          <CheckCircle className="w-3 h-3" />
          Confirmed
        </span>
      );
    case 'shipped':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          <Truck className="w-3 h-3" />
          Shipped
        </span>
      );
    case 'delivered':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Delivered
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function VendorDashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/vendor');
  }

  const user = session.user;
  const userId = (user as any).strapiUserId;
  const token = (user as any).strapiToken;

  // Fetch real data from Strapi
  const [orders, listingsStats, userProfile, pendingProducts] = await Promise.all([
    getVendorOrders(userId, token),
    getListingsStats(userId, token),
    getUserProfile(token),
    getPendingProducts(userId, token),
  ]);

  const stats = calculateStats(orders);
  const recentOrders = orders.slice(0, 5);

  // Placeholder performance metrics (would come from analytics in a real app)
  const performanceMetrics = {
    profileViews: 142,
    profileViewsChange: 12.5,
    conversionRate: orders.length > 0 ? ((stats.statusCounts.delivered / orders.length) * 100).toFixed(1) : '0',
    averageRating: 4.8,
    totalReviews: 24,
  };

  return (
    <div>
      {/* Pending Products Alert */}
      {pendingProducts.length > 0 && (
        <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">
                You have {pendingProducts.length} product{pendingProducts.length !== 1 ? 's' : ''} awaiting approval
              </h3>
              <ul className="mt-2 space-y-1">
                {pendingProducts.slice(0, 5).map((product) => (
                  <li key={product.id} className="text-sm text-amber-700">
                    {product.title}
                  </li>
                ))}
                {pendingProducts.length > 5 && (
                  <li className="text-sm text-amber-700 font-medium">
                    +{pendingProducts.length - 5} more...
                  </li>
                )}
              </ul>
              <Link
                href="/account/listings?status=pending"
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                View pending products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
        <p className="text-gray-600">
          Track your sales performance and manage your orders.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            {stats.revenueChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stats.revenueChange >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(stats.revenueChange).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalRevenue)}
          </p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            {stats.ordersChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stats.ordersChange >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(stats.ordersChange).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>

        {/* Active Listings */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{listingsStats.total}</p>
          <p className="text-sm text-gray-500">Active Listings</p>
        </div>

        {/* Profile Views */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-600" />
            </div>
            {performanceMetrics.profileViewsChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  performanceMetrics.profileViewsChange >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {performanceMetrics.profileViewsChange >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(performanceMetrics.profileViewsChange).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {performanceMetrics.profileViews}
          </p>
          <p className="text-sm text-gray-500">Profile Views</p>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className="mb-8">
        <VerificationCard
          isVerified={userProfile.is_verified_vendor}
          verificationRequested={userProfile.verification_requested}
          userId={userId}
          token={token}
        />
      </div>

      {/* Performance Overview & Order Status */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Overview
          </h2>
          <div className="space-y-4">
            {/* Average Order Value */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Average Order Value
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(stats.averageOrderValue)}
              </span>
            </div>

            {/* Conversion Rate */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Completion Rate
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {performanceMetrics.conversionRate}%
              </span>
            </div>

            {/* Average Rating */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Average Rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {performanceMetrics.averageRating}
                </span>
                <span className="text-sm text-gray-500">
                  ({performanceMetrics.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Status
          </h2>
          {stats.totalOrders > 0 ? (
            <div className="space-y-3">
              {/* Pending */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.statusCounts.pending}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{
                        width: `${(stats.statusCounts.pending / stats.totalOrders) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Confirmed */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Confirmed</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.statusCounts.confirmed}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${(stats.statusCounts.confirmed / stats.totalOrders) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Shipped */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Shipped</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.statusCounts.shipped}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{
                        width: `${(stats.statusCounts.shipped / stats.totalOrders) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Delivered */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.statusCounts.delivered}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{
                        width: `${(stats.statusCounts.delivered / stats.totalOrders) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Cancelled */}
              {stats.statusCounts.cancelled > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Cancelled</span>
                      <span className="text-sm font-medium text-gray-900">
                        {stats.statusCounts.cancelled}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all"
                        style={{
                          width: `${(stats.statusCounts.cancelled / stats.totalOrders) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          {orders.length > 5 && (
            <Link
              href="/account/orders?type=sales"
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        #{order.id.toString().padStart(5, '0')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        {order.buyer?.username || order.buyer?.email || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-500">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(Number(order.totalAmount) || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">
              When customers purchase from your listings, orders will appear here.
            </p>
            <Link
              href="/marketplace/sell"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Create a Listing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Link
          href="/marketplace/sell"
          className="group bg-white rounded-xl border-2 border-gray-100 hover:border-orange-300 p-5 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                Add Listing
              </h3>
              <p className="text-sm text-gray-500">Create a new product listing</p>
            </div>
          </div>
        </Link>

        <Link
          href="/account/listings"
          className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 p-5 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                My Listings
              </h3>
              <p className="text-sm text-gray-500">View and manage your products</p>
            </div>
          </div>
        </Link>

        <Link
          href="/account/messages"
          className="group bg-white rounded-xl border-2 border-gray-100 hover:border-purple-300 p-5 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                Messages
              </h3>
              <p className="text-sm text-gray-500">Chat with your customers</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
