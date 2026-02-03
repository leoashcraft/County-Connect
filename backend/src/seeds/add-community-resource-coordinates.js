/**
 * Add geocoordinates to community resources with specific addresses
 * Run with: node src/seeds/add-community-resource-coordinates.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Coordinates for community resources with specific addresses
// These are approximate coordinates based on address lookups
const resourceCoordinates = [
  // Food pantries and assistance - Corsicana area
  { name: "Corsicana Daily Bread", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Community Pantry", lat: 32.0954, lng: -96.4689 },
  { name: "Salvation Army - Corsicana", lat: 32.0920, lng: -96.4699 },
  { name: "Good Samaritans of Corsicana", lat: 32.0954, lng: -96.4689 },
  { name: "Kerens Food Pantry", lat: 32.1311, lng: -96.2278 },
  { name: "St. Vincent de Paul Society", lat: 32.0954, lng: -96.4689 },
  { name: "Mission Corsicana", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Food Pantry - Compassion Corsicana", lat: 32.0954, lng: -96.4689 },
  { name: "The Salvation Army - Corsicana Food Pantry", lat: 32.0920, lng: -96.4699 },
  { name: "Hope to Go Food Pantry", lat: 32.0954, lng: -96.4689 },
  { name: "Frost Community Center Food Pantry", lat: 32.0789, lng: -96.8072 },
  { name: "Northside Baptist Church Care Center", lat: 32.1012, lng: -96.4567 },
  { name: "House of Bread", lat: 32.0954, lng: -96.4689 },
  { name: "Catholic Charities - Immaculate Conception", lat: 32.0954, lng: -96.4689 },

  // Crisis / Mental Health
  { name: "Navarro County Crisis Center", lat: 32.0954, lng: -96.4689 },
  { name: "MHMR of Navarro County", lat: 32.0954, lng: -96.4689 },
  { name: "North Texas Behavioral Health Authority (NTBHA)", lat: 32.0954, lng: -96.4689 },
  { name: "Homeward Bound Crisis Respite House", lat: 32.0954, lng: -96.4689 },
  { name: "Child & Family Guidance Center - Corsicana", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Victim Assistance", lat: 32.0954, lng: -96.4712 },
  { name: "Family Abuse Center", lat: 31.5493, lng: -97.1467 }, // Waco

  // Senior services
  { name: "Navarro County Senior Center", lat: 32.0954, lng: -96.4689 },
  { name: "Meals on Wheels - Navarro County", lat: 32.0954, lng: -96.4689 },
  { name: "Meals on Wheels - CSI Community Services", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Senior Citizens Services", lat: 32.0954, lng: -96.4689 },
  { name: "Kerens Care Center", lat: 32.1311, lng: -96.2278 },

  // Medical
  { name: "Dr. Kent E. Rogers Medical Clinic", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Public Health District", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Indigent Healthcare", lat: 32.0954, lng: -96.4689 },
  { name: "Care Net Pregnancy Center", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County ESD #1 (EMS)", lat: 32.1456, lng: -96.3234 },

  // Veterans
  { name: "Navarro County Veterans Service Office", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Veterans Services Office", lat: 32.0954, lng: -96.4689 },

  // Youth / Family
  { name: "Boys & Girls Club of Corsicana", lat: 32.0954, lng: -96.4689 },
  { name: "Navarro County Child Advocacy Center", lat: 32.0954, lng: -96.4689 },

  // Education
  { name: "Kerens Library", lat: 32.1311, lng: -96.2278 },
  { name: "Navarro College Adult Education & Literacy Program", lat: 32.0847, lng: -96.5123 },

  // Job assistance
  { name: "Texas Workforce Solutions - Corsicana", lat: 32.0954, lng: -96.4689 },
  { name: "Corsicana Workforce Center", lat: 32.0954, lng: -96.4689 },
  { name: "Compassion Corsicana Resource Center", lat: 32.0954, lng: -96.4689 },

  // Shelter / Housing
  { name: "House of Refuge - Compassion Corsicana", lat: 32.0954, lng: -96.4689 },
  { name: "The Salvation Army - Housing Assistance", lat: 32.0920, lng: -96.4699 },
  { name: "Corsicana Housing Authority", lat: 32.0954, lng: -96.4689 },
  { name: "Dawson Housing Authority", lat: 31.9017, lng: -96.7133 },

  // Clothing / Other assistance
  { name: "Community Clothes Closet", lat: 32.0954, lng: -96.4689 },
  { name: "Community Action Committee of Navarro County", lat: 32.0954, lng: -96.4689 },
  { name: "Comprehensive Energy Assistance Program (CEAP)", lat: 32.0954, lng: -96.4689 },
  { name: "Compassion Corsicana - Financial Assistance", lat: 32.0954, lng: -96.4689 },

  // Emergency Management
  { name: "Navarro County Office of Emergency Management", lat: 32.0897, lng: -96.4689 },

  // Volunteer Fire Departments
  { name: "Blooming Grove Volunteer Fire Department", lat: 32.0983, lng: -96.7131 },
  { name: "Kerens Volunteer Fire Department", lat: 32.1311, lng: -96.2278 },
  { name: "Rice Volunteer Fire Department", lat: 32.2367, lng: -96.5006 },
  { name: "Frost Volunteer Fire Department", lat: 32.0789, lng: -96.8072 },
  { name: "Dawson Volunteer Fire Department", lat: 31.9017, lng: -96.7133 },
  { name: "Mildred Volunteer Fire Department", lat: 32.0345, lng: -96.3712 },
  { name: "Barry Volunteer Fire Department", lat: 32.0983, lng: -96.6456 },
];

const updateStmt = db.prepare(`
  UPDATE entities
  SET data = json_set(json_set(data, '$.lat', ?), '$.lng', ?)
  WHERE entity_type = 'CommunityResource'
  AND json_extract(data, '$.name') = ?
`);

let updated = 0;
let notFound = 0;

for (const resource of resourceCoordinates) {
  const result = updateStmt.run(resource.lat, resource.lng, resource.name);
  if (result.changes > 0) {
    console.log(`[UPDATED] ${resource.name} - (${resource.lat}, ${resource.lng})`);
    updated++;
  } else {
    console.log(`[NOT FOUND] ${resource.name}`);
    notFound++;
  }
}

console.log(`\nDone! Updated ${updated} resources with coordinates, ${notFound} not found.`);

db.close();
