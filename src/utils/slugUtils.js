/**
 * Slug Utility Functions
 * For generating SEO-friendly URLs and handling duplicate detection
 */

/**
 * Generate a URL-friendly slug from a string
 * @param {string} str - The string to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(str) {
  if (!str) return '';

  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Generate a town slug from town name
 * @param {string} townName - The town name
 * @returns {string} - URL-friendly town slug
 */
export function generateTownSlug(townName) {
  return generateSlug(townName);
}

/**
 * Check if a slug already exists for an entity type in a given town
 * @param {Object} EntityClass - The entity class (e.g., Church, Restaurant)
 * @param {string} slug - The slug to check
 * @param {string} townSlug - The town slug (optional, for location-based entities)
 * @param {string} excludeId - ID to exclude from check (for edits)
 * @returns {Promise<boolean>} - True if duplicate exists
 */
export async function checkSlugExists(EntityClass, slug, townSlug = null, excludeId = null) {
  try {
    const filters = { slug };
    if (townSlug) {
      filters.town_slug = townSlug;
    }

    const existing = await EntityClass.filter(filters);

    // If editing, exclude the current entity
    if (excludeId) {
      return existing.some(e => e.id !== excludeId);
    }

    return existing.length > 0;
  } catch (error) {
    console.error('Error checking slug:', error);
    return false;
  }
}

/**
 * Build SEO URL for an entity
 * @param {string} entityType - Type of entity (church, restaurant, school, etc.)
 * @param {string} townSlug - The town's URL slug
 * @param {string} entitySlug - The entity's URL slug
 * @returns {string} - Full SEO-friendly URL path
 */
export function buildEntityUrl(entityType, townSlug, entitySlug) {
  return `/${entityType}/${townSlug}/${entitySlug}`;
}

/**
 * Entity type to URL prefix mapping
 */
export const ENTITY_URL_PREFIXES = {
  Church: 'church',
  Restaurant: 'restaurant',
  School: 'school',
  FoodTruck: 'food-truck',
  Attraction: 'attraction',
  RealtyListing: 'real-estate',
  CommunityResource: 'resource',
  SportsTeam: 'sports-team',
  Job: 'job',
  Store: 'store'
};

/**
 * Get the URL prefix for an entity type
 * @param {string} entityType - The entity type name
 * @returns {string} - URL prefix
 */
export function getEntityUrlPrefix(entityType) {
  return ENTITY_URL_PREFIXES[entityType] || entityType.toLowerCase();
}
