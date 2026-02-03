/**
 * Update Blooming Grove Cafe to Rocking RD Cattle CO Cafe
 * Run with: node src/seeds/update-blooming-grove-cafe.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Find Blooming Grove Cafe
const existing = db.prepare(`
  SELECT id, data FROM entities
  WHERE entity_type = 'Restaurant'
  AND json_extract(data, '$.name') = ?
`).get('Blooming Grove Cafe');

if (existing) {
  const restaurantData = JSON.parse(existing.data);

  // Update the data
  restaurantData.name = 'Rocking RD Cattle CO Cafe';
  restaurantData.description = 'Family-owned cafe serving steaks, home-style cooking, and comfort food favorites. Connected to the Rocking RD cattle operation, known for quality beef and hearty Texas meals.';
  restaurantData.address = '104 Fordyce St, Blooming Grove, TX 76626';
  restaurantData.phone = '(903) 695-2300';
  restaurantData.hours = 'Mon-Sat: 8:00 AM - 7:40 PM';

  // Update in database
  const stmt = db.prepare(`
    UPDATE entities
    SET data = ?, updated_date = ?
    WHERE id = ?
  `);

  const now = new Date().toISOString();
  stmt.run(JSON.stringify(restaurantData), now, existing.id);

  console.log('Successfully updated Blooming Grove Cafe to Rocking RD Cattle CO Cafe');
} else {
  console.log('Blooming Grove Cafe not found in database');
}

db.close();
