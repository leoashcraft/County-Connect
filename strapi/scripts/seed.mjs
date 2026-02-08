#!/usr/bin/env node

/**
 * Comprehensive Seed Script: Import ALL data into Strapi
 *
 * Seeds: Towns, Service Categories, Churches, Restaurants, Schools,
 *        Local Businesses (attractions, community resources, sports teams,
 *        food trucks, public services), Service Pages, Site Settings
 *
 * Usage:
 *   STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=xxx node scripts/seed.js
 *
 * Options:
 *   --only=towns,churches    Seed only specific types
 *   --skip=service-pages     Skip specific types
 *   --dry-run                Show what would be seeded without creating
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

const onlyArg = process.argv.find(a => a.startsWith('--only='));
const skipArg = process.argv.find(a => a.startsWith('--skip='));
const ONLY = onlyArg ? onlyArg.split('=')[1].split(',') : null;
const SKIP = skipArg ? skipArg.split('=')[1].split(',') : [];

if (!STRAPI_TOKEN && !DRY_RUN) {
  console.error('ERROR: STRAPI_TOKEN environment variable is required');
  console.error('  Create one in Strapi admin: Settings → API Tokens → Create new API Token (Full access)');
  process.exit(1);
}

function shouldSeed(type) {
  if (SKIP.includes(type)) return false;
  if (ONLY && !ONLY.includes(type)) return false;
  return true;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Strapi API Helpers ──────────────────────────────────────────

async function strapiCreate(contentType, data, retries = 3) {
  if (DRY_RUN) {
    console.log(`  [DRY] Would create ${contentType}: ${data.name || data.title || data.slug || '?'}`);
    return { id: Math.floor(Math.random() * 10000), ...data };
  }

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/${contentType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        if (error?.error?.message?.includes('unique') || error?.error?.message?.includes('already')) {
          console.log(`  [SKIP] Duplicate: ${data.name || data.title || data.slug}`);
          return null;
        }
        throw new Error(`${res.status}: ${JSON.stringify(error?.error?.message || error)}`);
      }

      return (await res.json()).data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function strapiUpdate(contentType, id, data) {
  if (DRY_RUN) return { id, ...data };

  const res = await fetch(`${STRAPI_URL}/api/${contentType}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`${res.status}: ${JSON.stringify(error?.error?.message || error)}`);
  }

  return (await res.json()).data;
}

async function strapiFind(contentType, filters = {}) {
  if (DRY_RUN) return [];

  const params = new URLSearchParams({ 'pagination[pageSize]': '500' });
  for (const [key, val] of Object.entries(filters)) {
    params.set(`filters[${key}][$eq]`, val);
  }

  const res = await fetch(`${STRAPI_URL}/api/${contentType}?${params}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });

  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

// ─── Data Loading ────────────────────────────────────────────────

async function loadData(filename) {
  const seedPath = resolve(__dirname, `../../backend/src/seeds/data/${filename}`);
  try {
    const mod = await import(seedPath);
    return mod;
  } catch (error) {
    console.warn(`  Could not load ${filename}: ${error.message}`);
    return null;
  }
}

// ─── Seed Functions ──────────────────────────────────────────────

async function seedTowns() {
  console.log('\n━━━ Seeding Towns ━━━');
  const mod = await loadData('towns.js');
  if (!mod?.towns) { console.log('  No town data found'); return {}; }

  const townMap = {};
  let count = 0;

  for (const town of mod.towns) {
    try {
      // Combine description fields into rich text
      let description = town.description || '';
      if (town.history) description += `\n\n## History\n${town.history}`;
      if (town.known_for) description += `\n\n## Known For\n${town.known_for}`;
      if (town.getting_around) description += `\n\n## Getting Around\n${town.getting_around}`;

      const result = await strapiCreate('towns', {
        name: town.name,
        slug: town.slug || slugify(town.name),
        county: town.county || 'Navarro',
        state: town.state || 'TX',
        population: town.population || null,
        description: description.trim() || null,
        latitude: town.lat ?? town.latitude ?? null,
        longitude: town.lng ?? town.longitude ?? null,
        zipCodes: town.zip_codes || town.zipCodes || null,
      });

      if (result) {
        townMap[town.name.toLowerCase()] = result.id;
        // Also map by slug
        const slug = town.slug || slugify(town.name);
        townMap[slug] = result.id;
        count++;
        console.log(`  ✓ ${town.name} (ID: ${result.id})`);
      }
    } catch (error) {
      console.warn(`  ✗ ${town.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.towns.length} towns created`);
  return townMap;
}

async function seedServiceCategories() {
  console.log('\n━━━ Seeding Service Categories ━━━');
  const mod = await loadData('service-categories.js');
  if (!mod?.serviceCategories) { console.log('  No category data found'); return {}; }

  const categoryMap = {};
  let count = 0;

  for (const [key, cat] of Object.entries(mod.serviceCategories)) {
    if (typeof cat !== 'object' || !cat.label) continue;

    try {
      const result = await strapiCreate('service-categories', {
        name: cat.label,
        slug: key.replace(/_/g, '-'),
        icon: cat.icon || null,
        description: `${cat.label} - ${cat.services?.length || 0} services available`,
      });

      if (result) {
        categoryMap[key] = result.id;
        count++;
        console.log(`  ✓ ${cat.label} (${cat.services?.length || 0} services)`);
      }
    } catch (error) {
      console.warn(`  ✗ ${cat.label}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count} categories created`);
  return categoryMap;
}

async function seedChurches(townMap) {
  console.log('\n━━━ Seeding Churches ━━━');
  const mod = await loadData('churches.js');
  if (!mod?.churches) { console.log('  No church data found'); return; }

  let count = 0;

  for (const church of mod.churches) {
    try {
      const townId = townMap[church.town?.toLowerCase()] || null;

      const result = await strapiCreate('churches', {
        name: church.name,
        slug: slugify(church.name),
        denomination: church.denomination || null,
        address: church.address || null,
        city: church.town || null,
        state: 'TX',
        phone: church.phone || null,
        website: church.website || null,
        servicesTimes: church.service_times || null,
        town: townId,
        status: church.status || 'active',
      });

      if (result) {
        count++;
        if (count % 10 === 0) console.log(`  ... ${count}/${mod.churches.length}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${church.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.churches.length} churches created`);
}

async function seedRestaurants(townMap) {
  console.log('\n━━━ Seeding Restaurants ━━━');
  const mod = await loadData('restaurants.js');
  if (!mod?.restaurants) { console.log('  No restaurant data found'); return; }

  let count = 0;

  for (const rest of mod.restaurants) {
    try {
      const townId = townMap[rest.town?.toLowerCase()] || null;

      // Build description from extra fields
      let desc = rest.description || '';
      const features = [];
      if (rest.serves_alcohol) features.push(`Bar: ${rest.serves_alcohol}`);
      if (rest.outdoor_seating) features.push('Outdoor seating');
      if (rest.delivery_available) features.push('Delivery available');
      if (rest.takeout_available) features.push('Takeout available');
      if (rest.dine_in) features.push('Dine-in');
      if (rest.wheelchair_accessible) features.push('Wheelchair accessible');
      if (rest.family_friendly) features.push('Family friendly');
      if (rest.accepts_reservations) features.push('Accepts reservations');
      if (features.length > 0) {
        desc += (desc ? '\n\n' : '') + '**Features:** ' + features.join(' • ');
      }

      const result = await strapiCreate('restaurants', {
        name: rest.name,
        slug: slugify(rest.name),
        description: desc || null,
        address: rest.address || null,
        city: rest.town || null,
        state: 'TX',
        phone: rest.phone || null,
        cuisine: Array.isArray(rest.cuisine_types)
          ? rest.cuisine_types.join(', ')
          : (rest.cuisine_types || null),
        hours: rest.hours ? { text: rest.hours } : null,
        town: townId,
        status: rest.status || 'active',
      });

      if (result) {
        count++;
        if (count % 20 === 0) console.log(`  ... ${count}/${mod.restaurants.length}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${rest.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.restaurants.length} restaurants created`);
}

async function seedSchools(townMap) {
  console.log('\n━━━ Seeding Schools ━━━');
  const mod = await loadData('schools.js');
  if (!mod?.schools) { console.log('  No school data found'); return; }

  let count = 0;

  for (const school of mod.schools) {
    try {
      const townId = townMap[school.town?.toLowerCase()] || null;

      // Build description with mascot/colors info
      let desc = school.description || '';
      if (school.mascot) desc += (desc ? '\n\n' : '') + `**Mascot:** ${school.mascot}`;
      if (school.school_colors) desc += `\n**Colors:** ${school.school_colors}`;

      // Map school types to valid enum values
      const typeMap = {
        'daycare': 'daycare',
        'preschool': 'preschool',
        'pre-k': 'preschool',
        'pre_k': 'preschool',
        'head_start': 'headstart',
        'headstart': 'headstart',
        'childcare': 'daycare',
        'child_care': 'daycare',
      };
      const schoolType = typeMap[school.school_type] || school.school_type || null;

      const result = await strapiCreate('schools', {
        name: school.name,
        slug: slugify(school.name),
        schoolType,
        district: school.district || null,
        description: desc || null,
        address: school.address || null,
        city: school.town || null,
        phone: school.phone || null,
        website: school.website || null,
        grades: school.grades_served || null,
        town: townId,
        status: school.status || 'active',
      });

      if (result) {
        count++;
        if (count % 10 === 0) console.log(`  ... ${count}/${mod.schools.length}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${school.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.schools.length} schools created`);
}

async function seedAttractions(townMap) {
  console.log('\n━━━ Seeding Attractions → Local Businesses ━━━');
  const mod = await loadData('attractions.js');
  if (!mod?.attractions) { console.log('  No attraction data found'); return; }

  let count = 0;

  for (const attr of mod.attractions) {
    try {
      const townId = townMap[attr.town?.toLowerCase()] || null;

      // Build rich description
      let desc = attr.description || '';
      if (attr.history) desc += `\n\n## History\n${attr.history}`;
      if (attr.additional_info) desc += `\n\n${attr.additional_info}`;

      const specialties = {};
      if (attr.category) specialties.category = attr.category;
      if (attr.is_free !== undefined) specialties.isFree = attr.is_free;
      if (attr.year_established) specialties.yearEstablished = attr.year_established;

      const result = await strapiCreate('local-businesses', {
        name: attr.name,
        slug: slugify(attr.name),
        businessType: 'attraction',
        description: desc || null,
        address: attr.address || null,
        city: attr.town || null,
        state: 'TX',
        hours: attr.hours ? { text: attr.hours } : null,
        specialties: Object.keys(specialties).length > 0 ? specialties : null,
        town: townId,
        status: attr.status || 'active',
      });

      if (result) {
        count++;
        if (count % 20 === 0) console.log(`  ... ${count}/${mod.attractions.length}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${attr.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.attractions.length} attractions created`);
}

async function seedCommunityResources(townMap) {
  console.log('\n━━━ Seeding Community Resources → Local Businesses ━━━');
  const mod = await loadData('community-resources.js');
  if (!mod?.communityResources) { console.log('  No community resource data found'); return; }

  let count = 0;

  for (const res of mod.communityResources) {
    try {
      const townId = townMap[res.town?.toLowerCase()] || null;

      let desc = res.description || '';
      if (res.eligibility) desc += `\n\n**Eligibility:** ${res.eligibility}`;

      const specialties = {};
      if (res.category) specialties.category = res.category;
      if (res.services?.length > 0) specialties.services = res.services;

      const result = await strapiCreate('local-businesses', {
        name: res.name,
        slug: slugify(res.name),
        businessType: 'community-resource',
        description: desc || null,
        address: res.address || null,
        city: res.town || null,
        state: 'TX',
        phone: res.phone || null,
        email: res.email || null,
        website: res.website || null,
        hours: res.hours ? { text: res.hours } : null,
        specialties: Object.keys(specialties).length > 0 ? specialties : null,
        town: townId,
        status: res.status || 'active',
      });

      if (result) {
        count++;
        if (count % 20 === 0) console.log(`  ... ${count}/${mod.communityResources.length}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${res.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.communityResources.length} community resources created`);
}

async function seedSportsTeams(townMap) {
  console.log('\n━━━ Seeding Sports Teams → Local Businesses ━━━');
  const mod = await loadData('sports-teams.js');
  if (!mod?.sportsTeams) { console.log('  No sports team data found'); return; }

  let count = 0;

  for (const team of mod.sportsTeams) {
    try {
      const townId = townMap[team.town?.toLowerCase()] || null;

      const desc = team.description || '';

      const specialties = {
        sport: team.sport,
        level: team.level,
        organization: team.organization,
        homeVenue: team.home_venue,
        season: team.season,
      };

      const result = await strapiCreate('local-businesses', {
        name: team.name,
        slug: slugify(team.name),
        businessType: 'sports-team',
        description: desc || null,
        city: team.town || null,
        state: 'TX',
        specialties,
        town: townId,
        status: team.status || 'active',
      });

      if (result) {
        count++;
        if (count % 10 === 0) console.log(`  ... ${count}/${mod.sportsTeams.length}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${team.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.sportsTeams.length} sports teams created`);
}

async function seedFoodTrucks(townMap) {
  console.log('\n━━━ Seeding Food Trucks → Local Businesses ━━━');
  const mod = await loadData('food-trucks.js');
  if (!mod?.foodTrucks) { console.log('  No food truck data found'); return; }

  let count = 0;

  for (const truck of mod.foodTrucks) {
    try {
      const townName = truck.base_town || truck.town;
      const townId = townMap[townName?.toLowerCase()] || null;

      let desc = truck.description || '';
      if (truck.location_notes) desc += `\n\n**Location:** ${truck.location_notes}`;

      const specialties = {};
      if (truck.cuisine_types?.length > 0) specialties.cuisineTypes = truck.cuisine_types;
      if (truck.menu_highlights?.length > 0) specialties.menuHighlights = truck.menu_highlights;
      if (truck.serves_areas?.length > 0) specialties.servesAreas = truck.serves_areas;
      if (truck.social_media) specialties.socialMedia = truck.social_media;
      if (truck.accepts_catering !== undefined) specialties.acceptsCatering = truck.accepts_catering;

      const result = await strapiCreate('local-businesses', {
        name: truck.name,
        slug: slugify(truck.name),
        businessType: 'food-truck',
        description: desc || null,
        city: townName || null,
        state: 'TX',
        phone: truck.phone || null,
        website: truck.website || null,
        hours: truck.hours ? { text: truck.hours } : null,
        specialties: Object.keys(specialties).length > 0 ? specialties : null,
        town: townId,
        status: truck.status || 'active',
      });

      if (result) {
        count++;
        console.log(`  ✓ ${truck.name}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${truck.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.foodTrucks.length} food trucks created`);
}

async function seedPublicServices(townMap) {
  console.log('\n━━━ Seeding Public Services → Local Businesses ━━━');
  const mod = await loadData('public-services.js');
  if (!mod?.publicServices) { console.log('  No public service data found'); return; }

  let count = 0;

  for (const svc of mod.publicServices) {
    try {
      const townId = townMap[svc.town?.toLowerCase()] || null;

      let desc = svc.description || '';
      if (svc.eligibility) desc += `\n\n**Eligibility:** ${svc.eligibility}`;
      if (svc.emergency_phone && svc.emergency_phone !== '911') {
        desc += `\n\n**Emergency Phone:** ${svc.emergency_phone}`;
      }

      const specialties = {};
      if (svc.category) specialties.category = svc.category;
      if (svc.subcategory) specialties.subcategory = svc.subcategory;
      if (svc.services?.length > 0) specialties.services = svc.services;
      if (svc.is_public_service) specialties.isPublicService = true;

      const result = await strapiCreate('local-businesses', {
        name: svc.name,
        slug: slugify(svc.name),
        businessType: 'public-service',
        description: desc || null,
        address: svc.address || null,
        city: svc.town || null,
        state: 'TX',
        phone: svc.phone || null,
        email: svc.email || null,
        website: svc.website || null,
        hours: svc.hours ? { text: svc.hours } : null,
        specialties: Object.keys(specialties).length > 0 ? specialties : null,
        town: townId,
        status: svc.status || 'active',
      });

      if (result) {
        count++;
        if (count % 10 === 0) console.log(`  ... ${count}/${mod.publicServices.length}`);
      }
    } catch (error) {
      console.warn(`  ✗ ${svc.name}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.publicServices.length} public services created`);
}

async function seedServicePages(categoryMap) {
  console.log('\n━━━ Seeding Service Pages ━━━');
  const mod = await loadData('service-pages.js');
  if (!mod?.servicePages) { console.log('  No service page data found'); return; }

  let count = 0;
  let errors = 0;

  for (const page of mod.servicePages) {
    try {
      // Convert checklist sections: items array → markdown content
      const sections = (page.sections || []).map(s => {
        let content = s.content || '';
        if (s.items && Array.isArray(s.items)) {
          content = s.items.map(item => `- ${item}`).join('\n');
        }
        return { heading: s.heading, content };
      });

      const result = await strapiCreate('service-pages', {
        slug: page.slug,
        title: page.title,
        category: categoryMap[page.category] || null,
        subcategory: page.subcategory || null,
        layout: page.layout || 1,
        icon: page.icon || 'Briefcase',
        iconColor: page.iconColor || 'blue',
        metaTitle: page.metaTitle || null,
        metaDescription: page.metaDescription || null,
        metaKeywords: page.metaKeywords || null,
        heroContent: page.heroContent || '',
        localContext: page.localContext || null,
        sections,
        faqs: (page.faqs || []).map(f => ({
          question: f.question,
          answer: f.answer,
        })),
        externalResources: (page.externalResources || [])
          .filter(r => r.name && r.url)
          .map(r => ({ name: r.name, url: r.url })),
        claimedBusinessId: page.claimedBusinessId || null,
        status: page.status || 'active',
      });

      if (result) {
        count++;
        if (count % 50 === 0) console.log(`  ... ${count}/${mod.servicePages.length}`);
      }
    } catch (error) {
      errors++;
      console.warn(`  ✗ ${page.slug}: ${error.message}`);
    }
  }

  console.log(`  Total: ${count}/${mod.servicePages.length} service pages created (${errors} errors)`);
}

async function seedSiteSettings() {
  console.log('\n━━━ Seeding Site Settings ━━━');
  const mod = await loadData('site-settings.js');
  if (!mod?.siteSettings) { console.log('  No site settings data found'); return; }

  const cfg = mod.siteSettings.site_config || {};
  const analytics = mod.siteSettings.analytics_settings || {};

  const data = {
    siteName: cfg.site_name || 'CountyConnect',
    siteTagline: cfg.site_tagline || null,
    contactEmail: cfg.contact_email || null,
    contactPhone: cfg.contact_phone || null,
    address: cfg.county_seat ? `${cfg.county_seat}, ${cfg.county_state || 'TX'}` : null,
    socialLinks: {
      facebook: cfg.facebook_url || null,
      twitter: cfg.twitter_url || null,
      instagram: cfg.instagram_url || null,
    },
    analyticsId: analytics.ga4Enabled ? (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null) : null,
  };

  try {
    // Site settings is a single type — use PUT to /api/site-setting
    if (DRY_RUN) {
      console.log('  [DRY] Would update site settings');
      return;
    }

    const res = await fetch(`${STRAPI_URL}/api/site-setting`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(`${res.status}: ${JSON.stringify(error?.error?.message || error)}`);
    }

    console.log(`  ✓ Site settings updated`);
  } catch (error) {
    console.warn(`  ✗ Site settings: ${error.message}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   County Connect — Strapi Data Seeder       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`  Target: ${STRAPI_URL}`);
  console.log(`  Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  if (ONLY) console.log(`  Only: ${ONLY.join(', ')}`);
  if (SKIP.length) console.log(`  Skip: ${SKIP.join(', ')}`);
  console.log('');

  const startTime = Date.now();

  // Phase 1: Foundation data (needed for relations)
  let townMap = {};
  if (shouldSeed('towns')) {
    townMap = await seedTowns();
  } else {
    // Load existing towns for relation lookups
    console.log('\n  Loading existing towns for relations...');
    const existing = await strapiFind('towns');
    for (const t of existing) {
      townMap[t.name?.toLowerCase()] = t.id;
      if (t.slug) townMap[t.slug] = t.id;
    }
    console.log(`  Found ${existing.length} existing towns`);
  }

  let categoryMap = {};
  if (shouldSeed('service-categories')) {
    categoryMap = await seedServiceCategories();
  } else {
    // Load existing categories for relation lookups
    console.log('\n  Loading existing categories for relations...');
    const existing = await strapiFind('service-categories');
    for (const c of existing) {
      const key = c.slug?.replace(/-/g, '_');
      if (key) categoryMap[key] = c.id;
    }
    console.log(`  Found ${existing.length} existing categories`);
  }

  // Phase 2: Direct content types
  if (shouldSeed('churches')) await seedChurches(townMap);
  if (shouldSeed('restaurants')) await seedRestaurants(townMap);
  if (shouldSeed('schools')) await seedSchools(townMap);

  // Phase 3: Local business subtypes
  if (shouldSeed('attractions')) await seedAttractions(townMap);
  if (shouldSeed('community-resources')) await seedCommunityResources(townMap);
  if (shouldSeed('sports-teams')) await seedSportsTeams(townMap);
  if (shouldSeed('food-trucks')) await seedFoodTrucks(townMap);
  if (shouldSeed('public-services')) await seedPublicServices(townMap);

  // Phase 4: Service pages (depends on categories)
  if (shouldSeed('service-pages')) await seedServicePages(categoryMap);

  // Phase 5: Site settings
  if (shouldSeed('site-settings')) await seedSiteSettings();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║   Seeding complete in ${elapsed}s`);
  console.log(`╚══════════════════════════════════════════════╝\n`);
}

main().catch(error => {
  console.error('\n[FATAL ERROR]', error);
  process.exit(1);
});
