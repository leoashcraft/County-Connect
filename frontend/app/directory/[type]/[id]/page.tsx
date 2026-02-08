import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { strapi } from '@/lib/strapi';
import { getSession } from '@/lib/auth';
import { ChevronRight, MapPin, Phone, Mail, Globe, Clock, ArrowLeft, Star, Flag } from 'lucide-react';
import { EditPageButton } from '@/components/edit-page-button';
import { ClaimButton } from '@/components/directory/claim-button';
import { SaveButton, SaveableItemType } from '@/components/save-button';

// Custom ReactMarkdown components for consistent styling
const markdownComponents = {
  p: ({ children }: any) => {
    const childArray = Array.isArray(children) ? children : [children];
    if (childArray.length === 1 && typeof childArray[0] === 'object' && childArray[0]?.type === 'strong') {
      return <h4 className="font-semibold text-gray-900 mt-6 mb-2 first:mt-0">{childArray[0].props.children}</h4>;
    }
    return <p className="mb-3">{children}</p>;
  },
  ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
  li: ({ children }: any) => <li className="text-gray-700">{children}</li>,
  strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
  h2: ({ children }: any) => <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
  a: ({ href, children }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      {children}
    </a>
  ),
};

// Types that support claiming (have owner/organizer field)
const CLAIMABLE_TYPES = ['restaurants', 'churches', 'schools', 'events', 'food-trucks', 'sports-teams', 'community-resources', 'attractions', 'public-services', 'businesses'];

type DetailTheme = {
  bg: string;
  linkHover: string;
  contactLink: string;
  callBg: string;
  callHoverBg: string;
};

const DETAIL_THEMES: Record<string, DetailTheme> = {
  restaurants:          { bg: 'from-red-50 to-rose-50', linkHover: 'hover:text-red-600', contactLink: 'text-red-600', callBg: 'bg-red-600', callHoverBg: 'hover:bg-red-700' },
  churches:             { bg: 'from-indigo-50 to-violet-50', linkHover: 'hover:text-indigo-600', contactLink: 'text-indigo-600', callBg: 'bg-indigo-600', callHoverBg: 'hover:bg-indigo-700' },
  schools:              { bg: 'from-cyan-50 to-sky-50', linkHover: 'hover:text-cyan-600', contactLink: 'text-cyan-600', callBg: 'bg-cyan-600', callHoverBg: 'hover:bg-cyan-700' },
  'real-estate':        { bg: 'from-amber-50 to-yellow-50', linkHover: 'hover:text-amber-700', contactLink: 'text-amber-700', callBg: 'bg-amber-700', callHoverBg: 'hover:bg-amber-800' },
  jobs:                 { bg: 'from-sky-50 to-blue-50', linkHover: 'hover:text-sky-600', contactLink: 'text-sky-600', callBg: 'bg-sky-600', callHoverBg: 'hover:bg-sky-700' },
  events:               { bg: 'from-pink-50 to-rose-50', linkHover: 'hover:text-pink-500', contactLink: 'text-pink-500', callBg: 'bg-pink-500', callHoverBg: 'hover:bg-pink-600' },
  'food-trucks':        { bg: 'from-yellow-50 to-amber-50', linkHover: 'hover:text-yellow-700', contactLink: 'text-yellow-700', callBg: 'bg-yellow-700', callHoverBg: 'hover:bg-yellow-800' },
  'sports-teams':       { bg: 'from-emerald-50 to-green-50', linkHover: 'hover:text-emerald-600', contactLink: 'text-emerald-600', callBg: 'bg-emerald-600', callHoverBg: 'hover:bg-emerald-700' },
  'community-resources':{ bg: 'from-teal-50 to-emerald-50', linkHover: 'hover:text-teal-600', contactLink: 'text-teal-600', callBg: 'bg-teal-600', callHoverBg: 'hover:bg-teal-700' },
  attractions:          { bg: 'from-violet-50 to-purple-50', linkHover: 'hover:text-violet-600', contactLink: 'text-violet-600', callBg: 'bg-violet-600', callHoverBg: 'hover:bg-violet-700' },
  'public-services':    { bg: 'from-slate-50 to-gray-100', linkHover: 'hover:text-slate-600', contactLink: 'text-slate-600', callBg: 'bg-slate-600', callHoverBg: 'hover:bg-slate-700' },
  businesses:           { bg: 'from-blue-50 to-sky-50', linkHover: 'hover:text-blue-600', contactLink: 'text-blue-600', callBg: 'bg-blue-600', callHoverBg: 'hover:bg-blue-700' },
  'lost-and-found':     { bg: 'from-rose-50 to-pink-50', linkHover: 'hover:text-rose-600', contactLink: 'text-rose-600', callBg: 'bg-rose-500', callHoverBg: 'hover:bg-rose-600' },
};

