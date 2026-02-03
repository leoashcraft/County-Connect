/**
 * Seed community resources for Navarro County
 * Run with: node src/seeds/seed-community-resources.js
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

// Get Corsicana town ID
const corsicana = db.prepare(`
  SELECT id FROM entities
  WHERE entity_type = 'Town'
  AND json_extract(data, '$.name') = 'Corsicana'
`).get();

const corsicanaTownId = corsicana?.id;

// Community resources for Navarro County
const resources = [
  // === FOOD PANTRIES ===
  {
    name: "Navarro County Food Pantry - Compassion Corsicana",
    category: "food_pantry",
    description: "Drive-through food pantry operated by Compassion Corsicana in partnership with North Texas Food Bank. Residents may visit bi-weekly for groceries and weekly for fresh produce. Must be a Navarro County resident.",
    address: "517 N. Commerce Street, Corsicana, TX 75110",
    phone: "(903) 874-4971",
    email: null,
    website: "https://www.compassioncorsicana.org/programs",
    hours: "Mon-Fri: 9:00 AM - 4:00 PM (closed 12:00 PM - 1:00 PM)",
    eligibility: "Must be a Navarro County resident. Bring food pantry ID or state ID. Applications available at main office or online.",
    services: ["Food assistance", "Fresh produce", "Grocery items"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "The Salvation Army - Corsicana Food Pantry",
    category: "food_pantry",
    description: "Community food pantry serving residents of Navarro County. In 2023, provided food boxes to over 2,534 individuals and families.",
    address: "212 E. 1st Ave, Corsicana, TX 75110",
    phone: "(903) 874-7131",
    email: null,
    website: "https://southernusa.salvationarmy.org/corsicana/",
    hours: "Mon & Wed: 9:00 AM - 11:30 AM & 1:00 PM - 3:00 PM, Fri: 9:00 AM - 11:30 AM",
    eligibility: "Residents of Navarro County within 75110 zip code",
    services: ["Food boxes", "Emergency food assistance"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Hope to Go Food Pantry",
    category: "food_pantry",
    description: "A ministry of Mildred Baptist Church and partner with North Texas Food Bank. Provides quality food items and fresh produce to Navarro County children, families, and seniors in rural areas.",
    address: "Mildred Baptist Church, Mildred, TX",
    phone: "(903) 303-2402",
    email: null,
    website: "https://www.discovermildred.org/hopetogo",
    hours: "Call for distribution schedule",
    eligibility: "Navarro County residents in need of nutritional food assistance",
    services: ["Food assistance", "Fresh produce", "Rural area service"],
    town: "Mildred",
    town_id: null,
    status: "active"
  },

  // === SHELTER / HOUSING ===
  {
    name: "House of Refuge - Compassion Corsicana",
    category: "shelter",
    description: "Transitional housing providing a safe, faith-based environment for displaced women and their children. Residents work toward self-sufficiency through employment, community programs, and personal goal setting.",
    address: "111 E. 1st Avenue, Corsicana, TX 75110",
    phone: "(903) 874-3421",
    email: null,
    website: "https://www.compassioncorsicana.org/programs",
    hours: "Apply at main office Mon-Fri: 9:00 AM - 4:00 PM",
    eligibility: "Women 18+, male children 12 and under, must be capable of obtaining employment, able to live independently, Navarro County resident",
    services: ["Transitional housing", "Case management", "Self-sufficiency programs"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "The Salvation Army - Housing Assistance",
    category: "shelter",
    description: "Provides hotel vouchers and rental assistance to community members in need of temporary shelter. Also offers utility assistance for electricity, water, and gas.",
    address: "212 E. 1st Ave, Corsicana, TX 75110",
    phone: "(903) 874-7131",
    email: null,
    website: "https://southernusa.salvationarmy.org/corsicana/",
    hours: "Mon-Fri: 9:00 AM - 4:00 PM",
    eligibility: "Must apply and meet eligibility requirements through case worker",
    services: ["Hotel vouchers", "Rental assistance", "Utility assistance"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Corsicana Housing Authority",
    category: "shelter",
    description: "Provides public housing and Section 8 Housing Choice Vouchers to eligible low-income families, elderly, and disabled individuals.",
    address: "Corsicana, TX",
    phone: null,
    email: null,
    website: "https://hrc-ic.tdhca.state.tx.us/",
    hours: "Contact for hours",
    eligibility: "Low-income families, elderly, and disabled individuals. Waiting lists may apply.",
    services: ["Public housing", "Section 8 vouchers", "Rental assistance"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === UTILITY ASSISTANCE ===
  {
    name: "Comprehensive Energy Assistance Program (CEAP)",
    category: "utility_assistance",
    description: "Helps pay for utility bills, heating/cooling repairs, and home weatherization for qualifying families. Funded by Texas Department of Housing and Community Affairs.",
    address: "302 Hospital Dr, Corsicana, TX 75110",
    phone: "(903) 872-2401",
    email: "support@csicorsicana.org",
    website: "https://www.csicorsicana.org/comprehensive-energy-assistance-program/",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    eligibility: "Low-income households in Navarro County",
    services: ["Utility bill assistance", "Heating/cooling repairs", "Home weatherization"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Compassion Corsicana - Financial Assistance",
    category: "utility_assistance",
    description: "Community specialists assist with financial hardships including utilities, rent, emergency shelter, and transportation. Helps identify solutions and provides additional resources.",
    address: "111 E. 1st Avenue, Corsicana, TX 75110",
    phone: "(903) 874-4971",
    email: null,
    website: "https://www.compassioncorsicana.org/programs",
    hours: "Mon-Fri: 9:00 AM - 4:00 PM (closed 12:00 PM - 1:00 PM)",
    eligibility: "Navarro County residents experiencing financial hardship",
    services: ["Utility assistance", "Rent assistance", "Emergency shelter", "Transportation assistance"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === MEDICAL / HEALTH ===
  {
    name: "Dr. Kent E. Rogers Medical Clinic",
    category: "medical",
    description: "Faith-based Federally Qualified Health Clinic offering medical, dental, and mental health services. No one is denied healthcare. Accepts Medicare, Medicaid, most insurance, and offers modest fees for uninsured.",
    address: "Corsicana, TX",
    phone: null,
    email: null,
    website: "https://www.kentrogersclinic.org/",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    eligibility: "All patients welcome, sliding scale fees for uninsured",
    services: ["Primary care", "Dental care", "Mental health services", "Telehealth", "Chronic disease management"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Navarro County Public Health District",
    category: "medical",
    description: "County health department providing immunizations, family planning, and public health services to Navarro County residents.",
    address: "115 West Collin Street, Corsicana, TX 75110",
    phone: null,
    email: null,
    website: "https://navarrocountypublichealthdistr.godaddysites.com/",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    eligibility: "Navarro County residents",
    services: ["Immunizations", "Family planning", "Public health services", "Health education"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === MENTAL HEALTH ===
  {
    name: "North Texas Behavioral Health Authority (NTBHA)",
    category: "mental_health",
    description: "Local Behavioral Health Authority serving Navarro County with 24/7 crisis services, mobile crisis teams, and connections to mental health and substance use providers.",
    address: "Serving Navarro County",
    phone: "(866) 260-8000",
    email: null,
    website: "https://ntbha.org/",
    hours: "24/7 Crisis Line",
    eligibility: "All residents of Navarro County",
    services: ["24/7 crisis hotline", "Mobile crisis outreach", "Mental health referrals", "Substance use services"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Homeward Bound Crisis Respite House",
    category: "mental_health",
    description: "Short-term voluntary crisis respite for adults 18+ experiencing mental health crisis. 6-bed facility providing community-based crisis treatment for those with low risk of harm.",
    address: "Corsicana, TX",
    phone: null,
    email: null,
    website: "https://www.homewardboundinc.org/crisis",
    hours: "24/7",
    eligibility: "Adults 18+ experiencing mental health crisis, low risk of harm to self/others",
    services: ["Crisis respite", "Short-term treatment", "Stabilization services"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Child & Family Guidance Center - Corsicana",
    category: "mental_health",
    description: "Mental health services for children and families including the Youth Empowerment Services (YES) Waiver Program for youth ages 3-18 with mental health concerns.",
    address: "Corsicana, TX",
    phone: null,
    email: null,
    website: "https://www.childrenandfamilies.org/about-us/locations/corsicana",
    hours: "Contact for hours",
    eligibility: "Youth ages 3-18 and their families",
    services: ["Youth mental health services", "Family counseling", "YES Waiver Program"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === CRISIS SUPPORT ===
  {
    name: "988 Suicide & Crisis Lifeline",
    category: "crisis",
    description: "National suicide prevention and mental health crisis lifeline. Call or text 988 for immediate support. TTY users dial 711 then 988.",
    address: "National Service",
    phone: "988",
    email: null,
    website: "https://988lifeline.org/",
    hours: "24/7",
    eligibility: "Anyone in crisis",
    services: ["Suicide prevention", "Crisis counseling", "Mental health support"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "2-1-1 Texas",
    category: "crisis",
    description: "Statewide helpline connecting Texans to local resources for food, housing, healthcare, utilities, and more. Available 24/7.",
    address: "Statewide Service",
    phone: "211",
    email: null,
    website: "https://www.211texas.org/",
    hours: "24/7",
    eligibility: "All Texas residents",
    services: ["Resource referrals", "Social services information", "Crisis support"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Veterans Crisis Line",
    category: "crisis",
    description: "Free, confidential support for Veterans in crisis and their families and friends. Call 988 and press 1, text 838255, or chat online.",
    address: "National Service",
    phone: "988 (press 1)",
    email: null,
    website: "https://www.veteranscrisisline.net/",
    hours: "24/7",
    eligibility: "Veterans, service members, and their families",
    services: ["Crisis counseling", "Suicide prevention", "Mental health support for veterans"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === SENIOR SERVICES ===
  {
    name: "Meals on Wheels - CSI Community Services",
    category: "senior_services",
    description: "Delivers hot meals daily to homebound seniors in Navarro County. Program is free and enables seniors to live independently. Over 100 households currently served.",
    address: "302 Hospital Dr, Corsicana, TX 75110",
    phone: "(903) 872-2401",
    email: "support@csicorsicana.org",
    website: "https://www.csicorsicana.org/meals-on-wheels/",
    hours: "Mon-Fri meal delivery",
    eligibility: "Navarro County resident, primarily homebound, have Medicaid or private insurance. Call DADS at 1-888-337-6377 to apply.",
    services: ["Hot meal delivery", "Wellness checks", "Monthly activity packets"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Navarro County Senior Citizens Services",
    category: "senior_services",
    description: "County services for senior citizens including programs, activities, and resources for elderly residents.",
    address: "100 N Main St, Corsicana, TX",
    phone: null,
    email: null,
    website: null,
    hours: "Contact for hours",
    eligibility: "Senior citizens of Navarro County",
    services: ["Senior programs", "Activities", "Resources"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === VETERANS SERVICES ===
  {
    name: "Navarro County Veterans Services Office",
    category: "veterans",
    description: "Assists veterans, dependents, and survivors with disability benefits, claims, and rights. Located in the Navarro County Courthouse.",
    address: "300 W. 3rd Ave (Courthouse Annex), Corsicana, TX 75110",
    phone: "(903) 654-3017",
    email: null,
    website: "https://www.co.navarro.tx.us/page/navarro.veterans",
    hours: "Mon, Wed, Fri: 8:00 AM - 4:00 PM",
    eligibility: "Veterans, their dependents, and survivors",
    services: ["Benefits assistance", "Claims help", "Veteran advocacy"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === YOUTH SERVICES ===
  {
    name: "Navarro County Child Advocacy Center",
    category: "youth_services",
    description: "Dedicated to ending child abuse and neglect through advocacy, support services, and protection for children who are victims of violence. Operates CASA volunteer program.",
    address: "120 E. 2nd Avenue, Corsicana, TX 75110",
    phone: "(903) 872-3772",
    email: "admin@casanav.org",
    website: "https://www.cacnav.org/",
    hours: "Contact for hours",
    eligibility: "Children who are victims of abuse or neglect",
    services: ["Child advocacy", "CASA volunteers", "Abuse investigation support", "Family support"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },
  {
    name: "Boys & Girls Club of Corsicana",
    category: "youth_services",
    description: "Provides after-school and summer programs for youth, offering a safe place to learn, grow, and have fun.",
    address: "1000 Jackson Ave, Corsicana, TX",
    phone: null,
    email: null,
    website: null,
    hours: "After school and summer hours",
    eligibility: "Youth in Corsicana area",
    services: ["After-school programs", "Summer programs", "Youth development"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === JOB ASSISTANCE ===
  {
    name: "Corsicana Workforce Center",
    category: "job_assistance",
    description: "Workforce Solutions for North Central Texas providing job search assistance, training programs, and employment resources.",
    address: "Corsicana, TX",
    phone: "(903) 874-8276",
    email: "corsicanaworkforce@dfwjobs.com",
    website: "https://www.dfwjobs.com/find-a-workforce-center/corsicana-workforce-center",
    hours: "Contact for hours",
    eligibility: "Job seekers in Navarro County",
    services: ["Job search assistance", "Resume help", "Training programs", "Employment resources"],
    town: "Corsicana",
    town_id: corsicanaTownId,
    status: "active"
  },

  // === CLOTHING ASSISTANCE ===
  {
    name: "Compassion Corsicana Resource Center",
    category: "clothing",
    description: "Provides school uniforms (new and gently used) for children in need. Part of Compassion Corsicana's community assistance programs.",
    address: "111 E. 1st Avenue, Corsicana, TX 75110",
    phone: "(903) 874-4971",
    email: null,
    website: "https://www.compassioncorsicana.org/programs",
    hours: "Tue-Thu: 9:00 AM - 2:00 PM",
    eligibility: "Families in need of school uniforms",
    services: ["School uniforms", "Clothing assistance"],
    town: "Corsicana",
    town_id: corsicanaTownId,
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
  console.log(`[ADDED] ${resource.name} (${resource.category})`);
  added++;
}

console.log(`\nDone! Added ${added} community resources, skipped ${skipped} (already existed).`);

db.close();
