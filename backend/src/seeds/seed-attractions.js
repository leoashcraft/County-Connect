/**
 * Comprehensive Navarro County Attractions Seed Script
 * Includes: Parks, Lakes, Trails, Historic Sites, Texas Historical Markers,
 * Museums, Landmarks, Golf Courses, Public Docks, Recreation Areas, and more
 *
 * Run with: node src/seeds/seed-attractions.js
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

const attractions = [
  // ===========================
  // LAKES & WATERWAYS
  // ===========================
  {
    name: "Navarro Mills Lake",
    category: "lake",
    description: "A 5,070-acre U.S. Army Corps of Engineers reservoir offering excellent fishing, camping, swimming, and boating. The lake features multiple recreation areas with boat ramps, picnic facilities, and campgrounds.",
    address: "FM 667",
    town: "Purdon",
    lat: 31.9467,
    lng: -96.6950,
    is_free: true,
    year_established: 1963,
    history: "Navarro Mills Lake was created by the damming of Richland Creek by the U.S. Army Corps of Engineers in 1963 for flood control and water supply. Named after the nearby community of Navarro Mills, the lake has become a popular recreation destination for fishing, camping, and water sports.",
    hours: "Day use areas: 6 AM - 10 PM\nCampgrounds: 24 hours for registered campers",
    additional_info: "Popular fish species include largemouth bass, channel catfish, white bass, and crappie. The lake has 8 recreation areas managed by the Corps of Engineers."
  },
  {
    name: "Richland-Chambers Reservoir",
    category: "lake",
    description: "One of the largest lakes in Texas at 44,752 acres, known for world-class fishing, particularly for largemouth bass and catfish. The reservoir spans Navarro and Freestone counties.",
    address: "FM 1394",
    town: "Kerens",
    lat: 32.0375,
    lng: -96.2500,
    is_free: true,
    year_established: 1987,
    history: "Richland-Chambers Reservoir was completed in 1987 by the Tarrant Regional Water District. It is one of the largest reservoirs in Texas and serves as a major water supply source for the Dallas-Fort Worth metroplex while providing exceptional recreational opportunities.",
    hours: "Open 24 hours",
    additional_info: "The lake holds the Texas state record for blue catfish (121.5 lbs). Multiple marinas and boat ramps available. Fishing licenses required."
  },
  {
    name: "Lake Halbert",
    category: "lake",
    description: "A scenic 650-acre municipal lake in Corsicana featuring fishing, boating, swimming beach, picnic areas, and the beautiful Lake Halbert Park. A peaceful retreat for outdoor recreation.",
    address: "2300 Lake Park Dr",
    town: "Corsicana",
    lat: 32.0728,
    lng: -96.4958,
    is_free: true,
    year_established: 1921,
    history: "Lake Halbert was created in 1921 as a municipal water supply reservoir for Corsicana. Over the decades, it has evolved into one of the city's premier recreation destinations with parks, trails, and water activities.",
    hours: "Park: 6 AM - 10 PM",
    additional_info: "Features swimming beach, boat ramps, fishing piers, and picnic pavilions. No gasoline-powered boats allowed."
  },

  // ===========================
  // PUBLIC DOCKS & BOAT RAMPS
  // ===========================
  {
    name: "Navarro Mills Lake - Wolf Creek Park",
    category: "recreation",
    description: "Corps of Engineers recreation area with boat ramp, fishing pier, swimming beach, picnic areas, and campground with electrical hookups.",
    address: "Wolf Creek Park Road",
    town: "Purdon",
    lat: 31.9589,
    lng: -96.7089,
    is_free: false,
    admission_info: "Day use: $4/vehicle\nCamping: $12-24/night",
    hours: "6 AM - 10 PM (Day use)\n24 hours (Camping)",
    additional_info: "50 campsites with electrical hookups, restrooms, showers, dump station"
  },
  {
    name: "Navarro Mills Lake - Oak Park",
    category: "recreation",
    description: "Recreation area featuring a boat ramp, picnic facilities, and scenic lake access. Popular spot for fishing and picnicking.",
    address: "Oak Park Road off FM 667",
    town: "Purdon",
    lat: 31.9350,
    lng: -96.6850,
    is_free: false,
    admission_info: "Day use: $4/vehicle",
    hours: "6 AM - 10 PM"
  },
  {
    name: "Navarro Mills Lake - Pecan Point",
    category: "recreation",
    description: "Primitive camping and boat launch area on Navarro Mills Lake. Offers a quieter, more secluded lake experience.",
    address: "Pecan Point Road",
    town: "Purdon",
    lat: 31.9400,
    lng: -96.6700,
    is_free: false,
    admission_info: "Day use: $4/vehicle",
    hours: "6 AM - 10 PM"
  },
  {
    name: "Richland-Chambers Marina",
    category: "recreation",
    description: "Full-service marina on Richland-Chambers Reservoir offering boat slips, fuel, bait and tackle, boat rentals, and fishing guide services.",
    address: "9551 FM 1394",
    town: "Kerens",
    lat: 32.0280,
    lng: -96.2600,
    is_free: true,
    hours: "6 AM - 8 PM (Summer)\n7 AM - 6 PM (Winter)",
    phone: "(903) 654-3325",
    additional_info: "Boat rentals available. Fishing licenses and tackle sold on site."
  },
  {
    name: "Lake Halbert Boat Ramp",
    category: "recreation",
    description: "Public boat launch facility on Lake Halbert with parking area. Electric and trolling motors only.",
    address: "Lake Park Drive",
    town: "Corsicana",
    lat: 32.0735,
    lng: -96.4950,
    is_free: true,
    hours: "6 AM - 10 PM",
    additional_info: "No gasoline-powered motors. Electric and paddle boats welcome."
  },

  // ===========================
  // PARKS & NATURE AREAS
  // ===========================
  {
    name: "Lake Halbert Park",
    category: "park",
    description: "Beautiful 500-acre city park surrounding Lake Halbert featuring hiking trails, picnic areas, playgrounds, swimming beach, fishing piers, and scenic lake views.",
    address: "2300 Lake Park Dr",
    town: "Corsicana",
    lat: 32.0728,
    lng: -96.4958,
    is_free: true,
    hours: "6 AM - 10 PM",
    additional_info: "Pavilion rentals available. Popular for walking, jogging, and family picnics."
  },
  {
    name: "Jester Park",
    category: "park",
    description: "Popular community park with large playground, walking trails, sports fields, picnic pavilions, splash pad, antique tractor display, and seasonal swimming pool.",
    address: "2121 W 7th Ave",
    town: "Corsicana",
    lat: 32.0890,
    lng: -96.4825,
    is_free: true,
    hours: "6 AM - 10 PM",
    additional_info: "Splash pad open seasonally. Pavilion rentals available. Basketball courts on-site."
  },
  {
    name: "Community Park",
    category: "park",
    description: "Large multi-use park featuring sports fields, tennis courts, basketball courts, playground, and walking paths.",
    address: "1200 N 24th St",
    town: "Corsicana",
    lat: 32.1050,
    lng: -96.4550,
    is_free: true,
    hours: "6 AM - 10 PM"
  },
  {
    name: "Bunert Park",
    category: "park",
    description: "Neighborhood park with playground equipment, picnic areas, and open green space for family activities.",
    address: "500 N Main St",
    town: "Corsicana",
    lat: 32.0960,
    lng: -96.4678,
    is_free: true,
    hours: "6 AM - 10 PM"
  },
  {
    name: "I.O.O.F. Park",
    category: "park",
    description: "Historic park maintained by the Independent Order of Odd Fellows, featuring mature trees, picnic areas, and a peaceful setting.",
    address: "S Beaton St",
    town: "Corsicana",
    lat: 32.0850,
    lng: -96.4680,
    is_free: true,
    hours: "Dawn to dusk"
  },
  {
    name: "Northside Park",
    category: "park",
    description: "Community park in north Corsicana with playground, basketball court, and open space.",
    address: "N 15th St",
    town: "Corsicana",
    lat: 32.1100,
    lng: -96.4600,
    is_free: true,
    hours: "6 AM - 10 PM"
  },
  {
    name: "Lions Park",
    category: "park",
    description: "Neighborhood park sponsored by Lions Club International featuring playground and picnic facilities.",
    address: "W Park Ave",
    town: "Corsicana",
    lat: 32.0920,
    lng: -96.4750,
    is_free: true,
    hours: "6 AM - 10 PM"
  },
  {
    name: "Downtown Pocket Park",
    category: "park",
    description: "Cozy urban oasis in historic downtown Corsicana featuring colorful murals, water features, seasonal flowers, picnic tables, shaded seating, and restroom facilities. Available for event rentals.",
    address: "Beaton St",
    town: "Corsicana",
    lat: 32.0923,
    lng: -96.4673,
    is_free: true,
    hours: "Dawn to dusk",
    additional_info: "Perfect for downtown lunch breaks or small gatherings. Event rental available."
  },

  // ===========================
  // TRAILS
  // ===========================
  {
    name: "Lake Halbert Trail",
    category: "recreation",
    description: "Scenic 3-mile paved walking and biking trail circling portions of Lake Halbert, offering beautiful lake views and nature observation opportunities.",
    address: "Lake Park Drive",
    town: "Corsicana",
    lat: 32.0730,
    lng: -96.4960,
    is_free: true,
    hours: "6 AM - 10 PM",
    additional_info: "Paved surface suitable for walking, jogging, and cycling. Benches along the trail."
  },
  {
    name: "Jester Park Walking Trail",
    category: "recreation",
    description: "1.5-mile paved walking trail through Jester Park with exercise stations, perfect for morning walks and jogging.",
    address: "2121 W 7th Ave",
    town: "Corsicana",
    lat: 32.0892,
    lng: -96.4820,
    is_free: true,
    hours: "6 AM - 10 PM"
  },

  // ===========================
  // GOLF COURSES
  // ===========================
  {
    name: "Corsicana Country Club",
    category: "golf_course",
    description: "Historic private country club featuring an 18-hole championship golf course, pro shop, practice facilities, swimming pool, and fine dining.",
    address: "3500 Country Club Rd",
    town: "Corsicana",
    lat: 32.1150,
    lng: -96.4850,
    is_free: false,
    year_established: 1920,
    admission_info: "Private club - membership required\nGuest rates available with member sponsorship",
    hours: "Dawn to dusk (Golf)\nDining room hours vary",
    phone: "(903) 874-2811"
  },
  {
    name: "The Oaks Golf Course",
    category: "golf_course",
    description: "Historic par-36 public nine-hole golf course established in 1935. Features on-site restaurant Moontower at the Oaks with patio dining and live entertainment.",
    address: "2400 Country Club Rd",
    town: "Corsicana",
    lat: 32.1100,
    lng: -96.4800,
    is_free: false,
    year_established: 1935,
    admission_info: "9 holes: $15-20\n18 holes: $25-35\nCart rental available",
    hours: "7 AM - Dusk",
    phone: "(903) 872-1162"
  },

  // ===========================
  // MUSEUMS
  // ===========================
  {
    name: "Pearce Museum at Navarro College",
    category: "museum",
    description: "Outstanding museum featuring one of the finest collections of Western art and Civil War artifacts in Texas. Includes works by Frederic Remington and Charles Russell.",
    address: "3100 W Collin St",
    town: "Corsicana",
    lat: 32.0920,
    lng: -96.4980,
    is_free: false,
    year_established: 2003,
    admission_info: "Adults: $5\nSeniors/Students: $3\nChildren under 6: Free",
    hours: "Tuesday - Saturday: 10 AM - 4 PM\nClosed Sunday & Monday",
    phone: "(903) 875-7642",
    website: "https://www.navarrocollege.edu/pearce-museum/",
    history: "The Pearce Museum houses the remarkable collection assembled by Dr. Nathan E. Pearce, a Corsicana physician and art collector. The museum opened in 2003 on the Navarro College campus."
  },
  {
    name: "Pioneer Village",
    category: "museum",
    description: "Open-air museum preserving 19th-century Texas pioneer life with authentic log cabins, a one-room schoolhouse, blacksmith shop, military artifacts, and period exhibits. Also houses the Lefty Frizzell Museum.",
    address: "912 W Park Ave",
    town: "Corsicana",
    lat: 32.0922,
    lng: -96.4725,
    is_free: false,
    year_established: 1976,
    admission_info: "Adults: $5\nStudents: $3\nGroup rates available",
    hours: "Monday - Friday: 9 AM - 5 PM\nWeekends by appointment",
    phone: "(903) 654-4846",
    history: "Established in 1976 by the Navarro County Historical Society, Pioneer Village preserves authentic structures from the county's early settlement period, relocated and restored to create a living history experience."
  },
  {
    name: "Lefty Frizzell Country Music Museum",
    category: "museum",
    description: "Museum honoring Corsicana native Lefty Frizzell, a Country Music Hall of Fame legend who influenced generations of country artists including Merle Haggard and George Jones.",
    address: "912 W Park Ave",
    town: "Corsicana",
    lat: 32.0922,
    lng: -96.4725,
    is_free: true,
    year_established: 2009,
    hours: "By appointment or during Pioneer Village hours",
    phone: "(903) 654-4846",
    history: "William Orville 'Lefty' Frizzell was born in Corsicana in 1928 and became one of the most influential country music singers of the 20th century. He was inducted into the Country Music Hall of Fame in 1982."
  },
  {
    name: "Navarro County Historical Museum",
    category: "museum",
    description: "County museum featuring exhibits on local history including the oil boom, early settlers, Native American artifacts, and Navarro County's role in Texas history.",
    address: "113 E 3rd Ave",
    town: "Corsicana",
    lat: 32.0905,
    lng: -96.4650,
    is_free: false,
    admission_info: "Adults: $3\nStudents: $1",
    hours: "Tuesday - Saturday: 10 AM - 4 PM",
    phone: "(903) 654-4860"
  },

  // ===========================
  // HISTORIC SITES & LANDMARKS
  // ===========================
  {
    name: "Navarro County Courthouse",
    category: "landmark",
    description: "Magnificent 1905 Beaux-Arts courthouse listed on the National Register of Historic Places. One of the finest examples of classical revival architecture in Texas.",
    address: "300 W 3rd Ave",
    town: "Corsicana",
    lat: 32.0910,
    lng: -96.4695,
    is_free: true,
    year_established: 1905,
    history: "The current courthouse was designed by architect J. Riely Gordon and completed in 1905. It replaced an earlier 1881 structure and represents the prosperity brought by the oil boom. The building features a distinctive copper dome and ornate limestone facade."
  },
  {
    name: "Temple Beth-El",
    category: "architecture",
    description: "Historic 1900 synagogue, one of the oldest Jewish congregations in continuous operation in Texas. Beautiful Romanesque Revival architecture with stunning stained glass windows.",
    address: "208 S 15th St",
    town: "Corsicana",
    lat: 32.0875,
    lng: -96.4620,
    is_free: true,
    year_established: 1898,
    hours: "Tours by appointment",
    phone: "(903) 872-7408",
    history: "Temple Beth-El was established in 1898 by Jewish merchants who came to Corsicana during the cotton and oil boom years. The current sanctuary was built in 1900 and features magnificent stained glass windows imported from Germany."
  },
  {
    name: "Collin Street Bakery",
    category: "landmark",
    description: "World-famous bakery established in 1896, known globally for their Original DeLuxe Fruitcake shipped to over 190 countries. A Corsicana institution and must-visit destination.",
    address: "401 W 7th Ave",
    town: "Corsicana",
    lat: 32.0925,
    lng: -96.4720,
    is_free: true,
    year_established: 1896,
    hours: "Monday - Saturday: 7 AM - 7 PM\nSunday: 8 AM - 6 PM",
    phone: "(903) 872-8111",
    website: "https://www.collinstreetbakery.com",
    history: "Founded in 1896 by Gus Weidmann, a German immigrant baker. Tom McElwee developed the Original DeLuxe Fruitcake recipe in 1906. The bakery ships millions of fruitcakes worldwide annually and has been featured in countless publications."
  },
  {
    name: "Petroleum Park",
    category: "landmark",
    description: "Historic park commemorating the 1894 discovery of the first commercial oil well in Texas west of the Mississippi River. Features authentic oil field equipment, a historic oil derrick, 1951 Cooper Double Drum Pulling Unit, 1923 wooden jail, and historical markers.",
    address: "12th St & W Park Ave",
    town: "Corsicana",
    lat: 32.0940,
    lng: -96.4750,
    is_free: true,
    year_established: 1894,
    history: "On June 9, 1894, workers drilling a water well for the city of Corsicana struck oil at 1,030 feet. This accidental discovery led to the first commercial oil field in Texas west of the Mississippi and transformed Corsicana into a boomtown.",
    additional_info: "The discovery predates Spindletop by 7 years and marks the beginning of Texas's oil industry."
  },
  {
    name: "Carriage District Historic Homes",
    category: "architecture",
    description: "Historic residential district featuring beautifully preserved Victorian and early 20th-century homes built during Corsicana's oil boom prosperity.",
    address: "W 4th Ave to W 7th Ave",
    town: "Corsicana",
    lat: 32.0915,
    lng: -96.4700,
    is_free: true,
    history: "The Carriage District developed during the oil boom era (1894-1920) when wealthy oil barons and merchants built elaborate homes. Many homes feature Victorian, Colonial Revival, and Craftsman architecture."
  },

  // ===========================
  // ENTERTAINMENT VENUES
  // ===========================
  {
    name: "Cook Education Center Planetarium",
    category: "entertainment",
    description: "State-of-the-art planetarium at Navarro College offering immersive astronomy shows, laser light shows, and educational programs about the cosmos.",
    address: "3100 W Collin St",
    town: "Corsicana",
    lat: 32.0918,
    lng: -96.4985,
    is_free: false,
    admission_info: "Public shows: $4\nSchool groups: $3 per student",
    hours: "Shows: Thursday evenings and Saturday afternoons\nCall for schedule",
    phone: "(903) 875-7575",
    website: "https://www.navarrocollege.edu/planetarium/",
    additional_info: "Features a 40-foot dome with digital projection system. Public shows, school field trips, and special events available."
  },
  {
    name: "Palace Theatre",
    category: "entertainment",
    description: "Beautifully restored 1921 historic theater hosting live performances, concerts, classic films, and community events. A cultural centerpiece of downtown Corsicana.",
    address: "112 W 6th Ave",
    town: "Corsicana",
    lat: 32.0928,
    lng: -96.4672,
    is_free: false,
    year_established: 1921,
    hours: "Box office: 10 AM - 5 PM weekdays\nPerformance times vary",
    phone: "(903) 874-7792",
    history: "The Palace Theatre opened in 1921 as a vaudeville and movie palace during Corsicana's oil boom era. After years of decline, it was restored and reopened as a performing arts venue in 2008."
  },
  {
    name: "Warehouse Living Arts Center",
    category: "entertainment",
    description: "Community performing arts center in a converted warehouse space, hosting theater productions, concerts, art exhibits, and creative workshops.",
    address: "119 W 6th Ave",
    town: "Corsicana",
    lat: 32.0930,
    lng: -96.4678,
    is_free: false,
    hours: "Event schedule varies",
    phone: "(903) 872-5421"
  },
  {
    name: "Schulman's Movie Bowl Grille",
    category: "entertainment",
    description: "Premier entertainment complex featuring luxury movie theaters, bowling lanes, arcade games, and The Grove outdoor amphitheater with yard games and pickleball courts.",
    address: "3501 Corsicana Crossing Blvd",
    town: "Corsicana",
    lat: 32.0780,
    lng: -96.4450,
    is_free: false,
    hours: "Sunday - Thursday: 11 AM - 10 PM\nFriday - Saturday: 11 AM - 11 PM",
    phone: "(903) 874-2695",
    admission_info: "Movie tickets: $9-12\nBowling: $5-7 per game\nArcade: Pay per play"
  },
  {
    name: "The Grove at Schulman's",
    category: "entertainment",
    description: "Outdoor entertainment area featuring an amphitheater for live music, yard games, pickleball courts, and The Back Porch event rental space.",
    address: "3501 Corsicana Crossing Blvd",
    town: "Corsicana",
    lat: 32.0782,
    lng: -96.4448,
    is_free: true,
    hours: "Varies by event",
    additional_info: "Hosts concerts, community events, and private parties. Check schedule for upcoming events."
  },

  // ===========================
  // CAMPGROUNDS
  // ===========================
  {
    name: "Lake Halbert RV Park & Campground",
    category: "recreation",
    description: "Scenic campground at Lake Halbert offering RV sites with full hookups, tent camping areas, and access to lake activities including fishing, kayaking, and hiking trails.",
    address: "2300 Lake Park Dr",
    town: "Corsicana",
    lat: 32.0725,
    lng: -96.4965,
    is_free: false,
    admission_info: "RV sites (full hookups): $25-35/night\nTent sites: $15-20/night\nWeekly and monthly rates available",
    hours: "Office: 8 AM - 6 PM\nCampground: 24 hours",
    phone: "(903) 654-4800",
    additional_info: "Restrooms, showers, boat ramp access, fishing pier, playground nearby."
  },
  {
    name: "Wolf Creek Park Campground",
    category: "recreation",
    description: "Corps of Engineers campground at Navarro Mills Lake with 50 campsites featuring electrical hookups, restrooms, showers, swimming beach, and boat ramp access.",
    address: "Wolf Creek Park Road",
    town: "Purdon",
    lat: 31.9590,
    lng: -96.7090,
    is_free: false,
    admission_info: "Tent sites: $12/night\nElectric sites: $18-24/night\nReservations recommended",
    hours: "Campground: 24 hours\nGate: 6 AM - 10 PM",
    phone: "(254) 578-1431",
    website: "https://www.recreation.gov",
    additional_info: "50 campsites, dump station, potable water, picnic tables, fire rings, swimming beach."
  },
  {
    name: "Liberty Hill Campground",
    category: "recreation",
    description: "Primitive and developed camping at Navarro Mills Lake with lakefront sites, boat ramp, and fishing access.",
    address: "Liberty Hill Park Rd off FM 667",
    town: "Purdon",
    lat: 31.9505,
    lng: -96.7010,
    is_free: false,
    admission_info: "Primitive sites: $10/night\nDeveloped sites: $18/night",
    hours: "6 AM - 10 PM (Gate)",
    additional_info: "Boat ramp, fishing pier, restrooms, picnic areas."
  },
  {
    name: "Oak Park Campground",
    category: "recreation",
    description: "Quiet campground at Navarro Mills Lake offering shaded sites near the water with fishing and boating access.",
    address: "Oak Park Road off FM 667",
    town: "Purdon",
    lat: 31.9355,
    lng: -96.6855,
    is_free: false,
    admission_info: "Primitive camping: $10/night",
    hours: "6 AM - 10 PM (Gate)"
  },
  {
    name: "Brushy Creek Campground",
    category: "recreation",
    description: "Family-friendly campground at Navarro Mills Lake with developed campsites, restrooms, and convenient lake access.",
    address: "Brushy Creek Park Rd",
    town: "Purdon",
    lat: 31.9605,
    lng: -96.6805,
    is_free: false,
    admission_info: "Tent sites: $12/night\nElectric sites: $18/night",
    hours: "6 AM - 10 PM (Gate)"
  },
  {
    name: "Indian Creek Campground",
    category: "recreation",
    description: "Secluded camping area on Navarro Mills Lake's southern shore, perfect for those seeking a quieter camping experience.",
    address: "Indian Creek Park Rd",
    town: "Dawson",
    lat: 31.9105,
    lng: -96.7055,
    is_free: false,
    admission_info: "Primitive camping: $10/night",
    hours: "6 AM - 10 PM (Gate)"
  },

  // ===========================
  // TEXAS HISTORICAL MARKERS
  // ===========================
  {
    name: "Navarro County Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Commission marker describing the history and formation of Navarro County, named for Jose Antonio Navarro, a signer of the Texas Declaration of Independence.",
    address: "Courthouse Square",
    town: "Corsicana",
    lat: 32.0908,
    lng: -96.4693,
    is_free: true,
    year_established: 1936,
    history: "Navarro County was created in 1846 and named for Jose Antonio Navarro (1795-1871), a Texas patriot, statesman, and the only native-born Texan to sign the Texas Declaration of Independence."
  },
  {
    name: "Corsicana Oil Field Historical Marker",
    category: "historic_marker",
    description: "Marker commemorating the discovery of the Corsicana Oil Field in 1894, the first major commercial oil field in Texas.",
    address: "W Park Ave & 12th St",
    town: "Corsicana",
    lat: 32.0940,
    lng: -96.4752,
    is_free: true,
    year_established: 1894,
    history: "The discovery well was drilled June 9, 1894. By 1897, the field had 287 producing wells. The Corsicana oil field established Texas as a petroleum producer and led directly to the development of the Texas oil industry."
  },
  {
    name: "Battle of Chambers Creek Historical Marker",
    category: "historic_marker",
    description: "Marker commemorating the May 1841 engagement between Republic of Texas forces and Comanche warriors along Chambers Creek.",
    address: "FM 1129 near Rice",
    town: "Rice",
    lat: 32.1650,
    lng: -96.4980,
    is_free: true,
    year_established: 1841,
    history: "In May 1841, a company of Texas Rangers under Captain John H. Moore engaged Comanche warriors who had been raiding settlements. The battle was part of the ongoing Texas-Indian Wars."
  },
  {
    name: "Dresden Historical Marker",
    category: "historic_marker",
    description: "Marker for the ghost town of Dresden, one of the earliest settlements in Navarro County, which was once a contender for county seat.",
    address: "FM 709",
    town: "Navarro",
    lat: 32.0200,
    lng: -96.5200,
    is_free: true,
    history: "Dresden was established in the 1840s and was one of the earliest communities in Navarro County. The town declined after being bypassed by the railroad in the 1870s."
  },
  {
    name: "Bazette Historical Marker",
    category: "historic_marker",
    description: "Marker for the community of Bazette, established in the 1850s as a farming community in eastern Navarro County.",
    address: "Bazette Rd",
    town: "Kerens",
    lat: 32.0850,
    lng: -96.2650,
    is_free: true,
    history: "Bazette was named for early settler John Bazette. The community was an important stop on the early road between Corsicana and Palestine."
  },
  {
    name: "Blooming Grove Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Marker describing the history of Blooming Grove, settled in the 1850s and known for its beautiful spring wildflowers.",
    address: "Main St & Highway 22",
    town: "Blooming Grove",
    lat: 32.0820,
    lng: -96.7150,
    is_free: true,
    history: "Blooming Grove was named for the profusion of wildflowers that bloomed in the area each spring. The town was established in the 1850s and grew as an agricultural center."
  },
  {
    name: "Frost Historical Marker",
    category: "historic_marker",
    description: "Historical marker for the town of Frost, established when the railroad came through in 1881.",
    address: "Main St",
    town: "Frost",
    lat: 32.0770,
    lng: -96.8080,
    is_free: true,
    year_established: 1881,
    history: "Frost was established in 1881 when the Missouri-Kansas-Texas Railroad built through the area. The town was named for postmaster Samuel Frost."
  },
  {
    name: "Kerens Historical Marker",
    category: "historic_marker",
    description: "Marker describing the founding of Kerens, named for Judge Richard Kerens of St. Louis who helped bring the railroad to the area.",
    address: "Main St",
    town: "Kerens",
    lat: 32.1320,
    lng: -96.2280,
    is_free: true,
    year_established: 1881,
    history: "Kerens was established in 1881 on the Texas & St. Louis Railway. Judge Richard C. Kerens of St. Louis was instrumental in routing the railroad through the area."
  },
  {
    name: "Dawson Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Marker for the town of Dawson in southwestern Navarro County, near the Navarro/Hill county line.",
    address: "FM 667",
    town: "Dawson",
    lat: 31.8890,
    lng: -96.7100,
    is_free: true,
    history: "Dawson was established in the 1880s and named for Nicholas Mosby Dawson, a Texas revolutionary hero who died at the Dawson Massacre in 1842."
  },
  {
    name: "Eureka Historical Marker",
    category: "historic_marker",
    description: "Marker for the community of Eureka, an early settlement that was once a thriving farming community.",
    address: "FM 709",
    town: "Corsicana",
    lat: 32.0500,
    lng: -96.5500,
    is_free: true,
    history: "Eureka was established in the 1860s and was named by settlers who exclaimed 'Eureka!' upon finding the fertile land."
  },
  {
    name: "Richland Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Marker for the town of Richland, established in eastern Navarro County.",
    address: "Highway 31",
    town: "Richland",
    lat: 31.9290,
    lng: -96.4250,
    is_free: true,
    history: "Richland was named for Richland Creek, which flows through the area. The community developed as an agricultural center in the late 1800s."
  },
  {
    name: "Purdon Historical Marker",
    category: "historic_marker",
    description: "Historical marker for Purdon, a small community near Navarro Mills Lake.",
    address: "FM 667",
    town: "Purdon",
    lat: 31.9400,
    lng: -96.6900,
    is_free: true,
    history: "Purdon was established in the late 1800s and named for an early settler. The town's economy was based on cotton farming and later benefited from proximity to Navarro Mills Lake."
  },
  {
    name: "Mildred Historical Marker",
    category: "historic_marker",
    description: "Historical marker for the community of Mildred in eastern Navarro County.",
    address: "FM 55",
    town: "Corsicana",
    lat: 32.0450,
    lng: -96.3500,
    is_free: true,
    history: "Mildred was established in the late 1800s and served as a rural community center with a school, church, and general store."
  },
  {
    name: "Angus Historical Marker",
    category: "historic_marker",
    description: "Marker for the community of Angus in northern Navarro County, named for early cattleman Angus McLeod.",
    address: "FM 1129",
    town: "Corsicana",
    lat: 32.1800,
    lng: -96.4500,
    is_free: true,
    history: "Angus was a rural community established in the late 1800s. It was named for Angus McLeod, a Scottish immigrant who raised cattle in the area."
  },
  {
    name: "Powell Historical Marker",
    category: "historic_marker",
    description: "Historical marker for the community of Powell in northern Navarro County.",
    address: "Highway 31",
    town: "Corsicana",
    lat: 32.1500,
    lng: -96.3500,
    is_free: true,
    history: "Powell was established in the 1870s and named for early settler John Powell. The community developed around cotton farming."
  },
  {
    name: "Goodlow Historical Marker",
    category: "historic_marker",
    description: "Marker commemorating the Goodlow community, one of the African American freedmen communities established after the Civil War.",
    address: "E Highway 31",
    town: "Corsicana",
    lat: 32.0900,
    lng: -96.4200,
    is_free: true,
    history: "Goodlow was established by freed African Americans after the Civil War. The community built its own school and church and remained a close-knit community for generations."
  },
  {
    name: "Barry Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Marker for the community of Barry in far western Navarro County.",
    address: "Highway 31 West",
    town: "Barry",
    lat: 32.0950,
    lng: -96.9200,
    is_free: true,
    history: "Barry is a small community in western Navarro County near the Hill County line. It developed as an agricultural community in the late 1800s."
  },
  {
    name: "Chatfield Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Marker for the community of Chatfield in southern Navarro County.",
    address: "FM 637",
    town: "Chatfield",
    lat: 31.9500,
    lng: -96.5500,
    is_free: true,
    history: "Chatfield was established in the 1870s and named for early settler James Chatfield. The community was an important stop on early roads through the county."
  },
  {
    name: "Retreat Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Marker commemorating the community of Retreat in Navarro County.",
    address: "FM 1126",
    town: "Corsicana",
    lat: 32.0100,
    lng: -96.5800,
    is_free: true,
    history: "Retreat was established in the 1870s and served as a rural community center for surrounding farms."
  },
  {
    name: "Emhouse Historical Marker",
    category: "historic_marker",
    description: "Texas Historical Marker for the town of Emhouse in southern Navarro County.",
    address: "FM 744",
    town: "Emhouse",
    lat: 31.9650,
    lng: -96.5650,
    is_free: true,
    history: "Emhouse was established in the late 1800s and named for local settlers. The community developed around cotton farming."
  },

  // ===========================
  // CULTURAL CENTERS
  // ===========================
  {
    name: "Corsicana Public Library",
    category: "cultural",
    description: "Historic Carnegie library building serving the Corsicana community since 1903. Offers extensive collections, programs, and community meeting spaces.",
    address: "100 N 12th St",
    town: "Corsicana",
    lat: 32.0915,
    lng: -96.4645,
    is_free: true,
    year_established: 1903,
    hours: "Monday - Thursday: 9 AM - 8 PM\nFriday: 9 AM - 6 PM\nSaturday: 9 AM - 5 PM",
    phone: "(903) 654-4810",
    history: "The library was built in 1903 with a $15,000 grant from Andrew Carnegie. It is one of the finest examples of Carnegie library architecture in Texas."
  },
  {
    name: "Navarro Council of the Arts",
    category: "cultural",
    description: "Arts organization promoting visual and performing arts in Navarro County through exhibitions, performances, and educational programs.",
    address: "120 W 5th Ave",
    town: "Corsicana",
    lat: 32.0922,
    lng: -96.4675,
    is_free: true,
    hours: "Tuesday - Saturday: 10 AM - 4 PM",
    phone: "(903) 872-5421",
    additional_info: "Features rotating art exhibitions, art classes, and community cultural events."
  },

  // ===========================
  // OTHER NOTABLE PLACES
  // ===========================
  {
    name: "Navarro College",
    category: "landmark",
    description: "Community college founded in 1946, offering associate degrees, workforce training, and cultural attractions including the Pearce Museum and Planetarium. Home of the Netflix series 'Cheer'.",
    address: "3200 W 7th Ave",
    town: "Corsicana",
    lat: 32.0915,
    lng: -96.4990,
    is_free: true,
    year_established: 1946,
    history: "Navarro College was established in 1946 as a junior college to serve Navarro County. It has grown to multiple campuses and is known for its championship cheerleading program featured in Netflix's 'Cheer'.",
    website: "https://www.navarrocollege.edu"
  },
  {
    name: "Downtown Corsicana Historic District",
    category: "historic_site",
    description: "Vibrant historic downtown featuring preserved early 20th-century commercial buildings, unique shops, restaurants, and cultural venues.",
    address: "Beaton St & 6th Ave",
    town: "Corsicana",
    lat: 32.0920,
    lng: -96.4670,
    is_free: true,
    history: "Downtown Corsicana flourished during the oil boom era (1894-1920). Many original buildings remain, now housing antique shops, restaurants, and businesses.",
    additional_info: "First Friday Art Walk held monthly. Many buildings on the National Register of Historic Places."
  },
  {
    name: "Beaton Street Historic District",
    category: "historic_site",
    description: "Historic downtown corridor featuring original brick streets, preserved commercial buildings from the oil boom era, bronze tributes, and unique local shops and restaurants.",
    address: "Beaton St between 3rd and 7th Ave",
    town: "Corsicana",
    lat: 32.0918,
    lng: -96.4675,
    is_free: true,
    history: "Beaton Street has been Corsicana's main commercial thoroughfare since the 1870s. The brick pavers and historic buildings reflect the city's prosperity during the cotton and oil boom eras."
  },
  {
    name: "Corsicana Cemetery",
    category: "historic_site",
    description: "Historic cemetery containing graves dating to the 1850s, including many prominent Navarro County pioneers and historical figures.",
    address: "501 N 20th St",
    town: "Corsicana",
    lat: 32.1000,
    lng: -96.4580,
    is_free: true,
    history: "Established in the 1850s, Corsicana Cemetery contains the graves of many early settlers, Civil War veterans, and prominent citizens who shaped Navarro County's history."
  },
  {
    name: "Hebrew Cemetery",
    category: "historic_site",
    description: "Historic Jewish cemetery established in the 1870s, reflecting the significant Jewish community that developed in Corsicana.",
    address: "N 15th St",
    town: "Corsicana",
    lat: 32.1050,
    lng: -96.4620,
    is_free: true,
    history: "The Hebrew Cemetery was established in the 1870s by Corsicana's Jewish community, which grew during the cotton and oil boom years and included many prominent merchants."
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

for (const attraction of attractions) {
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
  console.log(`[ADDED] ${attraction.name} (${attraction.category})`);
  added++;
}

console.log(`\n========================================`);
console.log(`Done! Added ${added} attractions, skipped ${skipped} (already existed).`);
console.log(`========================================`);

// Print summary by category
const categories = {};
for (const a of attractions) {
  categories[a.category] = (categories[a.category] || 0) + 1;
}

console.log('\nAttractions by category:');
Object.entries(categories)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

db.close();
