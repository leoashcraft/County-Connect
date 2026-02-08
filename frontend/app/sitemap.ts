import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://navarrocounty.com';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function fetchFromStrapi(endpoint: string): Promise<any[]> {
  try {
    // Large pageSize is intentional for sitemap - server-side only, cached 24h
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}?pagination[pageSize]=1000`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    servicePages,
    restaurants,
    churches,
    schools,
    events,
    jobs,
    realEstate,
    localBusinesses,
    marketplaceListings,
    serviceListings,
    towns,
  ] = await Promise.all([
    fetchFromStrapi('service-pages'),
    fetchFromStrapi('restaurants'),
    fetchFromStrapi('churches'),
    fetchFromStrapi('schools'),
    fetchFromStrapi('events'),
    fetchFromStrapi('jobs'),
    fetchFromStrapi('real-estates'),
    fetchFromStrapi('local-businesses'),
    fetchFromStrapi('marketplace-listings'),
    fetchFromStrapi('service-listings'),
    fetchFromStrapi('towns'),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/directory/restaurants`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/directory/churches`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/directory/schools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/directory/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/directory/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/directory/real-estate`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/directory/businesses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/directory/food-trucks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/directory/sports-teams`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/directory/community-resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/directory/attractions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/community/forum`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/community/bulletin`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${SITE_URL}/community/lost-and-found`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
  ];

  // Service pages (guides)
  const guidePages: MetadataRoute.Sitemap = servicePages.map((page: any) => ({
    url: `${SITE_URL}/guides/${page.slug}`,
    lastModified: new Date(page.updatedAt || page.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Restaurants
  const restaurantPages: MetadataRoute.Sitemap = restaurants.map((item: any) => ({
    url: `${SITE_URL}/directory/restaurants/${item.slug || item.documentId}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Churches
  const churchPages: MetadataRoute.Sitemap = churches.map((item: any) => ({
    url: `${SITE_URL}/directory/churches/${item.slug || item.documentId}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Schools
  const schoolPages: MetadataRoute.Sitemap = schools.map((item: any) => ({
    url: `${SITE_URL}/directory/schools/${item.slug || item.documentId}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Events
  const eventPages: MetadataRoute.Sitemap = events.map((item: any) => ({
    url: `${SITE_URL}/directory/events/${item.slug || item.documentId}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Jobs
  const jobPages: MetadataRoute.Sitemap = jobs.map((item: any) => ({
    url: `${SITE_URL}/directory/jobs/${item.slug || item.documentId}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Real Estate
  const realEstatePages: MetadataRoute.Sitemap = realEstate.map((item: any) => ({
    url: `${SITE_URL}/directory/real-estate/${item.slug || item.documentId}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // Local Businesses (map by businessType)
  const businessPages: MetadataRoute.Sitemap = localBusinesses.map((item: any) => {
    const typeMap: Record<string, string> = {
      'business': 'businesses',
      'food-truck': 'food-trucks',
      'sports-team': 'sports-teams',
      'community-resource': 'community-resources',
      'attraction': 'attractions',
      'public-service': 'public-services',
    };
    const typePath = typeMap[item.businessType] || 'businesses';
    return {
      url: `${SITE_URL}/directory/${typePath}/${item.slug || item.documentId}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    };
  });

  // Marketplace listings
  const marketplacePages: MetadataRoute.Sitemap = marketplaceListings
    .filter((item: any) => item.status === 'active')
    .map((item: any) => ({
      url: `${SITE_URL}/marketplace/${item.documentId}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }));

  // Service listings
  const serviceListingPages: MetadataRoute.Sitemap = serviceListings
    .filter((item: any) => item.status === 'active')
    .map((item: any) => ({
      url: `${SITE_URL}/services/${item.documentId}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }));

  // Town pages
  const townPages: MetadataRoute.Sitemap = towns
    .filter((town: any) => town.slug && town.slug !== 'county-wide')
    .map((town: any) => ({
      url: `${SITE_URL}/${town.slug}`,
      lastModified: new Date(town.updatedAt || town.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...guidePages,
    ...restaurantPages,
    ...churchPages,
    ...schoolPages,
    ...eventPages,
    ...jobPages,
    ...realEstatePages,
    ...businessPages,
    ...marketplacePages,
    ...serviceListingPages,
    ...townPages,
  ];
}
