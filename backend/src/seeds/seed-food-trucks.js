/**
 * Seed food trucks for Navarro County
 * Run with: node src/seeds/seed-food-trucks.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

const now = new Date().toISOString();

// Food trucks serving Navarro County
const foodTrucks = [
  {
    name: "Taco Station Food Truck",
    description: "Authentic Mexican cuisine with quality dining, home flavors, and homemade tortillas. Owner Yebel Shlimovitch trained under famous chef Rick Bayless at Frontera Grill in Chicago before bringing authentic Mexican flavors to Corsicana. Everything is made fresh to order including hand-made tortillas.",
    cuisine_types: ["mexican", "tacos", "authentic"],
    base_town: "Corsicana",
    phone: null,
    website: "https://www.tacostationfoodtruck.com",
    social_media: {
      facebook: "TacoStationFoodTruck"
    },
    menu_highlights: [
      "Tacos with handmade flour tortillas",
      "Cochinita Pibil (slow-cooked pork)",
      "Quesadillas",
      "Gorditas",
      "Burritos",
      "House-made salsa"
    ],
    hours: "Mon-Fri: 11:00 AM - 6:00 PM, Sat: 11:00 AM - 8:00 PM, Sun: Closed",
    location_notes: "Often found near Seventh Avenue and S. 12th Street (near Tiger Tote). Also available for private events and catering.",
    serves_areas: ["Corsicana", "Navarro County"],
    accepts_catering: true,
    status: "active"
  },
  {
    name: "Shake the Bone BBQ",
    description: "Local BBQ food truck serving up smoked meats and classic Texas barbecue. Regular participant at Corsicana's Food Truck Friday events downtown.",
    cuisine_types: ["bbq", "american", "smoked meats"],
    base_town: "Corsicana",
    phone: null,
    website: null,
    social_media: {},
    menu_highlights: [
      "Smoked Brisket",
      "Pulled Pork",
      "Ribs",
      "BBQ Sides"
    ],
    hours: "Varies - check social media for schedule",
    location_notes: "Regularly appears at Food Truck Friday events in downtown Corsicana behind Brick Streets Brewery.",
    serves_areas: ["Corsicana", "Navarro County"],
    accepts_catering: true,
    status: "active"
  },
  {
    name: "Frios Gourmet Pops",
    description: "Gourmet popsicles made with real ingredients. Flavors range from timeless favorites like Strawberry Mango and Cookies and Cream to indulgent combos like Caramel Cheesecake and Key Lime Pie. Fruit-based pops are gluten-free and vegan.",
    cuisine_types: ["desserts", "frozen treats", "gourmet"],
    base_town: "Corsicana",
    phone: null,
    website: "https://friospops.com",
    social_media: {},
    menu_highlights: [
      "Strawberry Mango Pop",
      "Cookies and Cream Pop",
      "Caramel Cheesecake Pop",
      "Key Lime Pie Pop",
      "Pickle Pop"
    ],
    hours: "Varies - check schedule for events",
    location_notes: "Mobile vendor available for events. Regular participant at Food Truck Friday in downtown Corsicana.",
    serves_areas: ["Corsicana", "Navarro County"],
    accepts_catering: true,
    status: "active"
  },
  {
    name: "Kona Ice of Waco",
    description: "Tropical shaved ice truck bringing the flavors of the islands to Navarro County. The Kona Ice experience includes watching your shaved ice created and choosing from a variety of tropical flavors.",
    cuisine_types: ["desserts", "shaved ice", "frozen treats"],
    base_town: "Corsicana",
    phone: null,
    website: "https://www.kona-ice.com",
    social_media: {},
    menu_highlights: [
      "Tropical Shaved Ice",
      "Kona Floats",
      "Sugar-Free Options"
    ],
    hours: "Varies - available for events",
    location_notes: "Mobile vendor servicing Corsicana and surrounding Navarro County communities. Available for private events, schools, and festivals.",
    serves_areas: ["Corsicana", "Navarro County", "Waco area"],
    accepts_catering: true,
    status: "active"
  },
  {
    name: "BoHoSno",
    description: "Snow cone and shaved ice vendor serving refreshing frozen treats. A local favorite at community events and Food Truck Fridays in downtown Corsicana.",
    cuisine_types: ["desserts", "snow cones", "frozen treats"],
    base_town: "Corsicana",
    phone: null,
    website: null,
    social_media: {},
    menu_highlights: [
      "Classic Snow Cones",
      "Specialty Flavors",
      "Cream-topped Snow Cones"
    ],
    hours: "Varies - check social media for schedule",
    location_notes: "Regular participant at Food Truck Friday events in downtown Corsicana.",
    serves_areas: ["Corsicana", "Navarro County"],
    accepts_catering: true,
    status: "active"
  }
];

// Insert food trucks
const insertStmt = db.prepare(`
  INSERT INTO entities (id, entity_type, data, created_date, updated_date)
  VALUES (?, ?, ?, ?, ?)
`);

const checkStmt = db.prepare(`
  SELECT id FROM entities
  WHERE entity_type = 'FoodTruck'
  AND json_extract(data, '$.name') = ?
`);

let added = 0;
let skipped = 0;

for (const truck of foodTrucks) {
  // Check if already exists
  const existing = checkStmt.get(truck.name);
  if (existing) {
    console.log(`[SKIPPED] ${truck.name} - already exists`);
    skipped++;
    continue;
  }

  const id = uuidv4();
  const data = {
    id,
    ...truck,
    created_date: now
  };

  insertStmt.run(id, 'FoodTruck', JSON.stringify(data), now, now);
  console.log(`[ADDED] ${truck.name}`);
  added++;
}

console.log(`\nDone! Added ${added} food trucks, skipped ${skipped} (already existed).`);

db.close();
