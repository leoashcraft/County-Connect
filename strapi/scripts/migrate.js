#!/usr/bin/env node

/**
 * Data Migration Script: County Connect → Strapi
 *
 * Migrates data from the existing MySQL entities table
 * into structured Strapi content types via the REST API.
 *
 * Usage:
 *   DATABASE_URL=mysql://... STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=xxx node scripts/migrate.js
 */

const mysql = require('mysql2/promise');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required');
  process.exit(1);
}

if (!STRAPI_TOKEN) {
  console.error('ERROR: STRAPI_TOKEN environment variable is required');
  process.exit(1);
}

// ID mapping: old UUID → new Strapi ID
const idMap = {
  users: {},
  towns: {},
  serviceCategories: {},
  servicePages: {},
  restaurants: {},
  churches: {},
  schools: {},
  jobs: {},
  events: {},
  localBusinesses: {},
  marketplaceListings: {},
  marketplaceCategories: {},
  forumCategories: {},
  forumPosts: {},
};

// Strapi API helper
async function strapiCreate(contentType, data, retries = 3) {
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
        throw new Error(`Strapi ${res.status}: ${JSON.stringify(error)}`);
      }

      const result = await res.json();
      return result.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`  Retry ${i + 1}/${retries} for ${contentType}: ${error.message}`);
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// Fetch all entities of a type from source DB
async function fetchEntities(connection, entityType) {
  const [rows] = await connection.execute(
    'SELECT id, data, created_by, created_date, updated_date FROM entities WHERE entity_type = ? ORDER BY created_date ASC',
    [entityType]
  );
  return rows.map(row => ({
    id: row.id,
    ...JSON.parse(typeof row.data === 'string' ? row.data : JSON.stringify(row.data)),
    _createdBy: row.created_by,
    _createdDate: row.created_date,
    _updatedDate: row.updated_date,
  }));
}

// Fetch all users from source DB
async function fetchUsers(connection) {
  const [rows] = await connection.execute('SELECT * FROM users ORDER BY created_at ASC');
  return rows;
}

// ==========================================
// Migration functions for each content type
// ==========================================

