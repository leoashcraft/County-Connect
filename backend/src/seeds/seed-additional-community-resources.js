/**
 * Seed additional community resources for Navarro County (rural towns + more services)
 * Run with: node src/seeds/seed-additional-community-resources.js
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

// Get town IDs
const getTownId = (townName) => {
  const town = db.prepare(`
    SELECT id FROM entities
    WHERE entity_type = 'Town'
    AND json_extract(data, '$.name') = ?
  `).get(townName);
  return town?.id || null;
};

// Additional community resources
const resources = [
  // === FOOD PANTRIES - RURAL TOWNS ===
  {
    name: "Frost Community Center Food Pantry",
    category: "food_pantry",
    description: "Community center food pantry partnered with North Texas Food Bank. Staffed by dedicated volunteers serving Frost and surrounding rural areas.",
    address: "217 N Garitty St, Frost, TX 76641",
    phone: "(903) 682-2361",
    email: null,
    website: "https://www.frostbaptist.com/frost-community-center.html",
    hours: "Call for distribution schedule",
    eligibility: "Residents of Frost and surrounding Navarro County communities",
    services: ["Food distribution", "Emergency food assistance"],
    town: "Frost",
    town_id: getTownId("Frost"),
    status: "active"
  },
  {
    name: "Northside Baptist Church Care Center",
    category: "food_pantry",
    description: "Church-based food pantry ministry providing groceries and assistance to families in need. Partner with North Texas Food Bank.",
    address: "Corsicana, TX",
    phone: null,
    email: null,
    website: "http://www.nbchurch.net/care-center",
    hours: "Contact church for hours",
    eligibility: "Families in need in Navarro County",
    services: ["Food pantry", "Family assistance"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },
  {
    name: "House of Bread",
    category: "soup_kitchen",
    description: "Provides hot meals to those in need. Partner agency with North Texas Food Bank serving Navarro County.",
    address: "Corsicana, TX",
    phone: null,
    email: null,
    website: null,
    hours: "Contact for meal times",
    eligibility: "Anyone in need of a meal",
    services: ["Hot meals", "Soup kitchen"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },
  {
    name: "Catholic Charities - Immaculate Conception",
    category: "food_pantry",
    description: "Catholic Charities food assistance program partnered with North Texas Food Bank.",
    address: "Corsicana, TX",
    phone: null,
    email: null,
    website: null,
    hours: "Contact for hours",
    eligibility: "Community members in need",
    services: ["Food assistance"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },

  // === LIBRARIES (EDUCATION/OTHER) ===
  {
    name: "Kerens Library",
    category: "education",
    description: "Public library established in 1988 providing books, resources, internet access, and community programs. Hosts annual events including the Author's Luncheon.",
    address: "121 S. Colket Street, Kerens, TX 75144",
    phone: "(903) 396-2665",
    email: "kerenslibrary@yahoo.com",
    website: "https://kerenslibrary.org/",
    hours: "Mon-Fri: 10:00 AM - 5:00 PM, Sat-Sun: Closed",
    eligibility: "Open to all community members",
    services: ["Book lending", "Internet access", "Community programs", "Meeting space"],
    town: "Kerens",
    town_id: getTownId("Kerens"),
    status: "active"
  },

  // === ADULT EDUCATION ===
  {
    name: "Navarro College Adult Education & Literacy Program",
    category: "education",
    description: "Free GED preparation, ESL classes, and adult literacy programs. Self-paced classes allow students to work at their own speed. Official GED Testing Center.",
    address: "Bain Center, 3200 W 7th Ave, Corsicana, TX 75110",
    phone: "(903) 875-7464",
    email: null,
    website: "https://www.navarrocollege.edu/adult-education/",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    eligibility: "Adults seeking GED, ESL, or literacy education",
    services: ["GED preparation", "ESL classes", "Adult literacy", "Career pathways", "GED testing"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },

  // === VICTIM SERVICES ===
  {
    name: "Navarro County Victim Assistance",
    category: "crisis",
    description: "Assists crime victims in understanding case proceedings, connecting with social services, and exercising their statutory rights. Provides Crime Victim Compensation applications, protective order assistance, and victim notification services.",
    address: "300 W. 3rd Avenue, Suite 301, Corsicana, TX 75110",
    phone: "(903) 875-3309",
    email: "vcorpus@navarrocounty.org",
    website: "https://www.co.navarro.tx.us/page/navarro.District.Victimservices",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    eligibility: "Victims of crime in Navarro County",
    services: ["Victim impact statements", "Crime victim compensation", "Protective orders", "Restitution assistance", "VINE notification"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },
  {
    name: "National Domestic Violence Hotline",
    category: "crisis",
    description: "24/7 confidential support for victims of domestic violence. Provides safety planning, crisis intervention, and referrals to local resources.",
    address: "National Service",
    phone: "1-800-799-7233",
    email: null,
    website: "https://www.thehotline.org/",
    hours: "24/7",
    eligibility: "Anyone experiencing domestic violence",
    services: ["Crisis support", "Safety planning", "Local referrals", "TTY: 1-800-787-3224"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },
  {
    name: "Family Abuse Center",
    category: "shelter",
    description: "Serves victims of domestic violence in McLennan, Bosque, Ellis, Falls, Freestone, Hill, and Navarro Counties with shelter and support services.",
    address: "Waco, TX (serving Navarro County)",
    phone: "(254) 772-8999",
    email: null,
    website: null,
    hours: "24/7 Hotline",
    eligibility: "Victims of domestic violence in Navarro County",
    services: ["Emergency shelter", "Counseling", "Advocacy", "Support groups"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },

  // === EMERGENCY SERVICES ===
  {
    name: "Navarro County Office of Emergency Management",
    category: "other",
    description: "Coordinates emergency preparedness and response for Navarro County. Partners with fire departments, Red Cross, Salvation Army, and local agencies.",
    address: "814 S. Main St., Corsicana, TX 75110",
    phone: null,
    email: null,
    website: "https://navarrocountyoem.org/",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM (24/7 during emergencies)",
    eligibility: "All Navarro County residents",
    services: ["Emergency preparedness", "Disaster response", "CERT coordination", "Weather alerts"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },
  {
    name: "Navarro County ESD #1 (EMS)",
    category: "medical",
    description: "Emergency Medical Services providing ambulance and emergency medical care for rural Navarro County areas.",
    address: "Powell, TX",
    phone: "(903) 396-7176",
    email: null,
    website: "https://ncesd1.com",
    hours: "24/7 Emergency Service",
    eligibility: "Emergency medical services for all",
    services: ["Emergency medical response", "Ambulance service"],
    town: "Powell",
    town_id: getTownId("Powell"),
    status: "active"
  },

  // === VOLUNTEER FIRE DEPARTMENTS ===
  {
    name: "Blooming Grove Volunteer Fire Department",
    category: "other",
    description: "Volunteer fire department providing fire protection and emergency response for Blooming Grove and surrounding areas.",
    address: "101 North Hinckley Street, Blooming Grove, TX",
    phone: "(903) 695-2900",
    email: null,
    website: null,
    hours: "24/7 Emergency Response",
    eligibility: "Emergency services for all",
    services: ["Fire response", "Emergency rescue", "Community safety"],
    town: "Blooming Grove",
    town_id: getTownId("Blooming Grove"),
    status: "active"
  },
  {
    name: "Kerens Volunteer Fire Department",
    category: "other",
    description: "Volunteer fire department providing fire protection and emergency response for Kerens and surrounding areas.",
    address: "205 SE Third Street, Kerens, TX",
    phone: "(903) 396-2500",
    email: null,
    website: null,
    hours: "24/7 Emergency Response",
    eligibility: "Emergency services for all",
    services: ["Fire response", "Emergency rescue"],
    town: "Kerens",
    town_id: getTownId("Kerens"),
    status: "active"
  },
  {
    name: "Rice Volunteer Fire Department",
    category: "other",
    description: "Volunteer fire department providing fire protection and emergency response for Rice and surrounding areas.",
    address: "205 East Calhoun Street, Rice, TX",
    phone: "(903) 875-8404",
    email: null,
    website: null,
    hours: "24/7 Emergency Response",
    eligibility: "Emergency services for all",
    services: ["Fire response", "Emergency rescue"],
    town: "Rice",
    town_id: getTownId("Rice"),
    status: "active"
  },
  {
    name: "Frost Volunteer Fire Department",
    category: "other",
    description: "Volunteer fire department providing fire protection and emergency response for Frost and surrounding areas.",
    address: "112 West North Front Street, Frost, TX",
    phone: "(903) 682-3333",
    email: null,
    website: null,
    hours: "24/7 Emergency Response",
    eligibility: "Emergency services for all",
    services: ["Fire response", "Emergency rescue"],
    town: "Frost",
    town_id: getTownId("Frost"),
    status: "active"
  },
  {
    name: "Dawson Volunteer Fire Department",
    category: "other",
    description: "Volunteer fire department providing fire protection and emergency response for Dawson and surrounding areas.",
    address: "97 North Main Street, Dawson, TX",
    phone: "(254) 578-3241",
    email: "Dawsonchief01@gmail.com",
    website: null,
    hours: "24/7 Emergency Response",
    eligibility: "Emergency services for all",
    services: ["Fire response", "Emergency rescue"],
    town: "Dawson",
    town_id: getTownId("Dawson"),
    status: "active"
  },
  {
    name: "Mildred Volunteer Fire Department",
    category: "other",
    description: "Volunteer fire department providing fire protection and emergency response for Mildred and surrounding areas.",
    address: "5415 FM 637, Corsicana, TX",
    phone: "(903) 874-1600",
    email: null,
    website: null,
    hours: "24/7 Emergency Response",
    eligibility: "Emergency services for all",
    services: ["Fire response", "Emergency rescue"],
    town: "Mildred",
    town_id: getTownId("Mildred"),
    status: "active"
  },
  {
    name: "Barry Volunteer Fire Department",
    category: "other",
    description: "Volunteer fire department providing fire protection and emergency response for Barry and surrounding areas.",
    address: "101 West South Front Street, Barry, TX",
    phone: "(903) 695-0036",
    email: null,
    website: null,
    hours: "24/7 Emergency Response",
    eligibility: "Emergency services for all",
    services: ["Fire response", "Emergency rescue"],
    town: "Barry",
    town_id: getTownId("Barry"),
    status: "active"
  },

  // === HOUSING ===
  {
    name: "Dawson Housing Authority",
    category: "shelter",
    description: "Provides Tenant Based Rental Assistance (TBRA) and public housing options for low-income residents in Dawson.",
    address: "Dawson, TX",
    phone: null,
    email: null,
    website: null,
    hours: "Contact for hours",
    eligibility: "Low-income residents, waiting lists may apply",
    services: ["Rental assistance", "Public housing"],
    town: "Dawson",
    town_id: getTownId("Dawson"),
    status: "active"
  },

  // === SENIOR CARE ===
  {
    name: "Kerens Care Center",
    category: "senior_services",
    description: "Skilled nursing facility with 67 beds providing long-term care, memory care, and rehabilitation services. Medicare and Medicaid certified.",
    address: "809 North East 4th Street, Kerens, TX",
    phone: null,
    email: null,
    website: null,
    hours: "24/7 residential care",
    eligibility: "Seniors requiring skilled nursing care",
    services: ["Skilled nursing", "Memory care", "Rehabilitation", "Long-term care"],
    town: "Kerens",
    town_id: getTownId("Kerens"),
    status: "active"
  },

  // === STATEWIDE RESOURCES ===
  {
    name: "Texas SNAP Benefits (Food Stamps)",
    category: "food_pantry",
    description: "Supplemental Nutrition Assistance Program providing monthly food benefits to eligible low-income Texans. Apply through Texas Health and Human Services.",
    address: "Apply online or at local HHS office",
    phone: "1-877-541-7905",
    email: null,
    website: "https://www.yourtexasbenefits.com/",
    hours: "Online applications 24/7",
    eligibility: "Low-income Texas residents meeting income guidelines",
    services: ["Monthly food benefits", "EBT card"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },
  {
    name: "Texas Utility Help Program",
    category: "utility_assistance",
    description: "State program providing funding to low-income homeowners and renters for past due and future utility bills. Household income must be at or below 150% of Federal Poverty Guidelines.",
    address: "Apply online",
    phone: "(855) 566-2057",
    email: null,
    website: "https://www.TexasUtilityHelp.com",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    eligibility: "Household income at or below 150% FPG (family of 4: $41,000)",
    services: ["Utility bill assistance", "Past due payments", "Future bills"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  },
  {
    name: "Lifeline Phone & Internet Assistance",
    category: "utility_assistance",
    description: "Federal program helping eligible low-income individuals and families get discounted telephone or internet services.",
    address: "Apply through provider",
    phone: "1-866-454-8387",
    email: null,
    website: "https://www.texaslifeline.org",
    hours: "Contact for hours",
    eligibility: "Low-income individuals meeting federal guidelines",
    services: ["Discounted phone service", "Discounted internet"],
    town: "Corsicana",
    town_id: getTownId("Corsicana"),
    status: "active"
  }
];

// Insert community resources
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

for (const resource of resources) {
  // Check if already exists
  const existing = checkStmt.get(resource.name);
  if (existing) {
    console.log(`[SKIPPED] ${resource.name} - already exists`);
    skipped++;
    continue;
  }

  const id = uuidv4();
  const data = {
    id,
    ...resource,
    created_date: now
  };

  insertStmt.run(id, 'CommunityResource', JSON.stringify(data), now, now);
  console.log(`[ADDED] ${resource.name} (${resource.category}) - ${resource.town}`);
  added++;
}

console.log(`\nDone! Added ${added} community resources, skipped ${skipped} (already existed).`);

db.close();
