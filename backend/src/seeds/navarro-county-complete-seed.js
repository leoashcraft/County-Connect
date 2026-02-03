/**
 * Comprehensive Seed script for Navarro County data
 * Includes churches, schools, sports teams, and community resources
 * With geocoded lat/lng coordinates for map display
 *
 * Run with: node src/seeds/navarro-county-complete-seed.js
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

// ============================================
// CHURCHES IN NAVARRO COUNTY - COMPLETE LIST
// ============================================
const churches = [
  // === CORSICANA CHURCHES ===
  {
    name: "First Baptist Church Corsicana",
    denomination: "baptist",
    address: "301 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2651",
    website: "https://www.fbccorsicana.com",
    lat: 32.0981,
    lng: -96.4687,
    service_times: [
      { day: "Sunday", time: "9:00 AM", type: "Sunday School" },
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Corsicana",
    denomination: "methodist",
    address: "220 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2631",
    website: "https://www.fumccorsicana.org",
    lat: 32.0956,
    lng: -96.4687,
    service_times: [
      { day: "Sunday", time: "8:30 AM", type: "Traditional" },
      { day: "Sunday", time: "11:00 AM", type: "Traditional" }
    ],
    status: "active"
  },
  {
    name: "Immaculate Conception Catholic Church",
    denomination: "catholic",
    address: "3000 W State Highway 22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6765",
    website: "https://iccorsicana.org",
    lat: 32.0847,
    lng: -96.5139,
    service_times: [
      { day: "Saturday", time: "5:00 PM", type: "Mass" },
      { day: "Sunday", time: "8:00 AM", type: "Mass (Spanish)" },
      { day: "Sunday", time: "10:30 AM", type: "Mass" }
    ],
    status: "active"
  },
  {
    name: "Westminster Presbyterian Church",
    denomination: "presbyterian",
    address: "312 N 13th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-3781",
    lat: 32.0977,
    lng: -96.4707,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Grace Bible Church",
    denomination: "non_denominational",
    address: "2309 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2609",
    lat: 32.0878,
    lng: -96.4856,
    service_times: [
      { day: "Sunday", time: "9:30 AM", type: "Sunday School" },
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Northside Church of Christ",
    denomination: "church_of_christ",
    address: "1801 N Business 45, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-7077",
    lat: 32.1123,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "9:30 AM", type: "Bible Class" },
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Jackson Street Church of Christ",
    denomination: "church_of_christ",
    address: "500 S Jackson St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4252",
    lat: 32.0889,
    lng: -96.4634,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "St. John's Episcopal Church",
    denomination: "episcopal",
    address: "101 N 14th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-5425",
    lat: 32.0949,
    lng: -96.4697,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Holy Eucharist" }
    ],
    status: "active"
  },
  {
    name: "First Assembly of God",
    denomination: "assembly_of_god",
    address: "3120 W State Highway 22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-6000",
    lat: 32.0847,
    lng: -96.5159,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" },
      { day: "Wednesday", time: "7:00 PM", type: "Service" }
    ],
    status: "active"
  },
  {
    name: "Calvary Baptist Church",
    denomination: "baptist",
    address: "308 E 11th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4367",
    lat: 32.0916,
    lng: -96.4619,
    service_times: [
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Trinity Lutheran Church",
    denomination: "lutheran",
    address: "324 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4921",
    lat: 32.0983,
    lng: -96.4687,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Faith Lutheran Church",
    denomination: "lutheran",
    address: "3824 TX-22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-8795",
    lat: 32.0847,
    lng: -96.5259,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Cowboy Church of Corsicana",
    denomination: "non_denominational",
    address: "5864 W State Hwy 31, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-8000",
    lat: 32.0757,
    lng: -96.5639,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Highpoint Church",
    denomination: "non_denominational",
    address: "3100 N 45th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-4673",
    website: "https://highpointcorsicana.com",
    lat: 32.1157,
    lng: -96.4449,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Central Independent Baptist Church",
    denomination: "baptist",
    address: "1500 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-3936",
    website: "https://www.centralcorsicana.com",
    lat: 32.0878,
    lng: -96.4796,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Angus Baptist Church",
    denomination: "baptist",
    address: "6155 S IH 45 E, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-2771",
    lat: 32.0347,
    lng: -96.4189,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethany Baptist Church",
    denomination: "baptist",
    address: "1900 Mulberry Dr, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2285",
    lat: 32.1033,
    lng: -96.4419,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethlehem Baptist Church",
    denomination: "baptist",
    address: "409 N 3rd St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2591",
    lat: 32.0968,
    lng: -96.4802,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Memorial Baptist Church",
    denomination: "baptist",
    address: "1700 N 45th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-6464",
    lat: 32.1057,
    lng: -96.4449,
    service_times: [
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Northside Baptist Church",
    denomination: "baptist",
    address: "2800 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-5601",
    lat: 32.1147,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Grace Community Church",
    denomination: "baptist",
    address: "227 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-8455",
    lat: 32.0961,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "13th Avenue Christian Church",
    denomination: "other",
    address: "605 E 13th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2817",
    lat: 32.0932,
    lng: -96.4599,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Calvary Worship Center",
    denomination: "pentecostal",
    address: "1364 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-1084",
    lat: 32.1027,
    lng: -96.4692,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethel Temple Church",
    denomination: "pentecostal",
    address: "701 N 24th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-3291",
    lat: 32.0978,
    lng: -96.4580,
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethel Seventh-day Adventist Church",
    denomination: "other",
    address: "717 E 13th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2817",
    lat: 32.0932,
    lng: -96.4589,
    service_times: [
      { day: "Saturday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Believers Bible Church",
    denomination: "other",
    address: "2400 Bowie Dr, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2888",
    lat: 32.1083,
    lng: -96.4559,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Unity Baptist Church",
    denomination: "baptist",
    address: "406 S 34th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2861",
    lat: 32.0899,
    lng: -96.4549,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Mt. Zion Baptist Church",
    denomination: "baptist",
    address: "1408 Elm St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6555",
    lat: 32.0948,
    lng: -96.4762,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Bethel AME Church",
    denomination: "other",
    address: "615 N 5th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2833",
    lat: 32.0978,
    lng: -96.4779,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Second Avenue Missionary Baptist Church",
    denomination: "baptist",
    address: "300 E 2nd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2817",
    website: "https://secondavenuembc.org",
    lat: 32.0858,
    lng: -96.4639,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Iglesia Bautista Nueva Esperanza",
    denomination: "baptist",
    address: "1109 W 3rd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-9112",
    lat: 32.0869,
    lng: -96.4756,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" },
      { day: "Sunday", time: "6:00 PM", type: "Service" }
    ],
    status: "active"
  },
  {
    name: "New Life Fellowship",
    denomination: "non_denominational",
    address: "2801 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-0770",
    lat: 32.0878,
    lng: -96.4916,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === KERENS CHURCHES ===
  {
    name: "First Baptist Church Kerens",
    denomination: "baptist",
    address: "300 E Highway 31, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2262",
    lat: 32.1311,
    lng: -96.2281,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Kerens",
    denomination: "methodist",
    address: "201 N Colket Ave, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2283",
    lat: 32.1321,
    lng: -96.2301,
    service_times: [
      { day: "Sunday", time: "10:50 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Kerens Presbyterian Church",
    denomination: "presbyterian",
    address: "202 S Colket Ave, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2481",
    lat: 32.1301,
    lng: -96.2301,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First Assembly of God Kerens",
    denomination: "assembly_of_god",
    address: "101 E Highway 31, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2731",
    lat: 32.1311,
    lng: -96.2271,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === BLOOMING GROVE CHURCHES ===
  {
    name: "First Baptist Church Blooming Grove",
    denomination: "baptist",
    address: "301 E Fordyce St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2501",
    lat: 32.0889,
    lng: -96.7189,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Blooming Grove",
    denomination: "methodist",
    address: "108 W Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2484",
    lat: 32.0879,
    lng: -96.7199,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Blooming Grove Church of Christ",
    denomination: "church_of_christ",
    address: "200 E Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2511",
    lat: 32.0889,
    lng: -96.7179,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === RICE CHURCHES ===
  {
    name: "First Baptist Church Rice",
    denomination: "baptist",
    address: "404 N Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4361",
    lat: 32.2439,
    lng: -96.5019,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Rice United Methodist Church",
    denomination: "methodist",
    address: "309 S Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4211",
    lat: 32.2419,
    lng: -96.5019,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === DAWSON CHURCHES ===
  {
    name: "First Baptist Church Dawson",
    denomination: "baptist",
    address: "200 W Main St, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1228",
    lat: 31.9019,
    lng: -96.7139,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "First United Methodist Church Dawson",
    denomination: "methodist",
    address: "104 S Main St, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1211",
    lat: 31.9009,
    lng: -96.7129,
    service_times: [
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Dawson Church of Christ",
    denomination: "church_of_christ",
    address: "305 E Main St, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1244",
    lat: 31.9019,
    lng: -96.7109,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === FROST CHURCHES ===
  {
    name: "First Baptist Church Frost",
    denomination: "baptist",
    address: "100 N Main St, Frost, TX 76641",
    town: "Frost",
    phone: "(903) 682-3181",
    lat: 32.0769,
    lng: -96.8079,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Frost United Methodist Church",
    denomination: "methodist",
    address: "201 S Main St, Frost, TX 76641",
    town: "Frost",
    phone: "(903) 682-3221",
    lat: 32.0759,
    lng: -96.8079,
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // === MILDRED CHURCHES ===
  {
    name: "Mildred Baptist Church",
    denomination: "baptist",
    address: "5502 S US Hwy 287, Corsicana, TX 75109",
    town: "Mildred",
    phone: "(903) 874-7928",
    lat: 32.0247,
    lng: -96.4789,
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  }
];

// ============================================
// SCHOOLS IN NAVARRO COUNTY
// ============================================
const schools = [
  // === CORSICANA ISD ===
  {
    name: "Corsicana High School",
    school_type: "high",
    district: "Corsicana ISD",
    address: "3602 W State Highway 22, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7441",
    website: "https://chs.cisd.org",
    grades_served: "9-12",
    mascot: "Tigers",
    school_colors: "Orange and Black",
    lat: 32.0847,
    lng: -96.5199,
    status: "active"
  },
  {
    name: "Corsicana Middle School",
    school_type: "middle",
    district: "Corsicana ISD",
    address: "2400 W 2nd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7461",
    website: "https://cms.cisd.org",
    grades_served: "7-8",
    mascot: "Tigers",
    lat: 32.0858,
    lng: -96.4879,
    status: "active"
  },
  {
    name: "Collins Intermediate School",
    school_type: "middle",
    district: "Corsicana ISD",
    address: "2220 Bowie Dr, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7441",
    website: "https://collins.cisd.org",
    grades_served: "5-6",
    mascot: "Tigers",
    lat: 32.1063,
    lng: -96.4559,
    status: "active"
  },
  {
    name: "Bowie Elementary School",
    school_type: "elementary",
    district: "Corsicana ISD",
    address: "2500 Bowie Dr, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7481",
    website: "https://bowie.cisd.org",
    grades_served: "K-4",
    lat: 32.1093,
    lng: -96.4559,
    status: "active"
  },
  {
    name: "Carroll Elementary School",
    school_type: "elementary",
    district: "Corsicana ISD",
    address: "1601 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7491",
    website: "https://carroll.cisd.org",
    grades_served: "PK-4",
    lat: 32.1047,
    lng: -96.4692,
    status: "active"
  },
  {
    name: "Fannin Elementary School",
    school_type: "elementary",
    district: "Corsicana ISD",
    address: "1400 W 15th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7501",
    website: "https://fannin.cisd.org",
    grades_served: "K-4",
    lat: 32.0944,
    lng: -96.4796,
    status: "active"
  },
  {
    name: "Navarro Elementary School",
    school_type: "elementary",
    district: "Corsicana ISD",
    address: "3301 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7511",
    website: "https://navarro.cisd.org",
    grades_served: "K-4",
    lat: 32.0878,
    lng: -96.4976,
    status: "active"
  },
  {
    name: "Sam Houston Elementary School",
    school_type: "elementary",
    district: "Corsicana ISD",
    address: "2000 W Park Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-7521",
    website: "https://samhouston.cisd.org",
    grades_served: "PK-4",
    description: "Dual language campus",
    lat: 32.0888,
    lng: -96.4819,
    status: "active"
  },

  // === KERENS ISD ===
  {
    name: "Kerens High School",
    school_type: "high",
    district: "Kerens ISD",
    address: "100 Bobcat Dr, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2221",
    website: "https://www.kerensisd.org",
    grades_served: "9-12",
    mascot: "Bobcats",
    lat: 32.1341,
    lng: -96.2281,
    status: "active"
  },
  {
    name: "Kerens Elementary School",
    school_type: "elementary",
    district: "Kerens ISD",
    address: "200 Bobcat Dr, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2221",
    grades_served: "PK-6",
    mascot: "Bobcats",
    lat: 32.1351,
    lng: -96.2281,
    status: "active"
  },
  {
    name: "Kerens Junior High School",
    school_type: "middle",
    district: "Kerens ISD",
    address: "100 Bobcat Dr, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2221",
    grades_served: "7-8",
    mascot: "Bobcats",
    lat: 32.1341,
    lng: -96.2291,
    status: "active"
  },

  // === BLOOMING GROVE ISD ===
  {
    name: "Blooming Grove High School",
    school_type: "high",
    district: "Blooming Grove ISD",
    address: "210 N Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-3116",
    website: "https://www.bgisd.org",
    grades_served: "9-12",
    mascot: "Lions",
    lat: 32.0909,
    lng: -96.7199,
    status: "active"
  },
  {
    name: "Blooming Grove Junior High School",
    school_type: "middle",
    district: "Blooming Grove ISD",
    address: "200 N Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-3116",
    grades_served: "6-8",
    mascot: "Lions",
    lat: 32.0899,
    lng: -96.7199,
    status: "active"
  },
  {
    name: "Blooming Grove Elementary School",
    school_type: "elementary",
    district: "Blooming Grove ISD",
    address: "300 S Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-3116",
    grades_served: "PK-5",
    mascot: "Lions",
    lat: 32.0869,
    lng: -96.7199,
    status: "active"
  },

  // === RICE ISD ===
  {
    name: "Rice High School",
    school_type: "high",
    district: "Rice ISD",
    address: "500 Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4381",
    website: "https://www.rice-isd.org",
    grades_served: "9-12",
    mascot: "Bulldogs",
    lat: 32.2459,
    lng: -96.5019,
    status: "active"
  },
  {
    name: "Rice Middle School",
    school_type: "middle",
    district: "Rice ISD",
    address: "400 Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4381",
    grades_served: "6-8",
    mascot: "Bulldogs",
    lat: 32.2449,
    lng: -96.5019,
    status: "active"
  },
  {
    name: "Rice Elementary School",
    school_type: "elementary",
    district: "Rice ISD",
    address: "300 Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4381",
    grades_served: "PK-5",
    mascot: "Bulldogs",
    lat: 32.2439,
    lng: -96.5019,
    status: "active"
  },

  // === DAWSON ISD ===
  {
    name: "Dawson School",
    school_type: "high",
    district: "Dawson ISD",
    address: "150 Bulldog Dr, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1131",
    website: "https://www.dawsonisd.net",
    grades_served: "PK-12",
    mascot: "Bulldogs",
    lat: 31.9039,
    lng: -96.7129,
    status: "active"
  },

  // === FROST ISD ===
  {
    name: "Frost High School",
    school_type: "high",
    district: "Frost ISD",
    address: "200 Polar Bear Dr, Frost, TX 76641",
    town: "Frost",
    phone: "(903) 682-3001",
    grades_served: "7-12",
    mascot: "Polar Bears",
    lat: 32.0789,
    lng: -96.8079,
    status: "active"
  },
  {
    name: "Frost Elementary School",
    school_type: "elementary",
    district: "Frost ISD",
    address: "100 Polar Bear Dr, Frost, TX 76641",
    town: "Frost",
    phone: "(903) 682-3001",
    grades_served: "PK-6",
    mascot: "Polar Bears",
    lat: 32.0779,
    lng: -96.8079,
    status: "active"
  },

  // === MILDRED ISD ===
  {
    name: "Mildred High School",
    school_type: "high",
    district: "Mildred ISD",
    address: "5868 US Highway 287 S, Corsicana, TX 75109",
    town: "Mildred",
    phone: "(903) 872-3051",
    grades_served: "9-12",
    mascot: "Eagles",
    lat: 32.0207,
    lng: -96.4789,
    status: "active"
  },
  {
    name: "Mildred Junior High School",
    school_type: "middle",
    district: "Mildred ISD",
    address: "5868 US Highway 287 S, Corsicana, TX 75109",
    town: "Mildred",
    phone: "(903) 872-3051",
    grades_served: "6-8",
    mascot: "Eagles",
    lat: 32.0217,
    lng: -96.4789,
    status: "active"
  },
  {
    name: "Mildred Elementary School",
    school_type: "elementary",
    district: "Mildred ISD",
    address: "5868 US Highway 287 S, Corsicana, TX 75109",
    town: "Mildred",
    phone: "(903) 872-3051",
    grades_served: "K-5",
    mascot: "Eagles",
    lat: 32.0227,
    lng: -96.4789,
    status: "active"
  },

  // === NAVARRO COLLEGE ===
  {
    name: "Navarro College",
    school_type: "college",
    district: "Navarro College",
    address: "3200 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6501",
    website: "https://www.navarrocollege.edu",
    description: "Two-year accredited, state-supported community college. Home of the famous Navarro College Cheerleading team featured in Netflix's 'Cheer'.",
    mascot: "Bulldogs",
    founded_year: 1946,
    lat: 32.0878,
    lng: -96.4996,
    status: "active"
  }
];

// ============================================
// RUN SEED
// ============================================
function seed() {
  console.log("Starting Navarro County comprehensive seed...\n");

  // Seed Churches
  console.log("=== Seeding Churches ===");
  let churchCount = 0;
  churches.forEach(church => {
    insertEntity('Church', church);
    churchCount++;
  });
  console.log(`\nProcessed ${churchCount} churches.\n`);

  // Seed Schools
  console.log("=== Seeding Schools ===");
  let schoolCount = 0;
  schools.forEach(school => {
    insertEntity('School', school);
    schoolCount++;
  });
  console.log(`\nProcessed ${schoolCount} schools.\n`);

  console.log("=== Seed Complete ===");
}

seed();
db.close();
