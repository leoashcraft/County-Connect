/**
 * Update remaining restaurant hours (name variations and missing)
 * Run with: node src/seeds/update-remaining-restaurant-hours.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Hours for remaining restaurants (exact name matches)
const restaurantHours = {
  // === CHAINS ===
  "DQ Grill & Chill Kerens": "Mon-Sun: 10:30 AM - 9:00 PM",
  "Raising Cane's Chicken Fingers": "Mon-Sun: 10:00 AM - 11:00 PM",
  "Slim Chickens": "Mon-Sun: 10:30 AM - 10:00 PM",
  "Waffle House": "Open 24 Hours",
  "Wingstop": "Mon-Sun: 11:00 AM - 12:00 AM",
  "Zaxby's": "Mon-Sat: 10:30 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM",
  "Navarro College Starbucks": "Mon-Fri: 7:00 AM - 3:00 PM, Sat-Sun: Closed",

  // === LOCAL RESTAURANTS ===
  "Kerens Cafe": "Mon-Sat: 6:00 AM - 2:00 PM, Sun: Closed",
  "Rice Cafe": "Mon-Sat: 6:00 AM - 2:00 PM, Sun: Closed",
  "OAK COVE CAFE": "Wed-Mon: 7:00 AM - 2:00 PM, Tue: Closed",
  "Tastytown Cafe": "Mon-Sat: 6:00 AM - 2:00 PM, Sun: Closed",

  // === ITALIAN ===
  "Napoli's Italian Restaurant and Bar": "Tue-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM, Mon: Closed",

  // === MEXICAN ===
  "Old Mexican Inn Restaurant & Cantina": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM",
  "Taco Shop": "Mon-Sat: 7:00 AM - 9:00 PM, Sun: 8:00 AM - 8:00 PM",
  "Taqueria Las Comadres": "Mon-Sun: 7:00 AM - 9:00 PM",
  "Tortilleria Matehuala y Restaurante": "Mon-Sat: 6:00 AM - 8:00 PM, Sun: 7:00 AM - 3:00 PM",

  // === BBQ ===
  "Smokin' Guns BBQ": "Wed-Sat: 11:00 AM - 8:00 PM, Sun: 11:00 AM - 3:00 PM, Mon-Tue: Closed",
  "The Gipsy Joint & BBQ": "Thu-Sat: 11:00 AM - 8:00 PM, Sun: 11:00 AM - 3:00 PM, Mon-Wed: Closed",
  "Tucker Town BBQ": "Thu-Sat: 11:00 AM - 7:00 PM, Sun: 11:00 AM - 3:00 PM, Mon-Wed: Closed",

  // === ASIAN ===
  "Summer Palace": "Mon-Thu: 11:00 AM - 9:30 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:30 AM - 9:00 PM",
  "XOXO Boba": "Mon-Sat: 11:00 AM - 9:00 PM, Sun: 12:00 PM - 8:00 PM",

  // === OTHER ===
  "Olive Branch Eatery & Retail": "Tue-Sat: 11:00 AM - 3:00 PM, Sun-Mon: Closed",
  "Pelican Grill": "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 8:00 PM",
  "Pizza House Rice": "Mon-Sat: 11:00 AM - 9:00 PM, Sun: 12:00 PM - 8:00 PM",
  "The Harbor Restaurant": "Wed-Sat: 11:00 AM - 9:00 PM, Sun: 11:00 AM - 3:00 PM, Mon-Tue: Closed",
  "Timbers": "Mon-Sat: 11:00 AM - 12:00 AM, Sun: 11:00 AM - 10:00 PM",
  "Uniquely Yours Tea Room": "Tue-Sat: 11:00 AM - 3:00 PM, Sun-Mon: Closed",
  "Hootin Holler Beer & Liquor": "Mon-Sat: 10:00 AM - 9:00 PM, Sun: 12:00 PM - 6:00 PM"
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
let alreadyHasHours = 0;
let notFound = 0;

const restaurants = selectStmt.all();

for (const restaurant of restaurants) {
  const data = JSON.parse(restaurant.data);
  const name = data.name;

  // Skip if already has hours
  if (data.hours) {
    alreadyHasHours++;
    continue;
  }

  if (restaurantHours[name]) {
    data.hours = restaurantHours[name];
    updateStmt.run(JSON.stringify(data), now, restaurant.id);
    console.log(`[UPDATED] ${name}: ${restaurantHours[name]}`);
    updated++;
  } else {
    console.log(`[NOT FOUND] ${name}`);
    notFound++;
  }
}

console.log(`\nDone! Updated ${updated} restaurants, ${alreadyHasHours} already had hours, ${notFound} still without hours.`);

db.close();
