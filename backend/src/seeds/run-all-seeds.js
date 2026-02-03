/**
 * Master Seed Runner for Navarro County
 * 
 * This script runs all seed files in the correct order.
 * Works with both SQLite (local) and MySQL (production).
 * 
 * Usage:
 *   node src/seeds/run-all-seeds.js              # Run all seeds
 *   node src/seeds/run-all-seeds.js --clear      # Clear existing data first
 *   node src/seeds/run-all-seeds.js --dry-run    # Show what would be seeded
 * 
 * Environment:
 *   Uses DATABASE_TYPE and DATABASE_URL from .env
 */

import { initSeed, closeSeed, bulkInsertEntities, insertSiteSetting, getEntityCount, clearEntityType } from './seed-helper.js';

// Import data from seed files
import { churches } from './data/churches.js';
import { schools } from './data/schools.js';
import { restaurants } from './data/restaurants.js';
import { foodTrucks } from './data/food-trucks.js';
import { communityResources } from './data/community-resources.js';
import { attractions } from './data/attractions.js';
import { sportsTeams } from './data/sports-teams.js';
import { towns } from './data/towns.js';
import { pages } from './data/pages.js';
import { siteSettings } from './data/site-settings.js';

const args = process.argv.slice(2);
const clearFirst = args.includes('--clear');
const dryRun = args.includes('--dry-run');

async function runSeeds() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     Navarro County - Master Seed Runner          ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
    console.log('Data to be seeded:');
    console.log(`  - Churches: ${churches?.length || 0}`);
    console.log(`  - Schools: ${schools?.length || 0}`);
    console.log(`  - Restaurants: ${restaurants?.length || 0}`);
    console.log(`  - Food Trucks: ${foodTrucks?.length || 0}`);
    console.log(`  - Community Resources: ${communityResources?.length || 0}`);
    console.log(`  - Attractions: ${attractions?.length || 0}`);
    console.log(`  - Sports Teams: ${sportsTeams?.length || 0}`);
    console.log(`  - Towns: ${towns?.length || 0}`);
    console.log(`  - Pages: ${pages?.length || 0}`);
    return;
  }

  try {
    await initSeed();

    if (clearFirst) {
      console.log('⚠️  Clearing existing data...\n');
      await clearEntityType('Church');
      await clearEntityType('School');
      await clearEntityType('Restaurant');
      await clearEntityType('FoodTruck');
      await clearEntityType('CommunityResource');
      await clearEntityType('Attraction');
      await clearEntityType('SportsTeam');
      await clearEntityType('Town');
      await clearEntityType('Page');
      console.log('');
    }

    // Show current counts
    console.log('📊 Current entity counts:');
    for (const type of ['Church', 'School', 'Restaurant', 'FoodTruck', 'CommunityResource', 'Attraction', 'SportsTeam', 'Town', 'Page']) {
      const count = await getEntityCount(type);
      console.log(`   ${type}: ${count}`);
    }
    console.log('');

    // Seed in order of dependencies
    console.log('🌱 Starting seed process...\n');

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
    console.log('\n📊 Final entity counts:');
    for (const type of ['Church', 'School', 'Restaurant', 'FoodTruck', 'CommunityResource', 'Attraction', 'SportsTeam', 'Town', 'Page']) {
      const count = await getEntityCount(type);
      console.log(`   ${type}: ${count}`);
    }

    console.log('\n✅ Seed complete!');

  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await closeSeed();
  }
}

runSeeds();
