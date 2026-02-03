/**
 * Seed Helper - Database-agnostic seeding utilities
 * Works with both SQLite (local) and MySQL (production)
 */

import { initDatabase, closeDatabase, dbQuery, getDatabaseType } from '../models/database.js';
import { v4 as uuidv4 } from 'uuid';

let initialized = false;

/**
 * Get current timestamp in database-appropriate format
 * MySQL needs 'YYYY-MM-DD HH:MM:SS', SQLite accepts ISO 8601
 */
function getTimestamp() {
  const now = new Date();
  if (getDatabaseType() === 'mysql') {
    return now.toISOString().slice(0, 19).replace('T', ' ');
  }
  return now.toISOString();
}

/**
 * Initialize the database connection for seeding
 */
export async function initSeed() {
  if (!initialized) {
    await initDatabase();
    initialized = true;
    console.log(`Database initialized (${getDatabaseType()})`);
  }
}

/**
 * Close the database connection
 */
export async function closeSeed() {
  if (initialized) {
    await closeDatabase();
    initialized = false;
    console.log('Database connection closed');
  }
}

/**
 * Insert an entity if it doesn't already exist (by name)
 * @param {string} entityType - The type of entity (e.g., 'Church', 'Restaurant')
 * @param {object} data - The entity data
 * @param {boolean} skipDuplicates - If true, skip entities with same name
 * @returns {string} The entity ID
 */
export async function insertEntity(entityType, data, skipDuplicates = true) {
  const dbType = getDatabaseType();
  
  // Check if entity with same name exists
  if (skipDuplicates && data.name) {
    let existing;
    if (dbType === 'mysql') {
      existing = await dbQuery.get(
        `SELECT id FROM entities WHERE entity_type = ? AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.name')) = ?`,
        [entityType, data.name]
      );
    } else {
      existing = await dbQuery.get(
        `SELECT id FROM entities WHERE entity_type = ? AND json_extract(data, '$.name') = ?`,
        [entityType, data.name]
      );
    }

    if (existing) {
      console.log(`  [SKIP] ${entityType}: ${data.name} (already exists)`);
      return existing.id;
    }
  }

  const id = uuidv4();
  const now = getTimestamp();

  await dbQuery.run(
    `INSERT INTO entities (id, entity_type, data, created_date, updated_date)
     VALUES (?, ?, ?, ?, ?)`,
    [id, entityType, JSON.stringify({ ...data, id, created_date: now }), now, now]
  );

  console.log(`  [ADD] ${entityType}: ${data.name || id}`);
  return id;
}

/**
 * Bulk insert entities
 * @param {string} entityType - The type of entity
 * @param {array} dataArray - Array of entity data objects
 * @param {boolean} skipDuplicates - If true, skip entities with same name
 */
export async function bulkInsertEntities(entityType, dataArray, skipDuplicates = true) {
  console.log(`\nSeeding ${dataArray.length} ${entityType} entities...`);
  let added = 0;
  let skipped = 0;

  for (const data of dataArray) {
    const dbType = getDatabaseType();
    let existing = null;
    
    if (skipDuplicates && data.name) {
      if (dbType === 'mysql') {
        existing = await dbQuery.get(
          `SELECT id FROM entities WHERE entity_type = ? AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.name')) = ?`,
          [entityType, data.name]
        );
      } else {
        existing = await dbQuery.get(
          `SELECT id FROM entities WHERE entity_type = ? AND json_extract(data, '$.name') = ?`,
          [entityType, data.name]
        );
      }
    }

    if (existing) {
      skipped++;
      continue;
    }

    const id = uuidv4();
    const now = getTimestamp();

    await dbQuery.run(
      `INSERT INTO entities (id, entity_type, data, created_date, updated_date)
       VALUES (?, ?, ?, ?, ?)`,
      [id, entityType, JSON.stringify({ ...data, id, created_date: now }), now, now]
    );
    added++;
  }

  console.log(`  Added: ${added}, Skipped: ${skipped}`);
}

/**
 * Update an entity by name
 * @param {string} entityType - The type of entity
 * @param {string} name - The name to match
 * @param {object} updates - The fields to update
 */
export async function updateEntityByName(entityType, name, updates) {
  const dbType = getDatabaseType();
  
  let existing;
  if (dbType === 'mysql') {
    existing = await dbQuery.get(
      `SELECT id, data FROM entities WHERE entity_type = ? AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.name')) = ?`,
      [entityType, name]
    );
  } else {
    existing = await dbQuery.get(
      `SELECT id, data FROM entities WHERE entity_type = ? AND json_extract(data, '$.name') = ?`,
      [entityType, name]
    );
  }

  if (!existing) {
    console.log(`  [NOT FOUND] ${entityType}: ${name}`);
    return null;
  }

  const currentData = typeof existing.data === 'string' ? JSON.parse(existing.data) : existing.data;
  const mergedData = { ...currentData, ...updates };
  const now = getTimestamp();

  await dbQuery.run(
    `UPDATE entities SET data = ?, updated_date = ? WHERE id = ?`,
    [JSON.stringify(mergedData), now, existing.id]
  );

  console.log(`  [UPDATE] ${entityType}: ${name}`);
  return existing.id;
}

/**
 * Delete all entities of a type (use with caution!)
 * @param {string} entityType - The type of entity to delete
 */
export async function clearEntityType(entityType) {
  const result = await dbQuery.run(
    `DELETE FROM entities WHERE entity_type = ?`,
    [entityType]
  );
  console.log(`  Deleted ${result.changes} ${entityType} entities`);
  return result.changes;
}

/**
 * Get count of entities by type
 * @param {string} entityType - The type of entity
 */
export async function getEntityCount(entityType) {
  const result = await dbQuery.get(
    `SELECT COUNT(*) as count FROM entities WHERE entity_type = ?`,
    [entityType]
  );
  return result.count;
}

/**
 * Insert a site setting
 * @param {string} key - Setting key
 * @param {object} value - Setting value
 */
export async function insertSiteSetting(key, value) {
  const dbType = getDatabaseType();
  const now = getTimestamp();
  const valueStr = JSON.stringify(value);

  if (dbType === 'mysql') {
    await dbQuery.run(
      `INSERT INTO site_settings (setting_key, setting_value, updated_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = VALUES(updated_at)`,
      [key, valueStr, now]
    );
  } else {
    await dbQuery.run(
      `INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at)
       VALUES (?, ?, ?)`,
      [key, valueStr, now]
    );
  }

  console.log(`  [SETTING] ${key}`);
}
