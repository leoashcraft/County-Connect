# County Connect - Strapi CMS

Strapi v5 CMS backend for County Connect (Navarro County community platform).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run develop
```

Admin panel: http://localhost:1337/admin

## First-Time Setup

1. **Start Strapi** - `npm run develop`
2. **Create admin account** when prompted (or use `admin@navarrocounty.com` / `Admin123!`)
3. **Create API Token** for seed scripts:
   - Go to Settings → API Tokens
   - Click "Create new API Token"
   - Name: `Seed Script`, Token type: `Full access`
   - Copy the generated token

## Database Seeding

### Quick Method (All Data)

```bash
cd strapi
STRAPI_TOKEN=your_api_token node scripts/seed-all.js
```

### Individual Scripts

Run scripts in this order for manual seeding:

```bash
# 1. Towns (17 Navarro County towns with zip codes)
node scripts/seed-towns.js

# 2. Service listing categories
node scripts/seed-service-categories.js

# 3. Main data (churches, restaurants, schools, businesses)
STRAPI_TOKEN=your_token node scripts/seed.js

# 4. Service pages (302+ SEO guide pages)
STRAPI_TOKEN=your_token node scripts/seed-new-services.js

# 5. User permissions (public/authenticated roles)
node scripts/seed-permissions.js

# 6. Search synonyms (keyword synonyms for search)
node scripts/seed-synonyms.js
```

### Script Options

```bash
# Skip specific steps
node scripts/seed-all.js --skip=service-pages,synonyms

# Run only specific steps
node scripts/seed-all.js --only=towns,permissions

# Dry run (show what would be done)
node scripts/seed-all.js --dry-run
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `STRAPI_URL` | `http://localhost:1337` | Strapi server URL |
| `STRAPI_TOKEN` | - | API token (full access) |
| `ADMIN_EMAIL` | `admin@navarrocounty.com` | Admin email for login |
| `ADMIN_PASSWORD` | `Admin123!` | Admin password |

## Content Types

### Directory Types
- `restaurant` - Restaurants and food establishments
- `church` - Churches and religious organizations
- `school` - Schools, daycares, educational facilities
- `event` - Community events
- `local-business` - Generic business type with subtypes:
  - `business` - General businesses
  - `food-truck` - Food trucks
  - `sports-team` - Sports teams
  - `community-resource` - Community resources
  - `attraction` - Attractions and points of interest
  - `public-service` - Government and public services

### Marketplace Types
- `marketplace-listing` - Products for sale
- `marketplace-category` - Product categories
- `service-listing` - Services offered
- `service-listing-category` - Service categories

### Other Types
- `town` - Towns/cities in Navarro County
- `service-page` - SEO informational pages (guides)
- `deal` - Business deals and promotions
- `event-rsvp` - Event RSVPs
- `claim-request` - Listing claim requests
- `review` - Business reviews
- `notification` - User notifications
- `message` - User messages
- `support-ticket` - Support tickets
- `wishlist-item` - Saved items
- `wishlist-collection` - Saved item collections

## API Endpoints

Public API: `http://localhost:1337/api/`

Examples:
```bash
# Get all restaurants
curl http://localhost:1337/api/restaurants

# Get restaurant with relations
curl "http://localhost:1337/api/restaurants?populate=town,owner"

# Search by name
curl "http://localhost:1337/api/restaurants?filters[name][\$containsi]=grill"
```

## Production Deployment

See `DEPLOYMENT.md` in the project root for Railway deployment instructions.

### Environment Variables for Production

```env
# Required
DATABASE_CLIENT=mysql
DATABASE_HOST=your-mysql-host
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-password
DATABASE_SSL=true

# Strapi
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random-salt
ADMIN_JWT_SECRET=random-secret
TRANSFER_TOKEN_SALT=random-salt
JWT_SECRET=random-secret

# Optional
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
```
