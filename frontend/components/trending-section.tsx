import Link from 'next/link';
import { TrendingUp, Eye, Heart, ArrowRight } from 'lucide-react';

interface TrendingItem {
  id: string;
  documentId: string;
  title?: string;
  name?: string;
  slug?: string;
  viewCount?: number;
  type: string;
  href: string;
}

interface TrendingSectionProps {
  items: TrendingItem[];
  title?: string;
  className?: string;
}

export function TrendingSection({ items, title = 'Trending Now', className = '' }: TrendingSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <Link
            key={item.documentId || item.id}
            href={item.href}
            className="flex items-center gap-3 group"
          >
            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-sm font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 truncate">
                {item.title || item.name}
              </p>
              {item.viewCount !== undefined && item.viewCount > 0 && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {item.viewCount.toLocaleString()} views
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Server component helper to fetch trending items
export async function getTrendingItems(type: string, limit: number = 5): Promise<TrendingItem[]> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const typeConfig: Record<string, { endpoint: string; hrefPrefix: string }> = {
    restaurants: { endpoint: 'restaurants', hrefPrefix: '/directory/restaurants' },
    events: { endpoint: 'events', hrefPrefix: '/directory/events' },
    jobs: { endpoint: 'jobs', hrefPrefix: '/directory/jobs' },
    marketplace: { endpoint: 'marketplace-listings', hrefPrefix: '/marketplace' },
    services: { endpoint: 'service-listings', hrefPrefix: '/services' },
  };

  const config = typeConfig[type];
  if (!config) return [];

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/${config.endpoint}?sort=viewCount:desc&pagination[pageSize]=${limit}&filters[status][$eq]=active`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.data || []).map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      name: item.name,
      slug: item.slug,
      viewCount: item.viewCount || 0,
      type,
      href: `${config.hrefPrefix}/${item.slug || item.documentId}`,
    }));
  } catch (e) {
    return [];
  }
}
