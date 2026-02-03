/**
 * Update school phone numbers and add daycares/private schools
 * Run with: node src/seeds/update-schools-and-daycares.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Helper to insert entity
function insertEntity(entityType, data) {
  const id = uuidv4();
  const now = new Date().toISOString();

  // Check if entity with same name exists
  const existing = db.prepare(`
    SELECT id FROM entities WHERE entity_type = ? AND json_extract(data, '$.name') = ?
  `).get(entityType, data.name);

  if (existing) {
    console.log(`  [SKIP] ${entityType}: ${data.name} (already exists)`);
    return existing.id;
  }

  const stmt = db.prepare(`
    INSERT INTO entities (id, entity_type, data, created_date, updated_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(id, entityType, JSON.stringify({ ...data, id, created_date: now }), now, now);
  console.log(`  [ADD] ${entityType}: ${data.name}`);
  return id;
}

// Helper to update existing entity
function updateEntity(entityType, name, updates) {
  const existing = db.prepare(`
    SELECT id, data FROM entities WHERE entity_type = ? AND json_extract(data, '$.name') = ?
  `).get(entityType, name);

  if (!existing) {
    console.log(`  [NOT FOUND] ${entityType}: ${name}`);
    return null;
  }

  const currentData = JSON.parse(existing.data);
  const updatedData = { ...currentData, ...updates };
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE entities SET data = ?, updated_date = ? WHERE id = ?
  `).run(JSON.stringify(updatedData), now, existing.id);

  console.log(`  [UPDATE] ${entityType}: ${name}`);
  return existing.id;
}

// ============================================
// SCHOOL PHONE NUMBER CORRECTIONS
// ============================================
const schoolUpdates = [
  // Corsicana ISD
  { name: "Corsicana High School", phone: "(430) 775-6300", address: "3701 W Highway 22, Corsicana, TX 75110" },
  { name: "Corsicana Middle School", phone: "(430) 775-6200", address: "4101 FM 744, Corsicana, TX 75110" },
  { name: "Collins Intermediate School", phone: "(903) 641-2302", address: "1500 Dobbins Rd, Corsicana, TX 75110" },
  { name: "Bowie Elementary School", phone: "(903) 641-2261", address: "1213 W 4th Ave, Corsicana, TX 75110" },
  { name: "Carroll Elementary School", phone: "(903) 641-4739", address: "1101 E 13th Ave, Corsicana, TX 75110" },
  { name: "Fannin Elementary School", phone: "(903) 641-2269", address: "1400 W 15th Ave, Corsicana, TX 75110" },
  { name: "Navarro Elementary School", phone: "(903) 602-8540", address: "3201 N Beaton St, Corsicana, TX 75110" },
  { name: "Sam Houston Elementary School", phone: "(430) 775-6100", address: "601 S 45th St, Corsicana, TX 75110" },

  // Kerens ISD - correct phones
  { name: "Kerens High School", phone: "(903) 396-2924" },
  { name: "Kerens Elementary School", phone: "(903) 396-2662" },
  { name: "Kerens Junior High School", phone: "(903) 396-2924" },

  // Blooming Grove ISD - correct phones
  { name: "Blooming Grove High School", phone: "(903) 695-2541" },
  { name: "Blooming Grove Junior High School", phone: "(903) 695-2541" },
  { name: "Blooming Grove Elementary School", phone: "(903) 695-4401", address: "601 N Elm St, Blooming Grove, TX 76626" },

  // Rice ISD - correct phones
  { name: "Rice High School", phone: "(903) 326-4287" },
  { name: "Rice Middle School", phone: "(903) 326-4287" },
  { name: "Rice Elementary School", phone: "(903) 326-4287" },

  // Frost ISD - correct phones
  { name: "Frost High School", phone: "(903) 682-2711" },
  { name: "Frost Elementary School", phone: "(903) 682-2711" },

  // Mildred ISD - correct phones
  { name: "Mildred High School", phone: "(903) 872-6505" },
  { name: "Mildred Junior High School", phone: "(903) 872-6505" },
  { name: "Mildred Elementary School", phone: "(903) 872-6505" },

  // Dawson ISD - correct phones
  { name: "Dawson School", phone: "(254) 578-1031" }
];

// ============================================
// PRIVATE SCHOOLS TO ADD
// ============================================
const privateSchools = [
  {
    name: "Mrs. Ackley's Adventure School",
    school_type: "pre_k",
    address: "13220 NW County Road 4020, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 229-3318",
    email: "mrsackleysadventureschool@gmail.com",
    website: "https://mrsackleysadventureschool.com",
    description: "Private Pre-K program founded in 2020 by Laura Ackley, an accredited elementary educator. Curriculum aligns with Texas Pre-K Guidelines incorporating phonics, reading, writing, math, science, social studies, art, and physical education. Features hands-on experiential learning with Christian-based instruction.",
    grades_served: "Pre-K",
    founded_year: 2020,
    lat: 32.0989,
    lng: -96.7309,
    status: "active"
  },
  {
    name: "Agape Christian Academy",
    school_type: "private",
    address: "3116 W State Highway 22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 641-0900",
    description: "Christian private school serving students from Pre-K through 8th grade.",
    grades_served: "PK-8",
    enrollment: 140,
    lat: 32.0847,
    lng: -96.5109,
    status: "active"
  },
  {
    name: "James L Collins Catholic School",
    school_type: "private",
    address: "3000 W State Highway 22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-1751",
    description: "Catholic private school associated with Immaculate Conception Catholic Church, serving Pre-K through 8th grade.",
    grades_served: "PK-8",
    enrollment: 137,
    lat: 32.0847,
    lng: -96.5139,
    status: "active"
  }
];

// ============================================
// DAYCARES TO ADD
// ============================================
const daycares = [
  {
    name: "Little Tykes Learning Center",
    school_type: "daycare",
    address: "Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 682-4285",
    description: "Affordable daycare equipped with three classrooms, a toddler room, a kitchen and eating area, and two separate playgrounds.",
    grades_served: "Toddler - Preschool",
    lat: 32.0879,
    lng: -96.7189,
    status: "active"
  },
  {
    name: "Tiny Tigers Preschool",
    school_type: "pre_k",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 602-5088",
    grades_served: "Preschool",
    lat: 32.0954,
    lng: -96.4689,
    status: "active"
  },
  {
    name: "Creative Children's Center",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-9727",
    grades_served: "Infant - Preschool",
    lat: 32.0934,
    lng: -96.4669,
    status: "active"
  },
  {
    name: "Westminster Presbyterian Christian Education Program",
    school_type: "pre_k",
    address: "312 N 13th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2311",
    description: "Christian education program hosted at Westminster Presbyterian Church.",
    grades_served: "Preschool",
    lat: 32.0977,
    lng: -96.4707,
    status: "active"
  },
  {
    name: "J F Hailey 24/7 Licensed Child Care Center",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-2110",
    description: "Licensed childcare center with 24/7 availability. Maximum capacity of 32 children.",
    grades_served: "Infant - School Age",
    capacity: 32,
    lat: 32.0914,
    lng: -96.4649,
    status: "active"
  },
  {
    name: "LaLa's Little's Childcare and Pre-school",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-2228",
    description: "Childcare and preschool serving children from 6 weeks to kindergarten age.",
    grades_served: "6 weeks - Kindergarten",
    lat: 32.0894,
    lng: -96.4629,
    status: "active"
  },
  {
    name: "Little Harvard Academy",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 641-0228",
    grades_served: "Infant - Preschool",
    lat: 32.0974,
    lng: -96.4609,
    status: "active"
  },
  {
    name: "Stay and Play Learning Center",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-8082",
    description: "Licensed childcare center with maximum capacity of 94 children.",
    grades_served: "Infant - School Age",
    capacity: 94,
    lat: 32.0954,
    lng: -96.4589,
    status: "active"
  },
  {
    name: "Betts Busy Bodies",
    school_type: "daycare",
    address: "Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2655",
    description: "Licensed childcare center with maximum capacity of 31 children.",
    grades_served: "Infant - School Age",
    capacity: 31,
    lat: 32.1311,
    lng: -96.2281,
    status: "active"
  },
  {
    name: "Candy Cane Corner Inc",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-6781",
    description: "Large licensed childcare center with maximum capacity of 210 children.",
    grades_served: "Infant - School Age",
    capacity: 210,
    lat: 32.0924,
    lng: -96.4569,
    status: "active"
  },
  {
    name: "Country Kids",
    school_type: "daycare",
    address: "Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-6083",
    description: "Licensed childcare center with maximum capacity of 86 children.",
    grades_served: "Infant - School Age",
    capacity: 86,
    lat: 32.2439,
    lng: -96.5019,
    status: "active"
  },
  {
    name: "Little Red School House of Texas",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-1361",
    description: "Licensed childcare center with maximum capacity of 93 children.",
    grades_served: "Infant - School Age",
    capacity: 93,
    lat: 32.0944,
    lng: -96.4549,
    status: "active"
  },
  {
    name: "Mary Peterson CCC",
    school_type: "daycare",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7091",
    description: "Licensed childcare center with maximum capacity of 80 children.",
    grades_served: "Infant - School Age",
    capacity: 80,
    lat: 32.0904,
    lng: -96.4529,
    status: "active"
  },
  {
    name: "CDI Head Start Serving North Texas - Corsicana",
    school_type: "pre_k",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 654-9994",
    description: "Head Start early childhood education program with maximum capacity of 200 children.",
    grades_served: "Infant - Pre-K",
    capacity: 200,
    lat: 32.0964,
    lng: -96.4509,
    status: "active"
  },
  {
    name: "ChildCareGroup at Corsicana Early Head Start",
    school_type: "pre_k",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(430) 775-6079",
    description: "Early Head Start program with maximum capacity of 150 children.",
    grades_served: "Infant - School Age",
    capacity: 150,
    lat: 32.0984,
    lng: -96.4489,
    status: "active"
  }
];

// ============================================
// RUN UPDATES AND INSERTS
// ============================================
function seed() {
  console.log("Starting school updates and daycare additions...\n");

  // Update existing schools with correct phone numbers
  console.log("=== Updating School Phone Numbers ===");
  schoolUpdates.forEach(update => {
    const { name, ...changes } = update;
    updateEntity('School', name, changes);
  });
  console.log(`\nUpdated ${schoolUpdates.length} schools.\n`);

  // Add private schools
  console.log("=== Adding Private Schools ===");
  privateSchools.forEach(school => {
    insertEntity('School', school);
  });
  console.log(`\nProcessed ${privateSchools.length} private schools.\n`);

  // Add daycares as schools
  console.log("=== Adding Daycares ===");
  daycares.forEach(daycare => {
    insertEntity('School', daycare);
  });
  console.log(`\nProcessed ${daycares.length} daycares.\n`);

  console.log("=== Seed Complete ===");
}

seed();
db.close();
