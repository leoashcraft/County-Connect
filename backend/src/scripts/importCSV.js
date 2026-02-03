import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, initDatabase } from '../models/database.js';
import { EntityModel } from '../models/Entity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
initDatabase();

// Temporarily disable foreign keys for import
const db = getDatabase();
db.pragma('foreign_keys = OFF');

const CSV_DIR = path.join(__dirname, '../../../exported_data');

// Parse CSV line handling quoted values and commas
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

// Parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      let value = values[index] || '';

      // Parse JSON arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
      // Parse booleans
      else if (value === 'true') value = true;
      else if (value === 'false') value = false;
      // Parse numbers
      else if (value !== '' && !isNaN(value)) {
        value = parseFloat(value);
      }
      // Empty strings to null
      else if (value === '') {
        value = null;
      }

      row[header] = value;
    });

    rows.push(row);
  }

  return rows;
}

// Import CSV data for an entity type
function importEntity(entityType) {
  const csvFile = path.join(CSV_DIR, `${entityType}_export.csv`);

  if (!fs.existsSync(csvFile)) {
    console.log(`⚠️  CSV file not found: ${entityType}_export.csv`);
    return 0;
  }

  const stat = fs.statSync(csvFile);
  if (stat.size === 0) {
    console.log(`⏭️  Skipping empty file: ${entityType}_export.csv`);
    return 0;
  }

  console.log(`📥 Importing ${entityType}...`);

  try {
    const rows = parseCSV(csvFile);

    if (rows.length === 0) {
      console.log(`   No data to import`);
      return 0;
    }

    let imported = 0;

    for (const row of rows) {
      // Extract system fields
      const { id, created_date, updated_date, created_by_id, created_by, is_sample, ...data } = row;

      try {
        // Check if entity already exists
        const existing = EntityModel.findById(entityType, id);

        if (existing) {
          // Update existing entity
          EntityModel.update(entityType, id, data);
          imported++;
        } else {
          // Create new entity with specific ID
          const db = getDatabase();
          const stmt = db.prepare(`
            INSERT INTO entities (id, entity_type, data, created_by, created_date, updated_date)
            VALUES (?, ?, ?, ?, ?, ?)
          `);

          stmt.run(
            id,
            entityType,
            JSON.stringify(data),
            created_by_id || null,
            created_date || new Date().toISOString(),
            updated_date || new Date().toISOString()
          );
          imported++;
        }
      } catch (error) {
        console.error(`   Error importing ${entityType} ${id}:`, error.message);
      }
    }

    console.log(`   ✅ Imported ${imported}/${rows.length} ${entityType} entities`);
    return imported;
  } catch (error) {
    console.error(`   ❌ Error importing ${entityType}:`, error.message);
    return 0;
  }
}

// Main import function
async function importAllData() {
  console.log('🚀 Starting CSV import...\n');

  const entityTypes = [
    'Store',
    'Product',
    'Service',
    'Brand',
    'Cart',
    'Order',
    'Wishlist',
    'Review',
    'Message',
    'SupportTicket',
    'Refund',
    'Quote',
    'Coupon',
    'Follow',
    'BlogPost',
    'NewsletterSubscriber',
    'StoreInvitation',
    'StorePage',
    'StoreNavigationItem',
    'ProductVariation',
  ];

  let totalImported = 0;

  for (const entityType of entityTypes) {
    const count = importEntity(entityType);
    totalImported += count;
  }

  console.log(`\n✅ Import complete! Total entities imported: ${totalImported}`);

  // Re-enable foreign keys
  const db = getDatabase();
  db.pragma('foreign_keys = ON');
  console.log('✅ Foreign keys re-enabled');
}

// Run import
importAllData().catch(error => {
  console.error('Import failed:', error);
  process.exit(1);
});
