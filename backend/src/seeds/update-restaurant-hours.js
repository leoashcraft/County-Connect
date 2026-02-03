/**
 * Update restaurant hours
 * Run with: node src/seeds/update-restaurant-hours.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Restaurant hours data
const restaurantHours = {
  // === BLOOMING GROVE ===
  "Rocking RD Cattle CO Cafe": "Mon-Sat: 8:00 AM - 7:30 PM, Sun: Closed",
  "The Grove Nutrition": "Mon-Fri: 7:00 AM - 2:00 PM, Sat: 8:00 AM - 12:00 PM, Sun: Closed",

  // === CORSICANA - Fast Food & Chains ===
  "7 Brew Coffee": "Mon-Sat: 6:00 AM - 10:00 PM, Sun: 7:00 AM - 10:00 PM",
  "Applebee's Grill & Bar": "Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 11:00 PM, Sun: 11:00 AM - 10:00 PM",
  "Arby's": "Mon-Sun: 10:00 AM - 10:00 PM",
  "Braum's Ice Cream & Dairy Store": "Mon-Thu: 6:00 AM - 10:30 PM, Fri-Sat: 6:00 AM - 11:00 PM, Sun: 6:00 AM - 10:30 PM",
  "Buc-ee's": "Open 24 Hours",
  "Burger King": "Mon-Sun: 6:00 AM - 11:00 PM",
  "Bush's Chicken": "Mon-Sat: 10:30 AM - 9:00 PM, Sun: 11:00 AM - 9:00 PM",
  "Captain D's": "Mon-Thu: 10:30 AM - 9:00 PM, Fri-Sat: 10:30 AM - 10:00 PM, Sun: 10:30 AM - 9:00 PM",
  "Chick-fil-A Corsicana": "Mon-Sat: 6:30 AM - 10:00 PM, Sun: Closed",
  "Chili's Grill and Bar": "Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 11:00 PM, Sun: 11:00 AM - 10:00 PM",
  "Church's Texas Chicken": "Mon-Sun: 10:30 AM - 10:00 PM",
  "Cracker Barrel Old Country Store": "Mon-Sun: 7:00 AM - 9:00 PM",
  "Dairy Queen": "Mon-Sun: 10:30 AM - 10:00 PM",
  "Denny's": "Open 24 Hours",
  "Dickey's Barbecue Pit": "Mon-Sun: 11:00 AM - 9:00 PM",
  "Domino's Pizza": "Mon-Thu: 10:30 AM - 11:00 PM, Fri-Sat: 10:30 AM - 12:00 AM, Sun: 10:30 AM - 11:00 PM",
  "Dutch Bros Coffee": "Mon-Sun: 5:00 AM - 10:00 PM",
  "Freddy's Frozen Custard & Steakburgers": "Mon-Sun: 10:30 AM - 10:00 PM",
  "Golden Chick": "Mon-Sat: 10:30 AM - 9:30 PM, Sun: 11:00 AM - 9:00 PM",
  "Jack in the Box": "Open 24 Hours",
  "KFC": "Mon-Sun: 10:30 AM - 10:00 PM",
  "Layne's Chicken Fingers": "Mon-Sat: 10:30 AM - 9:00 PM, Sun: 11:00 AM - 9:00 PM",
  "Little Caesars Pizza": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM",
  "Long John Silver's": "Mon-Sun: 10:30 AM - 9:00 PM",
  "McDonald's": "Open 24 Hours",
  "Panda Express": "Mon-Sat: 10:30 AM - 9:30 PM, Sun: 11:00 AM - 9:00 PM",
  "Pizza Hut": "Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 11:00 PM, Sun: 11:00 AM - 10:00 PM",
  "Popeyes Louisiana Kitchen": "Mon-Sun: 10:30 AM - 10:00 PM",
  "Schlotzsky's": "Mon-Sat: 10:30 AM - 9:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Sonic Drive-In": "Mon-Sun: 6:00 AM - 11:00 PM",
  "Starbucks": "Mon-Fri: 5:30 AM - 8:00 PM, Sat-Sun: 6:00 AM - 8:00 PM",
  "Subway": "Mon-Sat: 8:00 AM - 9:00 PM, Sun: 9:00 AM - 8:00 PM",
  "Taco Bell": "Mon-Sun: 7:00 AM - 1:00 AM",
  "Taco Bueno": "Mon-Sun: 7:00 AM - 10:00 PM",
  "Taco Casa": "Mon-Sat: 7:00 AM - 9:00 PM, Sun: 8:00 AM - 9:00 PM",
  "Wendy's": "Mon-Sun: 6:30 AM - 11:00 PM",
  "Whataburger": "Open 24 Hours",

  // === CORSICANA - Local Restaurants ===
  "Across The Street Diner": "Mon-Sat: 7:00 AM - 2:00 PM, Sun: Closed",
  "Across the Street Bistro": "Tue-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 3:00 PM, Mon: Closed",
  "Angelita Vineyard & Winery": "Thu-Sat: 12:00 PM - 8:00 PM, Sun: 12:00 PM - 6:00 PM, Mon-Wed: Closed",
  "Billy's Grille": "Tue-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun-Mon: Closed",
  "Birrieria Aguinaga": "Mon-Sun: 8:00 AM - 9:00 PM",
  "Bottlecap Alley Icehouse Grill": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Brick Streets Brewery": "Wed-Thu: 4:00 PM - 9:00 PM, Fri: 4:00 PM - 10:00 PM, Sat: 12:00 PM - 10:00 PM, Sun: 12:00 PM - 6:00 PM, Mon-Tue: Closed",
  "C&S Baking Co.": "Tue-Fri: 7:00 AM - 5:00 PM, Sat: 8:00 AM - 2:00 PM, Sun-Mon: Closed",
  "Calle 7 Latin Cuisine": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "China One": "Mon-Thu: 11:00 AM - 9:30 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:30 AM - 9:00 PM",
  "Classic Wok Chinese Cafe": "Mon-Sat: 11:00 AM - 9:00 PM, Sun: Closed",
  "Cocina Azteca": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Cocina Las Tres Marias": "Mon-Sun: 7:00 AM - 9:00 PM",
  "Collin Street Bakery": "Mon-Sat: 7:00 AM - 6:00 PM, Sun: Closed",
  "Corsicana Steakhouse at the Opry": "Thu-Sat: 5:00 PM - 10:00 PM, Sun: 11:00 AM - 3:00 PM, Mon-Wed: Closed",
  "Cotton Patch Cafe": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM",
  "El Mexicano Grill": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Ellinya Italian Restaurant": "Tue-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM, Mon: Closed",
  "Food Belly": "Mon-Sat: 11:00 AM - 8:00 PM, Sun: Closed",
  "Fuji Grill & Sushi Corsicana Inc": "Mon-Thu: 11:00 AM - 9:30 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:30 AM - 9:00 PM",
  "Italian Village": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM",
  "Juliette's Taqueria": "Mon-Sat: 7:00 AM - 3:00 PM, Sun: Closed",
  "K & K Bar-b-que": "Tue-Sat: 11:00 AM - 8:00 PM, Sun-Mon: Closed",
  "La Cabana Restaurant": "Mon-Sun: 7:00 AM - 10:00 PM",
  "La Pradera": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Los Agaves Mexican Grill & Bar": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Marshall's Tavern Corsicana": "Tue-Sat: 4:00 PM - 12:00 AM, Sun-Mon: Closed",
  "Mas Queso Tex-Mex Restaurant": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Mita's Coffee House": "Mon-Fri: 7:00 AM - 5:00 PM, Sat: 8:00 AM - 3:00 PM, Sun: Closed",
  "Moontower at the Oaks": "Wed-Sat: 11:00 AM - 9:00 PM, Sun: 11:00 AM - 3:00 PM, Mon-Tue: Closed",
  "Ms. Arlene's Kountry Kitchen Soul Food & More": "Tue-Sat: 11:00 AM - 7:00 PM, Sun: 11:00 AM - 4:00 PM, Mon: Closed",
  "Old Mexico": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "On The Square Cafe": "Mon-Sat: 7:00 AM - 2:00 PM, Sun: Closed",
  "Papa Murphy's": "Mon-Sat: 11:00 AM - 8:00 PM, Sun: 12:00 PM - 7:00 PM",
  "Roma's Italian Restaurant": "Tue-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM, Mon: Closed",
  "Sakura Japanese Steakhouse": "Mon-Thu: 11:00 AM - 9:30 PM, Fri: 11:00 AM - 10:30 PM, Sat: 12:00 PM - 10:30 PM, Sun: 12:00 PM - 9:00 PM",
  "Santa Fe Cattle Company": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM",
  "Simply Yolked": "Mon-Sat: 7:00 AM - 2:00 PM, Sun: 8:00 AM - 2:00 PM",
  "Sirloin Stockade": "Mon-Sun: 11:00 AM - 9:00 PM",
  "SteamPunk Coffee Lab": "Mon-Fri: 7:00 AM - 6:00 PM, Sat: 8:00 AM - 4:00 PM, Sun: Closed",
  "Sweet 17": "Tue-Sat: 11:00 AM - 8:00 PM, Sun-Mon: Closed",
  "Taqueria El Palenque": "Mon-Sun: 7:00 AM - 10:00 PM",
  "Taqueria La Mexicana": "Mon-Sun: 6:00 AM - 10:00 PM",
  "The Angry Egg": "Mon-Sat: 7:00 AM - 2:00 PM, Sun: 8:00 AM - 2:00 PM",
  "The Original Fried Pie Shop": "Mon-Sat: 6:00 AM - 6:00 PM, Sun: Closed",
  "Wooden Spoon Restaurant": "Tue-Sat: 11:00 AM - 2:00 PM, Sun-Mon: Closed",

  // === DAWSON ===
  "Dawson Country Store": "Mon-Sat: 6:00 AM - 8:00 PM, Sun: 7:00 AM - 6:00 PM",

  // === FROST ===
  "Main Street Grill": "Mon-Sat: 6:00 AM - 2:00 PM, Sun: Closed",
  "Frost Dairy Queen": "Mon-Sun: 10:30 AM - 9:00 PM",

  // === KERENS ===
  "Kerens Dairy Queen": "Mon-Sun: 10:30 AM - 9:00 PM",
  "Los Arcos Mexican Restaurant": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Kerens Pizza Hut": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 9:00 PM",
  "Sonic Drive-In Kerens": "Mon-Sun: 7:00 AM - 10:00 PM",

  // === RICE ===
  "Rice Dairy Queen": "Mon-Sun: 10:30 AM - 9:00 PM",
  "Rice Sonic": "Mon-Sun: 7:00 AM - 10:00 PM",

  // === RICHLAND ===
  "Richland Crossing Cafe": "Mon-Sat: 6:00 AM - 2:00 PM, Sun: Closed",

  // === MEXIA (nearby) ===
  "El Charro": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",

  // === Grocery stores (for completeness) ===
  "Brookshire Food Store": "Mon-Sun: 6:00 AM - 10:00 PM",
  "HEB Grocery Company": "Mon-Sun: 6:00 AM - 11:00 PM",
  "Walmart Supercenter": "Mon-Sun: 6:00 AM - 11:00 PM"
};

// Update restaurants with hours
const selectStmt = db.prepare(`
  SELECT id, data FROM entities
  WHERE entity_type = 'Restaurant'
`);

const updateStmt = db.prepare(`
  UPDATE entities
  SET data = ?, updated_date = ?
  WHERE id = ?
`);

const now = new Date().toISOString();
let updated = 0;
let skipped = 0;

const restaurants = selectStmt.all();

for (const restaurant of restaurants) {
  const data = JSON.parse(restaurant.data);
  const name = data.name;

  if (restaurantHours[name]) {
    data.hours = restaurantHours[name];
    updateStmt.run(JSON.stringify(data), now, restaurant.id);
    console.log(`[UPDATED] ${name}: ${restaurantHours[name]}`);
    updated++;
  } else {
    skipped++;
  }
}

console.log(`\nDone! Updated ${updated} restaurants, skipped ${skipped} without hours data.`);

db.close();
