/**
 * Seed the About Navarro County page
 * Run with: node src/seeds/seed-about-county-page.js
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

// Check if page already exists
const existingPage = db.prepare(`
  SELECT id FROM entities
  WHERE entity_type = 'Page'
  AND json_extract(data, '$.slug') = ?
`).get('about-navarro-county');

if (existingPage) {
  console.log("About Navarro County page already exists. Updating...");

  // Delete existing to replace with updated content
  db.prepare(`DELETE FROM entities WHERE id = ?`).run(existingPage.id);
}

const pageId = uuidv4();

const pageData = {
  title: "About Navarro County, Texas | History, Communities & Local Guide",
  slug: "about-navarro-county",
  meta_title: "About Navarro County, Texas | History, Communities & Local Guide",
  meta_description: "Learn about Navarro County, Texas - its rich history, vibrant communities, local economy, and what makes this Central Texas region a great place to live and work.",
  is_published: true,
  content: {
    sections: [
      // Hero Section
      {
        id: "hero-1",
        type: "hero",
        content: {
          title: "About Navarro County, Texas",
          subtitle: "A Central Texas community with rich history and bright future",
          image: "",
          cta_text: "",
          cta_link: ""
        }
      },
      // Overview Section
      {
        id: "overview-1",
        type: "richtext",
        content: {
          heading: "Welcome to Navarro County",
          body: `Navarro County is located in the heart of Central Texas, approximately 50 miles south of Dallas. With a population of over 52,000 residents spread across more than 1,000 square miles, the county offers a perfect blend of small-town charm and modern conveniences.

<br>

The county seat is **Corsicana**, a city of approximately 25,000 residents that serves as the commercial, cultural, and governmental center of the region. Navarro County is home to numerous communities including Blooming Grove, Kerens, Rice, Dawson, Frost, Richland, and many more, each with its own unique character and history.

<br>

Whether you're looking to raise a family, start a business, or simply enjoy a slower pace of life while remaining connected to major metropolitan areas, Navarro County offers an exceptional quality of life.`
        }
      },
      // Quick Facts
      {
        id: "facts-1",
        type: "features",
        content: {
          heading: "Navarro County at a Glance",
          items: [
            { title: "Population", description: "52,624 residents (2020 Census)" },
            { title: "County Seat", description: "Corsicana, established 1848" },
            { title: "Area", description: "1,086 square miles" },
            { title: "Founded", description: "1846, named for José Antonio Navarro" },
            { title: "Major Highways", description: "I-45, US-287, TX-22, TX-31" },
            { title: "Nearby Cities", description: "50 miles to Dallas, 90 miles to Houston" }
          ]
        }
      },
      // History Section
      {
        id: "history-1",
        type: "richtext",
        content: {
          heading: "Rich Texas History",
          body: `Navarro County was established in 1846 and named in honor of **José Antonio Navarro**, a Texas patriot and signer of the Texas Declaration of Independence. Navarro was one of only two native-born Texans to sign the declaration and played a crucial role in Texas's fight for independence.

<br>

The county seat, Corsicana, was founded in 1848 and named after the Mediterranean island of Corsica—the birthplace of José Antonio Navarro's father. The city grew steadily as an agricultural center, but its destiny changed dramatically in 1894.

<br>

### The First Texas Oil Boom

In 1894, while drilling for water, workers accidentally struck oil in Corsicana, leading to the **first commercially significant oil discovery in Texas**. This discovery preceded the famous Spindletop gusher by seven years and established Corsicana as a pioneer in Texas's oil industry. A refinery was operational by 1899, and the discovery helped fuel the broader Texas oil boom that would transform the state's economy.

<br>

### World War II Era

During World War II, Corsicana Air Field trained thousands of military pilots, contributing to the war effort and bringing economic activity to the region. The legacy of aviation training continues today with the presence of general aviation facilities in the county.`
        }
      },
      // Economy Section
      {
        id: "economy-1",
        type: "richtext",
        content: {
          heading: "Local Economy & Employment",
          body: `Navarro County's economy has evolved from its agricultural and oil industry roots into a diverse mix of sectors:

<br>

- **Healthcare** - Navarro Regional Hospital and various medical facilities provide healthcare services and employment
- **Education** - Navarro College, public school districts, and educational support services
- **Manufacturing** - Various manufacturing and industrial operations
- **Retail & Services** - Growing retail sector serving local and regional customers
- **Agriculture** - Continued presence of farming, ranching, and related agribusiness
- **Energy** - Oil and gas operations remain part of the economic landscape

<br>

The county benefits from its strategic location on Interstate 45, providing easy access to the Dallas-Fort Worth metroplex and Houston markets. This positioning makes Navarro County attractive for businesses seeking lower costs while maintaining connectivity to major markets.`
        }
      },
      // Education Section
      {
        id: "education-1",
        type: "richtext",
        content: {
          heading: "Education & Schools",
          body: `Navarro County is served by multiple independent school districts committed to academic excellence:

<br>

- **Corsicana ISD** - The largest district, serving Corsicana and surrounding areas
- **Blooming Grove ISD** - Serving the Blooming Grove community
- **Dawson ISD** - Serving Dawson and southwestern Navarro County
- **Frost ISD** - Serving Frost and northwestern areas
- **Kerens ISD** - Serving Kerens and eastern Navarro County
- **Mildred ISD** - Serving the Mildred community
- **Rice ISD** - Serving Rice and nearby areas
- **Richland ISD** - Serving the Richland area

<br>

### Higher Education

**Navarro College**, headquartered in Corsicana, is a comprehensive community college offering associate degrees, workforce training, and continuing education. The college gained international recognition in 2020 through the Netflix documentary series "Cheer," which followed its nationally champion cheerleading program.

<br>

Navarro College also serves as a satellite facility for **Texas A&M University-Commerce**, allowing students to pursue bachelor's and master's degrees locally.`
        }
      },
      // Recreation Section
      {
        id: "recreation-1",
        type: "richtext",
        content: {
          heading: "Recreation & Outdoor Activities",
          body: `Navarro County offers exceptional opportunities for outdoor recreation, anchored by two major reservoirs that rank among Texas's finest.

<br>

### Richland-Chambers Reservoir

Spanning 64.62 square miles with over 1.1 million acre-feet of water capacity, **Richland-Chambers Reservoir** ranks as Texas's third-largest reservoir by surface area and eighth-largest by volume. Created by impounding Richland Creek and Chambers Creek in 1987, this massive body of water stretches across both Navarro and Freestone counties east of Corsicana and south of Kerens.

The reservoir has earned a reputation as one of Texas's premier fishing destinations, particularly for catfish. It holds the state record for blue catfish at an impressive 121.5 pounds. Anglers also enjoy outstanding catches of largemouth bass, white bass, and crappie. Multiple marinas, boat ramps, and guide services make the lake accessible to both casual visitors and serious anglers.

<br>

### Navarro Mills Lake

**Navarro Mills Lake**, a 5,070-acre U.S. Army Corps of Engineers reservoir, was created in 1963 by damming Richland Creek near the community of Purdon. Originally built for flood control and water supply, the lake has become a beloved recreation destination for Navarro County residents and visitors.

The lake features eight distinct recreation areas managed by the Corps of Engineers, including Wolf Creek Park, Oak Park, and Liberty Hill. These areas offer boat ramps, swimming beaches, picnic facilities, and well-maintained campgrounds with electrical hookups. Popular fish species include largemouth bass, channel catfish, white bass, and crappie.

<br>

### Lake Halbert

Closer to downtown Corsicana, **Lake Halbert** provides a scenic 650-acre retreat with a beautiful surrounding park, swimming beach, walking trails, and fishing opportunities. The lake is perfect for kayaking and paddle sports, as only electric motors are permitted.

<br>

### Parks & Trails

The county features numerous parks and recreational facilities throughout its communities. Jester Park offers playgrounds, walking trails, and a seasonal splash pad. Lake Halbert Park provides miles of scenic trails around the lake. Downtown Corsicana's pocket park offers an urban retreat with murals and water features.

<br>

### Community Events

Throughout the year, Navarro County communities host festivals, farmers markets, holiday celebrations, and cultural events that bring residents together and celebrate local heritage.`
        }
      },
      // Notable Attractions
      {
        id: "attractions-1",
        type: "features",
        content: {
          heading: "Notable Attractions & Landmarks",
          items: [
            { title: "Collin Street Bakery", description: "World-famous fruitcake bakery operating since 1896, shipping millions of cakes annually worldwide" },
            { title: "Navarro County Courthouse", description: "Historic 1905 courthouse in downtown Corsicana, a beautiful example of Classical Revival architecture" },
            { title: "Pioneer Village", description: "Living history museum showcasing 19th-century Texas frontier life" },
            { title: "Cook Center", description: "Planetarium and science center offering educational programming" },
            { title: "Warehouse Living Arts Center", description: "Cultural venue hosting theater, music, and community events" },
            { title: "Historic Downtown Corsicana", description: "Charming downtown district with shops, restaurants, and historic architecture" }
          ]
        }
      },
      // Communities Section
      {
        id: "communities-1",
        type: "richtext",
        content: {
          heading: "Our Communities",
          body: `Navarro County is home to diverse communities, each offering its own unique character:

<br>

**Corsicana** (pop. 25,591) - The county seat and largest city, offering the most services, shopping, and employment opportunities.

**Kerens** (pop. 1,505) - Gateway to Richland-Chambers Reservoir, known for fishing and outdoor recreation.

**Rice** (pop. 1,203) - Named for William Marsh Rice, founder of Rice University. "The city so nice, they named it Rice."

**Blooming Grove** (pop. 857) - Charming community with strong agricultural heritage.

**Dawson** (pop. 815) - The second-oldest town in the county, gateway to Navarro Mills Lake.

**Frost** (pop. 620) - Resilient community that rebuilt after a devastating 1930 tornado.

**Richland** (pop. 255) - Small town near Richland-Chambers Reservoir.

<br>

Additional communities include Angus, Barry, Chatfield, Emhouse, Emmett, Eureka, Goodlow, Mildred, Montfort, Mustang, Navarro, Oak Valley, Powell, Purdon, Pursley, and Retreat.`
        }
      },
      // Why Live Here
      {
        id: "why-live-1",
        type: "features",
        content: {
          heading: "Why Choose Navarro County?",
          items: [
            { title: "Affordable Living", description: "Lower cost of living compared to Dallas-Fort Worth, with affordable housing options" },
            { title: "Small-Town Values", description: "Strong community connections, friendly neighbors, and safe neighborhoods" },
            { title: "Easy Commute", description: "I-45 provides quick access to Dallas (50 min) while enjoying country living" },
            { title: "Quality Schools", description: "Multiple school districts committed to student success" },
            { title: "Outdoor Recreation", description: "Two major lakes, parks, and natural areas for fishing, boating, and hiking" },
            { title: "Rich Heritage", description: "Historic downtown, museums, and cultural events celebrating Texas history" }
          ]
        }
      },
      // CTA Section
      {
        id: "cta-1",
        type: "cta",
        content: {
          heading: "Explore Navarro County",
          text: "Discover local restaurants, events, jobs, and community resources throughout our county.",
          button_text: "Browse Local Directory",
          button_link: "/business-directory"
        }
      },
      // FAQ Section
      {
        id: "faq-1",
        type: "faq",
        content: {
          heading: "Frequently Asked Questions",
          items: [
            {
              question: "What is the population of Navarro County?",
              answer: "According to the 2020 Census, Navarro County has a population of 52,624 residents. The county seat, Corsicana, has approximately 25,591 residents."
            },
            {
              question: "How far is Navarro County from Dallas?",
              answer: "Corsicana, the county seat, is approximately 50 miles south of Dallas via Interstate 45. The drive typically takes about 50-60 minutes depending on traffic."
            },
            {
              question: "What is Navarro County known for?",
              answer: "Navarro County is known for being the site of the first commercially significant oil discovery in Texas (1894), the Collin Street Bakery's world-famous fruitcakes, Navarro College's championship cheerleading program featured in Netflix's 'Cheer,' and excellent fishing at Richland-Chambers Reservoir."
            },
            {
              question: "What school districts serve Navarro County?",
              answer: "Navarro County is served by multiple independent school districts including Corsicana ISD, Blooming Grove ISD, Dawson ISD, Frost ISD, Kerens ISD, Mildred ISD, Rice ISD, and Richland ISD."
            },
            {
              question: "Are there lakes in Navarro County?",
              answer: "Yes, Navarro County is home to Richland-Chambers Reservoir (the third-largest inland reservoir by surface area in Texas) and Navarro Mills Lake. Both offer excellent fishing, boating, and recreational opportunities."
            },
            {
              question: "Who was Navarro County named after?",
              answer: "Navarro County was named after José Antonio Navarro, a Texas patriot and one of only two native-born Texans to sign the Texas Declaration of Independence. He was instrumental in Texas's fight for independence from Mexico."
            }
          ]
        }
      }
    ]
  }
};

// Insert the page
const insertStmt = db.prepare(`
  INSERT INTO entities (id, entity_type, data, created_date, updated_date)
  VALUES (?, ?, ?, ?, ?)
`);

insertStmt.run(pageId, 'Page', JSON.stringify(pageData), now, now);

console.log("=== About Navarro County Page Created ===");
console.log(`Page ID: ${pageId}`);
console.log(`Slug: ${pageData.slug}`);
console.log(`Title: ${pageData.title}`);
console.log(`URL: /about-navarro-county`);
console.log("");
console.log("The page is now live and accessible at /about-navarro-county");

db.close();
