/**
 * Migration: Add slugs to existing towns
 * Run with: node src/seeds/add-town-slugs.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get all towns
const towns = db.prepare(`
  SELECT id, data FROM entities
  WHERE entity_type = 'Town'
`).all();

console.log(`Found ${towns.length} towns to update\n`);

const updateStmt = db.prepare(`
  UPDATE entities
  SET data = ?, updated_date = ?
  WHERE id = ?
`);

const now = new Date().toISOString();
let updated = 0;

for (const town of towns) {
  const townData = JSON.parse(town.data);

  if (!townData.slug) {
    townData.slug = generateSlug(townData.name);
    updateStmt.run(JSON.stringify(townData), now, town.id);
    console.log(`  [UPDATED] ${townData.name} → slug: "${townData.slug}"`);
    updated++;
  } else {
    console.log(`  [SKIP] ${townData.name} (already has slug: "${townData.slug}")`);
  }
}

console.log(`\nDone! Updated ${updated} towns.`);

db.close();
