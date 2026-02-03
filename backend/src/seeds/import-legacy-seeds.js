/**
 * Import data from legacy SQLite-based seed files
 * 
 * This script reads the original seed files and imports the data arrays
 * into the new MySQL-compatible database.
 * 
 * Usage: node src/seeds/import-legacy-seeds.js
 */

import { initSeed, closeSeed, bulkInsertEntities, getEntityCount } from './seed-helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract array data from a seed file by parsing its content
 */
function extractArrayFromFile(filePath, arrayName) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find the array definition
  const regex = new RegExp(`const ${arrayName} = \\[([\\s\\S]*?)\\];`, 'm');
  const match = content.match(regex);
  
  if (!match) {
    console.log(`  Could not find ${arrayName} in ${path.basename(filePath)}`);
    return [];
  }

  try {
    // Create a safe evaluation context
    const arrayContent = match[0];
    // Use Function constructor to safely evaluate the array
    const fn = new Function(`return (${arrayContent.replace(`const ${arrayName} = `, '')})`);
    const data = fn();
    return data;
  } catch (error) {
    console.log(`  Error parsing ${arrayName}: ${error.message}`);
    return [];
  }
}

async function importLegacySeeds() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     Import Legacy Seed Files                      ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  try {
    await initSeed();

    // Show current counts
    console.log('📊 Current entity counts:');
    for (const type of ['Restaurant', 'FoodTruck', 'CommunityResource', 'Attraction', 'Page']) {
      const count = await getEntityCount(type);
      console.log(`   ${type}: ${count}`);
    }
    console.log('');

    // Import Restaurants from both files
    console.log('=== Importing Restaurants ===');
    const restaurantsFile1 = path.join(__dirname, 'navarro-county-restaurants-seed.js');
    const restaurantsFile2 = path.join(__dirname, 'navarro-county-restaurants-seed-2.js');
    
    if (fs.existsSync(restaurantsFile1)) {
      const restaurants1 = extractArrayFromFile(restaurantsFile1, 'restaurants');
      if (restaurants1.length > 0) {
        await bulkInsertEntities('Restaurant', restaurants1);
      }
    }
    
    if (fs.existsSync(restaurantsFile2)) {
      const restaurants2 = extractArrayFromFile(restaurantsFile2, 'restaurants');
      if (restaurants2.length > 0) {
        await bulkInsertEntities('Restaurant', restaurants2);
      }
    }

    // Import Food Trucks
    console.log('\n=== Importing Food Trucks ===');
    const foodTrucksFile = path.join(__dirname, 'seed-food-trucks.js');
    if (fs.existsSync(foodTrucksFile)) {
      const foodTrucks = extractArrayFromFile(foodTrucksFile, 'foodTrucks');
      if (foodTrucks.length > 0) {
        await bulkInsertEntities('FoodTruck', foodTrucks);
      }
    }

    // Import Community Resources
    console.log('\n=== Importing Community Resources ===');
    const commResourcesFile = path.join(__dirname, 'seed-community-resources.js');
    const commResourcesFile2 = path.join(__dirname, 'seed-additional-community-resources.js');
    
    if (fs.existsSync(commResourcesFile)) {
      const resources1 = extractArrayFromFile(commResourcesFile, 'communityResources');
      if (resources1.length > 0) {
        await bulkInsertEntities('CommunityResource', resources1);
      }
    }
    
    if (fs.existsSync(commResourcesFile2)) {
      const resources2 = extractArrayFromFile(commResourcesFile2, 'additionalCommunityResources');
      if (resources2.length > 0) {
        await bulkInsertEntities('CommunityResource', resources2);
      }
    }

    // Import Attractions
    console.log('\n=== Importing Attractions ===');
    const attractionsFile = path.join(__dirname, 'seed-attractions.js');
    const attractionsFile2 = path.join(__dirname, 'seed-additional-attractions.js');
    
    if (fs.existsSync(attractionsFile)) {
      const attractions1 = extractArrayFromFile(attractionsFile, 'attractions');
      if (attractions1.length > 0) {
        await bulkInsertEntities('Attraction', attractions1);
      }
    }
    
    if (fs.existsSync(attractionsFile2)) {
      const attractions2 = extractArrayFromFile(attractionsFile2, 'additionalAttractions');
      if (attractions2.length > 0) {
        await bulkInsertEntities('Attraction', attractions2);
      }
    }

    // Final counts
    console.log('\n📊 Final entity counts:');
    for (const type of ['Restaurant', 'FoodTruck', 'CommunityResource', 'Attraction', 'Page']) {
      const count = await getEntityCount(type);
      console.log(`   ${type}: ${count}`);
    }

    console.log('\n✅ Import complete!');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await closeSeed();
  }
}

importLegacySeeds();
