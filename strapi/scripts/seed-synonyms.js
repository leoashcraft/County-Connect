/**
 * Seed Search Synonyms Script
 *
 * Populates searchKeywords field for existing listings based on name patterns
 * and business types. Run after Strapi has been restarted with the new schema.
 *
 * Usage: node scripts/seed-synonyms.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Admin credentials - will login and get JWT token
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@navarrocounty.com';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'Admin123!';

let adminToken = null;

async function login() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Admin login failed: ${err.error?.message || res.status}`);
  }

  const data = await res.json();
  return data.data.token;
}

// Synonym mappings based on common search patterns
const SYNONYM_RULES = [
  // Food pantries - people search "food pantry", "pantries", "food bank"
  { pattern: /food pantry/i, keywords: ['pantries', 'food bank', 'food assistance'] },
  { pattern: /pantry/i, keywords: ['pantries', 'food assistance'] },

  // Churches - denomination synonyms
  { pattern: /baptist/i, keywords: ['baptist church', 'worship'] },
  { pattern: /methodist/i, keywords: ['methodist church', 'worship'] },
  { pattern: /catholic/i, keywords: ['catholic church', 'mass', 'parish'] },
  { pattern: /church of christ/i, keywords: ['worship'] },

  // Schools - type synonyms
  { pattern: /elementary/i, keywords: ['primary school', 'grade school'] },
  { pattern: /high school/i, keywords: ['secondary school'] },
  { pattern: /isd/i, keywords: ['school district', 'public school'] },
  { pattern: /daycare|day care/i, keywords: ['childcare', 'child care', 'preschool'] },
  { pattern: /head start/i, keywords: ['preschool', 'early childhood'] },

  // Restaurants - cuisine types
  { pattern: /mexican/i, keywords: ['tex-mex', 'tacos', 'burritos'] },
  { pattern: /bbq|barbecue/i, keywords: ['bbq', 'barbecue', 'brisket', 'smoked meat'] },
  { pattern: /pizza/i, keywords: ['pizzeria', 'italian'] },
  { pattern: /chinese/i, keywords: ['asian food', 'chinese food'] },
  { pattern: /burger/i, keywords: ['burgers', 'hamburgers', 'fast food'] },
  { pattern: /coffee/i, keywords: ['cafe', 'espresso', 'coffeehouse'] },
  { pattern: /donut|doughnut/i, keywords: ['donuts', 'doughnuts', 'bakery'] },

  // Community resources
  { pattern: /library/i, keywords: ['books', 'reading'] },
  { pattern: /senior center/i, keywords: ['elderly', 'seniors', 'aging services'] },
  { pattern: /community center/i, keywords: ['rec center', 'recreation'] },
  { pattern: /thrift/i, keywords: ['thrift store', 'secondhand', 'used goods'] },
  { pattern: /shelter/i, keywords: ['homeless shelter', 'housing assistance'] },

  // Public services
  { pattern: /city hall/i, keywords: ['municipal', 'government'] },
  { pattern: /fire department|fire station/i, keywords: ['fire dept', 'firefighters', 'emergency'] },
  { pattern: /police/i, keywords: ['law enforcement', 'sheriff', 'cops'] },
  { pattern: /post office/i, keywords: ['usps', 'mail', 'postal'] },
  { pattern: /courthouse/i, keywords: ['court', 'legal'] },
  { pattern: /dmv|driver.*license/i, keywords: ['drivers license', 'vehicle registration'] },

  // Attractions
  { pattern: /museum/i, keywords: ['exhibit', 'history'] },
  { pattern: /park/i, keywords: ['recreation', 'outdoor', 'playground'] },
  { pattern: /lake/i, keywords: ['fishing', 'boating', 'water'] },

  // Sports
  { pattern: /football/i, keywords: ['gridiron', 'athletics'] },
  { pattern: /baseball/i, keywords: ['ball game', 'athletics'] },
  { pattern: /basketball/i, keywords: ['hoops', 'athletics'] },
  { pattern: /soccer/i, keywords: ['futbol', 'athletics'] },

  // Events
  { pattern: /festival/i, keywords: ['fair', 'celebration', 'event'] },
  { pattern: /parade/i, keywords: ['march', 'procession'] },
  { pattern: /market|farmers/i, keywords: ['farmers market', 'local produce'] },
];

// Business type specific synonyms
const BUSINESS_TYPE_SYNONYMS = {
  'food-truck': ['mobile food', 'street food'],
  'community-resource': ['community service', 'nonprofit'],
  'public-service': ['government service', 'city service'],
  'attraction': ['tourist spot', 'landmark', 'things to do'],
  'sports-team': ['athletics', 'local sports'],
  'lost-and-found': ['lost items', 'found items', 'missing'],
};

function generateKeywords(name, businessType) {
  const keywords = new Set();

  // Apply pattern-based rules
  for (const rule of SYNONYM_RULES) {
    if (rule.pattern.test(name)) {
      rule.keywords.forEach(k => keywords.add(k));
    }
  }

  // Apply business type synonyms
  if (businessType && BUSINESS_TYPE_SYNONYMS[businessType]) {
    BUSINESS_TYPE_SYNONYMS[businessType].forEach(k => keywords.add(k));
  }

  // Convert to array and limit to 3
  const result = Array.from(keywords).slice(0, 3);
  return result.length > 0 ? result.join(', ') : null;
}

async function fetchAll(endpoint) {
  const items = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}?pagination[page]=${page}&pagination[pageSize]=100`);
    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}: ${res.status}`);
      break;
    }
    const data = await res.json();
    items.push(...(data.data || []));
    hasMore = data.meta?.pagination?.page < data.meta?.pagination?.pageCount;
    page++;
  }

  return items;
}

// Map endpoint names to Strapi content-type UIDs
const ENDPOINT_TO_UID = {
  'local-businesses': 'api::local-business.local-business',
  'restaurants': 'api::restaurant.restaurant',
  'churches': 'api::church.church',
  'schools': 'api::school.school',
  'events': 'api::event.event',
};

async function updateItem(endpoint, documentId, searchKeywords) {
  const uid = ENDPOINT_TO_UID[endpoint];
  if (!uid) {
    throw new Error(`Unknown endpoint: ${endpoint}`);
  }

  // Use the admin content-manager API to update
  const res = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ searchKeywords }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  // Publish the changes
  const publishRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}/${documentId}/actions/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({}),
  });

  if (!publishRes.ok) {
    const err = await publishRes.json().catch(() => ({}));
    // Don't fail if publish fails - item might already be published
    console.log(`    [warn] Could not publish: ${err.error?.message || publishRes.status}`);
  }

  return res.json();
}

async function seedCollection(endpoint, nameField = 'name', businessTypeField = null) {
  console.log(`\nProcessing ${endpoint}...`);

  const items = await fetchAll(endpoint);
  console.log(`  Found ${items.length} items`);

  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    const name = item[nameField];
    if (!name) continue;

    const businessType = businessTypeField ? item[businessTypeField] : null;
    const keywords = generateKeywords(name, businessType);

    if (!keywords) {
      skipped++;
      continue;
    }

    // Skip if already has keywords
    if (item.searchKeywords) {
      console.log(`  [skip] ${name} - already has keywords`);
      skipped++;
      continue;
    }

    try {
      await updateItem(endpoint, item.documentId, keywords);
      console.log(`  [updated] ${name} -> "${keywords}"`);
      updated++;
    } catch (err) {
      console.error(`  [error] ${name}: ${err.message}`);
    }
  }

  console.log(`  Updated: ${updated}, Skipped: ${skipped}`);
}

async function main() {
  console.log('Seeding search synonyms...');
  console.log(`Strapi URL: ${STRAPI_URL}`);

  // Test connection
  try {
    const res = await fetch(`${STRAPI_URL}/api/local-businesses?pagination[pageSize]=1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log('Connected to Strapi successfully');
  } catch (err) {
    console.error(`Cannot connect to Strapi: ${err.message}`);
    console.error('Make sure Strapi is running and accessible.');
    process.exit(1);
  }

  // Login as admin
  console.log('Logging in as admin...');
  try {
    adminToken = await login();
    console.log('Logged in successfully');
  } catch (err) {
    console.error(`Admin login failed: ${err.message}`);
    process.exit(1);
  }

  // Process each collection
  await seedCollection('local-businesses', 'name', 'businessType');
  await seedCollection('restaurants', 'name');
  await seedCollection('churches', 'name');
  await seedCollection('schools', 'name');
  await seedCollection('events', 'title');

  console.log('\nDone!');
}

main().catch(console.error);
