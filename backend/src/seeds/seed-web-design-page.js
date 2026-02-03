/**
 * Seed the Web Design & Development services page
 * Run with: node src/seeds/seed-web-design-page.js
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
`).get('web-design-navarro-county');

if (existingPage) {
  console.log("Web Design page already exists. Skipping...");
  db.close();
  process.exit(0);
}

const pageId = uuidv4();

const pageData = {
  title: "Web Design & Development in Navarro County, TX | Local Small Business Websites",
  slug: "web-design-navarro-county",
  meta_title: "Web Design & Development in Navarro County, TX | Local Small Business Websites",
  meta_description: "Local web design and development services for Navarro County businesses. Fast, SEO-friendly websites built by a local developer who understands the community.",
  is_published: true,
  content: {
    sections: [
      // Hero Section (H1)
      {
        id: "hero-1",
        type: "hero",
        content: {
          title: "Navarro County Web Design & Development Services",
          subtitle: "Professional websites built by a local developer who understands the community",
          image: "",
          cta_text: "View Portfolio",
          cta_link: "https://leoashcraft.com"
        }
      },
      // Intro Section
      {
        id: "intro-1",
        type: "text",
        content: {
          heading: "",
          body: `NavarroCounty.com was built to support local businesses, organizations, and communities across Navarro County, Texas. In addition to being a local marketplace and community hub, we also offer professional web design and web development services tailored specifically for Navarro County businesses.

Whether you're a restaurant, church, contractor, nonprofit, or startup, having a modern, fast, and searchable website is no longer optional — it's how customers find and trust you.`
        }
      },
      // Why Local Web Design Matters
      {
        id: "why-local-1",
        type: "richtext",
        content: {
          heading: "Why Choose a Local Navarro County Web Designer?",
          body: `Working with a local web developer means your website is built with real knowledge of the Navarro County market — not generic templates designed for big cities.

<br>

- ✔ Local SEO optimization
- ✔ Mobile-friendly design for real users
- ✔ Fast loading, secure websites
- ✔ Built for Google search visibility
- ✔ Designed to convert local traffic into customers

<br>

Your business doesn't need a national agency — it needs a website that works locally.`
        }
      },
      // Services Offered
      {
        id: "services-1",
        type: "features",
        content: {
          heading: "Web Design & Development Services",
          items: [
            { title: "Small Business Websites", description: "Professional, affordable websites designed for local businesses" },
            { title: "Custom WordPress Development", description: "Fully customized WordPress sites with modern themes and functionality" },
            { title: "Local SEO Optimization", description: "Get found by customers searching in Navarro County and surrounding areas" },
            { title: "Website Redesigns", description: "Modernize your outdated website with fresh design and improved UX" },
            { title: "Performance & Speed Optimization", description: "Fast-loading websites that rank better and convert more visitors" },
            { title: "Accessibility & Mobile Optimization", description: "Websites that work perfectly on all devices and meet accessibility standards" },
            { title: "E-commerce & Online Ordering", description: "Sell products or accept orders online with secure payment processing" },
            { title: "Ongoing Maintenance & Support", description: "Keep your website secure, updated, and running smoothly" }
          ]
        }
      },
      // Built for Local Discovery
      {
        id: "local-discovery-1",
        type: "text",
        content: {
          heading: "Built for Local Discovery",
          body: `Businesses listed on NavarroCounty.com benefit from increased local visibility, internal linking, and community discovery. Your website can integrate seamlessly with your business listing, events, products, or services — creating a stronger local footprint across the county.

This platform is designed to help Navarro County businesses be found.`
        }
      },
      // Service Areas - Towns We Serve (SEO)
      {
        id: "service-areas-1",
        type: "richtext",
        content: {
          heading: "Web Design Services Throughout Navarro County",
          body: `We proudly serve businesses and organizations in every corner of Navarro County. Whether you're located in downtown Corsicana or the smaller communities throughout the region, we provide the same professional web design and development services tailored to your local market.

<br>

**Cities & Communities We Serve:**

<br>

Corsicana, Blooming Grove, Kerens, Rice, Dawson, Frost,
Richland, Barry, Angus, Retreat, Powell, Purdon, Mildred,
Emhouse, Eureka, Chatfield, Goodlow, Mustang, Navarro,
Oak Valley, Pursley, Montfort, Emmett

<br>

No matter where your business is located in Navarro County, we understand the local market and can build a website that connects you with customers in your community and beyond.`
        }
      },
      // About the Developer
      {
        id: "about-dev-1",
        type: "html",
        content: {
          html: `<h2 class="text-3xl font-bold text-gray-900 mb-6">About the Developer</h2>
<p class="text-lg text-gray-700 mb-6">This service is led by a local full-stack web developer with experience building scalable, secure, and SEO-optimized websites for higher education, healthcare, and small businesses.</p>
<p class="text-lg text-gray-700">View full portfolio and case studies at<br>
👉 <a href="https://leoashcraft.com" class="text-orange-600 hover:text-orange-700 font-semibold">leoashcraft.com</a></p>`
        }
      },
      // CTA Section
      {
        id: "cta-1",
        type: "cta",
        content: {
          heading: "Ready to Build Your Website?",
          text: "Get a professional, SEO-optimized website built by a local developer who understands your community.",
          button_text: "Contact Leo Ashcraft",
          button_link: "https://leoashcraft.com"
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

console.log("=== Web Design Page Created ===");
console.log(`Page ID: ${pageId}`);
console.log(`Slug: ${pageData.slug}`);
console.log(`Title: ${pageData.title}`);
console.log(`URL: /web-design-navarro-county`);
console.log("");
console.log("The page is now live and accessible at /web-design-navarro-county");

db.close();
