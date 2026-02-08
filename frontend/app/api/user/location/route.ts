import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ zip: null, town: null });
    }

    const userId = (session.user as any).strapiUserId;
    if (!userId) {
      return NextResponse.json({ zip: null, town: null });
    }

    // Fetch user profile with preferred_town populated using API token
    const res = await fetch(`${STRAPI_URL}/api/users/${userId}?populate=preferred_town`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ zip: null, town: null });
    }

    const user = await res.json();

    // Get zip from preferred_town's zipCodes array (first entry is primary)
    const preferredTown = user.preferred_town;
    let zip: string | null = null;
    let townName: string | null = null;

    if (preferredTown) {
      townName = preferredTown.name;
      // zipCodes is stored as JSON array
      if (Array.isArray(preferredTown.zipCodes) && preferredTown.zipCodes.length > 0) {
        zip = preferredTown.zipCodes[0];
      }
    }

    return NextResponse.json({
      zip,
      town: townName,
    });
  } catch (error) {
    console.error('Error fetching user location:', error);
    return NextResponse.json({ zip: null, town: null });
  }
}
