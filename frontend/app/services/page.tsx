import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Plus, Wrench, MapPin, Clock, Shield, BadgeCheck } from 'lucide-react';
import { strapiGet, buildQueryString } from '@/lib/strapi';
import { ServicesFilters } from './filters';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Services & Rentals',
  description: 'Find local service providers and rentals in Navarro County, Texas. Hire trusted professionals for any job.',
};

const PRICE_TYPE_LABELS: Record<string, string> = {
  fixed: 'Fixed Price',
  hourly: '/hour',
  daily: '/day',
  weekly: '/week',
  monthly: '/month',
  negotiable: 'Negotiable',
  free: 'Free',
  contact: 'Contact for Price',
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const listingType = typeof params.type === 'string' ? params.type : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'title:asc';

  let listings: any[] = [];
  let totalPages = 1;
  let categories: any[] = [];

  try {
    const filters: Record<string, any> = { status: { $eq: 'active' } };
    if (category) filters.category = { slug: { $eq: category } };
    if (search) {
      filters.$or = [
        { title: { $containsi: search } },
        { searchKeywords: { $containsi: search } },
      ];
    }
    if (listingType) filters.listingType = { $eq: listingType };

    const [listingsRes, catsRes] = await Promise.all([
      strapiGet<any[]>(`/service-listings${buildQueryString({
        filters,
        populate: ['images', 'category', 'provider', 'town'],
        sort,
        pagination: { page, pageSize: 24 },
      })}`),
      strapiGet<any[]>(`/service-listing-categories${buildQueryString({
        sort: 'sortOrder:asc,name:asc',
      })}`),
    ]);

    listings = listingsRes.data || [];
    totalPages = listingsRes.meta?.pagination?.pageCount || 1;
    categories = catsRes.data || [];
  } catch (error) {
    console.error('Error fetching service listings:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_services_14b175b086.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
        fallbackColor="bg-brand-700"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        {/* List Service Button - Top Right */}
        <Link
          href="/services/add"
          className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          List a Service
        </Link>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            Services & Rentals
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Find trusted local service providers and rentals in Navarro County
          </p>

          {/* Search Bar and Filters */}
          <form action="/services" method="get" className="max-w-3xl mx-auto relative z-10">
            <div className="flex items-center bg-white rounded-full shadow-lg relative z-10">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ''}
                  placeholder="Search services & rentals..."
                  className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-l-full"
                />
              </div>
              <ServicesFilters categories={categories} />
              <button
                type="submit"
                className="w-12 h-12 mr-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </HeroBackground>

      <FeaturedSponsor
        href="/featured-spot?type=directory-featured&page=/services"
        label="FEATURED SERVICE"
        title="Get Featured on Services"
        description="Promote your service to Navarro County customers"
      />

      {/* Type Tabs */}
      <section className="px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2">
            <Link
              href="/services"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !listingType ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All
            </Link>
            <Link
              href="/services?type=service"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                listingType === 'service' ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Services
            </Link>
            <Link
              href="/services?type=rental"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                listingType === 'rental' ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Rentals
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-8 px-6 pt-4">
        <div className="max-w-6xl mx-auto">
          {/* Grid */}
          {listings.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing: any) => (
                <Link
                  key={listing.documentId || listing.id}
                  href={`/services/${listing.documentId || listing.id}`}
                  className="group bg-white rounded-xl border-2 border-gray-100 hover:border-brand-300 hover:shadow-lg overflow-hidden transition-all duration-200"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wrench className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      listing.listingType === 'rental' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'
                    }`}>
                      {listing.listingType === 'rental' ? 'Rental' : 'Service'}
                    </span>
                    {listing.featured && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                    {listing.price && listing.priceType !== 'contact' ? (
                      <p className="text-lg font-bold text-brand-600 mt-1">
                        ${Number(listing.price).toLocaleString()}
                        {listing.priceType && listing.priceType !== 'fixed' && (
                          <span className="text-sm font-normal text-gray-500">
                            {PRICE_TYPE_LABELS[listing.priceType] || ''}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">
                        {PRICE_TYPE_LABELS[listing.priceType] || 'Contact for Price'}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      {listing.town?.name && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {listing.town.name}
                        </span>
                      )}
                      {listing.licensed && (
                        <span className="flex items-center gap-1 text-green-600">
                          <BadgeCheck className="w-3 h-3" />
                          Licensed
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h2>
              <p className="text-gray-500 mb-6">Be the first to list a service or rental!</p>
              <Link
                href="/services/add"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                List a Service
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/services?page=${p}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}${listingType ? `&type=${listingType}` : ''}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-brand-600 text-white'
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
