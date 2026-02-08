import { Metadata } from 'next';
import Link from 'next/link';
import { strapiGet, buildQueryString } from '@/lib/strapi';
import { Heart, MapPin, Calendar, Tag, Plus, ChevronRight, Search, DollarSign } from 'lucide-react';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Lost & Found',
  description: 'Lost and found pets and items in Navarro County, Texas. Help reunite pets with their families.',
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  lost_pet: { label: 'Lost Pet', color: 'bg-red-100 text-red-700' },
  found_pet: { label: 'Found Pet', color: 'bg-green-100 text-green-700' },
  lost_item: { label: 'Lost Item', color: 'bg-amber-100 text-amber-700' },
  found_item: { label: 'Found Item', color: 'bg-blue-100 text-blue-700' },
};

export default async function LostAndFoundPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const qp = await searchParams;
  const page = Number(qp.page) || 1;
  const postType = typeof qp.type === 'string' ? qp.type : undefined;

  let posts: any[] = [];
  let totalPages = 1;

  try {
    const filters: Record<string, any> = { status: { $eq: 'active' } };
    if (postType) filters.postType = { $eq: postType };

    const res = await strapiGet<any[]>(`/lost-and-found-posts${buildQueryString({
      filters,
      populate: ['town', 'images', 'author'],
      sort: 'createdAt:desc',
      pagination: { page, pageSize: 20 },
    })}`);

    posts = res.data || [];
    totalPages = res.meta.pagination?.pageCount || 1;
  } catch (error) {
    console.error('Error fetching lost and found posts:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_lost_3a40b753be.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
        fallbackColor="bg-rose-600"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        {/* Report Button - Top Right */}
        <Link
          href="/community/lost-and-found/add"
          className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Report Lost / Found
        </Link>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            Lost & Found
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Help reunite lost pets and items with their owners in Navarro County
          </p>

          {/* Search Bar */}
          <form action="/search" method="get" className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search lost & found..."
                  className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-full"
                />
              </div>
              <button
                type="submit"
                className="w-12 h-12 mr-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </HeroBackground>

      <FeaturedSponsor
        href="/featured-spot?type=directory-featured&page=/community/lost-and-found"
        label="FEATURED SPONSOR"
        title="Advertise Your Business"
        description="Reach the Navarro County community"
        gradientClass="from-rose-50 to-rose-100"
        borderClass="border-rose-200"
        sideBgClass="bg-rose-100"
        textClass="text-rose-600"
        buttonBgClass="bg-rose-500"
        buttonHoverClass="hover:bg-rose-600"
      />

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Type filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/community/lost-and-found"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!postType ? 'bg-rose-500 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              All
            </Link>
            {Object.entries(TYPE_LABELS).map(([key, { label }]) => (
              <Link
                key={key}
                href={`/community/lost-and-found?type=${key}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${postType === key ? 'bg-rose-500 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => {
                const typeInfo = TYPE_LABELS[post.postType] || TYPE_LABELS.lost_item;
                return (
                  <div
                    key={post.documentId}
                    className="bg-white rounded-xl border-2 border-gray-100 hover:border-rose-300 hover:shadow-lg overflow-hidden transition-all duration-200"
                  >
                    {post.images?.[0] && (
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={post.images[0].url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        {post.reward && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <DollarSign className="w-3 h-3" />
                            Reward{post.rewardAmount ? `: $${post.rewardAmount}` : ''}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{post.title}</h3>
                      {post.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.description.replace(/[#*_]/g, '').slice(0, 150)}</p>
                      )}
                      <div className="space-y-1 text-sm text-gray-500">
                        {post.lastSeenLocation && (
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            Last seen: {post.lastSeenLocation}
                          </p>
                        )}
                        {post.lastSeenDate && (
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.lastSeenDate).toLocaleDateString()}
                          </p>
                        )}
                        {post.town?.name && (
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {post.town.name}
                          </p>
                        )}
                      </div>
                      {post.contactPhone && (
                        <a
                          href={`tel:${post.contactPhone}`}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Call {post.contactName || 'Owner'}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h2>
              <p className="text-gray-500 mb-6">No lost or found reports at this time. That&apos;s good news!</p>
              <Link
                href="/community/lost-and-found/add"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Report Lost / Found
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/community/lost-and-found?page=${p}${postType ? `&type=${postType}` : ''}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page ? 'bg-rose-500 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
