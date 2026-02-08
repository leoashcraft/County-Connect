'use client';

import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { ReactNode } from 'react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface SecondaryHeroProps {
  title: string;
  subtitle: string;
  searchAction: string;
  searchPlaceholder: string;
  searchDefaultValue?: string;
  filters?: ReactNode;
  ctaHref: string;
  ctaLabel: string;
  buttonClassName?: string;
}

export function SecondaryHero({
  title,
  subtitle,
  searchAction,
  searchPlaceholder,
  searchDefaultValue = '',
  filters,
  ctaHref,
  ctaLabel,
  buttonClassName = 'bg-brand-600 hover:bg-brand-700',
}: SecondaryHeroProps) {
  return (
    <section
      className="relative text-white px-6 bg-cover bg-center flex items-center justify-center py-16"
      style={{ backgroundImage: `url('${STRAPI_URL}/uploads/bluebonnets_4f6ab757d6.avif')` }}
    >
      {/* CTA Button - Top Right */}
      <Link
        href={ctaHref}
        className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
      >
        <Plus className="w-4 h-4 md:w-5 md:h-5" />
        {ctaLabel}
      </Link>

      <div className="max-w-4xl mx-auto text-center w-full">
        <h1
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
        >
          {title}
        </h1>
        <p
          className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
        >
          {subtitle}
        </p>

        {/* Search Bar and Filters */}
        <form action={searchAction} method="get" className="max-w-3xl mx-auto">
          <div className="flex items-center bg-white rounded-full shadow-lg">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="search"
                defaultValue={searchDefaultValue}
                placeholder={searchPlaceholder}
                className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-l-full"
              />
            </div>
            {filters}
            <button
              type="submit"
              className={`w-12 h-12 mr-2 ${buttonClassName} text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
