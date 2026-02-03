#!/usr/bin/env node
/**
 * Pre-run script for Railway deployment
 * 
 * Runs before the application starts to:
 * 1. Initialize database tables
 * 2. Seed data if database is empty
 * 
 * Usage:
 *   node src/scripts/prebuild.js
 * 
 * Environment variables:
 *   DATABASE_TYPE - 'mysql' or 'sqlite' (default: sqlite)
 *   DATABASE_URL - MySQL connection URL (for Railway)
 *   SKIP_SEED - Set to 'true' to skip seeding
 */

import { initDatabase, closeDatabase, dbQuery, getDatabaseType } from '../models/database.js';
import { initSeed, closeSeed, bulkInsertEntities, insertSiteSetting, getEntityCount } from '../seeds/seed-helper.js';

// Import seed data
import { churches } from '../seeds/data/churches.js';
import { schools } from '../seeds/data/schools.js';
import { restaurants } from '../seeds/data/restaurants.js';
import { foodTrucks } from '../seeds/data/food-trucks.js';
import { communityResources } from '../seeds/data/community-resources.js';
import { attractions } from '../seeds/data/attractions.js';
import { sportsTeams } from '../seeds/data/sports-teams.js';
import { towns } from '../seeds/data/towns.js';
import { pages } from '../seeds/data/pages.js';
import { siteSettings } from '../seeds/data/site-settings.js';

async function prebuild() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║           Pre-run Script                         ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  try {
    // Initialize database (creates tables if they don't exist)
    console.log('Initializing database...');
    await initDatabase();
    console.log(`Database type: ${getDatabaseType()}`);
    console.log('Database tables initialized.\n');

    // Check if we should skip seeding
    if (process.env.SKIP_SEED === 'true') {
      console.log('SKIP_SEED=true, skipping seed process.');
      await closeDatabase();
      return;
    }

    // Check if database already has data
    const entityCount = await dbQuery.get('SELECT COUNT(*) as count FROM entities');
    
    if (entityCount && entityCount.count > 0) {
      console.log(`Database already has ${entityCount.count} entities.`);
      console.log('Skipping seed (database not empty).\n');
    } else {
      console.log('Database is empty. Running seed...\n');
      await runSeed();
    }

    await closeDatabase();
    console.log('\n✅ Pre-run complete!');

  } catch (error) {
    console.error('\n❌ Pre-run failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

async function runSeed() {
  // Seed in order of dependencies
  console.log('🌱 Seeding data...\n');

  // 1. Towns first (other entities reference them)
  if (towns?.length) {
    await bulkInsertEntities('Town', towns);
  }

  // 2. Core entities
  if (churches?.length) {
    await bulkInsertEntities('Church', churches);
  }

  if (schools?.length) {
    await bulkInsertEntities('School', schools);
  }

  if (restaurants?.length) {
    await bulkInsertEntities('Restaurant', restaurants);
  }

  if (foodTrucks?.length) {
    await bulkInsertEntities('FoodTruck', foodTrucks);
  }

  if (communityResources?.length) {
    await bulkInsertEntities('CommunityResource', communityResources);
  }

  if (attractions?.length) {
    await bulkInsertEntities('Attraction', attractions);
  }

  if (sportsTeams?.length) {
    await bulkInsertEntities('SportsTeam', sportsTeams);
  }

  // 3. Pages
  if (pages?.length) {
    await bulkInsertEntities('Page', pages);
  }

  // 4. Site Settings
  if (siteSettings) {
    console.log('\nSeeding site settings...');
    for (const [key, value] of Object.entries(siteSettings)) {
      await insertSiteSetting(key, value);
    }
  }

  // Final counts
  console.log('\n📊 Seeded entity counts:');
  for (const type of ['Church', 'School', 'Restaurant', 'FoodTruck', 'CommunityResource', 'Attraction', 'SportsTeam', 'Town', 'Page']) {
    const count = await getEntityCount(type);
    console.log(`   ${type}: ${count}`);
  }

  console.log('\n✅ Seed complete!');
}

prebuild();
