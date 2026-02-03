import { getDatabase } from '../models/database.js';

console.log('Adding user profile fields...');

const db = getDatabase();

try {
  // Add phone field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN phone TEXT').run();
    console.log('✓ Added phone column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ Phone column already exists');
    } else {
      throw e;
    }
  }

  // Add preferred_town_id field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN preferred_town_id TEXT REFERENCES towns(id)').run();
    console.log('✓ Added preferred_town_id column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ Preferred_town_id column already exists');
    } else {
      throw e;
    }
  }

  // Add street_address field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN street_address TEXT').run();
    console.log('✓ Added street_address column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ Street_address column already exists');
    } else {
      throw e;
    }
  }

  // Add city field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN city TEXT').run();
    console.log('✓ Added city column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ City column already exists');
    } else {
      throw e;
    }
  }

  // Add state field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN state TEXT').run();
    console.log('✓ Added state column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ State column already exists');
    } else {
      throw e;
    }
  }

  // Add zip_code field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN zip_code TEXT').run();
    console.log('✓ Added zip_code column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ Zip_code column already exists');
    } else {
      throw e;
    }
  }

  // Add bio field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN bio TEXT').run();
    console.log('✓ Added bio column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ Bio column already exists');
    } else {
      throw e;
    }
  }

  // Add profile_completed field
  try {
    db.prepare('ALTER TABLE users ADD COLUMN profile_completed INTEGER DEFAULT 0').run();
    console.log('✓ Added profile_completed column');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('✓ Profile_completed column already exists');
    } else {
      throw e;
    }
  }

  console.log('\n✅ User profile fields migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
