import { Metadata } from 'next';
import Link from 'next/link';
import { strapiGet, buildQueryString } from '@/lib/strapi';
import { ScrollText, MapPin, Calendar, Tag, Plus, ChevronRight, Search } from 'lucide-react';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Bulletin Board',
  description: 'Community bulletin board for Navarro County, Texas. Post announcements, free items, rideshares, and more.',
};

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  general: { label: 'General', color: 'bg-blue-100 text-blue-700' },
  free_swap: { label: 'Free / Swap', color: 'bg-green-100 text-green-700' },
  rideshare: { label: 'Rideshare', color: 'bg-purple-100 text-purple-700' },
  babysitters: { label: 'Babysitters', color: 'bg-pink-100 text-pink-700' },
  church_nonprofit: { label: 'Church / Nonprofit', color: 'bg-lime-100 text-lime-700' },
  volunteers: { label: 'Volunteers', color: 'bg-teal-100 text-teal-700' },
};

export default async function BulletinBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const qp = await searchParams;
  const page = Number(qp.page) || 1;
  const category = typeof qp.category === 'string' ? qp.category : undefined;
  const search = typeof qp.search === 'string' ? qp.search : undefined;

  let posts: any[] = [];
  let totalPages = 1;

  try {
    const filters: Record<string, any> = { status: { $eq: 'active' } };
    if (category) filters.category = { $eq: category };
    if (search) filters.title = { $contains: search };

    const res = await strapiGet<any[]>(`/bulletin-posts${buildQueryString({
      filters,
      populate: ['town', 'author'],
      sort: 'createdAt:desc',
      pagination: { page, pageSize: 20 },
    })}`);

    posts = res.data || [];
    totalPages = res.meta.pagination?.pageCount || 1;
  } catch (error) {
    console.error('Error fetching bulletin posts:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_bulletin_d4c998cdd6.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
        fallbackColor="bg-lime-700"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        {/* Post Button - Top Right */}
        <Link
          href="/community/bulletin/add"
          className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Post to Board
        </Link>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            Bulletin Board
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Community announcements and classifieds in Navarro County
          </p>

          {/* Search Bar */}
          <form action="/community/bulletin" method="get" className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ''}
                  placeholder="Search bulletin board..."
                  className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-full"
                />
              </div>
              <button
                type="submit"
                className="w-12 h-12 mr-2 bg-lime-600 hover:bg-lime-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </HeroBackground>

      <FeaturedSponsor
        href="/featured-spot?type=directory-featured&page=/community/bulletin"
        label="FEATURED SPONSOR"
        title="Advertise Your Business"
        description="Reach the Navarro County community"
        gradientClass="from-lime-50 to-lime-100"
        borderClass="border-lime-200"
        sideBgClass="bg-lime-100"
        textClass="text-lime-600"
        buttonBgClass="bg-lime-600"
        buttonHoverClass="hover:bg-lime-700"
      />

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/community/bulletin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!category ? 'bg-lime-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              All
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
              <Link
                key={key}
                href={`/community/bulletin?category=${key}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === key ? 'bg-lime-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post: any) => {
                const catInfo = CATEGORY_LABELS[post.category] || CATEGORY_LABELS.general;
                return (
                  <div
                    key={post.documentId}
                    className="bg-white rounded-xl border-2 border-gray-100 hover:border-lime-300 hover:shadow-md p-6 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catInfo.color}`}>
                            {catInfo.label}
                          </span>
                          {post.town?.name && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {post.town.name}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.description?.replace(/[#*_]/g, '').slice(0, 200)}</p>
                      </div>
                      <div className="text-right text-xs text-gray-400 whitespace-nowrap">
                        {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
                        {post.expiresAt && (
                          <p className="mt-1">
                            Expires: {new Date(post.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {(post.contactName || post.contactPhone || post.contactEmail) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600">
                        {post.contactName && <span>Contact: {post.contactName}</span>}
                        {post.contactPhone && <a href={`tel:${post.contactPhone}`} className="text-lime-600 hover:underline">{post.contactPhone}</a>}
                        {post.contactEmail && <a href={`mailto:${post.contactEmail}`} className="text-lime-600 hover:underline">{post.contactEmail}</a>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <ScrollText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h2>
              <p className="text-gray-500 mb-6">Be the first to post on the community bulletin board!</p>
              <Link
                href="/community/bulletin/add"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-lime-600 text-white rounded-xl font-semibold hover:bg-lime-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Post to Board
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/community/bulletin?page=${p}${category ? `&category=${category}` : ''}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page ? 'bg-lime-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
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
