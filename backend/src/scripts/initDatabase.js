import { initDatabase, closeDatabase } from '../models/database.js';
import { UserModel } from '../models/User.js';
import { EntityModel } from '../models/Entity.js';

async function main() {
  console.log('Initializing database...');

  // Initialize database (creates tables)
  await initDatabase();

  console.log('Database initialized successfully!');
  console.log('Tables created: users, entities, site_settings');

  // Check if --with-sample-data flag is passed
  const withSampleData = process.argv.includes('--with-sample-data');

  if (withSampleData) {
    // Optionally create a test admin user
    const testAdmin = {
      email: 'admin@test.com',
      full_name: 'Admin User',
      role: 'admin',
      oauth_provider: 'test',
      oauth_id: 'test-admin-1',
    };

    try {
      const existingAdmin = await UserModel.findByEmail(testAdmin.email);
      if (!existingAdmin) {
        await UserModel.create(testAdmin);
        console.log('Test admin user created:', testAdmin.email);
      } else {
        console.log('Test admin user already exists');
      }
    } catch (error) {
      console.error('Error creating test user:', error);
    }

    // Create some sample entities for testing
    const sampleStore = {
      name: 'Sample Store',
      description: 'A test store for development',
      is_active: true,
      owner_email: 'admin@test.com',
    };

    const sampleProduct = {
      name: 'Sample Product',
      description: 'A test product',
      price: 29.99,
      status: 'active',
    };

    try {
      // Check if sample data already exists
      const stores = await EntityModel.list('Store', { limit: 1 });
      if (stores.length === 0) {
        await EntityModel.create('Store', sampleStore);
        await EntityModel.create('Product', sampleProduct);
        console.log('Sample entities created');
      } else {
        console.log('Sample entities already exist');
      }
    } catch (error) {
      console.error('Error creating sample entities:', error);
    }
  }

  await closeDatabase();
  console.log('\nDatabase initialization complete!\n');
}

main().catch(console.error);
