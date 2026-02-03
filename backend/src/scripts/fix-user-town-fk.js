import { getDatabase } from '../models/database.js';

console.log('Fixing user preferred_town_id foreign key constraint...');

const db = getDatabase();

try {
  // SQLite doesn't support dropping foreign keys directly,
  // so we need to recreate the table without the FK constraint

  // Disable foreign key constraints temporarily
  db.pragma('foreign_keys = OFF');
  console.log('✓ Disabled foreign key constraints');

  // Begin transaction
  db.exec('BEGIN TRANSACTION;');

  // 1. Create a new users table without the FK constraint
  db.exec(`
    CREATE TABLE users_new (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      picture TEXT,
      role TEXT DEFAULT 'user',
      oauth_provider TEXT,
      oauth_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      phone TEXT,
      preferred_town_id TEXT,
      street_address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      bio TEXT,
      profile_completed INTEGER DEFAULT 0
    );
  `);
  console.log('✓ Created new users table');

  // 2. Copy all data from old table to new table
  db.exec(`
    INSERT INTO users_new
    SELECT id, email, full_name, picture, role, oauth_provider, oauth_id,
           created_at, updated_at, phone, preferred_town_id, street_address,
           city, state, zip_code, bio, profile_completed
    FROM users;
  `);
  console.log('✓ Copied user data');

  // 3. Drop the old table
  db.exec('DROP TABLE users;');
  console.log('✓ Dropped old users table');

  // 4. Rename the new table
  db.exec('ALTER TABLE users_new RENAME TO users;');
  console.log('✓ Renamed table');

  // Commit transaction
  db.exec('COMMIT;');
  console.log('✓ Transaction committed');

  // Re-enable foreign key constraints
  db.pragma('foreign_keys = ON');
  console.log('✓ Re-enabled foreign key constraints');

  console.log('\n✅ Foreign key constraint removed successfully!');
  console.log('Users can now set their preferred town without FK constraint errors.');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
