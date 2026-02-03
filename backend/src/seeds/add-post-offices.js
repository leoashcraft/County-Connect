/**
 * Seed post offices as Community Resources for all towns in Navarro County
 * Run with: node src/seeds/add-post-offices.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

const now = new Date().toISOString();

// Get town ID by name
const getTownId = (townName) => {
  const town = db.prepare(`
    SELECT id FROM entities
    WHERE entity_type = 'Town'
    AND json_extract(data, '$.name') = ?
  `).get(townName);
  return town?.id || null;
};

// Post office entries for Navarro County towns
const postOffices = [
  // === CORSICANA POST OFFICE ===
  {
    name: "US Post Office - Corsicana",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Corsicana and surrounding areas. Full-service post office offering mail services, package shipping, PO boxes, money orders, and postal supplies. The main post office for Navarro County.",
    address: "116 S Main St, Corsicana, TX 75110",
    phone: "(903) 874-4797",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:30 AM - 5:00 PM, Sat: 10:00 AM - 12:00 PM, Sun: Closed. Lobby: 24 hours",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Certified Mail", "Priority Mail", "Express Mail", "Bulk Mail Acceptance", "Stamps", "Postal Supplies"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    lat: 32.0941,
    lng: -96.4687,
    status: "active"
  },

  // === BLOOMING GROVE POST OFFICE ===
  {
    name: "US Post Office - Blooming Grove",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Blooming Grove and the surrounding rural community. Provides essential mail and package services to local residents.",
    address: "100 S Fordyce St, Blooming Grove, TX 76626",
    phone: "(903) 695-2212",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:15 AM - 12:15 PM & 1:15 PM - 3:15 PM, Sat: 8:30 AM - 10:30 AM, Sun: Closed. PO Box Access: 24 hours Mon-Sat",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Certified Mail", "Stamps", "Postal Supplies"],
    town: "Blooming Grove",
    town_id: getTownId("Blooming Grove"),
    lat: 32.0869,
    lng: -96.7189,
    status: "active"
  },

  // === KERENS POST OFFICE ===
  {
    name: "US Post Office - Kerens",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Kerens and surrounding communities in eastern Navarro County. Provides mail and package services to local residents and businesses.",
    address: "106 S Colket St, Kerens, TX 75144",
    phone: "(903) 396-7142",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:00 AM - 1:00 PM & 2:00 PM - 4:30 PM, Sat-Sun: Closed. Lobby: 24 hours",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Certified Mail", "Stamps", "Postal Supplies"],
    town: "Kerens",
    town_id: getTownId("Kerens"),
    lat: 32.1301,
    lng: -96.2281,
    status: "active"
  },

  // === RICE POST OFFICE ===
  {
    name: "US Post Office - Rice",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Rice and surrounding areas in northern Navarro County. Provides mail and package services to the local community.",
    address: "300 E Calhoun St, Rice, TX 75155",
    phone: "(903) 326-5441",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:00 AM - 12:30 PM & 1:30 PM - 4:00 PM, Sat: 7:30 AM - 9:45 AM (Pickup only), Sun: Closed. PO Box Access: 24 hours",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Certified Mail", "Stamps", "Postal Supplies"],
    town: "Rice",
    town_id: getTownId("Rice"),
    lat: 32.2429,
    lng: -96.5009,
    status: "active"
  },

  // === DAWSON POST OFFICE ===
  {
    name: "US Post Office - Dawson",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Dawson and surrounding rural areas in southern Navarro County. Provides essential mail and package services to the local community.",
    address: "108 N Main St, Dawson, TX 76639",
    phone: "(254) 578-1006",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:00 AM - 12:00 PM, Sat: 8:00 AM - 10:30 AM, Sun: Closed",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Certified Mail", "Stamps", "Postal Supplies"],
    town: "Dawson",
    town_id: getTownId("Dawson"),
    lat: 31.9019,
    lng: -96.7129,
    status: "active"
  },

  // === FROST POST OFFICE ===
  {
    name: "US Post Office - Frost",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Frost and surrounding rural communities in western Navarro County. Provides mail and package services to local residents.",
    address: "301 N Garitty St, Frost, TX 76641",
    phone: "(903) 682-3661",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:00 AM - 12:15 PM & 1:15 PM - 3:00 PM, Sat: 8:00 AM - 9:45 AM, Sun: Closed. Lobby: 24 hours",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Certified Mail", "Stamps", "Postal Supplies"],
    town: "Frost",
    town_id: getTownId("Frost"),
    lat: 32.0769,
    lng: -96.8079,
    status: "active"
  },

  // === PURDON POST OFFICE ===
  {
    name: "US Post Office - Purdon",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Purdon and surrounding rural areas. Provides essential mail services to the local community.",
    address: "700 S Brown St, Purdon, TX 76679",
    phone: "(903) 673-2366",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:00 AM - 12:00 PM, Sat: 7:30 AM - 9:30 AM, Sun: Closed",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Stamps", "Postal Supplies"],
    town: "Purdon",
    town_id: getTownId("Purdon"),
    lat: 31.9469,
    lng: -96.6189,
    status: "active"
  },

  // === RICHLAND POST OFFICE ===
  {
    name: "US Post Office - Richland",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Richland and surrounding areas. Provides mail and package services to the local rural community. Services include Burial Flags, Business Reply Mail, Duck Stamps, and General Delivery.",
    address: "107 E Main St, Richland, TX 76681",
    phone: "(903) 362-3273",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:00 AM - 12:00 PM, Sat: 9:00 AM - 11:00 AM, Sun: Closed. Lobby: 24 hours",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Stamps", "Postal Supplies", "Burial Flags", "Duck Stamps", "General Delivery"],
    town: "Richland",
    town_id: getTownId("Richland"),
    lat: 31.9279,
    lng: -96.4369,
    status: "active"
  },

  // === BARRY POST OFFICE ===
  {
    name: "US Post Office - Barry",
    category: "government",
    resource_type: "government_services",
    description: "United States Postal Service location serving Barry and surrounding rural areas in Navarro County. Established in 1886, this historic post office continues to provide essential mail services to the local community.",
    address: "103 Houston St, Barry, TX 75102",
    phone: "(903) 695-2696",
    email: null,
    website: "https://www.usps.com",
    hours: "Mon-Fri: 8:00 AM - 12:00 PM, Sat-Sun: Closed",
    eligibility: "Open to all",
    services_offered: ["Mail Services", "Package Shipping", "PO Boxes", "Money Orders", "Stamps", "Postal Supplies"],
    town: "Barry",
    town_id: getTownId("Barry"),
    lat: 32.0969,
    lng: -96.6519,
    status: "active"
  },

  // === MILDRED POST OFFICE ===
  // Note: Mildred is served by Corsicana post office, but adding a community resource entry
  // to indicate mail service information for the area
  {
    name: "Mildred Mail Services",
    category: "government",
    resource_type: "government_services",
    description: "The Mildred area is served by the Corsicana Post Office. Residents can pick up mail and access postal services at the main Corsicana location. Rural route delivery is available for most addresses in the Mildred community.",
    address: "Served by Corsicana Post Office - 116 S Main St, Corsicana, TX 75110",
    phone: "(903) 874-4797",
    email: null,
    website: "https://www.usps.com",
    hours: "See Corsicana Post Office hours",
    eligibility: "Mildred area residents",
    services_offered: ["Rural Route Delivery", "Mail Services via Corsicana"],
    town: "Mildred",
    town_id: getTownId("Mildred"),
    status: "active"
  },

  // === NAVARRO (COMMUNITY) POST OFFICE REFERENCE ===
  // Note: The community of Navarro is served by Corsicana post office
  {
    name: "Navarro Community Mail Services",
    category: "government",
    resource_type: "government_services",
    description: "The Navarro community area is served by the Corsicana Post Office. Residents can access full postal services at the Corsicana location. Rural route delivery is available for addresses in the Navarro community.",
    address: "Served by Corsicana Post Office - 116 S Main St, Corsicana, TX 75110",
    phone: "(903) 874-4797",
    email: null,
    website: "https://www.usps.com",
    hours: "See Corsicana Post Office hours",
    eligibility: "Navarro community residents",
    services_offered: ["Rural Route Delivery", "Mail Services via Corsicana"],
    town: "Navarro",
    town_id: getTownId("Navarro"),
    status: "active"
  },

  // === POWELL POST OFFICE REFERENCE ===
  // Note: Powell is served by nearby post offices
  {
    name: "Powell Mail Services",
    category: "government",
    resource_type: "government_services",
    description: "The Powell community is served by nearby post offices including Kerens and Corsicana. Residents can access postal services at these locations. Rural route delivery is available for most addresses in the Powell area.",
    address: "Served by Kerens Post Office - 106 S Colket St, Kerens, TX 75144",
    phone: "(903) 396-7142",
    email: null,
    website: "https://www.usps.com",
    hours: "See Kerens Post Office hours",
    eligibility: "Powell area residents",
    services_offered: ["Rural Route Delivery", "Mail Services via Kerens"],
    town: "Powell",
    town_id: getTownId("Powell"),
    status: "active"
  }
];

// Insert post offices as community resources
const insertStmt = db.prepare(`
  INSERT INTO entities (id, entity_type, data, created_date, updated_date)
  VALUES (?, ?, ?, ?, ?)
`);

const checkStmt = db.prepare(`
  SELECT id FROM entities
  WHERE entity_type = 'CommunityResource'
  AND json_extract(data, '$.name') = ?
`);

let added = 0;
let skipped = 0;

console.log("=== Adding Post Offices to Community Resources ===\n");

for (const postOffice of postOffices) {
  // Check if already exists
  const existing = checkStmt.get(postOffice.name);
  if (existing) {
    console.log(`[SKIPPED] ${postOffice.name} - already exists`);
    skipped++;
    continue;
  }

  const id = uuidv4();
  const data = {
    id,
    ...postOffice,
    created_date: now
  };

  insertStmt.run(id, 'CommunityResource', JSON.stringify(data), now, now);
  console.log(`[ADDED] ${postOffice.name} (${postOffice.town})`);
  added++;
}

console.log(`\n=== Summary ===`);
console.log(`Added: ${added} post office entries`);
console.log(`Skipped: ${skipped} (already existed)`);
console.log(`Total processed: ${postOffices.length}`);

db.close();
