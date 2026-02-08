import { Metadata } from 'next';
import Link from 'next/link';
import { strapi, buildQueryString } from '@/lib/strapi';
import {
  Search, Briefcase, Utensils, Truck, Church, GraduationCap,
  Calendar, Heart, Compass, Trophy, Building2, Home, MapPin,
  ShoppingBag, FileText, Plus, ArrowRight
} from 'lucide-react';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search across all of Navarro County',
};

// Define searchable sections
const SEARCH_SECTIONS = [
  {
    key: 'businesses',
    label: 'Business Directory',
    icon: Building2,
    color: 'bg-blue-100 text-blue-600',
    strapiType: 'local-businesses',
    filters: { businessType: { $eq: 'business' } },
    nameField: 'name',
    href: '/directory/businesses',
  },
  {
    key: 'restaurants',
    label: 'Restaurants',
    icon: Utensils,
    color: 'bg-red-100 text-red-600',
    strapiType: 'restaurants',
    filters: {},
    nameField: 'name',
    href: '/directory/restaurants',
  },
  {
    key: 'food-trucks',
    label: 'Food Trucks',
    icon: Truck,
    color: 'bg-yellow-100 text-yellow-600',
    strapiType: 'local-businesses',
    filters: { businessType: { $eq: 'food-truck' } },
    nameField: 'name',
    href: '/directory/food-trucks',
  },
  {
    key: 'churches',
    label: 'Churches',
    icon: Church,
    color: 'bg-indigo-100 text-indigo-600',
    strapiType: 'churches',
    filters: {},
    nameField: 'name',
    href: '/directory/churches',
  },
  {
    key: 'schools',
    label: 'Schools',
    icon: GraduationCap,
    color: 'bg-cyan-100 text-cyan-600',
    strapiType: 'schools',
    filters: {},
    nameField: 'name',
    href: '/directory/schools',
  },
  {
    key: 'events',
    label: 'Events',
    icon: Calendar,
    color: 'bg-pink-100 text-pink-600',
    strapiType: 'events',
    filters: {},
    nameField: 'title',
    href: '/directory/events',
  },
  {
    key: 'community-resources',
    label: 'Community Resources',
    icon: Heart,
    color: 'bg-rose-100 text-rose-600',
    strapiType: 'local-businesses',
    filters: { businessType: { $eq: 'community-resource' } },
    nameField: 'name',
    href: '/directory/community-resources',
  },
  {
    key: 'attractions',
    label: 'Explore Navarro',
    icon: Compass,
    color: 'bg-teal-100 text-teal-600',
    strapiType: 'local-businesses',
    filters: { businessType: { $eq: 'attraction' } },
    nameField: 'name',
    href: '/directory/attractions',
  },
  {
    key: 'sports-teams',
    label: 'Sports Teams',
    icon: Trophy,
    color: 'bg-orange-100 text-orange-600',
    strapiType: 'local-businesses',
    filters: { businessType: { $eq: 'sports-team' } },
    nameField: 'name',
    href: '/directory/sports-teams',
  },
  {
    key: 'real-estate',
    label: 'Real Estate',
    icon: Home,
    color: 'bg-amber-100 text-amber-600',
    strapiType: 'real-estates',
    filters: {},
    nameField: 'title',
    href: '/directory/real-estate',
  },
  {
    key: 'jobs',
    label: 'Jobs & Gigs',
    icon: Briefcase,
    color: 'bg-green-100 text-green-600',
    strapiType: 'jobs',
    filters: {},
    nameField: 'title',
    href: '/directory/jobs',
  },
  {
    key: 'guides',
    label: 'Local Guides',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600',
    strapiType: 'service-pages',
    filters: {},
    nameField: 'title',
    href: '/guides',
  },
];

// Generate word variants for flexible search
function getWordVariants(word: string): string[] {
  const variants = [word];
  if (word.endsWith('y') && !['ay', 'ey', 'oy', 'uy'].some(v => word.endsWith(v))) {
    variants.push(word.slice(0, -1) + 'ies');
  } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
    variants.push(word + 'es');
  } else {
    variants.push(word + 's');
  }
  if (word.endsWith('ies')) {
    variants.push(word.slice(0, -3) + 'y');
  } else if (word.endsWith('es')) {
    variants.push(word.slice(0, -2));
  } else if (word.endsWith('s') && word.length > 3) {
    variants.push(word.slice(0, -1));
  }
  return [...new Set(variants)];
}

