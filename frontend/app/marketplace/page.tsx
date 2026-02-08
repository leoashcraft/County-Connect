import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Plus, ShoppingBag, MapPin } from 'lucide-react';
import { strapi } from '@/lib/strapi';
import { MarketplaceFilters } from './filters';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Buy and sell locally in Navarro County, Texas. Browse listings for goods and services.',
};

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'title:asc';

  let listings: any[] = [];
  let totalPages = 1;
  let categories: any[] = [];

  try {
    const filters: Record<string, any> = { status: { $eq: 'active' } };
    if (category) filters.category = { slug: { $eq: category } };
    if (search) filters.title = { $contains: search };

    const [listingsRes, catsRes] = await Promise.all([
      strapi.marketplace.find({
        filters,
        populate: ['images', 'category', 'seller'],
        sort,
        pagination: { page, pageSize: 24 },
      }),
      strapi.marketplace.categories({ sort: 'name:asc' }),
    ]);

    listings = listingsRes.data || [];
    totalPages = listingsRes.meta.pagination?.pageCount || 1;
    categories = catsRes.data || [];
  } catch (error) {
    console.error('Error fetching marketplace listings:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_marketplace_04a3275bee.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
        fallbackColor="bg-blue-700"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        {/* Sell Button - Top Right */}
        <Link
          href="/marketplace/sell"
          className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Sell Something
        </Link>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            Marketplace
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Buy and sell locally in Navarro County, Texas
          </p>

          {/* Search Bar and Filters */}
          <form action="/marketplace" method="get" className="max-w-3xl mx-auto relative z-10">
            <div className="flex items-center bg-white rounded-full shadow-lg relative z-10">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ''}
                  placeholder="Search marketplace..."
                  className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-l-full"
                />
              </div>
              <MarketplaceFilters categories={categories} />
              <button
                type="submit"
                className="w-12 h-12 mr-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </HeroBackground>

      <FeaturedSponsor
        href="/featured-spot?type=directory-featured&page=/marketplace"
        label="FEATURED LISTING"
        title="Get Featured on Marketplace"
        description="Promote your listing to Navarro County buyers"
        gradientClass="from-blue-50 to-blue-100"
        borderClass="border-blue-200"
        sideBgClass="bg-blue-100"
        textClass="text-blue-600"
        buttonBgClass="bg-blue-600"
        buttonHoverClass="hover:bg-blue-700"
      />

      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Grid */}
          {listings.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing: any) => (
                <Link
                  key={listing.id}
                  href={`/marketplace/${listing.id}`}
                  className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg overflow-hidden transition-all duration-200"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {listing.condition && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 rounded-full text-xs font-medium text-gray-700">
                        {listing.condition}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-xl font-bold text-blue-600 mt-1">
                      ${Number(listing.price).toLocaleString()}
                    </p>
                    {listing.location && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h2>
              <p className="text-gray-500">Try adjusting your search or check back later.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/marketplace?page=${p}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
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
