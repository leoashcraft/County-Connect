import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { strapi } from '@/lib/strapi';
import { getSession } from '@/lib/auth';
import { ChevronRight, ArrowLeft, Flag, AlertCircle } from 'lucide-react';
import { ClaimForm } from './form';

// Map URL types to Strapi entity types
const ENTITY_TYPE_MAP: Record<string, string> = {
  restaurants: 'restaurant',
  churches: 'church',
  schools: 'school',
  events: 'event',
  'food-trucks': 'local-business',
  'sports-teams': 'local-business',
  'community-resources': 'local-business',
  attractions: 'local-business',
  'public-services': 'local-business',
  businesses: 'local-business',
};

// Map URL types to Strapi API types
const STRAPI_TYPE_MAP: Record<string, string> = {
  restaurants: 'restaurants',
  churches: 'churches',
  schools: 'schools',
  events: 'events',
  'food-trucks': 'local-businesses',
  'sports-teams': 'local-businesses',
  'community-resources': 'local-businesses',
  attractions: 'local-businesses',
  'public-services': 'local-businesses',
  businesses: 'local-businesses',
};

export async function generateMetadata({ params }: { params: Promise<{ type: string; id: string }> }): Promise<Metadata> {
  const { type, id } = await params;
  try {
    const strapiType = STRAPI_TYPE_MAP[type] || 'local-businesses';
    const res = await strapi.directory.findOne(strapiType, id);
    const item = res.data;
    if (!item) return { title: 'Claim Listing' };
    return {
      title: `Claim ${item.name || item.title}`,
      description: `Submit a claim request for ${item.name || item.title}`,
    };
  } catch {
    return { title: 'Claim Listing' };
  }
}

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  // Verify type is claimable
  if (!ENTITY_TYPE_MAP[type]) {
    notFound();
  }

  // Get session - require authentication
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/directory/${type}/${id}/claim`);
  }

  const strapiToken = (session.user as any)?.strapiToken;
  if (!strapiToken) {
    redirect(`/login?callbackUrl=/directory/${type}/${id}/claim`);
  }

  // Fetch the listing
  const strapiType = STRAPI_TYPE_MAP[type];
  let item: any = null;

  try {
    const res = await strapi.directory.findOne(strapiType, id);
    item = res.data;
  } catch (error) {
    console.error('Error fetching item:', error);
  }

  if (!item) notFound();

  // Check if already claimed
  const ownerField = type === 'events' ? 'organizer' : 'owner';
  const hasOwner = !!item[ownerField];

  const name = item.name || item.title;
  const label = type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const strapiEntityType = ENTITY_TYPE_MAP[type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/directory/${type}`} className="hover:text-brand-600">{label}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/directory/${type}/${id}`} className="hover:text-brand-600">{name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Claim</span>
          </nav>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link href={`/directory/${type}/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Listing
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {hasOwner ? (
            /* Already claimed */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">This Listing is Already Claimed</h1>
              <p className="text-gray-600 mb-6">
                Someone else has already claimed ownership of this listing. If you believe this is an error, please contact us.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href={`/directory/${type}/${id}`}
                  className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Return to Listing
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          ) : (
            /* Claim form */
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Flag className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Claim This Listing</h1>
                  <p className="text-gray-600">Verify your ownership to manage this listing</p>
                </div>
              </div>

              <ClaimForm
                type={type}
                entityId={id}
                entityName={name}
                strapiToken={strapiToken}
                strapiEntityType={strapiEntityType}
              />
            </>
          )}
        </div>

        {/* Info Card */}
        {!hasOwner && (
          <div className="mt-6 bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>1. We&apos;ll review your claim request within 1-2 business days</li>
              <li>2. We may contact you to verify your ownership or authorization</li>
              <li>3. Once approved, you&apos;ll be able to update your listing information</li>
              <li>4. You&apos;ll receive an email notification about your claim status</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