async function searchSection(
  section: typeof SEARCH_SECTIONS[0],
  query: string
): Promise<{ section: typeof SEARCH_SECTIONS[0]; results: any[]; total: number }> {
  try {
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const allVariants = words.flatMap(getWordVariants);

    // Build search filters
    const searchFilters: any[] = [];
    for (const variant of allVariants) {
      searchFilters.push({ [section.nameField]: { $containsi: variant } });
      if (section.key !== 'guides') {
        searchFilters.push({ searchKeywords: { $containsi: variant } });
      }
    }

    const filters: any = {
      $and: [
        section.filters,
        { $or: searchFilters },
      ].filter(f => Object.keys(f).length > 0),
    };

    // If no base filters, simplify
    if (Object.keys(section.filters).length === 0) {
      filters.$and = [{ $or: searchFilters }];
    }

    const response = await strapi.directory.find(section.strapiType, {
      filters: filters.$and.length > 0 ? { $and: filters.$and } : {},
      pagination: { pageSize: 5 },
      sort: `${section.nameField}:asc`,
      populate: ['town'],
    });

    return {
      section,
      results: response.data || [],
      total: response.meta?.pagination?.total || response.data?.length || 0,
    };
  } catch (error) {
    console.error(`Search error for ${section.key}:`, error);
    return { section, results: [], total: 0 };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.search === 'string' ? params.search : '';

  let searchResults: { section: typeof SEARCH_SECTIONS[0]; results: any[]; total: number }[] = [];

  if (query.trim()) {
    // Search all sections in parallel
    searchResults = await Promise.all(
      SEARCH_SECTIONS.map(section => searchSection(section, query))
    );

    // Sort by number of results (most results first)
    searchResults.sort((a, b) => b.total - a.total);
  }

  const totalResults = searchResults.reduce((sum, r) => sum + r.total, 0);
  const sectionsWithResults = searchResults.filter(r => r.total > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_homepage_1d91226b7c.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        {/* List Button - Top Right */}
        <Link
          href="/marketplace/sell"
          className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          List Something
        </Link>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            Search Navarro County
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Find businesses, restaurants, local guides, events, and more
          </p>
          <form action="/search" method="get" className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  defaultValue={query}
                  placeholder="Search businesses, restaurants, guides..."
                  className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-full"
                />
              </div>
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
        href="/featured-spot?type=homepage-featured"
        label="FEATURED BUSINESS"
        title="Advertise Your Business"
        description="Get premium placement in search results"
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!query.trim() ? (
          /* No query - show browse options */
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Everything</h2>
            <p className="text-gray-600 mb-8">
              Enter a search term to find businesses, restaurants, local guides, events, and more across Navarro County.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SEARCH_SECTIONS.slice(0, 8).map(section => (
                <Link
                  key={section.key}
                  href={section.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center`}>
                    <section.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{section.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          /* No results */
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find anything matching "<span className="font-medium">{query}</span>"
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Try different keywords or browse our categories below.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SEARCH_SECTIONS.slice(0, 8).map(section => (
                <Link
                  key={section.key}
                  href={section.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center`}>
                    <section.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{section.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Results found */
          <div>
            <p className="text-gray-600 mb-6">
              Found <span className="font-semibold text-gray-900">{totalResults}</span> results for "<span className="font-medium">{query}</span>" across <span className="font-semibold text-gray-900">{sectionsWithResults.length}</span> categories
            </p>

            <div className="space-y-6">
              {sectionsWithResults.map(({ section, results, total }) => (
                <div key={section.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Section Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center`}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{section.label}</h2>
                        <p className="text-sm text-gray-500">{total} result{total !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <Link
                      href={`${section.href}?search=${encodeURIComponent(query)}`}
                      className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1"
                    >
                      View all <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Preview Results */}
                  <div className="divide-y divide-gray-100">
                    {results.slice(0, 3).map((item: any) => (
                      <Link
                        key={item.documentId || item.id}
                        href={section.key === 'guides'
                          ? `/guides/${item.slug}`
                          : `${section.href}/${item.slug || item.documentId}`}
                        className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item[section.nameField]}
                          </p>
                          {item.town?.name && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {item.town.name}
                            </p>
                          )}
                          {item.cuisine && (
                            <p className="text-sm text-gray-500">{item.cuisine}</p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>

                  {/* View More */}
                  {total > 3 && (
                    <Link
                      href={`${section.href}?search=${encodeURIComponent(query)}`}
                      className="block px-6 py-3 bg-gray-50 text-center text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-gray-100 transition-colors"
                    >
                      View all {total} results in {section.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