const DEFAULT_THEME: DetailTheme = { bg: 'from-blue-50 to-sky-50', linkHover: 'hover:text-blue-600', contactLink: 'text-blue-600', callBg: 'bg-blue-600', callHoverBg: 'hover:bg-blue-700' };

// Format hours for display
function formatHoursForDisplay(hours: any): { day: string; hours: string; isToday: boolean }[] | null {
  if (!hours || typeof hours !== 'object') return null;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();

  return days.map((day, index) => {
    const dayHours = hours[day];
    let hoursText = 'Closed';

    if (dayHours && dayHours !== 'closed' && !dayHours.closed) {
      if (dayHours.open && dayHours.close) {
        hoursText = `${dayHours.open} - ${dayHours.close}`;
      }
    }

    return {
      day: dayLabels[index],
      hours: hoursText,
      isToday: index === today,
    };
  });
}

// Check if currently open
function isCurrentlyOpen(hours: any): { isOpen: boolean; closesAt?: string } | null {
  if (!hours || typeof hours !== 'object') return null;

  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()];
  const todayHours = hours[currentDay];

  if (!todayHours || todayHours.closed || todayHours === 'closed') {
    return { isOpen: false };
  }

  const openTime = todayHours.open;
  const closeTime = todayHours.close;

  if (!openTime || !closeTime) return null;

  const parseTime = (timeStr: string): number => {
    const normalized = timeStr.toLowerCase().replace(/\s/g, '');
    let hours = 0;
    let minutes = 0;

    const match = normalized.match(/^(\d{1,2}):?(\d{2})?(am|pm)?$/);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = match[2] ? parseInt(match[2], 10) : 0;
      if (match[3] === 'pm' && hours !== 12) hours += 12;
      if (match[3] === 'am' && hours === 12) hours = 0;
    }
    return hours * 60 + minutes;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTime(openTime);
  const closeMinutes = parseTime(closeTime);

  if (closeMinutes < openMinutes) {
    const isOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    return { isOpen, closesAt: isOpen ? closeTime : undefined };
  }

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  return { isOpen, closesAt: isOpen ? closeTime : undefined };
}

const CONTENT_TYPE_MAP: Record<string, string> = {
  restaurants: 'api::restaurant.restaurant',
  churches: 'api::church.church',
  schools: 'api::school.school',
  jobs: 'api::job.job',
  events: 'api::event.event',
  'real-estate': 'api::real-estate.real-estate',
  'food-trucks': 'api::local-business.local-business',
  'sports-teams': 'api::local-business.local-business',
  'community-resources': 'api::local-business.local-business',
  attractions: 'api::local-business.local-business',
  'public-services': 'api::local-business.local-business',
  businesses: 'api::local-business.local-business',
  'lost-and-found': 'api::lost-and-found-post.lost-and-found-post',
};

const SAVE_TYPE_MAP: Record<string, SaveableItemType> = {
  restaurants: 'restaurant',
  churches: 'church',
  schools: 'school',
  jobs: 'local-business',
  events: 'event',
  'real-estate': 'local-business',
  'food-trucks': 'local-business',
  'sports-teams': 'local-business',
  'community-resources': 'local-business',
  attractions: 'local-business',
  'public-services': 'local-business',
  businesses: 'local-business',
  'lost-and-found': 'local-business',
};

export async function generateMetadata({ params }: { params: Promise<{ type: string; id: string }> }): Promise<Metadata> {
  const { type, id } = await params;
  try {
    const strapiType = type === 'restaurants' ? 'restaurants' : type === 'churches' ? 'churches' : type === 'schools' ? 'schools' : type === 'jobs' ? 'jobs' : type === 'events' ? 'events' : type === 'real-estate' ? 'real-estates' : 'local-businesses';
    const res = await strapi.directory.findOne(strapiType, id);
    const item = res.data;
    if (!item) return { title: 'Not Found' };
    return {
      title: item.name || item.title,
      description: item.description?.slice(0, 160),
    };
  } catch {
    return { title: 'Not Found' };
  }
}

