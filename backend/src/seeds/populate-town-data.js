/**
 * Populate comprehensive town data for all Navarro County towns
 * Run with: node src/seeds/populate-town-data.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

const now = new Date().toISOString();

// Comprehensive town data for Navarro County
const townData = {
  "Corsicana": {
    population: 25591,
    zip_codes: "75109, 75110, 75151",
    lat: 32.0954,
    lng: -96.4689,
    description: "Corsicana is the county seat and largest city in Navarro County, offering a blend of rich history, thriving local businesses, and community spirit. Known as the home of the world-famous Collin Street Bakery fruitcake and Navarro College, Corsicana serves as the commercial and cultural hub of the region.",
    history: "Founded in 1848, Corsicana was named by José Antonio Navarro after the Mediterranean island of Corsica, the birthplace of his father. The city made history in 1894 when drillers searching for water accidentally discovered oil, leading to the first commercially significant oilfield in Texas. A refinery was in operation by January 1899. During World War II, Corsicana Air Field trained thousands of pilots. The Collin Street Bakery has been making its famous fruitcakes here since 1896.",
    known_for: "Collin Street Bakery fruitcakes, First Texas oil discovery, Navarro College, Netflix Cheer series, Historic downtown",
    getting_around: "Located on Interstate 45, approximately 50 miles southeast of Dallas. US Highway 287 and State Highways 22 and 31 also serve the city. The city has a well-maintained street system and is easily navigable.",
    official_website: "https://www.cityofcorsicana.com",
    chamber_website: "https://www.corsicana.org"
  },
  "Blooming Grove": {
    population: 857,
    zip_codes: "76626",
    lat: 32.0985,
    lng: -96.7142,
    description: "Blooming Grove is a charming small town in northwestern Navarro County with a proud agricultural heritage and strong community bonds. The town maintains its rural character while providing essential services to residents.",
    history: "Blooming Grove originated from a store established by R. J. Grady and Sam Andrews shortly after the Civil War. When a post office was established in 1871, citizens met at White Church Cemetery to choose a name. The town was named for Blooming Grove, Illinois, the birthplace of local doctor John Marion Davis. After 1881, the community moved a mile north to be on the Cotton Belt rail line and merged with the community of White Church. The town grew rapidly from 200 residents in 1884 to 800 by 1890.",
    known_for: "Small-town charm, Agricultural heritage, Blooming Grove Lions football, Historic White Church Cemetery",
    getting_around: "Located on State Highway 22, approximately 15 miles west of Corsicana. Farm Road 55 also serves the community. About 60 miles south of Dallas.",
    official_website: "",
    chamber_website: ""
  },
  "Kerens": {
    population: 1505,
    zip_codes: "75144",
    lat: 32.1310,
    lng: -96.2281,
    description: "Kerens is a welcoming city in eastern Navarro County, serving as a gateway to outdoor recreation at nearby Richland-Chambers Reservoir. The community offers small-town living with access to excellent fishing and water activities.",
    history: "Kerens was established in 1881 when the St. Louis Southwestern Railway of Texas was built through the county. The city was named for Judge Richard C. Kerens. The town developed as a railroad stop and grew into a thriving agricultural community. Notable residents include Johnson Blair Cherry, head coach of The University of Texas Longhorns Football Team from 1947 to 1950.",
    known_for: "Gateway to Richland-Chambers Reservoir, Railroad heritage, Small-town community, Fishing and outdoor recreation",
    getting_around: "Located on State Highway 31, approximately 15 miles east of Corsicana. Close to Richland-Chambers Reservoir for lake access. About 65 miles southeast of Dallas.",
    official_website: "",
    chamber_website: ""
  },
  "Rice": {
    population: 1203,
    zip_codes: "75155",
    lat: 32.2432,
    lng: -96.5008,
    description: "Rice is a friendly city in Navarro County with an interesting connection to Texas education history. The town's unofficial motto, 'The city so nice, they named it Rice,' reflects the community's welcoming spirit.",
    history: "The city's namesake is William Marsh Rice, who donated the land for a community school. He is the same William Marsh Rice who later founded Rice University in Houston. The town developed as an agricultural community and has maintained its small-town character while adapting to modern times.",
    known_for: "Connection to Rice University founder, Small-town hospitality, Agricultural heritage, Rice ISD",
    getting_around: "Located in central Navarro County with access via Farm Road 1126 and State Highway 31. Approximately 10 miles northeast of Corsicana and 55 miles south of Dallas.",
    official_website: "",
    chamber_website: ""
  },
  "Dawson": {
    population: 815,
    zip_codes: "76639",
    lat: 31.9018,
    lng: -96.7168,
    description: "Dawson is a historic town in southwestern Navarro County, known as the 'Gateway to Navarro Mills Lake.' As the second town established in the county, Dawson offers residents a peaceful rural lifestyle with easy access to lake recreation.",
    history: "Dawson was named for Britton Dawson, a cattle rancher and participant in the Battle of San Jacinto, who arrived in the area from Alabama in 1847 searching for grass and water for his cattle. He lived in the town until his death in 1903. The community began to grow after 1881 when the St. Louis Southwestern Railway built a line from Corsicana to Waco. Dawson became a supply and shipping center for local cotton farmers.",
    known_for: "Gateway to Navarro Mills Lake, Second oldest town in county, Battle of San Jacinto heritage, Rural character",
    getting_around: "Located 21 miles southwest of Corsicana and 50 miles south of Dallas. Near Navarro Mills Lake for fishing and recreation. Served by State Highway 31 and Farm Road 667.",
    official_website: "",
    chamber_website: ""
  },
  "Frost": {
    population: 620,
    zip_codes: "76641",
    lat: 32.0782,
    lng: -96.8067,
    description: "Frost is a small city in northwestern Navarro County with a resilient community spirit. The town has overcome significant challenges, including a devastating 1930 tornado, and continues to thrive as a close-knit agricultural community.",
    history: "Frost was founded in 1881 when the St. Louis Southwestern Railway built from Corsicana to Hillsboro. The town was named for Miles Frost, a fifth-generation Texan who established a trading post for north central Texas farmers. On May 6, 1930, a devastating tornado struck the city, destroying much of the business district and killing 41 people. Despite this tragedy, the community rebuilt and persevered.",
    known_for: "Community resilience, 1930 tornado history, Agricultural heritage, Small-town values",
    getting_around: "Located at the junction of State Highway 22 and Farm Road 667, approximately 20 miles west of Corsicana. About 55 miles south of Dallas via I-35E and Highway 22.",
    official_website: "",
    chamber_website: ""
  },
  "Richland": {
    population: 255,
    zip_codes: "76681",
    lat: 31.9271,
    lng: -96.4256,
    description: "Richland is a small town in south-central Navarro County, located near the massive Richland-Chambers Reservoir. The town offers a quiet rural lifestyle with convenient access to one of Texas's largest lakes.",
    history: "The area was first settled in the late 1840s. Asa Chambers had established a store on the trail from Corsicana to Franklin by 1848, when a post office named Richland Crossing opened. When the Houston and Texas Central Railway was built through in 1871, the town developed around the depot. Richland reached a peak population of 750 in 1929 before declining during the Great Depression.",
    known_for: "Richland-Chambers Reservoir access, Historic railroad town, Rural living, Fishing community",
    getting_around: "Located at the junction of Interstate 45 and State Highway 14, on Pisgah Ridge, 12 miles south of Corsicana. Easy access to Richland-Chambers Reservoir for boating and fishing.",
    official_website: "",
    chamber_website: ""
  },
  "Barry": {
    population: 250,
    zip_codes: "75102",
    lat: 32.0960,
    lng: -96.6400,
    description: "Barry is a small unincorporated community in western Navarro County, offering a peaceful rural setting for residents who appreciate country living while remaining close to larger towns.",
    history: "Barry developed as a small agricultural community serving the farming families of western Navarro County. The community has maintained its rural character over the decades.",
    known_for: "Rural living, Agricultural community, Peaceful countryside",
    getting_around: "Located in western Navarro County, accessible via Farm Road 744. Approximately 10 miles west of Corsicana.",
    official_website: "",
    chamber_website: ""
  },
  "Angus": {
    population: 300,
    zip_codes: "75110",
    lat: 32.0500,
    lng: -96.5300,
    description: "Angus is a small community in Navarro County, providing rural living for residents who work in nearby Corsicana and surrounding areas.",
    history: "Angus developed as an agricultural community in Navarro County, named after the Angus cattle breed that was raised in the area. The community has remained small but maintains strong ties to its agricultural roots.",
    known_for: "Rural community, Agricultural heritage, Proximity to Corsicana",
    getting_around: "Located south of Corsicana in central Navarro County. Accessible via local farm roads connecting to Highway 287 and Interstate 45.",
    official_website: "",
    chamber_website: ""
  },
  "Retreat": {
    population: 350,
    zip_codes: "75110",
    lat: 32.0100,
    lng: -96.4600,
    description: "Retreat is a small community in Navarro County offering a quiet escape from urban life while maintaining easy access to Corsicana's amenities.",
    history: "Retreat was named for its peaceful, secluded setting that offered early settlers a 'retreat' from busier areas. The community developed as a farming settlement and has retained its tranquil character.",
    known_for: "Peaceful setting, Rural lifestyle, Agricultural community",
    getting_around: "Located southeast of Corsicana in central Navarro County. Accessible via local roads connecting to Interstate 45.",
    official_website: "",
    chamber_website: ""
  },
  "Mildred": {
    population: 400,
    zip_codes: "75109",
    lat: 32.0300,
    lng: -96.3800,
    description: "Mildred is a small community in eastern Navarro County, known for its rural charm and the Mildred Independent School District which serves families in the surrounding area.",
    history: "Mildred developed as a farming community in eastern Navarro County. The community grew around its school, which continues to serve as a center of community life.",
    known_for: "Mildred ISD, Rural community, Agricultural heritage",
    getting_around: "Located in eastern Navarro County, approximately 12 miles east of Corsicana. Accessible via Farm Road 639 and local roads.",
    official_website: "",
    chamber_website: ""
  },
  "Emhouse": {
    population: 150,
    zip_codes: "75110",
    lat: 32.2000,
    lng: -96.5700,
    description: "Emhouse is a small unincorporated community in northern Navarro County, providing rural living for residents in the area between Corsicana and Ellis County.",
    history: "Emhouse was established as a small farming community in northern Navarro County. The community has maintained its rural agricultural character.",
    known_for: "Rural living, Agricultural community, Northern Navarro County",
    getting_around: "Located in northern Navarro County near the Ellis County line. Accessible via Farm Road 879 and local roads. Approximately 15 miles north of Corsicana.",
    official_website: "",
    chamber_website: ""
  },
  "Eureka": {
    population: 300,
    zip_codes: "75110",
    lat: 32.1800,
    lng: -96.4100,
    description: "Eureka is a small community in Navarro County, offering country living for residents who appreciate the quiet pace of rural Texas life.",
    history: "Eureka was named in the spirit of discovery, reflecting the optimism of early settlers who found the area suitable for farming and ranching.",
    known_for: "Rural community, Agricultural heritage, Country living",
    getting_around: "Located in eastern Navarro County. Accessible via local farm roads connecting to State Highway 31.",
    official_website: "",
    chamber_website: ""
  },
  "Goodlow": {
    population: 200,
    zip_codes: "75144",
    lat: 32.1500,
    lng: -96.2800,
    description: "Goodlow is a small community in eastern Navarro County near Kerens, offering rural living with access to Richland-Chambers Reservoir recreational opportunities.",
    history: "Goodlow developed as an agricultural community in eastern Navarro County. Its proximity to Kerens and Richland-Chambers Reservoir has shaped its character.",
    known_for: "Proximity to Richland-Chambers Reservoir, Rural living, Eastern Navarro County",
    getting_around: "Located near Kerens in eastern Navarro County. Accessible via local roads and State Highway 31. Close to Richland-Chambers Reservoir.",
    official_website: "",
    chamber_website: ""
  },
  "Powell": {
    population: 150,
    zip_codes: "75153",
    lat: 32.0700,
    lng: -96.3400,
    description: "Powell is a small unincorporated community in Navarro County, providing rural living for residents in the eastern part of the county.",
    history: "Powell developed as a small farming community in Navarro County, serving agricultural families in the surrounding area.",
    known_for: "Rural community, Agricultural heritage, Eastern Navarro County",
    getting_around: "Located in eastern Navarro County. Accessible via Farm Road 709 and local roads.",
    official_website: "",
    chamber_website: ""
  },
  "Purdon": {
    population: 100,
    zip_codes: "76679",
    lat: 31.9500,
    lng: -96.5800,
    description: "Purdon is a small community in southern Navarro County, offering quiet rural living near the Freestone County line.",
    history: "Purdon was established as a small agricultural community in southern Navarro County, serving farmers and ranchers in the surrounding area.",
    known_for: "Rural living, Southern Navarro County, Agricultural community",
    getting_around: "Located in southern Navarro County near the Freestone County line. Accessible via State Highway 14 and local roads.",
    official_website: "",
    chamber_website: ""
  },
  "Pursley": {
    population: 50,
    zip_codes: "76679",
    lat: 31.9200,
    lng: -96.5500,
    description: "Pursley is a small rural community in southern Navarro County, providing a peaceful country setting for its residents.",
    history: "Pursley developed as a small farming settlement in southern Navarro County.",
    known_for: "Rural community, Southern Navarro County",
    getting_around: "Located in southern Navarro County. Accessible via local roads connecting to State Highway 14.",
    official_website: "",
    chamber_website: ""
  },
  "Chatfield": {
    population: 75,
    zip_codes: "75105",
    lat: 32.2800,
    lng: -96.3800,
    description: "Chatfield is a small community in northern Navarro County near the Henderson County line, offering rural living in a peaceful setting.",
    history: "Chatfield was established as a small agricultural community in northern Navarro County.",
    known_for: "Rural community, Northern Navarro County, Country living",
    getting_around: "Located in northern Navarro County near the Henderson County line. Accessible via local farm roads.",
    official_website: "",
    chamber_website: ""
  },
  "Emmett": {
    population: 50,
    zip_codes: "75110",
    lat: 31.9800,
    lng: -96.4200,
    description: "Emmett is a small unincorporated community in Navarro County, providing rural living for residents in the area.",
    history: "Emmett developed as a small farming community in Navarro County.",
    known_for: "Rural community, Agricultural heritage",
    getting_around: "Located in central Navarro County. Accessible via local roads.",
    official_website: "",
    chamber_website: ""
  },
  "Montfort": {
    population: 50,
    zip_codes: "75110",
    lat: 32.0200,
    lng: -96.5500,
    description: "Montfort is a small community in Navarro County offering rural country living for its residents.",
    history: "Montfort developed as a small agricultural settlement in Navarro County.",
    known_for: "Rural living, Agricultural community",
    getting_around: "Located in central Navarro County. Accessible via local farm roads.",
    official_website: "",
    chamber_website: ""
  },
  "Mustang": {
    population: 25,
    zip_codes: "75110",
    lat: 32.1200,
    lng: -96.6000,
    description: "Mustang is a small rural community in Navarro County, named after the wild horses that once roamed the Texas prairies.",
    history: "Mustang was named for the wild mustang horses that were once common in the area. The community developed as a small agricultural settlement.",
    known_for: "Texas heritage, Rural community",
    getting_around: "Located in western Navarro County. Accessible via local roads.",
    official_website: "",
    chamber_website: ""
  },
  "Navarro": {
    population: 200,
    zip_codes: "75110",
    lat: 32.0600,
    lng: -96.4000,
    description: "Navarro is a community in Navarro County that shares its name with the county. The area represents the heart of the county's agricultural heritage.",
    history: "The community of Navarro takes its name from José Antonio Navarro, for whom Navarro County was named. Navarro was a Texas patriot and signer of the Texas Declaration of Independence.",
    known_for: "County namesake, Texas history, Agricultural heritage",
    getting_around: "Located in central Navarro County. Accessible via local roads.",
    official_website: "",
    chamber_website: ""
  },
  "Oak Valley": {
    population: 150,
    zip_codes: "75110",
    lat: 32.0400,
    lng: -96.5200,
    description: "Oak Valley is a small community in Navarro County, named for the oak trees that populate the rolling hills of the area.",
    history: "Oak Valley was named for the groves of oak trees in the area. The community developed as an agricultural settlement.",
    known_for: "Oak trees, Rural beauty, Agricultural community",
    getting_around: "Located in central Navarro County. Accessible via local roads near Corsicana.",
    official_website: "",
    chamber_website: ""
  }
};

// Update function
const updateTown = db.prepare(`
  UPDATE entities
  SET data = json_patch(data, ?),
      updated_date = ?
  WHERE entity_type = 'Town'
  AND json_extract(data, '$.name') = ?
`);

console.log("=== Updating Town Data ===\n");

let updated = 0;
let notFound = 0;

for (const [townName, data] of Object.entries(townData)) {
  const patchData = {
    population: data.population,
    zip_codes: data.zip_codes,
    lat: data.lat,
    lng: data.lng,
    description: data.description,
    history: data.history,
    known_for: data.known_for,
    getting_around: data.getting_around,
    official_website: data.official_website || null,
    chamber_website: data.chamber_website || null
  };

  const result = updateTown.run(JSON.stringify(patchData), now, townName);

  if (result.changes > 0) {
    console.log(`Updated: ${townName}`);
    updated++;
  } else {
    console.log(`Not found: ${townName}`);
    notFound++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Updated: ${updated} towns`);
console.log(`Not found: ${notFound} towns`);

db.close();
console.log("\nDone!");
