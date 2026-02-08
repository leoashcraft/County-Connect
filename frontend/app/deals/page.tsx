import { Metadata } from 'next';
import Link from 'next/link';
import { strapiGet, buildQueryString } from '@/lib/strapi';
import { Tag, Clock, MapPin, Percent, Gift, Ticket, ArrowRight } from 'lucide-react';
import { HeroBackground } from '@/components/hero-background';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Deals & Promotions',
  description: 'Find the best deals, discounts, and promotions from local businesses in Navarro County.',
};

const DISCOUNT_ICONS: Record<string, any> = {
  percentage: Percent,
  fixed: Tag,
  bogo: Gift,
  free_item: Gift,
  other: Ticket,
};

function formatDiscount(type: string, value: string): string {
  switch (type) {
    case 'percentage':
      return `${value}% OFF`;
    case 'fixed':
      return `$${value} OFF`;
    case 'bogo':
      return 'Buy One Get One';
    case 'free_item':
      return 'Free Item';
    default:
      return value || 'Special Offer';
  }
}

function isExpiringSoon(endDate: string): boolean {
  const end = new Date(endDate);
  const now = new Date();
  const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
}

export default async function DealsPage() {
  let deals: any[] = [];
  let featuredDeals: any[] = [];

  try {
    const now = new Date().toISOString();
    const [dealsRes, featuredRes] = await Promise.all([
      strapiGet<any[]>(`/deals${buildQueryString({
        filters: {
          status: { $eq: 'active' },
          $or: [
            { endDate: { $gte: now } },
            { endDate: { $null: true } },
          ],
        },
        populate: ['image', 'business', 'restaurant', 'town'],
        sort: 'endDate:asc',
        pagination: { pageSize: 50 },
      })}`),
      strapiGet<any[]>(`/deals${buildQueryString({
        filters: {
          status: { $eq: 'active' },
          featured: { $eq: true },
          $or: [
            { endDate: { $gte: now } },
            { endDate: { $null: true } },
          ],
        },
        populate: ['image', 'business', 'restaurant', 'town'],
        pagination: { pageSize: 3 },
      })}`),
    ]);

    deals = dealsRes.data || [];
    featuredDeals = featuredRes.data || [];
  } catch (error) {
    console.error('Error fetching deals:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_deals_placeholder.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
        fallbackColor="bg-amber-600"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}
          >
            Deals & Promotions
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
          >
            Save big with exclusive offers from Navarro County businesses
          </p>
        </div>
      </HeroBackground>

      <FeaturedSponsor
        href="/featured-spot?type=directory-featured&page=/deals"
        label="FEATURED DEAL"
        title="Promote Your Deal"
        description="Get your offer in front of local customers"
        gradientClass="from-amber-50 to-amber-100"
        borderClass="border-amber-200"
        sideBgClass="bg-amber-100"
        textClass="text-amber-600"
        buttonBgClass="bg-amber-600"
        buttonHoverClass="hover:bg-amber-700"
      />

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Featured Deals */}
          {featuredDeals.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-500" />
                Featured Deals
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredDeals.map((deal: any) => {
                  const business = deal.restaurant || deal.business;
                  const DiscountIcon = DISCOUNT_ICONS[deal.discountType] || Tag;

                  return (
                    <div
                      key={deal.documentId || deal.id}
                      className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                            <DiscountIcon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-2xl font-bold text-amber-700">
                            {formatDiscount(deal.discountType, deal.discountValue)}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">{deal.title}</h3>
                        {business && (
                          <p className="text-sm text-gray-600 mb-2">at {business.name}</p>
                        )}
                        {deal.endDate && (
                          <p className={`text-sm flex items-center gap-1 ${
                            isExpiringSoon(deal.endDate) ? 'text-red-600 font-medium' : 'text-gray-500'
                          }`}>
                            <Clock className="w-4 h-4" />
                            {isExpiringSoon(deal.endDate) ? 'Expires soon!' : `Ends ${new Date(deal.endDate).toLocaleDateString()}`}
                          </p>
                        )}
                        {deal.code && (
                          <div className="mt-4 px-3 py-2 bg-white border-2 border-dashed border-amber-300 rounded-lg text-center">
                            <p className="text-xs text-gray-500 mb-1">Use code</p>
                            <p className="font-mono font-bold text-gray-900">{deal.code}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Deals */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Active Deals</h2>

          {deals.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((deal: any) => {
                const business = deal.restaurant || deal.business;
                const DiscountIcon = DISCOUNT_ICONS[deal.discountType] || Tag;
                const expiringSoon = deal.endDate && isExpiringSoon(deal.endDate);

                return (
                  <div
                    key={deal.documentId || deal.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden"
                  >
                    {deal.image?.url && (
                      <div className="aspect-video bg-gray-100 relative">
                        <img
                          src={deal.image.url}
                          alt={deal.title}
                          className="w-full h-full object-cover"
                        />
                        {expiringSoon && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            Ending Soon
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DiscountIcon className="w-5 h-5 text-amber-500" />
                        <span className="font-bold text-amber-600">
                          {formatDiscount(deal.discountType, deal.discountValue)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{deal.title}</h3>
                      {business && (
                        <p className="text-sm text-gray-600 mb-2">{business.name}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {deal.town?.name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {deal.town.name}
                          </span>
                        )}
                        {deal.endDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Ends {new Date(deal.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {deal.code && (
                        <div className="mt-3 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-center">
                          <span className="text-xs text-gray-500">Code: </span>
                          <span className="font-mono font-medium text-gray-900">{deal.code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No active deals</h2>
              <p className="text-gray-500 mb-6">Check back soon for new promotions!</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
              >
                Browse businesses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
