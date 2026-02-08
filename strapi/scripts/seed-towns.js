/**
 * Seed Navarro County towns with zip codes
 * Run: cd strapi && node scripts/seed-towns.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@navarrocounty.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

const navarroCountyTowns = [
  {
    name: 'Corsicana',
    slug: 'corsicana',
    county: 'Navarro',
    state: 'TX',
    population: 24485,
    zipCodes: ['75110', '75109', '75151'],
    latitude: 32.0954,
    longitude: -96.4689,
    description: 'Corsicana is the county seat of Navarro County and the largest city in the county. Known for its historic downtown, Collin Street Bakery fruitcakes, and rich oil industry heritage.',
  },
  {
    name: 'Kerens',
    slug: 'kerens',
    county: 'Navarro',
    state: 'TX',
    population: 1573,
    zipCodes: ['75144'],
    latitude: 32.1301,
    longitude: -96.2278,
    description: 'A small community in eastern Navarro County with a close-knit atmosphere and local charm.',
  },
  {
    name: 'Blooming Grove',
    slug: 'blooming-grove',
    county: 'Navarro',
    state: 'TX',
    population: 833,
    zipCodes: ['76626'],
    latitude: 32.0862,
    longitude: -96.7142,
    description: 'A quiet rural community in western Navarro County.',
  },
  {
    name: 'Dawson',
    slug: 'dawson',
    county: 'Navarro',
    state: 'TX',
    population: 807,
    zipCodes: ['76639'],
    latitude: 31.9012,
    longitude: -96.7156,
    description: 'A small town in southern Navarro County with agricultural roots.',
  },
  {
    name: 'Frost',
    slug: 'frost',
    county: 'Navarro',
    state: 'TX',
    population: 643,
    zipCodes: ['76641'],
    latitude: 32.0773,
    longitude: -96.8067,
    description: 'A small community in southwestern Navarro County.',
  },
  {
    name: 'Rice',
    slug: 'rice',
    county: 'Navarro',
    state: 'TX',
    population: 923,
    zipCodes: ['75155'],
    latitude: 32.2395,
    longitude: -96.5003,
    description: 'A small town in northern Navarro County.',
  },
  {
    name: 'Richland',
    slug: 'richland',
    county: 'Navarro',
    state: 'TX',
    population: 264,
    zipCodes: ['76681'],
    latitude: 31.9284,
    longitude: -96.4292,
    description: 'A small rural community in southeastern Navarro County near Richland Chambers Reservoir.',
  },
  {
    name: 'Barry',
    slug: 'barry',
    county: 'Navarro',
    state: 'TX',
    population: 245,
    zipCodes: ['75102'],
    latitude: 32.0998,
    longitude: -96.6156,
    description: 'A small community between Corsicana and Blooming Grove.',
  },
  {
    name: 'Mildred',
    slug: 'mildred',
    county: 'Navarro',
    state: 'TX',
    population: 411,
    zipCodes: ['75109'],
    latitude: 32.0362,
    longitude: -96.3778,
    description: 'A rural community east of Corsicana.',
  },
  {
    name: 'Purdon',
    slug: 'purdon',
    county: 'Navarro',
    state: 'TX',
    population: 125,
    zipCodes: ['76679'],
    latitude: 31.9498,
    longitude: -96.5778,
    description: 'A small unincorporated community in southern Navarro County.',
  },
  {
    name: 'Angus',
    slug: 'angus',
    county: 'Navarro',
    state: 'TX',
    population: 415,
    zipCodes: ['75159'],
    latitude: 32.2595,
    longitude: -96.4292,
    description: 'A small community in northern Navarro County.',
  },
  {
    name: 'Powell',
    slug: 'powell',
    county: 'Navarro',
    state: 'TX',
    population: 118,
    zipCodes: ['75153'],
    latitude: 32.1073,
    longitude: -96.3356,
    description: 'A small rural community in eastern Navarro County.',
  },
  {
    name: 'Retreat',
    slug: 'retreat',
    county: 'Navarro',
    state: 'TX',
    population: 377,
    zipCodes: ['75110'],
    latitude: 32.1459,
    longitude: -96.5639,
    description: 'A small community north of Corsicana.',
  },
  {
    name: 'Emhouse',
    slug: 'emhouse',
    county: 'Navarro',
    state: 'TX',
    population: 150,
    zipCodes: ['75110'],
    latitude: 32.1612,
    longitude: -96.5378,
    description: 'A small unincorporated community in Navarro County.',
  },
  {
    name: 'Eureka',
    slug: 'eureka',
    county: 'Navarro',
    state: 'TX',
    population: 310,
    zipCodes: ['76639'],
    latitude: 31.9362,
    longitude: -96.6778,
    description: 'A small community near Dawson in southern Navarro County.',
  },
  {
    name: 'Navarro',
    slug: 'navarro',
    county: 'Navarro',
    state: 'TX',
    population: 200,
    zipCodes: ['75110'],
    latitude: 31.9859,
    longitude: -96.4825,
    description: 'An unincorporated community that shares its name with the county.',
  },
  {
    name: 'Oak Valley',
    slug: 'oak-valley',
    county: 'Navarro',
    state: 'TX',
    population: 420,
    zipCodes: ['75110'],
    latitude: 32.0495,
    longitude: -96.5175,
    description: 'A small community near Corsicana.',
  },
];

async function getAdminToken() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Admin login failed: ${res.status}`);
  }

  const data = await res.json();
  return data.data.token;
}

async function seedTowns(token) {
  console.log('Seeding Navarro County towns...\n');

  let created = 0;
  let skipped = 0;

  for (const town of navarroCountyTowns) {
    // Check if town already exists using Content Manager API
    const checkRes = await fetch(
      `${STRAPI_URL}/content-manager/collection-types/api::town.town?filters[slug][$eq]=${town.slug}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const checkData = await checkRes.json();

    if (checkData.results && checkData.results.length > 0) {
      console.log(`⏭️  Skipping ${town.name} (already exists)`);
      skipped++;
      continue;
    }

    // Create town using Content Manager API
    const createRes = await fetch(
      `${STRAPI_URL}/content-manager/collection-types/api::town.town`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(town),
      }
    );

    if (createRes.ok) {
      const townData = await createRes.json();
      console.log(`✅ Created ${town.name} (${town.zipCodes[0]})`);
      created++;

      // Publish the town
      const documentId = townData.data?.documentId || townData.documentId;
      if (documentId) {
        await fetch(
          `${STRAPI_URL}/content-manager/collection-types/api::town.town/${documentId}/actions/publish`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } else {
      const error = await createRes.json();
      console.error(`❌ Failed to create ${town.name}:`, error);
    }
  }

  console.log(`\n✅ Done! Created: ${created}, Skipped: ${skipped}`);
}

async function main() {
  try {
    console.log('Logging into Strapi admin...');
    const token = await getAdminToken();
    console.log('Logged in successfully!\n');

    await seedTowns(token);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
