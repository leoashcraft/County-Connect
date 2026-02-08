import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}

interface StrapiError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

type StrapiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  token?: string;
};

async function strapiRequest<T>(
  path: string,
  options: StrapiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, cache, next: nextOptions, token } = options;

  const url = `${STRAPI_URL}/api${path}`;

  const authToken = token || STRAPI_API_TOKEN;

  const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(cache ? { cache } : {}),
    ...(nextOptions ? { next: nextOptions } : {}),
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as StrapiError;
    throw new Error(
      errorData?.error?.message || `Strapi API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

// ==========================================
// Server-side fetching (no CORS, uses API token)
// ==========================================

export async function strapiGet<T>(
  path: string,
  options?: { cache?: RequestCache; next?: NextFetchRequestConfig }
): Promise<StrapiResponse<T>> {
  return strapiRequest<StrapiResponse<T>>(path, {
    method: 'GET',
    ...options,
  });
}

export async function strapiGetSingle<T>(
  path: string,
  options?: { cache?: RequestCache; next?: NextFetchRequestConfig }
): Promise<StrapiSingleResponse<T>> {
  return strapiRequest<StrapiSingleResponse<T>>(path, {
    method: 'GET',
    ...options,
  });
}

// ==========================================
// Client-side mutations (uses user JWT)
// ==========================================

export async function strapiPost<T>(
  path: string,
  data: Record<string, unknown>,
  token?: string
): Promise<StrapiResponse<T>> {
  return strapiRequest<StrapiResponse<T>>(path, {
    method: 'POST',
    body: { data },
    token,
  });
}

export async function strapiPut<T>(
  path: string,
  data: Record<string, unknown>,
  token?: string
): Promise<StrapiResponse<T>> {
  return strapiRequest<StrapiResponse<T>>(path, {
    method: 'PUT',
    body: { data },
    token,
  });
}

export async function strapiDelete(
  path: string,
  token?: string
): Promise<void> {
  await strapiRequest(path, {
    method: 'DELETE',
    token,
  });
}

// ==========================================
// Query builder helpers
// ==========================================

type FilterOperator = '$eq' | '$ne' | '$lt' | '$lte' | '$gt' | '$gte' | '$in' | '$notIn' | '$contains' | '$notContains' | '$startsWith' | '$endsWith' | '$null' | '$notNull';

interface QueryParams {
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  populate?: string | string[] | Record<string, unknown>;
  fields?: string[];
  publicationState?: 'live' | 'preview';
}

export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.filters) {
    const flattenFilters = (obj: unknown, prefix = 'filters'): void => {
      if (Array.isArray(obj)) {
        // Handle arrays (e.g., $or: [{...}, {...}])
        obj.forEach((item, index) => {
          flattenFilters(item, `${prefix}[${index}]`);
        });
      } else if (typeof obj === 'object' && obj !== null) {
        // Handle objects
        for (const [key, value] of Object.entries(obj)) {
          flattenFilters(value, `${prefix}[${key}]`);
        }
      } else {
        // Handle primitive values
        searchParams.set(prefix, String(obj));
      }
    };
    flattenFilters(params.filters);
  }

  if (params.sort) {
    const sortArr = Array.isArray(params.sort) ? params.sort : [params.sort];
    sortArr.forEach((s, i) => searchParams.set(`sort[${i}]`, s));
  }

  if (params.pagination) {
    if (params.pagination.page !== undefined) {
      searchParams.set('pagination[page]', String(params.pagination.page));
    }
    if (params.pagination.pageSize !== undefined) {
      searchParams.set('pagination[pageSize]', String(params.pagination.pageSize));
    }
    if (params.pagination.start !== undefined) {
      searchParams.set('pagination[start]', String(params.pagination.start));
    }
    if (params.pagination.limit !== undefined) {
      searchParams.set('pagination[limit]', String(params.pagination.limit));
    }
  }

  if (params.populate) {
    if (typeof params.populate === 'string') {
      searchParams.set('populate', params.populate);
    } else if (Array.isArray(params.populate)) {
      params.populate.forEach((p, i) => searchParams.set(`populate[${i}]`, p));
    } else {
      const flattenPopulate = (obj: Record<string, unknown>, prefix = 'populate') => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object' && value !== null) {
            flattenPopulate(value as Record<string, unknown>, `${prefix}[${key}]`);
          } else {
            searchParams.set(`${prefix}[${key}]`, String(value));
          }
        }
      };
      flattenPopulate(params.populate);
    }
  }

  if (params.fields) {
    params.fields.forEach((f, i) => searchParams.set(`fields[${i}]`, f));
  }

  if (params.publicationState) {
    searchParams.set('publicationState', params.publicationState);
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

// ==========================================
// Convenience methods for common content types
// ==========================================

export const strapi = {
  // Service Pages
  servicePages: {
    find: (params?: QueryParams) =>
      strapiGet<any[]>(`/service-pages${buildQueryString(params || {})}`),
    findBySlug: (slug: string) =>
      strapiGet<any[]>(`/service-pages${buildQueryString({
        filters: { slug: { $eq: slug } },
        populate: ['category', 'sections', 'faqs', 'externalResources', 'relatedServices'],
      })}`),
    findOne: (id: number) =>
      strapiGetSingle<any>(`/service-pages/${id}?populate=*`),
    create: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/service-pages', data, token),
    update: (id: number, data: Record<string, unknown>, token: string) =>
      strapiPut<any>(`/service-pages/${id}`, data, token),
    delete: (id: number, token: string) =>
      strapiDelete(`/service-pages/${id}`, token),
  },

  // Service Categories
  serviceCategories: {
    find: (params?: QueryParams) =>
      strapiGet<any[]>(`/service-categories${buildQueryString(params || {})}`),
  },

  // Towns
  towns: {
    find: (params?: QueryParams) =>
      strapiGet<any[]>(`/towns${buildQueryString(params || {})}`),
    findBySlug: (slug: string) =>
      strapiGet<any[]>(`/towns${buildQueryString({
        filters: { slug: { $eq: slug } },
        populate: '*',
      })}`),
  },

  // Directory types (generic)
  directory: {
    find: (type: string, params?: QueryParams) =>
      strapiGet<any[]>(`/${type}${buildQueryString(params || {})}`),
    findOne: (type: string, documentId: string) => {
      // Events use 'organizer' instead of 'owner'
      const ownerField = type === 'events' ? 'organizer' : 'owner';
      return strapiGetSingle<any>(`/${type}/${documentId}${buildQueryString({
        populate: ['town', 'images', ownerField],
      })}`);
    },
    findBySlug: (type: string, slug: string) =>
      strapiGet<any[]>(`/${type}${buildQueryString({
        filters: { slug: { $eq: slug } },
        populate: '*',
      })}`),
    create: (type: string, data: Record<string, unknown>, token: string) =>
      strapiPost<any>(`/${type}`, data, token),
    update: (type: string, id: number, data: Record<string, unknown>, token: string) =>
      strapiPut<any>(`/${type}/${id}`, data, token),
    delete: (type: string, id: number, token: string) =>
      strapiDelete(`/${type}/${id}`, token),
  },

  // Marketplace
  marketplace: {
    find: (params?: QueryParams) =>
      strapiGet<any[]>(`/marketplace-listings${buildQueryString(params || {})}`),
    findOne: (id: number) =>
      strapiGetSingle<any>(`/marketplace-listings/${id}?populate=*`),
    create: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/marketplace-listings', data, token),
    update: (id: number, data: Record<string, unknown>, token: string) =>
      strapiPut<any>(`/marketplace-listings/${id}`, data, token),
    categories: (params?: QueryParams) =>
      strapiGet<any[]>(`/marketplace-categories${buildQueryString(params || {})}`),
  },

  // Forum
  forum: {
    posts: (params?: QueryParams) =>
      strapiGet<any[]>(`/forum-posts${buildQueryString(params || {})}`),
    post: (id: number) =>
      strapiGetSingle<any>(`/forum-posts/${id}?populate=*`),
    createPost: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/forum-posts', data, token),
    comments: (postId: number) =>
      strapiGet<any[]>(`/forum-comments${buildQueryString({
        filters: { post: { id: { $eq: postId } } },
        populate: ['author', 'parentComment'],
        sort: 'createdAt:asc',
      })}`),
    createComment: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/forum-comments', data, token),
    categories: () =>
      strapiGet<any[]>('/forum-categories'),
  },

  // Reviews
  reviews: {
    find: (entityType: string, entityId: string) =>
      strapiGet<any[]>(`/reviews${buildQueryString({
        filters: { entityType: { $eq: entityType }, entityId: { $eq: entityId } },
        populate: ['author'],
        sort: 'createdAt:desc',
      })}`),
    create: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/reviews', data, token),
  },

  // Claim Requests
  claimRequests: {
    create: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/claim-requests', data, token),
    find: (token: string) =>
      strapiGet<any[]>('/claim-requests'),
    findOne: (id: string, token: string) =>
      strapiGetSingle<any>(`/claim-requests/${id}`),
  },

  // Support
  support: {
    tickets: (params?: QueryParams) =>
      strapiGet<any[]>(`/support-tickets${buildQueryString(params || {})}`),
    createTicket: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/support-tickets', data, token),
    messages: (ticketId: number) =>
      strapiGet<any[]>(`/support-messages${buildQueryString({
        filters: { ticket: { id: { $eq: ticketId } } },
        populate: ['sender'],
        sort: 'createdAt:asc',
      })}`),
    createMessage: (data: Record<string, unknown>, token: string) =>
      strapiPost<any>('/support-messages', data, token),
  },

  // Site Settings
  siteSettings: () =>
    strapiGetSingle<any>('/site-setting?populate=*'),

  // Navigation
  navigation: (params?: QueryParams) =>
    strapiGet<any[]>(`/navigation-menus${buildQueryString({
      sort: 'order:asc',
      filters: { isVisible: { $eq: true } },
      ...params,
    })}`),

  // Media upload
  upload: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};

export default strapi;
