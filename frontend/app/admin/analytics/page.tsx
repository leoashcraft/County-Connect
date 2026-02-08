'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, FileText, ShoppingBag, ShieldX } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = (session?.user as any)?.isAdmin;

  useEffect(() => {
    if (status === 'authenticated' && !isAdmin) {
      router.push('/');
    }
  }, [status, isAdmin, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <ShieldX className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Page Views (30d)', value: '--', icon: Eye, color: 'bg-blue-100 text-blue-600' },
    { label: 'Unique Visitors', value: '--', icon: Users, color: 'bg-green-100 text-green-600' },
    { label: 'Service Pages', value: '302', icon: FileText, color: 'bg-purple-100 text-purple-600' },
    { label: 'Marketplace Listings', value: '--', icon: ShoppingBag, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-orange-500" />
          Analytics
        </h1>
        <p className="text-gray-600 mt-1">Site performance and usage metrics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-amber-600" />
          <h3 className="font-semibold text-gray-900">Analytics Integration</h3>
        </div>
        <p className="text-sm text-gray-700">
          Connect Google Analytics or Umami to see detailed site metrics.
          Set NEXT_PUBLIC_GA_MEASUREMENT_ID or NEXT_PUBLIC_UMAMI_WEBSITE_ID in your environment variables.
        </p>
      </div>
    </div>
  );
}
