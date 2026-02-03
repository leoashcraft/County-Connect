export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createStoreUrl(storeSlug, pageSlug = null) {
  if (pageSlug) {
    return `/StoreView?store=${storeSlug}&page=${pageSlug}`;
  }
  return `/StoreView?store=${storeSlug}`;
}

export function createProductUrl(storeSlug, productSlug) {
  return `/ProductView?store=${storeSlug}&product=${productSlug}`;
}

export function createServiceUrl(storeSlug, serviceSlug) {
  return `/ServiceView?store=${storeSlug}&service=${serviceSlug}`;
}