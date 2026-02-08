# County Connect - Deployment Guide

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────>│   Strapi CMS    │
│   (Railway)     │     │   (Railway)     │
│   Port 3000     │     │   Port 1337     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────┬───────────────┘
                 ▼
         ┌───────────────┐
         │  MySQL (shared)│
         │  (Railway)     │
         └───────────────┘
```

## Railway Setup

### 1. Create Services

Create three Railway services in one project:
- **MySQL** - Use Railway's MySQL template
- **Strapi** - Deploy from `strapi/` directory
- **Next.js** - Deploy from `frontend/` directory

### 2. Strapi Environment Variables

```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_URL=${{MySQL.DATABASE_URL}}
APP_KEYS=<generate-4-random-keys>
API_TOKEN_SALT=<generate-random>
ADMIN_JWT_SECRET=<generate-random>
TRANSFER_TOKEN_SALT=<generate-random>
JWT_SECRET=<generate-random>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONTEND_URL=https://navarrocounty.com
STRAPI_URL=https://cms.navarrocounty.com
```

### 3. Next.js Environment Variables

```
NEXT_PUBLIC_STRAPI_URL=https://cms.navarrocounty.com
STRAPI_API_TOKEN=<create-in-strapi-admin>
NEXTAUTH_URL=https://navarrocounty.com
NEXTAUTH_SECRET=<generate-random>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### 4. Custom Domains

- Next.js: `navarrocounty.com`
- Strapi: `cms.navarrocounty.com` (or use Railway internal networking)

### 5. Data Migration

```bash
# After Strapi is running and admin is set up:

# 1. Create an API token in Strapi admin
#    Settings → API Tokens → Create new → Full access

# 2. Seed service pages from existing data
cd strapi
STRAPI_URL=https://cms.navarrocounty.com STRAPI_TOKEN=<token> node scripts/seed.js

# 3. Migrate from existing database (if needed)
DATABASE_URL=<old-db-url> STRAPI_URL=https://cms.navarrocounty.com STRAPI_TOKEN=<token> node scripts/migrate.js
```

## Strapi Permissions Setup

After creating the admin account, configure permissions:

**Settings → Users & Permissions → Roles → Public:**
- All directory types (restaurants, churches, etc.): `find`, `findOne`
- service-pages, service-categories: `find`, `findOne`
- towns, reviews: `find`, `findOne`

**Settings → Users & Permissions → Roles → Authenticated:**
- claim-request: `create`, `find`, `findOne`
- reviews: `create`
- marketplace-listings: `create`, `update`, `delete` (own)
- forum-posts, forum-comments: `create`

**Note:** Claim approval/rejection requires admin (`is_admin` flag on user).

## Cutover Checklist

- [ ] Strapi deployed and admin account created
- [ ] API token created for Next.js
- [ ] Public/Authenticated permissions configured
- [ ] Service pages seeded (302 pages)
- [ ] Google OAuth configured for new domain
- [ ] DNS pointed to Next.js service
- [ ] SSL certificates active
- [ ] All service pages render correctly
- [ ] Directory pages render with claim buttons
- [ ] Sitemap submitted to Google Search Console
- [ ] Old Express app available as fallback
- [ ] Monitor for 404s in first 48 hours
