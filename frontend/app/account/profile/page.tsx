import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { ProfileForm } from './profile-form';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const metadata: Metadata = {
  title: 'My Profile',
};

// Disable page caching to always get fresh data
export const dynamic = 'force-dynamic';

interface Town {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

interface UserProfile {
  id: number;
  full_name: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  preferred_town: Town | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  profile_completed: boolean;
  picture: string | null;
}

async function getUserProfile(userId: number): Promise<{ profile: UserProfile | null; error?: string }> {
  try {
    // Use API token to fetch user with populated relations
    const res = await fetch(
      `${STRAPI_URL}/api/users/${userId}?populate=preferred_town`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: 'no-store',
      }
    );

    if (res.ok) {
      const data = await res.json();
      return { profile: data };
    } else {
      const errorData = await res.json().catch(() => ({}));
      console.error('Profile fetch failed:', res.status, errorData);
      return { profile: null, error: errorData?.error?.message || `Status ${res.status}` };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { profile: null, error: 'Network error' };
  }
}

async function getTowns(): Promise<Town[]> {
  try {
    // Fetch towns without auth - they're public data
    const res = await fetch(
      `${STRAPI_URL}/api/towns?sort=name:asc&pagination[pageSize]=100`,
      {
        cache: 'no-store', // Always fetch fresh
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    } else {
      console.error('Towns fetch failed:', res.status);
    }
  } catch (error) {
    console.error('Error fetching towns:', error);
  }
  return [];
}

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/profile');
  }

  const user = session.user;
  const userId = (user as any).strapiUserId;
  const token = (user as any).strapiToken;

  if (!userId || !token) {
    redirect('/login?callbackUrl=/account/profile');
  }

  // Fetch user profile and towns in parallel
  const [profileResult, towns] = await Promise.all([
    getUserProfile(userId),
    getTowns(),
  ]);

  if (!profileResult.profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load profile. Please try again later.</p>
        {profileResult.error && (
          <p className="text-sm text-red-500 mt-2">Error: {profileResult.error}</p>
        )}
      </div>
    );
  }

  const profile = profileResult.profile;

  // Ensure we have picture from OAuth if not stored
  const profileWithPicture: UserProfile = {
    ...profile,
    picture: profile.picture || user.image || null,
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-orange-600">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/account" className="hover:text-orange-600">
          Account
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">My Profile</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Profile Form */}
      <ProfileForm initialProfile={profileWithPicture} towns={towns} />
    </div>
  );
}
