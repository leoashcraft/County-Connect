import Link from 'next/link';
import { Metadata } from 'next';
import {
  Home, Wrench, Briefcase, Heart, Car, Music, Utensils, Leaf,
  Hammer, Scissors, GraduationCap, ShoppingBag, Bed, Factory,
  Search, BookOpen, ArrowRight
} from 'lucide-react';
import { strapi } from '@/lib/strapi';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Navarro County Guides',
  description: 'Your guide to services, resources, and information in Navarro County, Texas. Browse 300+ local guides.',
};

const CATEGORY_ICONS: Record<string, any> = {
  home_services: Home,
  professional_services: Briefcase,
  health_wellness: Heart,
  automotive: Car,
  events_entertainment: Music,
  food_beverage: Utensils,
  agriculture_rural: Leaf,
  construction_trades: Hammer,
  beauty_personal_care: Scissors,
  education_childcare: GraduationCap,
  retail: ShoppingBag,
  lodging_travel: Bed,
  industrial_commercial: Factory,
};

const CATEGORY_COLORS: Record<string, string> = {
  home_services: 'bg-blue-100 text-blue-600',
  professional_services: 'bg-purple-100 text-purple-600',
  health_wellness: 'bg-rose-100 text-rose-600',
  automotive: 'bg-gray-100 text-gray-600',
  events_entertainment: 'bg-pink-100 text-pink-600',
  food_beverage: 'bg-red-100 text-red-600',
  agriculture_rural: 'bg-green-100 text-green-600',
  construction_trades: 'bg-amber-100 text-amber-600',
  beauty_personal_care: 'bg-fuchsia-100 text-fuchsia-600',
  education_childcare: 'bg-cyan-100 text-cyan-600',
  retail: 'bg-indigo-100 text-indigo-600',
  lodging_travel: 'bg-teal-100 text-teal-600',
  industrial_commercial: 'bg-slate-100 text-slate-600',
};

export default async function GuidesPage() {
  let servicePages: any[] = [];
  let categories: any[] = [];

  try {
    const [pagesRes, catsRes] = await Promise.all([
      strapi.servicePages.find({
        filters: { status: { $eq: 'active' } },
        fields: ['title', 'slug', 'subcategory', 'icon', 'iconColor', 'metaDescription'],
        populate: { category: { fields: ['name', 'slug'] } },
        pagination: { pageSize: 500 },
        sort: 'title:asc',
      }),
      strapi.serviceCategories.find({ sort: 'name:asc' }),
    ]);
    servicePages = pagesRes.data || [];
    categories = catsRes.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
  }

  // Group services by category
  const groupedServices: Record<string, any[]> = {};
  for (const page of servicePages) {
    const cat = page.category?.slug || page.category?.name || page.subcategory || 'other';
    if (!groupedServices[cat]) groupedServices[cat] = [];
    groupedServices[cat].push(page);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_services_14b175b086.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            Navarro County Guides
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Your guide to services, resources, and information in Navarro County
          </p>

          {/* Search Bar */}
          <form action="/search" method="get" className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search guides..."
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
        href="/featured-spot?type=guide-featured"
        label="FEATURED GUIDE"
        title="Get Your Business Featured"
        description="Reach Navarro County residents searching for local info"
      />

      {/* Services Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {Object.entries(groupedServices).map(([category, pages]) => {
            const IconComponent = CATEGORY_ICONS[category] || Briefcase;
            const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600';

            return (
              <div key={category} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {category.replace(/_/g, ' ')}
                  </h2>
                  <span className="text-sm text-gray-500">({pages.length} guides)</span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pages.map((page: any) => (
                    <Link
                      key={page.slug}
                      href={`/guides/${page.slug}`}
                      className="group bg-white rounded-xl border-2 border-gray-100 hover:border-brand-300 hover:shadow-md p-4 transition-all duration-200"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors mb-1">
                        {page.title}
                      </h3>
                      {page.metaDescription && (
                        <p className="text-sm text-gray-500 line-clamp-2">{page.metaDescription}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm text-brand-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {servicePages.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No guides found</h2>
              <p className="text-gray-500">Guides will appear here once they are added to the CMS.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
