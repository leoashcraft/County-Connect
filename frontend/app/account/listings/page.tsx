'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ShoppingBag, Eye } from 'lucide-react';

export default function MyListingsPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) loadListings();
  }, [session]);

  const loadListings = async () => {
    try {
      const token = (session?.user as any)?.strapiToken;
      const userId = (session?.user as any)?.strapiUserId;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/marketplace-listings?filters[seller][id][$eq]=${userId}&populate=images&sort=createdAt:desc`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      setListings(data.data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <Link
          href="/marketplace/sell"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Listing
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing: any) => (
            <div key={listing.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {listing.images?.[0] ? (
                  <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-lg font-bold text-blue-600">${Number(listing.price).toLocaleString()}</p>
                <p className="text-sm text-gray-500 capitalize">{listing.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/marketplace/${listing.id}`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Eye className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h2>
          <p className="text-gray-500 mb-6">Start selling something to your community!</p>
          <Link
            href="/marketplace/sell"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Listing
          </Link>
        </div>
      )}
    </div>
  );
}
