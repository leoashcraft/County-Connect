/**
 * Additional Navarro County Attractions Seed Script
 * Adds parks and attractions from smaller towns that were missing
 *
 * Run with: node src/seeds/seed-additional-attractions.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

const now = new Date().toISOString();

// Get town ID by name
function getTownId(townName) {
  const result = db.prepare(`
    SELECT id FROM entities
    WHERE entity_type = 'Town'
    AND json_extract(data, '$.name') = ?
  `).get(townName);
  return result?.id || null;
}

const additionalAttractions = [
  // ===========================
  // BLOOMING GROVE
  // ===========================
  {
    name: "Blooming Grove City Park",
    category: "park",
    description: "Well-maintained city park perfect for relaxing under shade trees. Features a paved walking trail, newly resurfaced tennis and basketball courts, and space for outdoor activities.",
    address: "Main St",
    city: "Blooming Grove",
    state: "TX",
    zip_code: "76626",
    town: "Blooming Grove",
    lat: 32.0820,
    lng: -96.7145,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Includes picnic areas, playground, and sports courts. A peaceful retreat for families."
  },
  {
    name: "Blooming Grove War Memorial",
    category: "monument",
    description: "Memorial honoring local veterans and those who served in the armed forces. Located within Blooming Grove City Park, offering a moment of reflection and reverence.",
    address: "Main St",
    city: "Blooming Grove",
    state: "TX",
    zip_code: "76626",
    town: "Blooming Grove",
    lat: 32.0821,
    lng: -96.7143,
    is_free: true,
    hours: "Dawn to dusk"
  },
  {
    name: "Blooming Grove Community Center",
    category: "cultural",
    description: "Community gathering space hosting recreational activities, community events, and serving as a hub for local gatherings and civic functions.",
    address: "100 N Fordyce St",
    city: "Blooming Grove",
    state: "TX",
    zip_code: "76626",
    town: "Blooming Grove",
    lat: 32.0825,
    lng: -96.7148,
    is_free: true,
    hours: "Call for hours",
    additional_info: "Available for event rentals. Contact city hall for availability."
  },

  // ===========================
  // FROST
  // ===========================
  {
    name: "Frost City Park",
    category: "park",
    description: "Local city park featuring playground equipment, open green space, and facilities for outdoor recreation. A gathering place for the Frost community.",
    address: "Main St",
    city: "Frost",
    state: "TX",
    zip_code: "76641",
    town: "Frost",
    lat: 32.0775,
    lng: -96.8075,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Features local wildlife viewing opportunities and running trails."
  },
  {
    name: "Frost Community Gym & Fitness Center",
    category: "recreation",
    description: "Community fitness facility offering gym equipment and recreation space for Frost residents.",
    address: "Main St",
    city: "Frost",
    state: "TX",
    zip_code: "76641",
    town: "Frost",
    lat: 32.0772,
    lng: -96.8078,
    is_free: false,
    admission_info: "Membership required",
    hours: "Contact city for hours"
  },

  // ===========================
  // KERENS
  // ===========================
  {
    name: "Kerens Veterans Memorial Park",
    category: "park",
    description: "Community park honoring local veterans with memorial displays, panoramic views, and recreational facilities. Popular destination for outdoor activities and community events.",
    address: "S Colket Ave",
    city: "Kerens",
    state: "TX",
    zip_code: "75144",
    town: "Kerens",
    lat: 32.1305,
    lng: -96.2275,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Features memorial displays, walking paths, and picnic areas."
  },
  {
    name: "Kerens City Park",
    category: "park",
    description: "Community park with lush greenery, natural vegetation, and a tranquil setting. Known for its picturesque backdrop and serene atmosphere, perfect for family outings.",
    address: "N Main St",
    city: "Kerens",
    state: "TX",
    zip_code: "75144",
    town: "Kerens",
    lat: 32.1330,
    lng: -96.2285,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Playground, picnic facilities, and natural walking areas."
  },
  {
    name: "Kerens City Lake",
    category: "lake",
    description: "Small municipal lake near Kerens offering fishing opportunities and peaceful lakeside relaxation. A local favorite for anglers.",
    address: "Off US-31",
    city: "Kerens",
    state: "TX",
    zip_code: "75144",
    town: "Kerens",
    lat: 32.1350,
    lng: -96.2200,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Fishing permitted. Texas fishing license required."
  },
  {
    name: "Kerens Cotton Harvest Festival Grounds",
    category: "entertainment",
    description: "Festival grounds hosting the annual Kerens Cotton Harvest Festival celebrating the area's agricultural heritage with live music, carnival rides, food vendors, and community celebrations.",
    address: "Downtown Kerens",
    city: "Kerens",
    state: "TX",
    zip_code: "75144",
    town: "Kerens",
    lat: 32.1318,
    lng: -96.2282,
    is_free: false,
    hours: "During festival events",
    additional_info: "Annual Cotton Harvest Festival held each October. Check for event dates."
  },

  // ===========================
  // RICE
  // ===========================
  {
    name: "Mike Dickens Memorial Park",
    category: "park",
    description: "Nestled behind Rice's central neighborhood, this park is a destination for family fun and city events. Features walking trails, baseball fields, concession stand, and playground areas.",
    address: "Behind Central Neighborhood",
    city: "Rice",
    state: "TX",
    zip_code: "75155",
    town: "Rice",
    lat: 32.1645,
    lng: -96.5000,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Baseball fields, walking trails, playground, concession stand available during events."
  },
  {
    name: "Rice Community Gym & Fitness Center",
    category: "recreation",
    description: "Community recreation facility offering gym access, fitness equipment, and space for community activities. Memberships available through Rice Parks & Recreation.",
    address: "Main St",
    city: "Rice",
    state: "TX",
    zip_code: "75155",
    town: "Rice",
    lat: 32.1648,
    lng: -96.4995,
    is_free: false,
    admission_info: "Membership required. Ages 14+ with adult supervision. Call (903) 326-7500.",
    hours: "Contact city for hours",
    phone: "(903) 326-7500"
  },
  {
    name: "Rice Soccer Complex",
    category: "recreation",
    description: "Soccer facility with multiple fields for youth and adult soccer leagues and recreational play.",
    address: "Sports Complex Rd",
    city: "Rice",
    state: "TX",
    zip_code: "75155",
    town: "Rice",
    lat: 32.1650,
    lng: -96.4990,
    is_free: true,
    hours: "Dawn to dusk"
  },

  // ===========================
  // CORSICANA (Additional)
  // ===========================
  {
    name: "Corsicana Spray Park - Jester",
    category: "recreation",
    description: "Free splash pad and spray park within Jester Park, perfect for cooling off during hot Texas summers. Popular family destination.",
    address: "2121 W 7th Ave",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.0891,
    lng: -96.4823,
    is_free: true,
    hours: "Seasonal - Memorial Day to Labor Day",
    additional_info: "Part of Jester Park complex. Restrooms available."
  },
  {
    name: "Corsicana BMX Track",
    category: "recreation",
    description: "BMX bicycle track offering courses for riders of all skill levels. Part of the city's parks and recreation facilities.",
    address: "Community Park",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.1055,
    lng: -96.4545,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Helmets required. Open to the public."
  },
  {
    name: "Corsicana Disc Golf Course",
    category: "recreation",
    description: "18-hole disc golf course set in a scenic park setting. Free to play with your own discs.",
    address: "Community Park",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.1052,
    lng: -96.4548,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Bring your own discs. Course map available at the first tee."
  },
  {
    name: "Corsicana Skate Park",
    category: "recreation",
    description: "Concrete skate park with ramps and rails for skateboarding and inline skating. Free public facility.",
    address: "Jester Park",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.0893,
    lng: -96.4828,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Safety equipment recommended. Supervised use advised for younger users."
  },
  {
    name: "Corsicana City Pool",
    category: "recreation",
    description: "Public swimming pool offering lap swimming, recreational swim, and swimming lessons during summer months.",
    address: "W 7th Ave",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.0892,
    lng: -96.4826,
    is_free: false,
    admission_info: "Small admission fee. Season passes available.",
    hours: "Seasonal - Memorial Day to Labor Day",
    phone: "(903) 654-4874"
  },
  {
    name: "First Friday Art Walk",
    category: "cultural",
    description: "Monthly arts and culture event held on the first Friday of each month in downtown Corsicana. Features art galleries, live music, food vendors, and community celebration.",
    address: "Beaton St Downtown",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.0920,
    lng: -96.4670,
    is_free: true,
    hours: "First Friday of each month, evening hours",
    additional_info: "Various downtown galleries and shops participate. Check local listings for details."
  },

  // ===========================
  // DAWSON AREA (near Navarro Mills Lake)
  // ===========================
  {
    name: "Dawson City Park",
    category: "park",
    description: "Small community park serving the town of Dawson with basic recreational facilities and green space.",
    address: "Main St",
    city: "Dawson",
    state: "TX",
    zip_code: "76639",
    town: "Dawson",
    lat: 31.8895,
    lng: -96.7095,
    is_free: true,
    hours: "Dawn to dusk"
  },

  // ===========================
  // RICHLAND
  // ===========================
  {
    name: "Richland Community Park",
    category: "park",
    description: "Community park in the Richland area near Richland-Chambers Reservoir, providing outdoor recreation space for local residents.",
    address: "Highway 31",
    city: "Richland",
    state: "TX",
    zip_code: "76681",
    town: "Richland",
    lat: 31.9295,
    lng: -96.4245,
    is_free: true,
    hours: "Dawn to dusk"
  },

  // ===========================
  // NATURAL AREAS & WILDLIFE
  // ===========================
  {
    name: "Trinity River Bottomlands",
    category: "recreation",
    description: "Natural wetlands and bottomlands along the Trinity River offering wildlife viewing, birding, and nature observation. Home to bald eagles, deer, and over 90 bird species.",
    address: "Along Trinity River",
    city: "Kerens",
    state: "TX",
    zip_code: "75144",
    town: "Kerens",
    lat: 32.0500,
    lng: -96.2000,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Popular for birdwatching, especially during migration seasons. Bald eagles frequently spotted in winter."
  },
  {
    name: "Navarro Mills Wildflower Viewing Area",
    category: "park",
    description: "Scenic area near Liberty Hill Park at Navarro Mills Lake, famous for spectacular spring wildflower displays including bluebonnets, Indian paintbrushes, and other native Texas wildflowers.",
    address: "Liberty Hill Park Rd",
    city: "Dawson",
    state: "TX",
    zip_code: "76639",
    town: "Dawson",
    lat: 31.9510,
    lng: -96.7005,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Best viewing typically March-May. The brilliant array of native wildflowers transforms the landscape into an incredible palette of colors."
  },

  // ===========================
  // ADDITIONAL HISTORICAL MARKERS
  // ===========================
  {
    name: "Corsicana Oil Discovery Site",
    category: "historic_marker",
    description: "Marker commemorating the exact location where the first commercial oil well in Texas was discovered on June 9, 1894, when workers drilling for water struck oil at 1,030 feet.",
    address: "S 12th St",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.0885,
    lng: -96.4675,
    is_free: true,
    year_established: 1894,
    history: "The discovery led to Texas's first major oil field and established Corsicana as a pioneer in the Texas oil industry, predating Spindletop by seven years."
  },
  {
    name: "Jose Antonio Navarro Statue",
    category: "monument",
    description: "Bronze statue honoring Jose Antonio Navarro (1795-1871), the Texas patriot and statesman for whom Navarro County was named. He was the only native-born Texan to sign the Texas Declaration of Independence.",
    address: "Courthouse Square",
    city: "Corsicana",
    state: "TX",
    zip_code: "75110",
    town: "Corsicana",
    lat: 32.0912,
    lng: -96.4692,
    is_free: true,
    history: "Navarro was a pivotal figure in Texas history, serving in the Texas Congress and helping draft the Texas Constitution. He dedicated his life to the cause of Texas liberty."
  }
];

// Insert attractions into entities table
const insertStmt = db.prepare(`
  INSERT INTO entities (id, entity_type, data, created_date, updated_date)
  VALUES (?, ?, ?, ?, ?)
`);

const checkStmt = db.prepare(`
  SELECT id FROM entities
  WHERE entity_type = 'Attraction'
  AND json_extract(data, '$.name') = ?
`);

let added = 0;
let skipped = 0;

for (const attraction of additionalAttractions) {
  // Check if already exists
  const existing = checkStmt.get(attraction.name);
  if (existing) {
    console.log(`[SKIPPED] ${attraction.name} - already exists`);
    skipped++;
    continue;
  }

  const id = uuidv4();
  const townId = getTownId(attraction.town);

  const data = {
    id,
    ...attraction,
    town_id: townId,
    status: 'active',
    created_date: now
  };

  insertStmt.run(id, 'Attraction', JSON.stringify(data), now, now);
  console.log(`[ADDED] ${attraction.name} (${attraction.category}) - ${attraction.town}`);
  added++;
}

console.log(`\n========================================`);
console.log(`Done! Added ${added} attractions, skipped ${skipped} (already existed).`);
console.log(`========================================`);

// Print summary by town
const towns = {};
for (const a of additionalAttractions) {
  towns[a.town] = (towns[a.town] || 0) + 1;
}

console.log('\nAttractions by town:');
Object.entries(towns)
  .sort((a, b) => b[1] - a[1])
  .forEach(([town, count]) => {
    console.log(`  ${town}: ${count}`);
  });

db.close();
