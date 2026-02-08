# County Connect

Your independent community hub for local services, businesses, jobs, events, and everything Navarro County, Texas.

![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![Strapi](https://img.shields.io/badge/Strapi-5.35-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Architecture

```
┌─────────────────────┐      ┌─────────────────────┐
│   Next.js 15        │─────>│   Strapi v5 CMS     │
│   App Router        │      │   Headless API      │
│   Port 3000         │      │   Port 1337         │
└──────────┬──────────┘      └──────────┬──────────┘
           │                            │
           └────────────┬───────────────┘
                        ▼
                ┌───────────────┐
                │    MySQL      │
                │   (Railway)   │
                └───────────────┘
```

**Frontend:** Next.js 15 with App Router, TypeScript, Tailwind CSS, NextAuth.js
**Backend:** Strapi v5 headless CMS with 35+ custom content types
**Database:** MySQL (production) / SQLite (development)
**Auth:** Google OAuth via NextAuth.js, synced to Strapi users
**Maps:** OpenStreetMap + Leaflet (no API key required)
**Weather:** OpenWeatherMap with server-side caching

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Google Cloud OAuth credentials

### 1. Clone & Install

```bash
git clone <repo-url>
cd county-connect

# Install Strapi dependencies
cd strapi && npm install && cd ..

# Install Next.js dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment

**Strapi** (`strapi/.env`):
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random-salt
ADMIN_JWT_SECRET=random-secret
JWT_SECRET=random-secret
TRANSFER_TOKEN_SALT=random-salt
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<create-after-strapi-setup>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENWEATHER_API_KEY=your-openweather-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-id
```

### 3. Start Development Servers

**Terminal 1 - Strapi:**
```bash
cd strapi
npm run develop
```

**Terminal 2 - Next.js:**
```bash
cd frontend
npm run dev
```

### 4. Initial Strapi Setup

1. Open http://localhost:1337/admin
2. Create admin account (e.g., `admin@navarrocounty.com` / `Admin123!`)
3. Go to Settings → API Tokens → Create new token (Full access)
4. Copy token to `frontend/.env.local` as `STRAPI_API_TOKEN`
5. Run permission seed script:
   ```bash
   cd strapi && node scripts/seed-permissions.js
   ```

---

## Project Structure

```
county-connect/
├── frontend/                    # Next.js 15 App
│   ├── app/                     # App Router pages
│   │   ├── (auth)/             # Auth routes (login, callback)
│   │   ├── guides/[slug]/      # SEO informational pages (302 pages)
│   │   ├── services/           # Services & Rentals marketplace
│   │   ├── directory/[type]/   # Directory listings (13 types)
│   │   ├── marketplace/        # Products & Goods marketplace
│   │   ├── deals/              # Business deals & promotions
│   │   ├── community/          # Forum, bulletin, activity feed
│   │   ├── account/            # User dashboard & settings
│   │   ├── admin/              # Admin dashboard
│   │   └── api/                # API routes (auth, weather)
│   ├── components/             # React components (40+)
│   │   ├── directory/          # ClaimButton, etc.
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   ├── notification-bell.tsx
│   │   ├── weather-widget.tsx
│   │   ├── map-embed.tsx
│   │   ├── share-button.tsx
│   │   ├── save-button.tsx
│   │   └── ...
│   ├── lib/                    # Utilities
│   │   ├── strapi.ts          # Strapi API client
│   │   ├── auth.ts            # Auth helpers
│   │   ├── dashboard-config.ts
│   │   └── use-location-filter.ts
│   └── public/                 # Static assets
│       ├── manifest.json       # PWA manifest
│       └── robots.txt
│
├── strapi/                      # Strapi v5 CMS
│   ├── src/api/                # 35+ Content type APIs
│   ├── src/components/         # Shared components
│   ├── config/                 # Strapi configuration
│   └── scripts/                # Migration & seed scripts
│
├── DEPLOYMENT.md               # Railway deployment guide
└── README.md                   # This file
```

---

## Content Types (35 Types)

### Directory Content (5 types)

| Type | Description | Key Fields |
|------|-------------|------------|
| **restaurant** | Local eateries | name, cuisine, priceRange, hours, searchKeywords, owner |
| **church** | Places of worship | name, denomination, serviceTimes, searchKeywords, owner |
| **school** | Educational institutions | name, schoolType, district, grades, searchKeywords, owner |
| **event** | Local events | title, startDate, endDate, location, rsvpEnabled, organizer |
| **local-business** | Generic directory type | name, businessType, hours, specialties, searchKeywords, owner |

The `local-business` type uses `businessType` field to handle: food-trucks, sports-teams, community-resources, attractions, public-services, and general businesses.

### Marketplace Content (6 types)

| Type | Description | Key Fields |
|------|-------------|------------|
| **product** | Products for sale | title, price, category, seller, status |
| **service-listing** | Services for hire | title, rateType, rate, provider |
| **job** | Employment listings | title, company, salary, jobType, postedBy |
| **real-estate** | Property listings | title, price, bedrooms, sqft, agent |
| **vehicle** | Cars, trucks, equipment | title, make, model, year, price |
| **pet** | Pets for adoption/sale | name, species, breed, age |

### User & Engagement (12 types)

| Type | Description | Key Fields |
|------|-------------|------------|
| **wishlist-item** | Saved items (any type) | itemType, itemId, itemName, user |
| **wishlist-collection** | Organize saved items | name, items, user |
| **dashboard-preference** | User dashboard config | visibleSections, user |
| **claim-request** | Listing ownership claims | entityType, entityId, claimant, status |
| **notification** | User notifications | type, title, message, isRead |
| **event-rsvp** | Event attendance | event, user, status (interested/going) |
| **content-report** | Flag inappropriate content | contentType, contentId, reason |
| **support-ticket** | Help requests | subject, category, priority, status |
| **review** | Business reviews | rating, content, business, author |
| **conversation** | User conversations | participants, lastMessage |
| **message** | Chat messages | content, sender, conversation |
| **activity-log** | Community activity feed | actionType, actorName, details |

### Content & Site Management (8 types)

| Type | Description | Key Fields |
|------|-------------|------------|
| **guide** | SEO informational pages (302) | title, slug, content, layout, category |
| **category** | Content categorization | name, slug, type |
| **town** | Navarro County towns | name, slug, population |
| **deal** | Business promotions | title, discountType, code, dates |
| **newsletter-subscriber** | Email list | email, interests, frequency |
| **saved-search** | Search alerts | criteria, alertFrequency |
| **emergency-alert** | Site-wide announcements | title, message, severity |
| **featured-spot-inquiry** | Featured advertising requests | businessName, contactInfo |

### Community (4 types)

| Type | Description |
|------|-------------|
| **forum-post** | Discussion threads |
| **forum-comment** | Replies (supports nesting) |
| **forum-category** | Forum organization |
| **bulletin-post** | Community announcements |

---

## Key Features

### Directory System

Browse local businesses, restaurants, churches, schools, and events.

- **Dynamic routing**: `/directory/[type]` and `/directory/[type]/[id]`
- **Search with synonyms**: `searchKeywords` field enables alternative term matching (e.g., "food bank" finds "food pantry")
- **Location filtering**: Filter by preferred town, county-wide, or custom selection
- **Open/closed status**: Real-time business hours display with `BusinessHours` component
- **Map integration**: OpenStreetMap embeds with directions via `MapEmbed` component

**Seed synonyms**:
```bash
cd strapi && node scripts/seed-synonyms.js
```

---

### Claim This Listing

Allow users to claim ownership of unclaimed directory listings.

**Flow:**
1. **Unclaimed Listing** → Shows "Claim This Listing" button
2. **User submits claim** → Provides verification info (role, phone, email)
3. **Admin reviews** → Approves or rejects via Strapi admin
4. **On approval** → User becomes listing owner, sees "Your Listing" badge

**Claimable types:** restaurants, churches, schools, events, local-businesses

**Files:**
- `strapi/src/api/claim-request/` - Backend API with approve/reject actions
- `frontend/components/directory/claim-button.tsx` - UI component
- `frontend/app/directory/[type]/[id]/claim/` - Claim form pages

---

### Saved Items & Collections

Universal save system for any content type.

- **Save anything**: Products, services, restaurants, events, guides
- **Heart icons**: Save buttons on all listing cards (top-right corner)
- **Collections**: Organize saved items into custom collections
- **Collection management**: Create, rename, delete, move items between collections

**Components**: `SaveButton` (variants: card, button, icon)
**Page**: `/account/saved`

---

### Event RSVP

Track event attendance.

- **Status options**: Interested, Going
- **Attendee counts**: Display on event cards and detail pages
- **Toggle on/off**: Users can change their RSVP
- **Requires auth**: "Sign in to RSVP" for unauthenticated users

**Components**: `EventRsvp`, `EventAttendeeBadge`

---

### Notifications System

Real-time user notifications.

- **Types**: message, order, claim, save, forum_reply, event_reminder, listing_inquiry, review, system
- **Bell icon**: Header notification bell with unread count badge
- **Mark as read**: Individual or mark all read
- **Polling**: Checks every 60 seconds

**Components**: `NotificationBell`
**Page**: `/account/notifications`

---

### Deals & Promotions

Business deals and discounts.

- **Discount types**: Percentage, fixed amount, BOGO, free item
- **Promo codes**: Optional coupon codes
- **Date ranges**: Start and end dates with validation
- **Expiring soon**: Visual badges for deals ending within 3 days

**Page**: `/deals`

---

### Social Sharing

Share content across platforms.

- **Platforms**: Facebook, Twitter, WhatsApp, Email
- **Copy link**: With visual feedback on copy
- **Native share**: Uses Web Share API on mobile devices
- **Add to calendar**: Google Calendar, Outlook, iCal download for events

**Components**: `ShareButton` (variants: button, icon, inline), `AddToCalendar`

---

### Weather Widget

Local weather display with server-side caching.

- **60-minute cache**: Per location (lat/lon rounded to 2 decimals)
- **Shared cache**: All users in same area share cached data
- **Variants**: Compact (header) and full (sidebar)
- **Graceful degradation**: Silently fails if API unavailable

**Files:**
- `frontend/app/api/weather/route.ts` - Cached API endpoint
- `frontend/components/weather-widget.tsx`

---

### Map Integration

OpenStreetMap + Leaflet (no API key required).

- **Lazy loading**: Map loads on click to save resources
- **Custom markers**: Leaflet marker icons
- **Directions**: Links to Google Maps for turn-by-turn navigation
- **Open in Maps**: Links to OpenStreetMap

**Components**: `MapEmbed`, `DirectionsLink`

---

### Photo Gallery

Image galleries with lightbox.

- **Grid layouts**: 2, 3, or 4 columns
- **Lightbox**: Full-screen view with navigation
- **Keyboard support**: Arrow keys and Escape to close
- **Thumbnails**: Thumbnail strip in lightbox mode
- **Zoom & download**: Zoom toggle and download button

**Component**: `PhotoGallery`

---

### Content Reporting

Flag inappropriate content.

- **Reportable types**: listing, forum_post, forum_comment, review, message, event, service
- **Reasons**: spam, inappropriate, harassment, misinformation, scam, other
- **Status workflow**: pending → reviewed → actioned/dismissed

**Component**: `ReportContentModal`

---

### Newsletter Subscription

Email list with preferences.

- **Frequency options**: Daily, weekly, monthly
- **Interest categories**: News, events, deals, jobs
- **Variants**: Inline, card, footer
- **Unsubscribe tokens**: Secure unsubscribe links
- **Duplicate checking**: Prevents duplicate subscriptions

**Component**: `NewsletterSignup`

---

### Emergency Alerts

Site-wide announcements.

- **Severity levels**: Info (blue), warning (amber), critical (red)
- **Dismissible**: Persists dismiss state to localStorage
- **Date targeting**: Start and end dates
- **Town targeting**: Optional town-specific alerts
- **Polling**: Checks every 5 minutes

**Component**: `EmergencyAlertBanner`

---

### Activity Feed

Community activity stream.

- **Action types**: listing_created, event_created, review_posted, deal_posted, forum_post, rsvp, saved_item
- **Refresh capability**: Pull to refresh
- **Town filtering**: Filter by location
- **Timestamps**: Relative time display ("2 hours ago")

**Component**: `ActivityFeed`
**Page**: `/community/activity`

---

### Customizable Dashboard

User account personalization.

- **18 dashboard sections**: Toggle visibility on/off
- **Auto-show**: Sections appear when user creates content of that type
- **Defaults**: Profile, Vendor Dashboard, Orders, Saved, Cart, Messages, Support
- **"Customize Dashboard"**: Collapsible section to toggle sections

**Config**: `frontend/lib/dashboard-config.ts`
**Individual pages**: `/account/my-restaurants`, `/account/my-churches`, etc.

---

### Vendor Features

For business owners and sellers.

- **Verification request**: Users can request vendor verification
- **Verified badge**: Shows on profile and listings
- **Vendor dashboard**: Sales analytics, orders, performance metrics
- **Pending products**: Alert for items awaiting review

**Page**: `/account/vendor`

---

### Profile Completion

Encourage complete profiles.

- **Yellow banner**: Prompts incomplete profiles
- **Required fields**: Name, phone, address
- **Preferred town**: For location-based personalization
- **Sets `profile_completed: true`**: When all fields filled

---

### Location Filter

Filter content by location.

- **Three modes**: My Town, County-Wide, Custom
- **Persists to localStorage**: Remembers user preference
- **Cross-component sync**: Custom event `locationFilterChanged`
- **Town selection modal**: For custom mode

**Components**: `LocationFilter`
**Hook**: `useLocationFilter`

---

### Dark Mode

Theme switching.

- **System preference**: Respects OS setting by default
- **Manual toggle**: User can override
- **Persistence**: Saves to localStorage
- **Tailwind dark classes**: Full dark mode support

**Component**: `DarkModeToggle`

---

### Print Support

Print-friendly pages.

- **Print button**: Triggers browser print dialog
- **Print styles**: Hides nav, buttons; optimizes layout
- **Full-width**: Removes max-width constraints
- **Link URLs**: Shows URLs after links

**Component**: `PrintButton`

---

### PWA Support

Progressive Web App features.

- **Manifest**: `/public/manifest.json`
- **Icons**: App icons for home screen (192x192, 512x512)
- **Installable**: Add to home screen prompt on mobile
- **Standalone mode**: Full-screen app experience

---

### SEO

Search engine optimization.

- **Dynamic sitemap**: `/sitemap.xml` generated from all Strapi content
- **Robots.txt**: Crawling rules with sitemap reference
- **SSG + ISR**: Static generation with incremental revalidation (86400 seconds for guides)
- **Meta tags**: Dynamic OG and Twitter cards per page
- **5 layout variants**: Standard, Split, Cards, Timeline, Magazine

---

## Authentication Flow

```
User clicks "Sign In"
        ↓
Redirect to Google OAuth
        ↓
Google returns auth code
        ↓
NextAuth exchanges for tokens
        ↓
Strapi callback syncs/creates user
        ↓
JWT stored in session with strapiToken
        ↓
Authenticated requests use strapiToken
```

**Session data includes:**
- `strapiToken` - JWT for Strapi API calls
- `strapiUserId` - User ID in Strapi
- `isAdmin` - Admin flag for protected routes

---

## API Client

The `frontend/lib/strapi.ts` provides a comprehensive API client:

```typescript
import { strapi } from '@/lib/strapi';

// Directory
const restaurants = await strapi.directory.find('restaurants', {
  filters: { town: { slug: { $eq: 'corsicana' } } }
});
const restaurant = await strapi.directory.findOne('restaurants', documentId);

// Guides (service pages)
const guides = await strapi.servicePages.find();
const guide = await strapi.servicePages.findBySlug('drivers-license');

// Claim requests (authenticated)
await strapi.claimRequests.create(data, userToken);

// Reviews
const reviews = await strapi.reviews.find('restaurants', entityId);

// Wishlist
await strapi.wishlist.add(itemData, userToken);
await strapi.wishlist.remove(itemId, userToken);

// Notifications
const notifications = await strapi.notifications.find(userToken);
await strapi.notifications.markRead(notificationId, userToken);
```

---

## Protected Routes

Middleware protects these routes (requires authentication):
- `/marketplace/sell` - Create listings
- `/account/*` - User account pages
- `/admin/*` - Admin dashboard (requires `isAdmin`)
- `/community/forum/new` - Create forum posts
- `/directory/[type]/[id]/claim` - Claim listing form

---

## Scripts

### Strapi Scripts

```bash
cd strapi

# Seed public permissions (run after first admin creation)
node scripts/seed-permissions.js

# Seed search synonyms for directory items
node scripts/seed-synonyms.js

# Seed sample data
STRAPI_TOKEN=<token> node scripts/seed.js

# Migrate legacy data
DATABASE_URL=mysql://... STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=<token> node scripts/migrate.js
```

### Frontend Scripts

```bash
cd frontend

# Development
npm run dev

# Production build
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## Strapi v5 Gotchas

Important notes for working with Strapi v5:

1. **Schema files must be `.ts`** - TypeScript compilation doesn't copy JSON files to dist/
2. **Enum values must start with letters** - No `$`, `$$`, numbers, etc.
3. **CORS `enabled` option removed** - Just omit it from middleware config
4. **`@strapi/plugin-i18n`** - Built into core, don't install separately
5. **Relation queries** - Use `populate` not `fields` for relations
6. **Public permissions** - Run `seed-permissions.js` after admin creation

---

## Troubleshooting

### Strapi won't start after schema changes
```bash
cd strapi
rm -rf .cache dist
npm run build
npm run develop
```

### "fetch failed" errors in Next.js
- Ensure Strapi is running on port 1337
- Check `NEXT_PUBLIC_STRAPI_URL` is correct
- Verify API token has correct permissions

### OAuth redirect mismatch
- Google Console: Add `http://localhost:3000/api/auth/callback/google`
- Strapi: Check `FRONTEND_URL` matches Next.js URL

### Content not appearing
- Check Strapi admin: Content published?
- Check permissions: Run `node scripts/seed-permissions.js`

### Weather widget not showing
- Ensure `OPENWEATHER_API_KEY` is set in `.env.local`
- Check API route: `curl http://localhost:3000/api/weather`

### Maps not loading
- Leaflet CSS must be imported in globals.css: `@import 'leaflet/dist/leaflet.css';`
- Ensure leaflet, react-leaflet packages are installed

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Railway deployment instructions.

**Production URLs:**
- Frontend: `https://navarrocounty.com`
- Strapi Admin: `https://cms.navarrocounty.com/admin`
- Strapi API: `https://cms.navarrocounty.com/api`

---

## License

MIT License - See LICENSE file for details.

---

Built for Navarro County, Texas
