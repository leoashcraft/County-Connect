import Link from 'next/link';
import { Search, Plus } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchAction?: string;
  searchDefaultValue?: string;
  showListButton?: boolean;
  listButtonText?: string;
  listButtonHref?: string;
  backgroundImage?: string;
}

export function PageHero({
  title,
  subtitle,
  searchPlaceholder = 'Search...',
  searchAction = '/search',
  searchDefaultValue = '',
  showListButton = true,
  listButtonText = 'List Something',
  listButtonHref = '/marketplace/sell',
  backgroundImage,
}: PageHeroProps) {
  const bgImage = backgroundImage || `${STRAPI_URL}/uploads/bluebonnets_4f6ab757d6.avif`;

  return (
    <section
      className="relative text-white px-6 bg-cover bg-center flex items-center justify-center py-16"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="max-w-4xl mx-auto text-center w-full">
        <h1
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            {subtitle}
          </p>
        )}

        {/* Search Bar */}
        <form action={searchAction} method="get" className="flex gap-2 max-w-2xl mx-auto mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              name="search"
              defaultValue={searchDefaultValue}
              placeholder={searchPlaceholder}
              className="w-full px-5 py-3.5 pl-12 rounded-xl text-gray-900 bg-white shadow-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            Explore
          </button>
        </form>

        {/* List/Sell Button */}
        {showListButton && (
          <Link
            href={listButtonHref}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white font-medium hover:bg-white/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {listButtonText}
          </Link>
        )}
      </div>
    </section>
  );
}
