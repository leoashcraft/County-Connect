'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Bell, BellOff, Trash2, Plus, MapPin } from 'lucide-react';
import Link from 'next/link';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface SavedSearch {
  id: string;
  documentId: string;
  name: string;
  searchType: string;
  query: string;
  filters: any;
  alertFrequency: string;
  isActive: boolean;
  town?: { name: string };
}

const SEARCH_TYPE_LABELS: Record<string, string> = {
  jobs: 'Jobs & Gigs',
  marketplace: 'Marketplace',
  services: 'Services & Rentals',
  'real-estate': 'Real Estate',
  events: 'Events',
  all: 'All Categories',
};

const FREQUENCY_LABELS: Record<string, string> = {
  instant: 'Instant',
  daily: 'Daily',
  weekly: 'Weekly',
  none: 'Off',
};

export function SavedSearchesClient() {
  const { data: session } = useSession();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const token = (session as any)?.strapiToken;
  const userId = (session as any)?.strapiUserId;

  useEffect(() => {
    if (!token || !userId) return;

    const fetchSearches = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/saved-searches?filters[user][id][$eq]=${userId}&populate=town&sort=createdAt:desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setSearches(data.data || []);
        }
      } catch (e) {
        console.error('Error fetching saved searches:', e);
      }
      setLoading(false);
    };

    fetchSearches();
  }, [token, userId]);

  const toggleActive = async (searchId: string, currentActive: boolean) => {
    if (!token) return;
    try {
      await fetch(`${STRAPI_URL}/api/saved-searches/${searchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { isActive: !currentActive } }),
      });
      setSearches(prev =>
        prev.map(s => s.documentId === searchId ? { ...s, isActive: !currentActive } : s)
      );
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const updateFrequency = async (searchId: string, frequency: string) => {
    if (!token) return;
    try {
      await fetch(`${STRAPI_URL}/api/saved-searches/${searchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { alertFrequency: frequency } }),
      });
      setSearches(prev =>
        prev.map(s => s.documentId === searchId ? { ...s, alertFrequency: frequency } : s)
      );
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const deleteSearch = async (searchId: string) => {
    if (!token || !confirm('Delete this saved search?')) return;
    try {
      await fetch(`${STRAPI_URL}/api/saved-searches/${searchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearches(prev => prev.filter(s => s.documentId !== searchId));
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const getSearchUrl = (search: SavedSearch) => {
    const typeUrls: Record<string, string> = {
      jobs: '/directory/jobs',
      marketplace: '/marketplace',
      services: '/services',
      'real-estate': '/directory/real-estate',
      events: '/directory/events',
      all: '/search',
    };
    const base = typeUrls[search.searchType] || '/search';
    return search.query ? `${base}?search=${encodeURIComponent(search.query)}` : base;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
            <p className="text-gray-600">Get notified when new listings match your criteria</p>
          </div>
        </div>

        {searches.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-700 mb-1">No saved searches</h2>
            <p className="text-gray-500 mb-4">
              Save a search from any listing page to get notified of new matches.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {searches.map((search) => (
              <div
                key={search.documentId}
                className={`bg-white rounded-xl border border-gray-200 p-4 ${
                  !search.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={getSearchUrl(search)}
                      className="font-semibold text-gray-900 hover:text-brand-600"
                    >
                      {search.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                        {SEARCH_TYPE_LABELS[search.searchType] || search.searchType}
                      </span>
                      {search.query && (
                        <span className="flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          &quot;{search.query}&quot;
                        </span>
                      )}
                      {search.town?.name && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {search.town.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={search.alertFrequency}
                      onChange={(e) => updateFrequency(search.documentId, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="none">Off</option>
                    </select>

                    <button
                      onClick={() => toggleActive(search.documentId, search.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        search.isActive
                          ? 'text-brand-600 hover:bg-brand-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={search.isActive ? 'Pause alerts' : 'Resume alerts'}
                    >
                      {search.isActive ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => deleteSearch(search.documentId)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
