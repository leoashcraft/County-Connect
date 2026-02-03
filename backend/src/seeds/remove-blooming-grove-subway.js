/**
 * Remove Subway from Blooming Grove
 * Run with: node src/seeds/remove-blooming-grove-subway.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Find and delete Subway in Blooming Grove
const subway = db.prepare(`
  SELECT id, data FROM entities
  WHERE entity_type = 'Restaurant'
  AND json_extract(data, '$.name') LIKE '%Subway%'
  AND json_extract(data, '$.town') = 'Blooming Grove'
`).get();

if (subway) {
  const data = JSON.parse(subway.data);
  console.log(`Found: ${data.name} in ${data.town}`);

  db.prepare(`DELETE FROM entities WHERE id = ?`).run(subway.id);
  console.log('Deleted successfully.');
} else {
  console.log('No Subway found in Blooming Grove.');
}

db.close();
