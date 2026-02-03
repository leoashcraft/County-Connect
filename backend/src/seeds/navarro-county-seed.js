/**
 * Seed script for Navarro County data
 * Run with: node src/seeds/navarro-county-seed.js
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

  const stmt = db.prepare(`
    INSERT INTO entities (id, entity_type, data, created_date, updated_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(id, entityType, JSON.stringify({ ...data, id, created_date: now }), now, now);
  console.log(`Created ${entityType}: ${data.name}`);
  return id;
}

// ============================================
// CHURCHES IN NAVARRO COUNTY
// ============================================
const churches = [
  // Corsicana Churches
  {
    name: "First Baptist Church Corsicana",
    denomination: "baptist",
    address: "301 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2651",
    website: "https://www.fbccorsicana.com",
    service_times: [
      { day: "Sunday", time: "9:00 AM", type: "Sunday School" },
      { day: "Sunday", time: "10:30 AM", type: "Worship" },
      { day: "Wednesday", time: "6:00 PM", type: "Bible Study" }
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
    service_times: [
      { day: "Sunday", time: "8:30 AM", type: "Traditional" },
      { day: "Sunday", time: "11:00 AM", type: "Traditional" }
    ],
    status: "active"
  },
  {
    name: "Immaculate Conception Catholic Church",
    denomination: "catholic",
    address: "614 S 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6765",
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
    address: "820 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2651",
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
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "St. John's Episcopal Church",
    denomination: "episcopal",
    address: "231 S 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4048",
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
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" },
      { day: "Wednesday", time: "7:00 PM", type: "Service" }
    ],
    status: "active"
  },
  {
    name: "Calvary Baptist Church",
    denomination: "baptist",
    address: "1115 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4367",
    service_times: [
      { day: "Sunday", time: "10:45 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Mt. Zion Baptist Church",
    denomination: "baptist",
    address: "1408 Elm St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6555",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Trinity Lutheran Church",
    denomination: "lutheran",
    address: "324 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4921",
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  },

  // Kerens Churches
  {
    name: "First Baptist Church Kerens",
    denomination: "baptist",
    address: "300 E Highway 31, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2262",
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
    service_times: [
      { day: "Sunday", time: "10:50 AM", type: "Worship" }
    ],
    status: "active"
  },

  // Blooming Grove Churches
  {
    name: "First Baptist Church Blooming Grove",
    denomination: "baptist",
    address: "301 E Fordyce St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2501",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },
  {
    name: "Blooming Grove United Methodist Church",
    denomination: "methodist",
    address: "108 W Main St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2484",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },

  // Rice Churches
  {
    name: "First Baptist Church Rice",
    denomination: "baptist",
    address: "404 N Houston St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4361",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },

  // Dawson Churches
  {
    name: "First Baptist Church Dawson",
    denomination: "baptist",
    address: "200 W Main St, Dawson, TX 76639",
    town: "Dawson",
    phone: "(254) 578-1228",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },

  // Frost Churches
  {
    name: "First Baptist Church Frost",
    denomination: "baptist",
    address: "100 N Main St, Frost, TX 76641",
    town: "Frost",
    phone: "(903) 682-3181",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },

  // Mildred Churches
  {
    name: "Mildred Baptist Church",
    denomination: "baptist",
    address: "FM 709, Mildred, TX 75109",
    town: "Mildred",
    phone: "(903) 874-2235",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" }
    ],
    status: "active"
  },

  // More Corsicana Churches
  {
    name: "Iglesia Bautista Nueva Esperanza",
    denomination: "baptist",
    address: "1109 W 3rd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-9112",
    service_times: [
      { day: "Sunday", time: "11:00 AM", type: "Worship" },
      { day: "Sunday", time: "6:00 PM", type: "Service" }
    ],
    status: "active"
  },
  {
    name: "Bethel Temple Church",
    denomination: "pentecostal",
    address: "701 N 24th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-3291",
    service_times: [
      { day: "Sunday", time: "10:00 AM", type: "Worship" },
      { day: "Wednesday", time: "7:30 PM", type: "Bible Study" }
    ],
    status: "active"
  },
  {
    name: "New Life Fellowship",
    denomination: "non_denominational",
    address: "2801 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 875-0770",
    service_times: [
      { day: "Sunday", time: "10:30 AM", type: "Worship" }
    ],
    status: "active"
  }
];

// ============================================
// SPORTS TEAMS IN NAVARRO COUNTY
// ============================================
const sportsTeams = [
  // Corsicana ISD - High School
  {
    name: "Corsicana Tigers Football",
    sport: "football",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    home_venue: "Tiger Stadium",
    season: "Fall",
    description: "Corsicana High School varsity football team. UIL Class 5A.",
    status: "active"
  },
  {
    name: "Corsicana Tigers Basketball (Boys)",
    sport: "basketball",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    home_venue: "CHS Gymnasium",
    season: "Winter",
    description: "Corsicana High School boys varsity basketball.",
    status: "active"
  },
  {
    name: "Corsicana Tigers Basketball (Girls)",
    sport: "basketball",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    home_venue: "CHS Gymnasium",
    season: "Winter",
    status: "active"
  },
  {
    name: "Corsicana Tigers Baseball",
    sport: "baseball",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    home_venue: "Tiger Baseball Field",
    season: "Spring",
    status: "active"
  },
  {
    name: "Corsicana Tigers Softball",
    sport: "softball",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    home_venue: "Tiger Softball Field",
    season: "Spring",
    status: "active"
  },
  {
    name: "Corsicana Tigers Soccer (Boys)",
    sport: "soccer",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    season: "Winter/Spring",
    status: "active"
  },
  {
    name: "Corsicana Tigers Soccer (Girls)",
    sport: "soccer",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    season: "Winter/Spring",
    status: "active"
  },
  {
    name: "Corsicana Tigers Volleyball",
    sport: "volleyball",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    season: "Fall",
    status: "active"
  },
  {
    name: "Corsicana Tigers Track & Field",
    sport: "track",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    season: "Spring",
    status: "active"
  },
  {
    name: "Corsicana Tigers Tennis",
    sport: "tennis",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    season: "Fall/Spring",
    status: "active"
  },
  {
    name: "Corsicana Tigers Golf",
    sport: "golf",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    season: "Spring",
    status: "active"
  },
  {
    name: "Corsicana Tigers Cheerleading",
    sport: "cheer",
    level: "high_school",
    organization: "Corsicana High School",
    town: "Corsicana",
    season: "Year-round",
    status: "active"
  },

  // Corsicana Middle Schools
  {
    name: "Collins Intermediate Football",
    sport: "football",
    level: "middle_school",
    organization: "Collins Intermediate",
    town: "Corsicana",
    season: "Fall",
    status: "active"
  },
  {
    name: "Collins Intermediate Basketball",
    sport: "basketball",
    level: "middle_school",
    organization: "Collins Intermediate",
    town: "Corsicana",
    season: "Winter",
    status: "active"
  },

  // Kerens ISD
  {
    name: "Kerens Bobcats Football",
    sport: "football",
    level: "high_school",
    organization: "Kerens High School",
    town: "Kerens",
    home_venue: "Bobcat Stadium",
    season: "Fall",
    description: "UIL Class 2A football program.",
    status: "active"
  },
  {
    name: "Kerens Bobcats Basketball (Boys)",
    sport: "basketball",
    level: "high_school",
    organization: "Kerens High School",
    town: "Kerens",
    season: "Winter",
    status: "active"
  },
  {
    name: "Kerens Lady Bobcats Basketball",
    sport: "basketball",
    level: "high_school",
    organization: "Kerens High School",
    town: "Kerens",
    season: "Winter",
    status: "active"
  },
  {
    name: "Kerens Bobcats Baseball",
    sport: "baseball",
    level: "high_school",
    organization: "Kerens High School",
    town: "Kerens",
    season: "Spring",
    status: "active"
  },
  {
    name: "Kerens Lady Bobcats Softball",
    sport: "softball",
    level: "high_school",
    organization: "Kerens High School",
    town: "Kerens",
    season: "Spring",
    status: "active"
  },
  {
    name: "Kerens Bobcats Track & Field",
    sport: "track",
    level: "high_school",
    organization: "Kerens High School",
    town: "Kerens",
    season: "Spring",
    status: "active"
  },

  // Blooming Grove ISD
  {
    name: "Blooming Grove Lions Football",
    sport: "football",
    level: "high_school",
    organization: "Blooming Grove High School",
    town: "Blooming Grove",
    season: "Fall",
    description: "UIL Class 2A football program.",
    status: "active"
  },
  {
    name: "Blooming Grove Lions Basketball (Boys)",
    sport: "basketball",
    level: "high_school",
    organization: "Blooming Grove High School",
    town: "Blooming Grove",
    season: "Winter",
    status: "active"
  },
  {
    name: "Blooming Grove Lady Lions Basketball",
    sport: "basketball",
    level: "high_school",
    organization: "Blooming Grove High School",
    town: "Blooming Grove",
    season: "Winter",
    status: "active"
  },
  {
    name: "Blooming Grove Lions Baseball",
    sport: "baseball",
    level: "high_school",
    organization: "Blooming Grove High School",
    town: "Blooming Grove",
    season: "Spring",
    status: "active"
  },
  {
    name: "Blooming Grove Lady Lions Softball",
    sport: "softball",
    level: "high_school",
    organization: "Blooming Grove High School",
    town: "Blooming Grove",
    season: "Spring",
    status: "active"
  },

  // Rice ISD
  {
    name: "Rice Bulldogs Football",
    sport: "football",
    level: "high_school",
    organization: "Rice High School",
    town: "Rice",
    season: "Fall",
    description: "UIL Class 2A football program.",
    status: "active"
  },
  {
    name: "Rice Bulldogs Basketball (Boys)",
    sport: "basketball",
    level: "high_school",
    organization: "Rice High School",
    town: "Rice",
    season: "Winter",
    status: "active"
  },
  {
    name: "Rice Lady Bulldogs Basketball",
    sport: "basketball",
    level: "high_school",
    organization: "Rice High School",
    town: "Rice",
    season: "Winter",
    status: "active"
  },

  // Dawson ISD
  {
    name: "Dawson Bulldogs Football",
    sport: "football",
    level: "high_school",
    organization: "Dawson High School",
    town: "Dawson",
    season: "Fall",
    status: "active"
  },
  {
    name: "Dawson Bulldogs Basketball",
    sport: "basketball",
    level: "high_school",
    organization: "Dawson High School",
    town: "Dawson",
    season: "Winter",
    status: "active"
  },

  // Frost ISD
  {
    name: "Frost Polar Bears Football",
    sport: "football",
    level: "high_school",
    organization: "Frost High School",
    town: "Frost",
    season: "Fall",
    status: "active"
  },
  {
    name: "Frost Polar Bears Basketball",
    sport: "basketball",
    level: "high_school",
    organization: "Frost High School",
    town: "Frost",
    season: "Winter",
    status: "active"
  },

  // Mildred ISD
  {
    name: "Mildred Eagles Football",
    sport: "football",
    level: "high_school",
    organization: "Mildred High School",
    town: "Mildred",
    season: "Fall",
    status: "active"
  },
  {
    name: "Mildred Eagles Basketball",
    sport: "basketball",
    level: "high_school",
    organization: "Mildred High School",
    town: "Mildred",
    season: "Winter",
    status: "active"
  },

  // Navarro College
  {
    name: "Navarro College Bulldogs Football",
    sport: "football",
    level: "college",
    organization: "Navarro College",
    town: "Corsicana",
    home_venue: "Bulldogs Stadium",
    season: "Fall",
    description: "NJCAA Division I football program.",
    status: "active"
  },
  {
    name: "Navarro College Bulldogs Basketball (Men)",
    sport: "basketball",
    level: "college",
    organization: "Navarro College",
    town: "Corsicana",
    season: "Winter",
    description: "NJCAA Division I men's basketball.",
    status: "active"
  },
  {
    name: "Navarro College Lady Bulldogs Basketball",
    sport: "basketball",
    level: "college",
    organization: "Navarro College",
    town: "Corsicana",
    season: "Winter",
    description: "NJCAA Division I women's basketball.",
    status: "active"
  },
  {
    name: "Navarro College Bulldogs Baseball",
    sport: "baseball",
    level: "college",
    organization: "Navarro College",
    town: "Corsicana",
    season: "Spring",
    description: "NJCAA Division I baseball program.",
    status: "active"
  },
  {
    name: "Navarro College Lady Bulldogs Softball",
    sport: "softball",
    level: "college",
    organization: "Navarro College",
    town: "Corsicana",
    season: "Spring",
    description: "NJCAA Division I softball program.",
    status: "active"
  },
  {
    name: "Navarro College Cheerleading",
    sport: "cheer",
    level: "college",
    organization: "Navarro College",
    town: "Corsicana",
    season: "Year-round",
    description: "14-time NCA National Champions. Featured in Netflix documentary 'Cheer'.",
    status: "active"
  },
  {
    name: "Navarro College Cross Country",
    sport: "track",
    level: "college",
    organization: "Navarro College",
    town: "Corsicana",
    season: "Fall",
    status: "active"
  },

  // Youth Leagues
  {
    name: "Corsicana Youth Football League",
    sport: "football",
    level: "youth",
    organization: "Corsicana Youth Sports",
    town: "Corsicana",
    season: "Fall",
    description: "Youth football for ages 5-12.",
    status: "active"
  },
  {
    name: "Corsicana Youth Basketball",
    sport: "basketball",
    level: "youth",
    organization: "Corsicana YMCA",
    town: "Corsicana",
    season: "Winter",
    description: "Youth basketball leagues at the YMCA.",
    status: "active"
  },
  {
    name: "Corsicana Little League Baseball",
    sport: "baseball",
    level: "youth",
    organization: "Corsicana Little League",
    town: "Corsicana",
    season: "Spring",
    description: "Little League baseball for ages 4-16.",
    status: "active"
  },
  {
    name: "Corsicana Girls Softball Association",
    sport: "softball",
    level: "youth",
    organization: "CGSA",
    town: "Corsicana",
    season: "Spring",
    description: "Girls fastpitch softball for ages 4-18.",
    status: "active"
  },
  {
    name: "Corsicana Youth Soccer",
    sport: "soccer",
    level: "youth",
    organization: "Corsicana Soccer Association",
    town: "Corsicana",
    season: "Fall/Spring",
    description: "Youth soccer for ages 4-18.",
    status: "active"
  }
];

// ============================================
// COMMUNITY RESOURCES IN NAVARRO COUNTY
// ============================================
const communityResources = [
  // Food Pantries
  {
    name: "Corsicana Daily Bread",
    category: "food_pantry",
    address: "1020 N Main St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-3594",
    description: "Food pantry providing groceries to families in need. No income requirements.",
    hours: "Tuesday & Thursday: 9:00 AM - 12:00 PM",
    eligibility_requirements: "Navarro County residents. Bring photo ID.",
    status: "active"
  },
  {
    name: "Navarro County Community Pantry",
    category: "food_pantry",
    address: "300 W 3rd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-4447",
    description: "Community food pantry serving Navarro County families.",
    hours: "Monday, Wednesday, Friday: 10:00 AM - 2:00 PM",
    eligibility_requirements: "Income-based eligibility. Bring ID and proof of address.",
    status: "active"
  },
  {
    name: "Salvation Army - Corsicana",
    category: "food_pantry",
    address: "615 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2339",
    description: "Emergency food assistance, utility help, and social services.",
    hours: "Monday - Friday: 9:00 AM - 4:00 PM",
    eligibility_requirements: "Income verification required. Call for appointment.",
    services_offered: ["Food pantry", "Utility assistance", "Clothing"],
    status: "active"
  },
  {
    name: "Good Samaritans of Corsicana",
    category: "food_pantry",
    address: "501 W 5th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-6442",
    description: "Food assistance and emergency services for local families.",
    hours: "Monday - Thursday: 9:00 AM - 12:00 PM",
    status: "active"
  },
  {
    name: "Kerens Food Pantry",
    category: "food_pantry",
    address: "100 N Colket Ave, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2283",
    description: "Community food pantry serving Kerens and surrounding areas.",
    hours: "2nd and 4th Thursday: 10:00 AM - 12:00 PM",
    eligibility_requirements: "Kerens area residents.",
    status: "active"
  },

  // Crisis Services
  {
    name: "Navarro County Crisis Center",
    category: "crisis",
    address: "Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-7747",
    description: "24-hour crisis hotline for domestic violence, sexual assault, and mental health emergencies.",
    hours: "24/7 Hotline",
    services_offered: ["Crisis counseling", "Emergency shelter", "Legal advocacy", "Support groups"],
    status: "active"
  },
  {
    name: "MHMR of Navarro County",
    category: "crisis",
    address: "910 N Main St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2526",
    description: "Mental health and developmental disability services.",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    services_offered: ["Mental health services", "Crisis intervention", "Substance abuse services"],
    status: "active"
  },

  // Utility Assistance
  {
    name: "Community Action Committee of Navarro County",
    category: "utility",
    address: "1015 E 2nd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-4483",
    description: "Utility assistance, weatherization, and community programs.",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    services_offered: ["LIHEAP utility assistance", "Weatherization", "Head Start"],
    eligibility_requirements: "Income-based. Bring ID, social security cards, and utility bills.",
    status: "active"
  },
  {
    name: "St. Vincent de Paul Society",
    category: "utility",
    address: "614 S 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6765",
    description: "Emergency assistance with rent, utilities, and basic needs.",
    hours: "By appointment",
    eligibility_requirements: "Call to schedule appointment.",
    status: "active"
  },

  // Senior Services
  {
    name: "Navarro County Senior Center",
    category: "senior",
    address: "820 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6788",
    description: "Services and activities for seniors including meals, recreation, and transportation.",
    hours: "Monday - Friday: 8:00 AM - 4:00 PM",
    services_offered: ["Congregate meals", "Transportation", "Activities", "Health screenings"],
    eligibility_requirements: "Age 60 and older.",
    status: "active"
  },
  {
    name: "Meals on Wheels - Navarro County",
    category: "senior",
    address: "820 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-6788",
    description: "Home-delivered meals for homebound seniors.",
    hours: "Deliveries Monday - Friday",
    eligibility_requirements: "Age 60+, homebound, unable to prepare meals.",
    status: "active"
  },

  // Clothing/Basic Needs
  {
    name: "Community Clothes Closet",
    category: "clothing",
    address: "220 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2631",
    description: "Free clothing for families in need.",
    hours: "Tuesday: 9:00 AM - 12:00 PM",
    eligibility_requirements: "Anyone in need.",
    status: "active"
  },
  {
    name: "Mission Corsicana",
    category: "shelter",
    address: "216 N 11th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-1711",
    description: "Emergency shelter and transitional housing for men.",
    hours: "Evening intake",
    services_offered: ["Emergency shelter", "Meals", "Life skills training"],
    status: "active"
  },

  // Medical Assistance
  {
    name: "Navarro County Indigent Healthcare",
    category: "medical",
    address: "300 W 3rd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 654-3025",
    description: "Healthcare assistance for uninsured county residents.",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    eligibility_requirements: "Navarro County resident, income-based eligibility.",
    status: "active"
  },
  {
    name: "Care Net Pregnancy Center",
    category: "medical",
    address: "1120 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2273",
    description: "Free pregnancy testing, ultrasounds, and parenting classes.",
    hours: "Monday - Thursday: 9:00 AM - 4:00 PM",
    services_offered: ["Pregnancy tests", "Ultrasounds", "Parenting classes", "Material assistance"],
    status: "active"
  },

  // Veterans Services
  {
    name: "Navarro County Veterans Service Office",
    category: "veteran",
    address: "300 W 3rd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 654-3095",
    description: "Assistance with VA benefits, claims, and veteran services.",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    services_offered: ["VA claims assistance", "Benefits counseling", "Referrals"],
    eligibility_requirements: "Veterans and their dependents.",
    status: "active"
  },

  // Disability Services
  {
    name: "Texas Workforce Solutions - Corsicana",
    category: "disability",
    address: "1020 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-4331",
    description: "Employment services, vocational rehabilitation, and job training.",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    services_offered: ["Job search assistance", "Vocational rehabilitation", "Training programs"],
    status: "active"
  }
];

// ============================================
// RUN SEED
// ============================================
function seed() {
  console.log("Starting Navarro County seed...\n");

  // Seed Churches
  console.log("=== Seeding Churches ===");
  churches.forEach(church => {
    insertEntity('Church', church);
  });
  console.log(`\nSeeded ${churches.length} churches.\n`);

  // Seed Sports Teams
  console.log("=== Seeding Sports Teams ===");
  sportsTeams.forEach(team => {
    insertEntity('SportsTeam', team);
  });
  console.log(`\nSeeded ${sportsTeams.length} sports teams.\n`);

  // Seed Community Resources
  console.log("=== Seeding Community Resources ===");
  communityResources.forEach(resource => {
    insertEntity('CommunityResource', resource);
  });
  console.log(`\nSeeded ${communityResources.length} community resources.\n`);

  console.log("=== Seed Complete ===");
  console.log(`Total: ${churches.length} churches, ${sportsTeams.length} sports teams, ${communityResources.length} community resources`);
}

seed();
db.close();
