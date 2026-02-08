import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { strapi } from '@/lib/strapi';
import { MapPin, Phone, Globe, ArrowRight, Search, Plus, ChevronRight, Clock } from 'lucide-react';
import { DirectoryFilters } from './filters';
import { HeroBackground } from '@/components/hero-background';
import { SaveButton, SaveableItemType } from '@/components/save-button';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Strip markdown for plain text preview
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')           // headers
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // bold
    .replace(/\*([^*]+)\*/g, '$1')       // italic
    .replace(/__([^_]+)__/g, '$1')       // bold alt
    .replace(/_([^_]+)_/g, '$1')         // italic alt
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/`([^`]+)`/g, '$1')         // inline code
    .replace(/^\s*[-*+]\s+/gm, '')       // list items
    .replace(/^\s*\d+\.\s+/gm, '')       // numbered lists
    .replace(/\n{2,}/g, ' ')             // multiple newlines
    .replace(/\n/g, ' ')                 // single newlines
    .trim();
}

// Check if a restaurant is currently open based on hours
function isCurrentlyOpen(hours: any): { isOpen: boolean; closesAt?: string; opensAt?: string } | null {
  if (!hours) return null;

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const fullDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Parse time string to minutes since midnight
  const parseTime = (timeStr: string): number => {
    const normalized = timeStr.toLowerCase().replace(/\s/g, '');
    let hrs = 0;
    let mins = 0;

    const match = normalized.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?$/);
    if (match) {
      hrs = parseInt(match[1], 10);
      mins = match[2] ? parseInt(match[2], 10) : 0;
      if (match[3] === 'pm' && hrs !== 12) hrs += 12;
      if (match[3] === 'am' && hrs === 12) hrs = 0;
    }
    return hrs * 60 + mins;
  };

  // Handle text format: "Mon-Sat: 7:00 AM - 2:00 PM, Sun: Closed"
  if (hours.text && typeof hours.text === 'string') {
    const text = hours.text.toLowerCase();
    const currentDayShort = dayNames[currentDay];
    const currentDayFull = fullDayNames[currentDay];

    // Check if today is explicitly closed
    const closedPattern = new RegExp(`${currentDayShort}[a-z]*\\s*:\\s*closed`, 'i');
    if (closedPattern.test(text)) {
      return { isOpen: false };
    }

    // Parse ranges like "Mon-Sat: 7:00 AM - 2:00 PM"
    const rangePattern = /([a-z]{3})-([a-z]{3}):\s*(\d{1,2}:\d{2}\s*[ap]m)\s*-\s*(\d{1,2}:\d{2}\s*[ap]m)/gi;
    let match;
    while ((match = rangePattern.exec(text)) !== null) {
      const startDay = dayNames.indexOf(match[1].toLowerCase());
      const endDay = dayNames.indexOf(match[2].toLowerCase());
      const openTime = match[3];
      const closeTime = match[4];

      // Check if current day is in range
      let inRange = false;
      if (startDay <= endDay) {
        inRange = currentDay >= startDay && currentDay <= endDay;
      } else {
        // Handles wrap-around like Fri-Mon
        inRange = currentDay >= startDay || currentDay <= endDay;
      }

      if (inRange) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const openMinutes = parseTime(openTime);
        const closeMinutes = parseTime(closeTime);
        const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
        return { isOpen, closesAt: isOpen ? closeTime : undefined };
      }
    }

    // If no range matched, assume closed
    return { isOpen: false };
  }

  // Handle structured format: { monday: { open: "9:00", close: "17:00" } }
  if (typeof hours === 'object') {
    const todayKey = fullDayNames[currentDay];
    const todayHours = hours[todayKey];

    if (!todayHours || todayHours.closed || todayHours === 'closed') {
      return { isOpen: false };
    }

    if (todayHours.open && todayHours.close) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const openMinutes = parseTime(todayHours.open);
      const closeMinutes = parseTime(todayHours.close);

      if (closeMinutes < openMinutes) {
        const isOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
        return { isOpen, closesAt: isOpen ? todayHours.close : undefined };
      }

      const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
      return { isOpen, closesAt: isOpen ? todayHours.close : undefined };
    }
  }

  return null;
}

// Map URL slugs to Strapi collection types
type DirectoryTheme = {
  gradient: string;
  subtitleText: string;
  breadcrumbText: string;
  btnText: string;
  btnHoverBg: string;
  ctaBg: string;
  ctaHoverBg: string;
  cardBorder: string;
  cardText: string;
  paginationBg: string;
  featuredGradient: string;
  featuredBorder: string;
  featuredSideBg: string;
  featuredText: string;
  heroBg: string;
};

const THEMES: Record<string, DirectoryTheme> = {
  red:      { gradient: 'from-red-500 via-rose-500 to-red-600', subtitleText: 'text-red-100', breadcrumbText: 'text-red-200', btnText: 'text-red-600', btnHoverBg: 'hover:bg-red-50', ctaBg: 'bg-red-600', ctaHoverBg: 'hover:bg-red-700', cardBorder: 'hover:border-red-300', cardText: 'group-hover:text-red-600', paginationBg: 'bg-red-600', featuredGradient: 'from-red-50 to-red-100', featuredBorder: 'border-red-200', featuredSideBg: 'bg-red-100', featuredText: 'text-red-600', heroBg: 'bg-red-700' },
  indigo:   { gradient: 'from-indigo-500 via-violet-500 to-indigo-600', subtitleText: 'text-indigo-100', breadcrumbText: 'text-indigo-200', btnText: 'text-indigo-600', btnHoverBg: 'hover:bg-indigo-50', ctaBg: 'bg-indigo-600', ctaHoverBg: 'hover:bg-indigo-700', cardBorder: 'hover:border-indigo-300', cardText: 'group-hover:text-indigo-600', paginationBg: 'bg-indigo-600', featuredGradient: 'from-indigo-50 to-indigo-100', featuredBorder: 'border-indigo-200', featuredSideBg: 'bg-indigo-100', featuredText: 'text-indigo-600', heroBg: 'bg-indigo-700' },
  cyan:     { gradient: 'from-cyan-500 via-sky-500 to-cyan-600', subtitleText: 'text-cyan-100', breadcrumbText: 'text-cyan-200', btnText: 'text-cyan-600', btnHoverBg: 'hover:bg-cyan-50', ctaBg: 'bg-cyan-600', ctaHoverBg: 'hover:bg-cyan-700', cardBorder: 'hover:border-cyan-300', cardText: 'group-hover:text-cyan-600', paginationBg: 'bg-cyan-600', featuredGradient: 'from-cyan-50 to-cyan-100', featuredBorder: 'border-cyan-200', featuredSideBg: 'bg-cyan-100', featuredText: 'text-cyan-600', heroBg: 'bg-cyan-700' },
  amber:    { gradient: 'from-amber-600 via-yellow-600 to-amber-700', subtitleText: 'text-amber-100', breadcrumbText: 'text-amber-200', btnText: 'text-amber-700', btnHoverBg: 'hover:bg-amber-50', ctaBg: 'bg-amber-700', ctaHoverBg: 'hover:bg-amber-800', cardBorder: 'hover:border-amber-300', cardText: 'group-hover:text-amber-700', paginationBg: 'bg-amber-700', featuredGradient: 'from-amber-50 to-amber-100', featuredBorder: 'border-amber-200', featuredSideBg: 'bg-amber-100', featuredText: 'text-amber-700', heroBg: 'bg-amber-700' },
  emerald:  { gradient: 'from-emerald-500 via-green-500 to-emerald-600', subtitleText: 'text-emerald-100', breadcrumbText: 'text-emerald-200', btnText: 'text-emerald-600', btnHoverBg: 'hover:bg-emerald-50', ctaBg: 'bg-emerald-600', ctaHoverBg: 'hover:bg-emerald-700', cardBorder: 'hover:border-emerald-300', cardText: 'group-hover:text-emerald-600', paginationBg: 'bg-emerald-600', featuredGradient: 'from-emerald-50 to-emerald-100', featuredBorder: 'border-emerald-200', featuredSideBg: 'bg-emerald-100', featuredText: 'text-emerald-600', heroBg: 'bg-emerald-700' },
  sky:      { gradient: 'from-sky-400 via-blue-400 to-sky-500', subtitleText: 'text-sky-100', breadcrumbText: 'text-sky-200', btnText: 'text-sky-600', btnHoverBg: 'hover:bg-sky-50', ctaBg: 'bg-sky-600', ctaHoverBg: 'hover:bg-sky-700', cardBorder: 'hover:border-sky-300', cardText: 'group-hover:text-sky-600', paginationBg: 'bg-sky-600', featuredGradient: 'from-sky-50 to-sky-100', featuredBorder: 'border-sky-200', featuredSideBg: 'bg-sky-100', featuredText: 'text-sky-600', heroBg: 'bg-sky-700' },
  pink:     { gradient: 'from-pink-400 via-rose-400 to-pink-500', subtitleText: 'text-pink-100', breadcrumbText: 'text-pink-200', btnText: 'text-pink-600', btnHoverBg: 'hover:bg-pink-50', ctaBg: 'bg-pink-500', ctaHoverBg: 'hover:bg-pink-600', cardBorder: 'hover:border-pink-300', cardText: 'group-hover:text-pink-600', paginationBg: 'bg-pink-500', featuredGradient: 'from-pink-50 to-pink-100', featuredBorder: 'border-pink-200', featuredSideBg: 'bg-pink-100', featuredText: 'text-pink-600', heroBg: 'bg-pink-600' },
  violet:   { gradient: 'from-violet-500 via-purple-500 to-violet-600', subtitleText: 'text-violet-100', breadcrumbText: 'text-violet-200', btnText: 'text-violet-600', btnHoverBg: 'hover:bg-violet-50', ctaBg: 'bg-violet-600', ctaHoverBg: 'hover:bg-violet-700', cardBorder: 'hover:border-violet-300', cardText: 'group-hover:text-violet-600', paginationBg: 'bg-violet-600', featuredGradient: 'from-violet-50 to-violet-100', featuredBorder: 'border-violet-200', featuredSideBg: 'bg-violet-100', featuredText: 'text-violet-600', heroBg: 'bg-violet-700' },
  slate:    { gradient: 'from-slate-600 via-gray-600 to-slate-700', subtitleText: 'text-slate-200', breadcrumbText: 'text-slate-300', btnText: 'text-slate-600', btnHoverBg: 'hover:bg-slate-50', ctaBg: 'bg-slate-600', ctaHoverBg: 'hover:bg-slate-700', cardBorder: 'hover:border-slate-300', cardText: 'group-hover:text-slate-600', paginationBg: 'bg-slate-600', featuredGradient: 'from-slate-50 to-slate-100', featuredBorder: 'border-slate-200', featuredSideBg: 'bg-slate-100', featuredText: 'text-slate-600', heroBg: 'bg-slate-700' },
  blue:     { gradient: 'from-blue-500 via-sky-500 to-blue-600', subtitleText: 'text-blue-100', breadcrumbText: 'text-blue-200', btnText: 'text-blue-600', btnHoverBg: 'hover:bg-blue-50', ctaBg: 'bg-blue-600', ctaHoverBg: 'hover:bg-blue-700', cardBorder: 'hover:border-blue-300', cardText: 'group-hover:text-blue-600', paginationBg: 'bg-blue-600', featuredGradient: 'from-blue-50 to-blue-100', featuredBorder: 'border-blue-200', featuredSideBg: 'bg-blue-100', featuredText: 'text-blue-600', heroBg: 'bg-blue-700' },
  rose:     { gradient: 'from-rose-500 via-pink-400 to-rose-500', subtitleText: 'text-rose-100', breadcrumbText: 'text-rose-200', btnText: 'text-rose-600', btnHoverBg: 'hover:bg-rose-50', ctaBg: 'bg-rose-500', ctaHoverBg: 'hover:bg-rose-600', cardBorder: 'hover:border-rose-300', cardText: 'group-hover:text-rose-600', paginationBg: 'bg-rose-500', featuredGradient: 'from-rose-50 to-rose-100', featuredBorder: 'border-rose-200', featuredSideBg: 'bg-rose-100', featuredText: 'text-rose-600', heroBg: 'bg-rose-600' },
  teal:     { gradient: 'from-teal-500 via-emerald-500 to-teal-600', subtitleText: 'text-teal-100', breadcrumbText: 'text-teal-200', btnText: 'text-teal-600', btnHoverBg: 'hover:bg-teal-50', ctaBg: 'bg-teal-600', ctaHoverBg: 'hover:bg-teal-700', cardBorder: 'hover:border-teal-300', cardText: 'group-hover:text-teal-600', paginationBg: 'bg-teal-600', featuredGradient: 'from-teal-50 to-teal-100', featuredBorder: 'border-teal-200', featuredSideBg: 'bg-teal-100', featuredText: 'text-teal-600', heroBg: 'bg-teal-700' },
  yellow:   { gradient: 'from-yellow-600 via-amber-500 to-yellow-700', subtitleText: 'text-yellow-100', breadcrumbText: 'text-yellow-200', btnText: 'text-yellow-700', btnHoverBg: 'hover:bg-yellow-50', ctaBg: 'bg-yellow-700', ctaHoverBg: 'hover:bg-yellow-800', cardBorder: 'hover:border-yellow-300', cardText: 'group-hover:text-yellow-700', paginationBg: 'bg-yellow-700', featuredGradient: 'from-yellow-50 to-yellow-100', featuredBorder: 'border-yellow-200', featuredSideBg: 'bg-yellow-100', featuredText: 'text-yellow-700', heroBg: 'bg-yellow-700' },
  lime:     { gradient: 'from-lime-500 via-green-500 to-lime-600', subtitleText: 'text-lime-100', breadcrumbText: 'text-lime-200', btnText: 'text-lime-700', btnHoverBg: 'hover:bg-lime-50', ctaBg: 'bg-lime-600', ctaHoverBg: 'hover:bg-lime-700', cardBorder: 'hover:border-lime-300', cardText: 'group-hover:text-lime-600', paginationBg: 'bg-lime-600', featuredGradient: 'from-lime-50 to-lime-100', featuredBorder: 'border-lime-200', featuredSideBg: 'bg-lime-100', featuredText: 'text-lime-600', heroBg: 'bg-lime-700' },
};

const DIRECTORY_TYPES: Record<string, { plural: string; singular: string; label: string; strapiType: string; businessType?: string; theme: string; saveType: SaveableItemType }> = {
  restaurants: { plural: 'restaurants', singular: 'restaurant', label: 'Restaurants', strapiType: 'restaurants', theme: 'red', saveType: 'restaurant' },
  churches: { plural: 'churches', singular: 'church', label: 'Churches', strapiType: 'churches', theme: 'indigo', saveType: 'church' },
  schools: { plural: 'schools', singular: 'school', label: 'Schools & Childcare', strapiType: 'schools', theme: 'cyan', saveType: 'school' },
  'real-estate': { plural: 'real-estate-listings', singular: 'real-estate', label: 'Real Estate', strapiType: 'real-estates', theme: 'amber', saveType: 'local-business' },
  jobs: { plural: 'jobs', singular: 'job', label: 'Jobs & Gigs', strapiType: 'jobs', theme: 'sky', saveType: 'local-business' },
  events: { plural: 'events', singular: 'event', label: 'Events', strapiType: 'events', theme: 'pink', saveType: 'event' },
  'food-trucks': { plural: 'food-trucks', singular: 'food-truck', label: 'Food Trucks', strapiType: 'local-businesses', businessType: 'food-truck', theme: 'yellow', saveType: 'local-business' },
  'sports-teams': { plural: 'sports-teams', singular: 'sports-team', label: 'Sports Teams', strapiType: 'local-businesses', businessType: 'sports-team', theme: 'emerald', saveType: 'local-business' },
  'community-resources': { plural: 'community-resources', singular: 'community-resource', label: 'Community Resources', strapiType: 'local-businesses', businessType: 'community-resource', theme: 'teal', saveType: 'local-business' },
  attractions: { plural: 'attractions', singular: 'attraction', label: 'Attractions & Landmarks', strapiType: 'local-businesses', businessType: 'attraction', theme: 'violet', saveType: 'local-business' },
  'public-services': { plural: 'public-services', singular: 'public-service', label: 'Public Services', strapiType: 'local-businesses', businessType: 'public-service', theme: 'slate', saveType: 'local-business' },
  businesses: { plural: 'businesses', singular: 'business', label: 'Business Directory', strapiType: 'local-businesses', businessType: 'business', theme: 'blue', saveType: 'local-business' },
  'lost-and-found': { plural: 'lost-and-found', singular: 'lost-and-found', label: 'Lost & Found', strapiType: 'local-businesses', businessType: 'lost-and-found', theme: 'rose', saveType: 'local-business' },
};

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const config = DIRECTORY_TYPES[type];
  if (!config) return { title: 'Directory' };
  return {
    title: config.label,
    description: `Browse ${config.label.toLowerCase()} in Navarro County, Texas.`,
  };
}

export default async function DirectoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { type } = await params;
  const qp = await searchParams;
  const config = DIRECTORY_TYPES[type];

  if (!config) notFound();

  const page = Number(qp.page) || 1;
  const search = typeof qp.search === 'string' ? qp.search : undefined;
  const town = typeof qp.town === 'string' ? qp.town : undefined;

  // Jobs, events, and real-estate use 'title', others use 'name'
  const titleTypes = ['events', 'jobs', 'real-estate'];
  const sortField = titleTypes.includes(type) ? 'title' : 'name';
  const defaultSort = `${sortField}:asc`;
  const rawSort = typeof qp.sort === 'string' ? qp.sort : defaultSort;
  // Replace 'name' with correct field for title-based types
  const sort = titleTypes.includes(type) ? rawSort.replace(/^name:/, 'title:') : rawSort;

  let items: any[] = [];
  let totalPages = 1;
  let towns: any[] = [];

  try {
    const filters: Record<string, any> = {};
    // Events use different status values
    if (type === 'events') {
      filters.$or = [{ status: { $eq: 'upcoming' } }, { status: { $eq: 'ongoing' } }];
    } else {
      filters.status = { $eq: 'active' };
    }
    if (search) {
      // Search by name/title OR searchKeywords (synonyms)
      // Note: searchKeywords only exists on: restaurants, churches, schools, events, local-businesses
      // Jobs, events, and real-estate use 'title', others use 'name'
      const nameField = titleTypes.includes(type) ? 'title' : 'name';
      const typesWithSearchKeywords = ['restaurants', 'churches', 'schools', 'events', 'local-businesses'];
      const hasSearchKeywords = typesWithSearchKeywords.includes(config.strapiType);

      const searchFilters: Record<string, any>[] = [
        { [nameField]: { $containsi: search } },
      ];

      if (hasSearchKeywords) {
        searchFilters.push({ searchKeywords: { $containsi: search } });

        // Generate word variants (singular/plural) for flexible matching
        const getWordVariants = (word: string): string[] => {
          const variants = [word];
          // Try plural forms
          if (word.endsWith('y') && !['ay', 'ey', 'oy', 'uy'].some(v => word.endsWith(v))) {
            variants.push(word.slice(0, -1) + 'ies'); // pantry -> pantries
          } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
            variants.push(word + 'es');
          } else {
            variants.push(word + 's');
          }
          // Try singular forms
          if (word.endsWith('ies')) {
            variants.push(word.slice(0, -3) + 'y'); // pantries -> pantry
          } else if (word.endsWith('es')) {
            variants.push(word.slice(0, -2)); // churches -> church
          } else if (word.endsWith('s') && word.length > 3) {
            variants.push(word.slice(0, -1)); // parks -> park
          }
          return [...new Set(variants)];
        };

        // Check each word and its variants against synonyms
        const words = search.split(/\s+/).filter(w => w.length >= 3);
        for (const word of words) {
          for (const variant of getWordVariants(word.toLowerCase())) {
            searchFilters.push({ searchKeywords: { $containsi: variant } });
          }
        }
      }

      // Combine with existing filters using $and
      if (filters.$or) {
        filters.$and = [{ $or: filters.$or }, { $or: searchFilters }];
        delete filters.$or;
      } else {
        filters.$or = searchFilters;
      }
    }
    if (town) filters.town = { slug: { $eq: town } };

    // For generic local-business types, filter by businessType
    if (config.strapiType === 'local-businesses' && config.businessType) {
      filters.businessType = { $eq: config.businessType };
    }

    // Not all content types have the same relations
    const populateFields: string[] = ['town'];
    const typesWithImages = ['restaurants', 'churches', 'schools', 'real-estates', 'local-businesses'];
    const typesWithOwner = ['restaurants', 'churches', 'local-businesses'];
    if (typesWithImages.includes(config.strapiType)) populateFields.push('images');
    if (typesWithOwner.includes(config.strapiType)) populateFields.push('owner');
    // Note: 'hours' is a JSON field, not a relation, so it's included by default

    const [itemsRes, townsRes] = await Promise.all([
      strapi.directory.find(config.strapiType, {
        filters,
        populate: populateFields,
        sort,
        pagination: { page, pageSize: 24 },
      }),
      strapi.towns.find({ sort: 'name:asc', fields: ['name', 'slug'] }),
    ]);

    items = itemsRes.data || [];
    totalPages = itemsRes.meta.pagination?.pageCount || 1;
    towns = townsRes.data || [];
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }

  const theme = THEMES[config.theme] || THEMES.orange;

  // Custom hero backgrounds for each directory type
  const heroBackgrounds: Record<string, string> = {
    'restaurants': 'hero_restaurants_700c1623a8.avif',
    'churches': 'hero_churches_75f003dd4c.avif',
    'schools': 'hero_schools_9bb95285a9.avif',
    'real-estate': 'hero_realestate_c0b8727028.avif',
    'jobs': 'hero_jobs_2d33b277e5.avif',
    'events': 'hero_events_9716e12dcc.avif',
    'food-trucks': 'hero_foodtrucks_0acbe593a6.avif',
    'sports-teams': 'hero_sports_b03d2f23d8.avif',
    'community-resources': 'hero_resources_69d5034e0c.avif',
    'attractions': 'hero_explore_267d8db0e1.avif',
    'public-services': 'hero_public_5a74f3d557.avif',
    'businesses': 'hero_businesses_c35bad6257.avif',
  };
  const heroImage = heroBackgrounds[type] || 'hero_homepage_1d91226b7c.avif';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero - matches homepage style */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/${heroImage}`}
        className="text-white px-6 flex items-center justify-center py-16"
        fallbackColor={theme.heroBg}
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        {/* Add Listing Button - Top Right */}
        <Link
          href={`/directory/${type}/add`}
          className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Add {config.singular}
        </Link>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            {config.label}
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Discover {config.label.toLowerCase()} in Navarro County, Texas
          </p>

          {/* Search Bar and Filters */}
          <form action={`/directory/${type}`} method="get" className="max-w-3xl mx-auto relative z-10">
            <div className="flex items-center bg-white rounded-full shadow-lg relative z-10">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ''}
                  placeholder={`Search ${config.label.toLowerCase()}...`}
                  className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-l-full"
                />
              </div>
              <DirectoryFilters towns={towns} type={type} />
              <button
                type="submit"
                className={`w-12 h-12 mr-2 ${theme.ctaBg} ${theme.ctaHoverBg} text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0`}
                aria-label={type === 'attractions' ? 'Explore' : 'Search'}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </HeroBackground>

      {/* Featured Sponsor - horizontal card */}
      <section className="py-6 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Link
            href={`/featured-spot?type=directory-featured&page=/directory/${type}`}
            className={`flex items-stretch bg-gradient-to-r ${theme.featuredGradient} rounded-2xl ${theme.featuredBorder} border overflow-hidden hover:shadow-lg transition-shadow`}
          >
            <div className={`w-48 md:w-64 flex-shrink-0 ${theme.featuredSideBg} flex items-center justify-center`}>
              <div className="text-center p-4">
                <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-2">
                  <Plus className={`w-8 h-8 ${theme.featuredText}`} />
                </div>
                <p className={`${theme.featuredText} font-medium text-sm`}>Your Ad Here</p>
              </div>
            </div>
            <div className="flex-1 p-6 flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${theme.featuredText} mb-1`}>FEATURED {config.singular.toUpperCase()}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Get Featured on This Page</h3>
                <p className="text-gray-600 text-sm">Promote your {config.singular.toLowerCase()} to Navarro County customers</p>
              </div>
              <div className="hidden md:block">
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 ${theme.ctaBg} ${theme.ctaHoverBg} text-white font-medium rounded-lg transition-colors`}>
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {items.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any) => {
                const openStatus = type === 'restaurants' ? isCurrentlyOpen(item.hours) : null;
                return (
                <Link
                  key={item.documentId}
                  href={`/directory/${type}/${item.documentId}`}
                  className={`group bg-white rounded-xl border-2 border-gray-100 ${theme.cardBorder} hover:shadow-lg overflow-hidden transition-all duration-200 relative`}
                >
                  {/* Save Button */}
                  <SaveButton
                    itemType={config.saveType}
                    itemId={item.documentId}
                    itemName={item.name || item.title}
                    itemImage={item.images?.[0]?.url || null}
                    itemUrl={`/directory/${type}/${item.documentId}`}
                    variant="card"
                    className={item.images?.[0] ? '' : 'top-3 right-3'}
                  />
                  {item.images?.[0] && (
                    <div className="aspect-video bg-gray-100 overflow-hidden relative">
                      <img
                        src={item.images[0].url}
                        alt={item.name || item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Open/Closed chip for restaurants */}
                      {openStatus && (
                        <span className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          openStatus.isOpen
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-800 text-white'
                        }`}>
                          {openStatus.isOpen ? 'Open' : 'Closed'}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Show chip even without image */}
                  {!item.images?.[0] && openStatus && (
                    <div className="px-5 pt-4 pr-14">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        openStatus.isOpen
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-800 text-white'
                      }`}>
                        {openStatus.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className={`font-semibold text-gray-900 ${theme.cardText} transition-colors text-lg mb-1`}>
                      {item.name || item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{stripMarkdown(item.description)}</p>
                    )}
                    <div className="space-y-1.5 text-sm text-gray-600">
                      {(item.address || item.city) && (
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{[item.address, item.city, 'TX'].filter(Boolean).join(', ')}</span>
                        </p>
                      )}
                      {item.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          {item.phone}
                        </p>
                      )}
                      {item.website && (
                        <p className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className={`truncate ${theme.btnText}`}>Visit Website</span>
                        </p>
                      )}
                    </div>
                    {/* Type-specific info */}
                    {item.price && (
                      <p className={`text-lg font-bold ${theme.btnText} mt-3`}>
                        ${Number(item.price).toLocaleString()}
                      </p>
                    )}
                    {item.salary && (
                      <p className="text-sm font-medium text-green-600 mt-2">{item.salary}</p>
                    )}
                    {item.startDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(item.startDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No {config.label.toLowerCase()} found</h2>
              <p className="text-gray-500">Try adjusting your search or add a new listing.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/directory/${type}?page=${p}${search ? `&search=${search}` : ''}${town ? `&town=${town}` : ''}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? `${theme.paginationBg} text-white`
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
