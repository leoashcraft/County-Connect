/**
 * Seed the Best Internet Service in Navarro County page
 * Run with: node src/seeds/seed-internet-service-page.js
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
`).get('best-internet-navarro-county');

if (existingPage) {
  console.log("Internet Service page already exists. Skipping...");
  db.close();
  process.exit(0);
}

const pageId = uuidv4();

const starlinkReferral = "https://starlink.com/residential?referral=RC-1146010-14247-46";

const pageData = {
  title: "Best Internet Service in Navarro County, TX | Rural Internet Options",
  slug: "best-internet-navarro-county",
  meta_title: "Best Internet Service in Navarro County, TX | Rural Internet Options",
  meta_description: "Find the best internet service for Navarro County, Texas. Compare rural internet options including Starlink satellite internet for reliable high-speed connectivity.",
  is_published: true,
  content: {
    sections: [
      // Hero Section
      {
        id: "hero-1",
        type: "hero",
        content: {
          title: "Best Internet Service in Navarro County, TX",
          subtitle: "Reliable high-speed internet for rural Texas communities",
          image: "",
          cta_text: "Get Starlink Internet",
          cta_link: starlinkReferral
        }
      },
      // Intro Section
      {
        id: "intro-1",
        type: "text",
        content: {
          heading: "",
          body: `Living in rural Navarro County means dealing with limited internet options. Traditional providers often don't reach outside city limits, leaving many residents with slow DSL, unreliable fixed wireless, or expensive cellular data plans.

Fortunately, satellite internet technology has changed everything. Starlink now offers high-speed, low-latency internet to rural areas across Navarro County — no matter how far you are from town.`
        }
      },
      // The Rural Internet Problem
      {
        id: "problem-1",
        type: "richtext",
        content: {
          heading: "The Rural Internet Challenge",
          body: `If you live outside Corsicana, Kerens, or other Navarro County towns, you've probably experienced:

<br>

- Slow speeds that can't handle video calls or streaming
- Unreliable connections that drop during bad weather
- Data caps that limit your monthly usage
- High prices for subpar service
- Being told "service not available at your address"

<br>

These problems affect everything from working from home to kids doing homework online. Rural Navarro County deserves better internet options.`
        }
      },
      // Why Starlink
      {
        id: "why-starlink-1",
        type: "features",
        content: {
          heading: "Why Starlink is the Best Option for Rural Navarro County",
          items: [
            { title: "High-Speed Downloads", description: "Speeds typically between 50-200+ Mbps — fast enough for streaming, gaming, and video calls" },
            { title: "Low Latency", description: "20-40ms latency means responsive video calls and online gaming, unlike traditional satellite" },
            { title: "No Data Caps", description: "Unlimited data with no throttling or overage charges" },
            { title: "Works Anywhere", description: "If you have a clear view of the sky, Starlink works — no cable or phone lines needed" },
            { title: "Easy Self-Install", description: "Set up in minutes with the included app and mounting hardware" },
            { title: "Reliable Service", description: "Thousands of satellites ensure consistent coverage even in remote areas" }
          ]
        }
      },
      // How It Works
      {
        id: "how-it-works-1",
        type: "text",
        content: {
          heading: "How Starlink Works",
          body: `Starlink uses a constellation of thousands of low-Earth orbit satellites to deliver internet directly to a small dish at your home. Unlike traditional satellite internet (HughesNet, Viasat) that uses distant geostationary satellites, Starlink's satellites orbit much closer to Earth — resulting in dramatically faster speeds and lower latency.

The Starlink dish (called "Dishy") automatically finds and tracks satellites overhead. Just plug it in, point it at the sky, and you're online. The included app walks you through setup in about 15 minutes.`
        }
      },
      // Service Areas
      {
        id: "service-areas-1",
        type: "richtext",
        content: {
          heading: "Starlink Coverage in Navarro County",
          body: `Starlink is available throughout Navarro County, including:

<br>

Corsicana, Blooming Grove, Kerens, Rice, Dawson, Frost,
Richland, Barry, Angus, Retreat, Powell, Purdon, Mildred,
Emhouse, Eureka, Chatfield, Goodlow, Mustang, Navarro,
Oak Valley, Pursley, Montfort, Emmett

<br>

Whether you're on a ranch outside Blooming Grove or a homestead near Kerens, Starlink can deliver reliable high-speed internet to your door.`
        }
      },
      // Comparison
      {
        id: "comparison-1",
        type: "html",
        content: {
          html: `<h2 class="text-3xl font-bold text-gray-900 mb-6">How Starlink Compares</h2>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-orange-100">
<th class="p-3 border">Provider</th>
<th class="p-3 border">Speed</th>
<th class="p-3 border">Latency</th>
<th class="p-3 border">Data Cap</th>
<th class="p-3 border">Rural Availability</th>
</tr>
</thead>
<tbody>
<tr class="bg-green-50">
<td class="p-3 border font-semibold">Starlink</td>
<td class="p-3 border">50-200+ Mbps</td>
<td class="p-3 border">20-40ms</td>
<td class="p-3 border">Unlimited</td>
<td class="p-3 border">Excellent</td>
</tr>
<tr>
<td class="p-3 border">HughesNet</td>
<td class="p-3 border">25 Mbps</td>
<td class="p-3 border">600+ms</td>
<td class="p-3 border">15-200GB</td>
<td class="p-3 border">Good</td>
</tr>
<tr>
<td class="p-3 border">Viasat</td>
<td class="p-3 border">12-100 Mbps</td>
<td class="p-3 border">500+ms</td>
<td class="p-3 border">40-300GB</td>
<td class="p-3 border">Good</td>
</tr>
<tr>
<td class="p-3 border">Rural DSL</td>
<td class="p-3 border">1-10 Mbps</td>
<td class="p-3 border">30-50ms</td>
<td class="p-3 border">Varies</td>
<td class="p-3 border">Limited</td>
</tr>
<tr>
<td class="p-3 border">Fixed Wireless</td>
<td class="p-3 border">10-50 Mbps</td>
<td class="p-3 border">30-60ms</td>
<td class="p-3 border">Varies</td>
<td class="p-3 border">Limited</td>
</tr>
</tbody>
</table>
</div>`
        }
      },
      // CTA Section
      {
        id: "cta-1",
        type: "cta",
        content: {
          heading: "Ready for Better Internet?",
          text: "Join thousands of rural Texans who have switched to Starlink for reliable, high-speed internet.",
          button_text: "Order Starlink Now",
          button_link: starlinkReferral
        }
      },
      // FAQ Section
      {
        id: "faq-1",
        type: "richtext",
        content: {
          heading: "Frequently Asked Questions",
          body: `**How much does Starlink cost?**

Starlink Residential is $120/month with a one-time equipment cost of $499. There are no contracts or hidden fees.

<br>

**Is there a data cap?**

No. Starlink offers unlimited data with no throttling or overage charges.

<br>

**Will it work during storms?**

Starlink performs well in most weather conditions. Heavy rain or snow may briefly affect service, but outages are typically short.

<br>

**Do I need professional installation?**

No. Starlink is designed for easy self-installation. The app guides you through setup in about 15 minutes.

<br>

**Can I take it with me if I move?**

Yes. Starlink is portable and can be transferred to a new address within your service area.`
        }
      },
      // Final CTA
      {
        id: "cta-2",
        type: "html",
        content: {
          html: `<div class="text-center py-8">
<p class="text-lg text-gray-700 mb-4">Ready to experience real high-speed internet in rural Navarro County?</p>
<a href="${starlinkReferral}" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all">
Get Starlink Today
</a>
</div>`
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

console.log("=== Internet Service Page Created ===");
console.log(`Page ID: ${pageId}`);
console.log(`Slug: ${pageData.slug}`);
console.log(`Title: ${pageData.title}`);
console.log(`URL: /best-internet-navarro-county`);
console.log("");
console.log("The page is now live and accessible at /best-internet-navarro-county");

db.close();
