# County Connect Backend API

A Node.js/Express backend API for the County Connect marketplace application with OAuth authentication and entity management.

## Features

- ✅ Google OAuth 2.0 authentication
- ✅ JWT token-based authorization
- ✅ RESTful API for entity CRUD operations
- ✅ SQLite database with JSON document storage
- ✅ Rate limiting and security middleware
- ✅ CORS configuration
- ✅ Graceful shutdown handling

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** SQLite3 (better-sqlite3)
- **Authentication:** JWT + OAuth 2.0
- **Security:** Helmet, CORS, Rate Limiting

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js          # Application configuration
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── database.js         # Database initialization
│   │   ├── User.js             # User model
│   │   └── Entity.js           # Generic entity model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── entities.js         # Entity CRUD routes
│   ├── services/
│   │   └── oauthService.js     # OAuth provider integration
│   ├── scripts/
│   │   └── initDatabase.js     # Database initialization script
│   └── server.js               # Main application entry point
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_PATH=./database.sqlite

# CORS Configuration (your frontend URL)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Set **Application type** to "Web application"
7. Add **Authorized redirect URIs**:
   - `http://localhost:5173/auth/callback` (for development)
   - Your production URL for production
8. Copy the **Client ID** and **Client Secret** to your `.env` file

### 4. Initialize Database

```bash
npm run init-db
```

This will:
- Create the database tables
- Create a test admin user (admin@test.com)
- Add sample entities for testing

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/callback`
Exchange OAuth authorization code for JWT token.

**Request:**
```json
{
  "code": "oauth_authorization_code",
  "provider": "google",
  "redirectUri": "http://localhost:5173/auth/callback"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "full_name": "User Name",
    "picture": "https://...",
    "role": "user",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "full_name": "User Name",
  "picture": "https://...",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT `/api/auth/me`
Update current user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "full_name": "New Name",
  "picture": "https://new-picture-url.com/image.jpg"
}
```

### Entity Endpoints

All entity endpoints support the following entity types:
- `Store`
- `Product`
- `Service`
- `Cart`
- `Order`
- `Wishlist`
- `Review`
- `Message`
- `SupportTicket`
- And any other entity type your frontend uses

#### GET `/api/entities/:entityType`
List all entities of a type.

**Query Parameters:**
- `sort` - Sort field (prefix with `-` for descending, e.g., `-created_date`)
- `limit` - Number of results to return
- `skip` - Number of results to skip (pagination)
- `q` - JSON query string for filtering (e.g., `{"status":"active"}`)

**Examples:**
```
GET /api/entities/Product?sort=-created_date&limit=10
GET /api/entities/Store?q={"is_active":true}
```

#### GET `/api/entities/:entityType/:id`
Get a single entity by ID.

**Example:**
```
GET /api/entities/Product/123e4567-e89b-12d3-a456-426614174000
```

#### POST `/api/entities/:entityType`
Create a new entity (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "status": "active"
}
```

#### POST `/api/entities/:entityType/bulk`
Bulk create multiple entities (requires authentication).

**Request:**
```json
[
  { "name": "Product 1", "price": 10.00 },
  { "name": "Product 2", "price": 20.00 }
]
```

#### PUT `/api/entities/:entityType/:id`
Update an entity (requires authentication).

**Request:**
```json
{
  "name": "Updated Product Name",
  "price": 34.99
}
```

#### DELETE `/api/entities/:entityType/:id`
Delete an entity (requires authentication).

**Response:** 204 No Content

#### DELETE `/api/entities/:entityType`
Delete multiple entities matching a query (requires authentication).

**Request:**
```json
{
  "status": "inactive"
}
```

**Response:**
```json
{
  "deletedCount": 5
}
```

### Health Check

#### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  picture TEXT,
  role TEXT DEFAULT 'user',
  oauth_provider TEXT,
  oauth_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### Entities Table
```sql
CREATE TABLE entities (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  data TEXT NOT NULL,
  created_by TEXT,
  created_date TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_date TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
)
```

The entities table uses a flexible JSON storage approach where all entity data is stored in the `data` column as JSON. This allows you to create any entity type without schema changes.

## Security Features

- **Helmet:** Secure HTTP headers
- **CORS:** Configurable cross-origin resource sharing
- **Rate Limiting:** Prevents brute-force attacks
- **JWT Authentication:** Secure token-based auth
- **Input Validation:** Validates and sanitizes user input

## Development

### Running Tests
```bash
npm test
```

### Database Management

**Reset database:**
```bash
rm database.sqlite
npm run init-db
```

**View database:**
```bash
sqlite3 database.sqlite
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong `JWT_SECRET` (generate with `openssl rand -base64 32`)
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name county-connect-api
   ```
6. Set up database backups
7. Configure proper rate limiting for your traffic

## Troubleshooting

### EADDRINUSE Error
Port already in use. Change the PORT in `.env` or kill the process:
```bash
lsof -ti:3000 | xargs kill -9
```

### Database Locked
SQLite database is locked. Ensure only one process is accessing it.

### OAuth Errors
- Verify Google OAuth credentials are correct
- Check that redirect URI matches exactly
- Ensure the OAuth consent screen is configured

## License

MIT
