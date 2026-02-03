/**
 * Add The Grove Nutrition to Blooming Grove
 * Run with: node src/seeds/add-grove-nutrition.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Check if already exists
const existing = db.prepare(`
  SELECT id FROM entities
  WHERE entity_type = 'Restaurant'
  AND json_extract(data, '$.name') = ?
`).get('The Grove Nutrition');

if (existing) {
  console.log('The Grove Nutrition already exists.');
  db.close();
  process.exit(0);
}

const id = uuidv4();
const now = new Date().toISOString();

const restaurantData = {
  id,
  name: "The Grove Nutrition",
  address: "101 N Fordyce St, Blooming Grove, TX 76626",
  town: "Blooming Grove",
  phone: "(903) 695-0090",
  cuisine_types: ["healthy", "smoothies", "cafe"],
  description: "Nutrition club offering energizing teas, protein shakes, smoothies, and healthy meal replacement options. A great spot for a quick, nutritious pick-me-up.",
  serves_alcohol: null,
  wheelchair_accessible: true,
  outdoor_seating: false,
  delivery_available: false,
  takeout_available: true,
  dine_in: true,
  family_friendly: true,
  accepts_credit_cards: true,
  status: "active",
  business_status: "open",
  created_date: now
};

const stmt = db.prepare(`
  INSERT INTO entities (id, entity_type, data, created_date, updated_date)
  VALUES (?, ?, ?, ?, ?)
`);

stmt.run(id, 'Restaurant', JSON.stringify(restaurantData), now, now);
console.log('Added: The Grove Nutrition in Blooming Grove');

db.close();