async function migrateUsers(connection) {
  console.log('\n--- Migrating Users...');
  const users = await fetchUsers(connection);
  let count = 0;

  for (const user of users) {
    try {
      // Strapi users-permissions plugin has its own user creation
      const res = await fetch(`${STRAPI_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          username: user.email,
          email: user.email,
          password: `migrated_${user.id}_${Date.now()}`,
          confirmed: true,
          blocked: false,
          role: 1, // Default authenticated role
          full_name: user.full_name,
          phone: user.phone,
          street_address: user.street_address,
          city: user.city,
          state: user.state,
          zip_code: user.zip_code,
          bio: user.bio,
          is_verified_vendor: !!user.is_verified_vendor,
          verification_requested: !!user.verification_requested,
          profile_completed: !!user.profile_completed,
          external_id: user.id,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        idMap.users[user.id] = result.id;
        count++;
      } else {
        const err = await res.json().catch(() => ({}));
        console.warn(`  [WARN] User ${user.email}: ${JSON.stringify(err)}`);
      }
    } catch (error) {
      console.warn(`  [WARN] User ${user.email}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${users.length} users`);
}

async function migrateTowns(connection) {
  console.log('\n--- Migrating Towns...');
  const towns = await fetchEntities(connection, 'Town');
  let count = 0;

  for (const town of towns) {
    try {
      const result = await strapiCreate('towns', {
        name: town.name,
        slug: town.slug || town.name?.toLowerCase().replace(/\s+/g, '-'),
        county: town.county || 'Navarro',
        state: town.state || 'TX',
        population: town.population,
        description: town.description,
        latitude: town.latitude || town.lat,
        longitude: town.longitude || town.lng,
        zipCodes: town.zipCodes || town.zip_codes,
      });
      idMap.towns[town.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] Town ${town.name}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${towns.length} towns`);
}

async function migrateServiceCategories(connection) {
  console.log('\n--- Migrating Service Categories...');
  // Service categories might be stored as separate entities or embedded in service pages
  const categories = await fetchEntities(connection, 'ServiceCategory');

  // If no explicit categories, extract unique categories from service pages
  if (categories.length === 0) {
    console.log('  No ServiceCategory entities found, will extract from service pages');
    return;
  }

  let count = 0;
  for (const cat of categories) {
    try {
      const result = await strapiCreate('service-categories', {
        name: cat.name,
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-'),
        icon: cat.icon,
        description: cat.description,
      });
      idMap.serviceCategories[cat.id] = result.id;
      if (cat.slug) idMap.serviceCategories[cat.slug] = result.id;
      if (cat.name) idMap.serviceCategories[cat.name] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] Category ${cat.name}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${categories.length} service categories`);
}

async function migrateServicePages(connection) {
  console.log('\n--- Migrating Service Pages...');
  const pages = await fetchEntities(connection, 'ServicePage');
  let count = 0;

  // Track categories for auto-creation
  const seenCategories = new Set();

  for (const page of pages) {
    try {
      // Auto-create category if needed
      let categoryId = null;
      if (page.category) {
        if (!idMap.serviceCategories[page.category]) {
          try {
            const catResult = await strapiCreate('service-categories', {
              name: page.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              slug: page.category.replace(/_/g, '-'),
            });
            idMap.serviceCategories[page.category] = catResult.id;
          } catch (e) {
            // Category might already exist
          }
        }
        categoryId = idMap.serviceCategories[page.category];
      }

      const result = await strapiCreate('service-pages', {
        slug: page.slug,
        title: page.title,
        category: categoryId,
        subcategory: page.subcategory,
        layout: page.layout || 1,
        icon: page.icon || 'Briefcase',
        iconColor: page.iconColor || 'blue',
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        metaKeywords: page.metaKeywords,
        heroContent: page.heroContent,
        localContext: page.localContext,
        sections: (page.sections || []).map(s => ({
          heading: s.heading,
          content: s.content,
        })),
        faqs: (page.faqs || []).map(f => ({
          question: f.question,
          answer: f.answer,
        })),
        externalResources: (page.externalResources || []).map(r => ({
          name: r.name,
          url: r.url,
        })),
        claimedBusinessId: page.claimedBusinessId,
        status: page.status || 'active',
      });
      idMap.servicePages[page.id] = result.id;
      if (page.slug) idMap.servicePages[page.slug] = result.id;
      count++;

      if (count % 50 === 0) {
        console.log(`  ... ${count}/${pages.length} service pages`);
      }
    } catch (error) {
      console.warn(`  [WARN] ServicePage ${page.slug}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${pages.length} service pages`);
}

async function migrateRestaurants(connection) {
  console.log('\n--- Migrating Restaurants...');
  const restaurants = await fetchEntities(connection, 'Restaurant');
  let count = 0;

  for (const item of restaurants) {
    try {
      const result = await strapiCreate('restaurants', {
        name: item.name,
        slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-'),
        description: item.description,
        address: item.address,
        city: item.city,
        state: item.state || 'TX',
        zipCode: item.zipCode || item.zip_code,
        phone: item.phone,
        email: item.email,
        website: item.website,
        cuisine: item.cuisine,
        priceRange: item.priceRange || item.price_range,
        hours: item.hours || item.operating_hours,
        town: item.town_id ? idMap.towns[item.town_id] : null,
        owner: item._createdBy ? idMap.users[item._createdBy] : null,
        status: item.status || 'active',
      });
      idMap.restaurants[item.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] Restaurant ${item.name}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${restaurants.length} restaurants`);
}

async function migrateChurches(connection) {
  console.log('\n--- Migrating Churches...');
  const churches = await fetchEntities(connection, 'Church');
  let count = 0;

  for (const item of churches) {
    try {
      const result = await strapiCreate('churches', {
        name: item.name,
        slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-'),
        denomination: item.denomination,
        description: item.description,
        address: item.address,
        city: item.city,
        state: item.state || 'TX',
        phone: item.phone,
        email: item.email,
        website: item.website,
        servicesTimes: item.servicesTimes || item.services_times || item.service_times,
        town: item.town_id ? idMap.towns[item.town_id] : null,
        owner: item._createdBy ? idMap.users[item._createdBy] : null,
        status: item.status || 'active',
      });
      idMap.churches[item.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] Church ${item.name}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${churches.length} churches`);
}

async function migrateSchools(connection) {
  console.log('\n--- Migrating Schools...');
  const schools = await fetchEntities(connection, 'School');
  let count = 0;

  for (const item of schools) {
    try {
      const result = await strapiCreate('schools', {
        name: item.name,
        slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-'),
        schoolType: item.schoolType || item.school_type,
        district: item.district,
        description: item.description,
        address: item.address,
        city: item.city,
        phone: item.phone,
        website: item.website,
        grades: item.grades,
        enrollment: item.enrollment,
        town: item.town_id ? idMap.towns[item.town_id] : null,
        status: item.status || 'active',
      });
      idMap.schools[item.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] School ${item.name}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${schools.length} schools`);
}

async function migrateJobs(connection) {
  console.log('\n--- Migrating Jobs...');
  const jobs = await fetchEntities(connection, 'Job');
  let count = 0;

  for (const item of jobs) {
    try {
      const result = await strapiCreate('jobs', {
        title: item.title,
        slug: item.slug || item.title?.toLowerCase().replace(/\s+/g, '-'),
        company: item.company,
        description: item.description,
        jobType: item.jobType || item.job_type,
        salary: item.salary,
        location: item.location,
        requirements: item.requirements,
        benefits: item.benefits,
        contactEmail: item.contactEmail || item.contact_email,
        contactPhone: item.contactPhone || item.contact_phone,
        applicationUrl: item.applicationUrl || item.application_url,
        town: item.town_id ? idMap.towns[item.town_id] : null,
        postedBy: item._createdBy ? idMap.users[item._createdBy] : null,
        expiresAt: item.expiresAt || item.expires_at,
        status: item.status || 'active',
      });
      idMap.jobs[item.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] Job ${item.title}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${jobs.length} jobs`);
}

async function migrateEvents(connection) {
  console.log('\n--- Migrating Events...');
  const events = await fetchEntities(connection, 'Event');
  let count = 0;

  for (const item of events) {
    try {
      const result = await strapiCreate('events', {
        title: item.title,
        slug: item.slug || item.title?.toLowerCase().replace(/\s+/g, '-'),
        description: item.description,
        startDate: item.startDate || item.start_date || item.date,
        endDate: item.endDate || item.end_date,
        location: item.location,
        address: item.address,
        eventType: item.eventType || item.event_type,
        price: item.price,
        contactInfo: item.contactInfo || item.contact_info,
        website: item.website,
        town: item.town_id ? idMap.towns[item.town_id] : null,
        organizer: item._createdBy ? idMap.users[item._createdBy] : null,
        status: item.status || 'upcoming',
      });
      idMap.events[item.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] Event ${item.title}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${events.length} events`);
}

async function migrateGenericBusinesses(connection) {
  console.log('\n--- Migrating Local Businesses (generic types)...');

  // Types that map to local-business
  const businessTypes = [
    'Store', 'FoodTruck', 'TruckStop', 'CommunityResource',
    'SportsTeam', 'Daycare', 'Attraction', 'RealtyListing',
  ];

  let totalCount = 0;

  for (const entityType of businessTypes) {
    const items = await fetchEntities(connection, entityType);
    let count = 0;

    for (const item of items) {
      try {
        const result = await strapiCreate('local-businesses', {
          name: item.name || item.title,
          slug: item.slug || (item.name || item.title)?.toLowerCase().replace(/\s+/g, '-'),
          businessType: entityType.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, ''),
          description: item.description,
          address: item.address,
          city: item.city,
          state: item.state || 'TX',
          zipCode: item.zipCode || item.zip_code,
          phone: item.phone,
          email: item.email,
          website: item.website,
          hours: item.hours || item.operating_hours,
          specialties: item.specialties || item.tags,
          town: item.town_id ? idMap.towns[item.town_id] : null,
          owner: item._createdBy ? idMap.users[item._createdBy] : null,
          status: item.status || 'active',
        });
        idMap.localBusinesses[item.id] = result.id;
        count++;
      } catch (error) {
        console.warn(`  [WARN] ${entityType} ${item.name || item.title}: ${error.message}`);
      }
    }
    console.log(`  ${entityType}: ${count}/${items.length}`);
    totalCount += count;
  }
  console.log(`  Total local businesses migrated: ${totalCount}`);
}

async function migrateReviews(connection) {
  console.log('\n--- Migrating Reviews...');
  const reviews = await fetchEntities(connection, 'Review');
  let count = 0;

  for (const item of reviews) {
    try {
      await strapiCreate('reviews', {
        rating: item.rating || 5,
        title: item.title,
        content: item.content || item.text || item.body,
        entityType: item.entityType || item.entity_type,
        entityId: item.entityId || item.entity_id,
        author: item._createdBy ? idMap.users[item._createdBy] : null,
      });
      count++;
    } catch (error) {
      console.warn(`  [WARN] Review: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${reviews.length} reviews`);
}

async function migrateForumPosts(connection) {
  console.log('\n--- Migrating Forum Posts...');
  const posts = await fetchEntities(connection, 'ForumPost');
  let count = 0;

  for (const item of posts) {
    try {
      const result = await strapiCreate('forum-posts', {
        title: item.title,
        slug: item.slug || item.title?.toLowerCase().replace(/\s+/g, '-'),
        content: item.content || item.body,
        category: item.category,
        author: item._createdBy ? idMap.users[item._createdBy] : null,
        town: item.town_id ? idMap.towns[item.town_id] : null,
        status: item.status || 'published',
      });
      idMap.forumPosts[item.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] ForumPost ${item.title}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${posts.length} forum posts`);
}

async function migrateMarketplaceListings(connection) {
  console.log('\n--- Migrating Marketplace Listings...');
  const listings = await fetchEntities(connection, 'Product');
  let count = 0;

  for (const item of listings) {
    try {
      const result = await strapiCreate('marketplace-listings', {
        title: item.title || item.name,
        slug: item.slug || (item.title || item.name)?.toLowerCase().replace(/\s+/g, '-'),
        description: item.description,
        price: item.price,
        condition: item.condition,
        category: item.category,
        contactEmail: item.contactEmail || item.contact_email,
        contactPhone: item.contactPhone || item.contact_phone,
        seller: item._createdBy ? idMap.users[item._createdBy] : null,
        town: item.town_id ? idMap.towns[item.town_id] : null,
        status: item.status || 'active',
      });
      idMap.marketplaceListings[item.id] = result.id;
      count++;
    } catch (error) {
      console.warn(`  [WARN] Listing ${item.title || item.name}: ${error.message}`);
    }
  }
  console.log(`  Migrated ${count}/${listings.length} marketplace listings`);
}

// ==========================================
// Main migration
// ==========================================

async function main() {
  console.log('=== County Connect -> Strapi Migration ===');
  console.log(`   Source: ${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);
  console.log(`   Target: ${STRAPI_URL}`);
  console.log('');

  // Parse DATABASE_URL
  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  console.log('Connected to source database');

  // Check entity counts
  const [entityCounts] = await connection.execute(
    'SELECT entity_type, COUNT(*) as count FROM entities GROUP BY entity_type ORDER BY count DESC'
  );
  console.log('\nEntity counts in source database:');
  for (const row of entityCounts) {
    console.log(`   ${row.entity_type}: ${row.count}`);
  }

  const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
  console.log(`   Users: ${userCount[0].count}`);

  // Run migrations in dependency order
  const startTime = Date.now();

  await migrateUsers(connection);
  await migrateTowns(connection);
  await migrateServiceCategories(connection);
  await migrateServicePages(connection);
  await migrateRestaurants(connection);
  await migrateChurches(connection);
  await migrateSchools(connection);
  await migrateJobs(connection);
  await migrateEvents(connection);
  await migrateGenericBusinesses(connection);
  await migrateMarketplaceListings(connection);
  await migrateReviews(connection);
  await migrateForumPosts(connection);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nMigration complete in ${elapsed}s`);
  console.log('\nID Mapping Summary:');
  Object.entries(idMap).forEach(([type, map]) => {
    const count = Object.keys(map).length;
    if (count > 0) console.log(`   ${type}: ${count} mapped`);
  });

  await connection.end();
}

main().catch(error => {
  console.error('\n[ERROR] Migration failed:', error);
  process.exit(1);
});
