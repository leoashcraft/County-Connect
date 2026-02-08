import { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Edit } from 'lucide-react';
import { DASHBOARD_SECTIONS } from '@/lib/dashboard-config';
import { DashboardTiles } from './dashboard-tiles';
import { DashboardCustomizer } from './dashboard-customizer';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Fetch user's content counts to determine auto-show sections
async function getUserContentCounts(userId: number, token: string) {
  const counts: Record<string, number> = {};

  const contentTypes = [
    { key: 'restaurants', endpoint: 'restaurants', ownerField: 'owner' },
    { key: 'churches', endpoint: 'churches', ownerField: 'owner' },
    { key: 'schools', endpoint: 'schools', ownerField: 'owner' },
    { key: 'jobs', endpoint: 'jobs', ownerField: 'postedBy' },
    { key: 'real-estates', endpoint: 'real-estates', ownerField: 'listedBy' },
    { key: 'orders', endpoint: 'orders', ownerField: 'user' },
    { key: 'local-businesses', endpoint: 'local-businesses', ownerField: 'owner' },
    { key: 'marketplace-listings', endpoint: 'marketplace-listings', ownerField: 'seller' },
    { key: 'service-listings', endpoint: 'service-listings', ownerField: 'provider' },
  ];

  await Promise.all(
    contentTypes.map(async ({ key, endpoint, ownerField }) => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/${endpoint}?filters[${ownerField}][id][$eq]=${userId}&pagination[pageSize]=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          counts[key] = data.meta?.pagination?.total || 0;
        }
      } catch {
        counts[key] = 0;
      }
    })
  );

  // Get local-business counts by businessType
  try {
    const businessTypes = ['business', 'food-truck', 'sports-team', 'community-resource'];
    await Promise.all(
      businessTypes.map(async (type) => {
        const res = await fetch(
          `${STRAPI_URL}/api/local-businesses?filters[owner][id][$eq]=${userId}&filters[businessType][$eq]=${type}&pagination[pageSize]=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          counts[`local-businesses-${type}`] = data.meta?.pagination?.total || 0;
        }
      })
    );
  } catch {}

  return counts;
}

// Fetch user's dashboard preferences
async function getDashboardPreferences(userId: number, token: string) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/dashboard-preferences?filters[user][id][$eq]=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data.data?.[0] || null;
    }
  } catch {}
  return null;
}

export default async function AccountDashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account');
  }

  const user = session.user;
  const userId = (user as any).strapiUserId;
  const token = (user as any).strapiToken;

  // Fetch preferences and content counts
  const [preferences, contentCounts] = await Promise.all([
    getDashboardPreferences(userId, token),
    getUserContentCounts(userId, token),
  ]);

  const visibleSections: string[] = preferences?.visibleSections || [];
  const hasCustomPreferences = !!preferences;

  // Determine which sections to show
  const sectionsToShow = DASHBOARD_SECTIONS.filter((section) => {
    // Always show fixed sections
    if (section.alwaysVisible) return true;

    // If user has custom preferences, use those
    if (hasCustomPreferences) {
      return visibleSections.includes(section.id);
    }

    // Default behavior: show defaultVisible sections
    if (section.defaultVisible) return true;

    // Auto-show if user has content of this type
    if (section.contentType) {
      if (section.businessType) {
        return (contentCounts[`local-businesses-${section.businessType}`] || 0) > 0;
      }
      return (contentCounts[section.contentType] || 0) > 0;
    }

    return false;
  });

  // Sections available but not currently shown
  const hiddenSections = DASHBOARD_SECTIONS.filter(
    (section) => !section.alwaysVisible && !sectionsToShow.includes(section)
  );

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-600">
          Manage your account, listings, orders, and more from your dashboard.
        </p>
      </div>

      {/* Quick Profile Card */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-2xl">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name || 'User'}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <Link
            href="/account/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Dashboard Tiles Grid */}
      <DashboardTiles visibleSectionIds={sectionsToShow.map((s) => s.id)} />

      {/* Customize Dashboard */}
      <DashboardCustomizer
        visibleSectionIds={sectionsToShow.map((s) => s.id)}
        contentCounts={contentCounts}
        preferencesId={preferences?.documentId}
      />
    </div>
  );
}
