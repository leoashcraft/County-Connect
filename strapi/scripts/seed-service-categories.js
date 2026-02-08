/**
 * Seed Service Listing Categories Script
 *
 * Creates initial categories for the Services & Rentals marketplace.
 * Run after Strapi has been restarted with the new content types.
 *
 * Usage: node scripts/seed-service-categories.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Admin credentials - will login and get JWT token
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@navarrocounty.com';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'Admin123!';

let adminToken = null;

async function login() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Admin login failed: ${err.error?.message || res.status}`);
  }

  const data = await res.json();
  return data.data.token;
}

// Service listing categories with Lucide icon names
const CATEGORIES = [
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Landscaping, lawn care, home repair, cleaning, and property maintenance services',
    icon: 'Home',
    sortOrder: 1,
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Auto repair, detailing, towing, and vehicle maintenance services',
    icon: 'Car',
    sortOrder: 2,
  },
  {
    name: 'Professional Services',
    slug: 'professional-services',
    description: 'Legal, accounting, consulting, and business services',
    icon: 'Briefcase',
    sortOrder: 3,
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Personal training, massage, wellness coaching, and health services',
    icon: 'Heart',
    sortOrder: 4,
  },
  {
    name: 'Events & Entertainment',
    slug: 'events-entertainment',
    description: 'DJs, photographers, catering, party rentals, and event planning',
    icon: 'PartyPopper',
    sortOrder: 5,
  },
  {
    name: 'Tech & Electronics',
    slug: 'tech-electronics',
    description: 'Computer repair, IT support, electronics installation, and tech services',
    icon: 'Monitor',
    sortOrder: 6,
  },
  {
    name: 'Moving & Hauling',
    slug: 'moving-hauling',
    description: 'Moving services, junk removal, delivery, and hauling',
    icon: 'Truck',
    sortOrder: 7,
  },
  {
    name: 'Pet Services',
    slug: 'pet-services',
    description: 'Pet sitting, grooming, training, and veterinary services',
    icon: 'PawPrint',
    sortOrder: 8,
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description: 'Hair styling, makeup, nails, and personal care services',
    icon: 'Sparkles',
    sortOrder: 9,
  },
  {
    name: 'Education & Tutoring',
    slug: 'education-tutoring',
    description: 'Tutoring, music lessons, language instruction, and educational services',
    icon: 'GraduationCap',
    sortOrder: 10,
  },
  {
    name: 'Construction & Trades',
    slug: 'construction-trades',
    description: 'Plumbing, electrical, HVAC, roofing, and skilled trade services',
    icon: 'Hammer',
    sortOrder: 11,
  },
  {
    name: 'Equipment Rentals',
    slug: 'equipment-rentals',
    description: 'Tools, machinery, trailers, and equipment for rent',
    icon: 'Wrench',
    sortOrder: 12,
  },
  {
    name: 'Farm & Ranch',
    slug: 'farm-ranch',
    description: 'Agricultural services, tractor work, fencing, and rural property services',
    icon: 'Tractor',
    sortOrder: 13,
  },
  {
    name: 'Other Services',
    slug: 'other-services',
    description: 'Miscellaneous services and rentals',
    icon: 'MoreHorizontal',
    sortOrder: 99,
  },
];

async function createCategory(category) {
  // Use admin content-manager API instead of public API
  const res = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service-listing-category.service-listing-category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(category),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // Check if it's a duplicate error
    if (err.error?.message?.includes('unique') || err.error?.message?.includes('already')) {
      console.log(`  ⏭️  "${category.name}" already exists, skipping`);
      return null;
    }
    throw new Error(`Failed to create "${category.name}": ${err.error?.message || res.status}`);
  }

  const data = await res.json();
  return data.data;
}

async function main() {
  console.log('🌱 Seeding Service Listing Categories\n');
  console.log(`Strapi URL: ${STRAPI_URL}`);

  // Login to get admin token
  console.log('\n📝 Logging in as admin...');
  try {
    adminToken = await login();
    console.log('✅ Login successful\n');
  } catch (err) {
    console.error('❌', err.message);
    console.log('\nMake sure Strapi is running and admin credentials are correct.');
    process.exit(1);
  }

  // Create categories
  console.log('📂 Creating categories...\n');
  let created = 0;
  let skipped = 0;

  for (const category of CATEGORIES) {
    try {
      const result = await createCategory(category);
      if (result) {
        console.log(`  ✅ Created "${category.name}"`);
        created++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`  ❌ ${err.message}`);
    }
  }

  console.log(`\n✨ Done! Created ${created} categories, skipped ${skipped} existing.\n`);
}

main().catch(console.error);