export default async function DirectoryDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  const strapiType = type === 'restaurants' ? 'restaurants' : type === 'churches' ? 'churches' : type === 'schools' ? 'schools' : type === 'jobs' ? 'jobs' : type === 'events' ? 'events' : type === 'real-estate' ? 'real-estates' : 'local-businesses';

  // Get session for claim button
  const session = await getSession();
  const isAuthenticated = !!session?.user;
  const strapiUserId = (session?.user as any)?.strapiUserId;

  let item: any = null;
  let reviews: any[] = [];

  try {
    const res = await strapi.directory.findOne(strapiType, id);
    item = res.data;
  } catch (error) {
    console.error('Error fetching item:', error);
  }

  if (!item) notFound();

  // Load reviews
  try {
    const reviewRes = await strapi.reviews.find(type, String(id));
    reviews = reviewRes.data || [];
  } catch {}

  const name = item.name || item.title;
  const label = type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const theme = DETAIL_THEMES[type] || DEFAULT_THEME;

  // Determine owner status for claim button
  const ownerField = type === 'events' ? 'organizer' : 'owner';
  const ownerId = item[ownerField]?.id;
  const hasOwner = !!ownerId;
  const isOwner = hasOwner && strapiUserId && ownerId === strapiUserId;
  const isClaimable = CLAIMABLE_TYPES.includes(type);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className={theme.linkHover}>Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/directory/${type}`} className={theme.linkHover}>{label}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">{name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Link href={`/directory/${type}`} className={`inline-flex items-center gap-2 text-sm text-gray-600 ${theme.linkHover} mb-6`}>
          <ArrowLeft className="w-4 h-4" />
          Back to {label}
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Images */}
            {item.images?.[0] && (
              <div className="aspect-video bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
                <img src={item.images[0].url} alt={name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
              {item.description && (
                <div className="prose max-w-none text-gray-700">
                  <ReactMarkdown components={markdownComponents}>{item.description}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500" />
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-6">
                  {reviews.map((review: any, i: number) => (
                    <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} className={`w-4 h-4 ${s < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        {review.author && (
                          <span className="text-sm text-gray-500">{review.author.username}</span>
                        )}
                      </div>
                      {review.title && <p className="font-medium text-gray-900">{review.title}</p>}
                      {review.content && <p className="text-gray-700 text-sm mt-1">{review.content}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Button */}
            <SaveButton
              itemType={SAVE_TYPE_MAP[type] || 'local-business'}
              itemId={id}
              itemName={name}
              itemImage={item.images?.[0]?.url || null}
              itemUrl={`/directory/${type}/${id}`}
              variant="button"
              className="w-full justify-center"
            />

            {/* Report closure - only for restaurants */}
            {type === 'restaurants' && (
              <div className="text-center">
                <Link
                  href={`/report-closure?listing=${encodeURIComponent(name)}&type=restaurant&id=${id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-500 transition-colors"
                >
                  <Flag className="w-3 h-3" />
                  Report permanent or temporary closure
                </Link>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 sticky top-6">
              <h2 className="font-bold text-gray-900 mb-4">Contact Info</h2>
              <div className="space-y-3 text-sm">
                {(item.address || item.city) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{[item.address, item.city, item.state || 'TX', item.zipCode].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {item.phone && (
                  <a href={`tel:${item.phone}`} className={`flex items-center gap-3 ${theme.contactLink} hover:underline`}>
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    {item.phone}
                  </a>
                )}
                {item.email && (
                  <a href={`mailto:${item.email}`} className={`flex items-center gap-3 ${theme.contactLink} hover:underline`}>
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    {item.email}
                  </a>
                )}
                {item.website && (
                  <a href={item.website} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${theme.contactLink} hover:underline`}>
                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    Visit Website
                  </a>
                )}
              </div>

              {item.phone && (
                <a
                  href={`tel:${item.phone}`}
                  className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 ${theme.callBg} ${theme.callHoverBg} text-white rounded-lg font-medium transition-colors`}
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              )}
            </div>

            {/* Hours - only for restaurants */}
            {type === 'restaurants' && item.hours && (() => {
              const hoursData = formatHoursForDisplay(item.hours);
              const openStatus = isCurrentlyOpen(item.hours);
              if (!hoursData) return null;
              return (
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      Hours
                    </h2>
                    {openStatus && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        openStatus.isOpen
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {openStatus.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {hoursData.map((row) => (
                      <div
                        key={row.day}
                        className={`flex justify-between ${
                          row.isToday ? 'font-semibold text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        <span>{row.day}</span>
                        <span className={row.hours === 'Closed' ? 'text-gray-400' : ''}>
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Claim button */}
            {isClaimable && (
              <ClaimButton
                type={type}
                id={id}
                isAuthenticated={isAuthenticated}
                isOwner={isOwner}
                hasOwner={hasOwner}
                theme={theme}
              />
            )}

            {/* Town info */}
            {item.town && (
              <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  {item.town.name}
                </h3>
                <p className="text-sm text-gray-600">Navarro County, Texas</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {item.documentId && (
        <EditPageButton
          contentType={CONTENT_TYPE_MAP[type] || 'api::local-business.local-business'}
          documentId={item.documentId}
        />
      )}
    </div>
  );
}
