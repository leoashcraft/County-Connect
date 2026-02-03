/**
 * Navarro County Restaurants Seed - Part 2
 * Additional restaurants found in comprehensive search
 * Run with: node src/seeds/navarro-county-restaurants-seed-2.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

function insertRestaurant(data) {
  const id = uuidv4();
  const now = new Date().toISOString();

  const existing = db.prepare(`
    SELECT id FROM entities WHERE entity_type = 'Restaurant' AND json_extract(data, '$.name') = ?
  `).get(data.name);

  if (existing) {
    console.log(`  [SKIP] ${data.name}`);
    return null;
  }

  const stmt = db.prepare(`
    INSERT INTO entities (id, entity_type, data, created_date, updated_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  const restaurantData = {
    ...data,
    id,
    created_date: now,
    status: data.status || 'active',
    business_status: data.business_status || 'open'
  };

  stmt.run(id, 'Restaurant', JSON.stringify(restaurantData), now, now);
  console.log(`  [ADD] ${data.name}`);
  return id;
}

const restaurants = [
  // === ADDITIONAL AMERICAN / CASUAL DINING ===
  {
    name: "Applebee's Grill & Bar",
    address: "1901 S IH 45, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-7630",
    cuisine_types: ["american", "bar_grill"],
    serves_alcohol: "full_bar",
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    curbside_pickup: true,
    dine_in: true,
    family_friendly: true,
    high_chairs_available: true,
    accepts_credit_cards: true,
    lat: 32.0756,
    lng: -96.4534
  },
  {
    name: "Denny's",
    address: "2801 US 287, Corsicana, TX 75109",
    town: "Corsicana",
    phone: "(903) 874-8920",
    cuisine_types: ["american", "breakfast", "diner"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    high_chairs_available: true,
    accepts_credit_cards: true,
    lat: 32.0645,
    lng: -96.4298
  },
  {
    name: "Uniquely Yours Tea Room",
    address: "625 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-2723",
    cuisine_types: ["american", "cafe", "tea_room"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    accepts_reservations: true,
    family_friendly: true,
    private_dining: true,
    accepts_credit_cards: true,
    lat: 32.1001,
    lng: -96.4683
  },

  // === ADDITIONAL ASIAN RESTAURANTS ===
  {
    name: "China One",
    address: "3201 W 7th Ave, Ste 105, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-3888",
    cuisine_types: ["chinese", "asian"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0889,
    lng: -96.5012
  },
  {
    name: "Classic Wok Chinese Cafe",
    address: "1737 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-0433",
    cuisine_types: ["chinese", "asian"],
    description: "Authentic Chinese cuisine in a classy, quiet atmosphere. Customers say it's the best Asian food in the area.",
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0891,
    lng: -96.4867
  },
  {
    name: "Summer Palace",
    address: "2110 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-5061",
    cuisine_types: ["chinese", "asian"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0890,
    lng: -96.4912
  },

  // === ADDITIONAL MEXICAN RESTAURANTS ===
  {
    name: "Birrieria Aguinaga",
    address: "1739 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 257-3630",
    cuisine_types: ["mexican", "birria"],
    description: "Family-run gem with authentic Mexican cuisine prepared with love and fresh ingredients.",
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0891,
    lng: -96.4869
  },
  {
    name: "Cocina Azteca",
    address: "122 W 3rd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(430) 236-7816",
    cuisine_types: ["mexican"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0967,
    lng: -96.4701
  },
  {
    name: "El Mexicano Grill",
    address: "1427 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-8989",
    cuisine_types: ["mexican", "tex_mex"],
    serves_alcohol: "full_bar",
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0892,
    lng: -96.4815
  },
  {
    name: "Juliette's Taqueria",
    address: "1921 N 45th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-4328",
    cuisine_types: ["mexican", "tacos"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.1089,
    lng: -96.4534
  },
  {
    name: "La Cabana Restaurant",
    address: "809 N 24th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 602-5196",
    cuisine_types: ["mexican"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.1012,
    lng: -96.4923
  },
  {
    name: "Taco Bell",
    address: "2937 S HWY 287, Corsicana, TX 75109",
    town: "Corsicana",
    phone: "(903) 872-9800",
    cuisine_types: ["fast_food", "mexican"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0612,
    lng: -96.4267
  },
  {
    name: "Taco Shop",
    address: "1119 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-3440",
    cuisine_types: ["mexican", "tacos"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0894,
    lng: -96.4789
  },
  {
    name: "Taco Station Food Truck",
    address: "222 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 467-9804",
    cuisine_types: ["mexican", "tacos", "food_truck"],
    serves_alcohol: null,
    wheelchair_accessible: false,
    outdoor_seating: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: false,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0956,
    lng: -96.4723
  },
  {
    name: "Los Agaves Mexican Grill & Bar",
    address: "1500 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-0035",
    cuisine_types: ["mexican", "tex_mex"],
    description: "Offers enchiladas, burritos, steaks, tacos, menudo, fajitas and much more.",
    serves_alcohol: "full_bar",
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0891,
    lng: -96.4831
  },
  {
    name: "Taqueria Las Comadres",
    address: "1200 W 2nd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-1234",
    cuisine_types: ["mexican", "tacos"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0978,
    lng: -96.4801
  },

  // === COFFEE SHOPS & BAKERIES ===
  {
    name: "C&S Baking Co.",
    address: "215 E 5th Ave Suite G, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(214) 454-5964",
    cuisine_types: ["bakery", "cafe"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0941,
    lng: -96.4668
  },
  {
    name: "Dutch Bros Coffee",
    address: "3840 State Hwy 31 W Business, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(541) 955-4700",
    cuisine_types: ["coffee", "drinks"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: false,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0823,
    lng: -96.5134
  },
  {
    name: "Mita's Coffee House",
    address: "216 N Beaton St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 602-5080",
    cuisine_types: ["coffee", "cafe"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: true,
    free_wifi: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0965,
    lng: -96.4686
  },
  {
    name: "Starbucks",
    address: "2004 S Hwy 287, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(430) 236-6074",
    cuisine_types: ["coffee", "cafe"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    restroom_accessible: true,
    outdoor_seating: true,
    drive_thru: true,
    free_wifi: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0734,
    lng: -96.4578
  },
  {
    name: "Navarro College Starbucks",
    address: "3205 W 2nd Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-8088",
    cuisine_types: ["coffee", "cafe"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    free_wifi: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0945,
    lng: -96.5023
  },
  {
    name: "Timbers",
    address: "210 E 5th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 503-0363",
    cuisine_types: ["coffee", "cafe", "breakfast"],
    description: "Cozy, rustic space in historic downtown with homemade bagels, soups, sandwiches, baked goods, and coffee.",
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    free_wifi: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0942,
    lng: -96.4669
  },
  {
    name: "XOXO Boba",
    address: "111 N Main St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: null,
    cuisine_types: ["boba", "drinks", "asian"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0956,
    lng: -96.4689
  },

  // === BBQ & STEAKHOUSE ===
  {
    name: "Corsicana Steakhouse at the Opry",
    address: "3830 State Hwy 31 W, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 326-8255",
    cuisine_types: ["steakhouse", "american"],
    description: "Located at the Corsicana Opry with Eastern European and Armenian influences.",
    serves_alcohol: "full_bar",
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    accepts_reservations: true,
    family_friendly: true,
    live_music: true,
    private_dining: true,
    accepts_credit_cards: true,
    lat: 32.0823,
    lng: -96.5123
  },
  {
    name: "Tucker Town BBQ",
    address: "4095 US-287, Corsicana, TX 75109",
    town: "Corsicana",
    phone: "(903) 851-3012",
    cuisine_types: ["bbq", "american"],
    serves_alcohol: "beer_wine",
    wheelchair_accessible: true,
    outdoor_seating: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0512,
    lng: -96.4123
  },

  // === PIZZA ===
  {
    name: "Domino's Pizza",
    address: "200 N 15th St, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-1111",
    cuisine_types: ["pizza"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: false,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0967,
    lng: -96.4812
  },
  {
    name: "Little Caesars Pizza",
    address: "840 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-4800",
    cuisine_types: ["pizza", "fast_food"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: false,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0948,
    lng: -96.4781
  },

  // === ADDITIONAL FAST FOOD ===
  {
    name: "Dairy Queen",
    address: "1712 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-3377",
    cuisine_types: ["fast_food", "ice_cream", "burgers"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0891,
    lng: -96.4859
  },
  {
    name: "Arby's",
    address: "3600 W State Hwy 31, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-0122",
    cuisine_types: ["fast_food", "sandwiches"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0812,
    lng: -96.5089
  },
  {
    name: "Jack in the Box",
    address: "1800 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-5505",
    cuisine_types: ["fast_food", "burgers"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0891,
    lng: -96.4867
  },
  {
    name: "Captain D's",
    address: "1404 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-8400",
    cuisine_types: ["fast_food", "seafood"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0892,
    lng: -96.4813
  },
  {
    name: "Braum's Ice Cream & Dairy Store",
    address: "714 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-0700",
    cuisine_types: ["fast_food", "ice_cream", "burgers"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0949,
    lng: -96.4768
  },
  {
    name: "Church's Texas Chicken",
    address: "916 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-2566",
    cuisine_types: ["fast_food", "chicken"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0946,
    lng: -96.4785
  },
  {
    name: "Long John Silver's",
    address: "1600 W 7th Ave, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 874-4355",
    cuisine_types: ["fast_food", "seafood"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0891,
    lng: -96.4843
  },
  {
    name: "Wingstop",
    address: "3501 Corsicana Crossing Blvd, Corsicana, TX 75109",
    town: "Corsicana",
    phone: "(903) 872-9464",
    cuisine_types: ["fast_food", "wings", "chicken"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0723,
    lng: -96.4234
  },
  {
    name: "Zaxby's",
    address: "2000 S I-45, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-8282",
    cuisine_types: ["fast_food", "chicken"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.1001,
    lng: -96.4519
  },
  {
    name: "Raising Cane's Chicken Fingers",
    address: "3410 W State Hwy 31, Corsicana, TX 75110",
    town: "Corsicana",
    phone: "(903) 872-1010",
    cuisine_types: ["fast_food", "chicken"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0823,
    lng: -96.5067
  },
  {
    name: "Slim Chickens",
    address: "3505 Corsicana Crossing Blvd, Corsicana, TX 75109",
    town: "Corsicana",
    phone: "(903) 229-0044",
    cuisine_types: ["fast_food", "chicken"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: true,
    drive_thru: true,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0723,
    lng: -96.4230
  },
  {
    name: "Cracker Barrel Old Country Store",
    address: "3510 Corsicana Crossing Blvd, Corsicana, TX 75109",
    town: "Corsicana",
    phone: "(903) 872-0230",
    cuisine_types: ["american", "southern", "breakfast"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    restroom_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    high_chairs_available: true,
    accepts_credit_cards: true,
    lat: 32.0723,
    lng: -96.4225
  },

  // === CONVENIENCE STORES WITH FOOD ===
  {
    name: "Buc-ee's",
    address: "2595 S I-45, Corsicana, TX 75109",
    town: "Corsicana",
    phone: "(979) 238-6390",
    cuisine_types: ["convenience", "bbq", "snacks"],
    description: "Famous Texas travel center with BBQ, jerky, fudge, and more.",
    serves_alcohol: "beer_wine",
    wheelchair_accessible: true,
    restroom_accessible: true,
    outdoor_seating: true,
    drive_thru: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: false,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0723,
    lng: -96.4456
  },

  // === SMALLER TOWNS ===
  {
    name: "Sonic Drive-In Kerens",
    address: "100 S Main St, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2311",
    cuisine_types: ["fast_food", "american"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: true,
    drive_thru: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: false,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.1301,
    lng: -96.2267
  },
  {
    name: "DQ Grill & Chill Kerens",
    address: "201 N Main St, Kerens, TX 75144",
    town: "Kerens",
    phone: "(903) 396-2523",
    cuisine_types: ["fast_food", "ice_cream", "burgers"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    drive_thru: true,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.1323,
    lng: -96.2278
  },
  {
    name: "Pizza House Rice",
    address: "105 Main St, Rice, TX 75155",
    town: "Rice",
    phone: "(903) 326-4455",
    cuisine_types: ["pizza", "italian"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: true,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.2445,
    lng: -96.5028
  },
  {
    name: "Subway Blooming Grove",
    address: "601 E Grady St, Blooming Grove, TX 76626",
    town: "Blooming Grove",
    phone: "(903) 695-2778",
    cuisine_types: ["fast_food", "sandwiches"],
    serves_alcohol: null,
    wheelchair_accessible: true,
    outdoor_seating: false,
    delivery_available: false,
    takeout_available: true,
    dine_in: true,
    family_friendly: true,
    accepts_credit_cards: true,
    lat: 32.0889,
    lng: -96.7134
  }
];

function seed() {
  console.log("Starting Navarro County restaurant seed (Part 2)...\n");
  console.log("=== Adding More Restaurants ===");

  let added = 0;
  let skipped = 0;

  restaurants.forEach(restaurant => {
    const result = insertRestaurant(restaurant);
    if (result) {
      added++;
    } else {
      skipped++;
    }
  });

  console.log(`\n=== Seed Complete ===`);
  console.log(`Added: ${added} restaurants`);
  console.log(`Skipped: ${skipped} (already exist)`);

  // Count total restaurants
  const total = db.prepare(`SELECT COUNT(*) as count FROM entities WHERE entity_type = 'Restaurant'`).get();
  console.log(`Total restaurants in database: ${total.count}`);
}

seed();
db.close();
