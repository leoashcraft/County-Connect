# County Connect - Quick Setup Guide

Complete setup guide for the County Connect marketplace application with local OAuth authentication.

## Project Overview

This is a full-stack marketplace application with:
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express + SQLite
- **Authentication:** Local OAuth 2.0 with Google

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Cloud Console account (for OAuth)
- Terminal/Command line access

### Step 1: Set Up Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - Add test users if in development
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (development)
     - Add production URL when deploying
7. Copy **Client ID** and **Client Secret**

### Step 2: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your Google OAuth credentials
# Required variables:
# - GOOGLE_CLIENT_ID=your_client_id_here
# - GOOGLE_CLIENT_SECRET=your_client_secret_here
# - JWT_SECRET=generate_a_secure_random_string

# Initialize database
npm run init-db

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

### Step 3: Set Up Frontend

```bash
# Open a new terminal
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set:
# VITE_GOOGLE_CLIENT_ID=your_client_id_here
# VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
# VITE_API_BASE_URL=http://localhost:3000/api

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 4: Test the Application

1. Open browser to `http://localhost:5173`
2. Click "Sign In" button
3. You'll be redirected to Google OAuth
4. After authentication, you'll be redirected back to the app
5. You should now be logged in!

## Project Structure

```
county-connect/
├── backend/                  # Backend API server
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.js        # Main server file
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── src/                      # Frontend application
│   ├── api/                 # API client
│   ├── auth/                # Authentication logic
│   ├── components/          # React components
│   ├── pages/               # Page components
│   └── App.jsx
├── .env.example
├── package.json
├── MIGRATION_GUIDE.md       # Detailed migration info
├── SETUP.md                 # This file
└── README.md
```

## Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_PATH=./database.sqlite
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:3000/api
```

## Common Issues

### Port Already in Use
If port 3000 or 5173 is in use:
```bash
# Change PORT in backend/.env
PORT=3001

# OR kill the process
lsof -ti:3000 | xargs kill -9
```

### OAuth Redirect Mismatch
Ensure the redirect URI in:
- Google Cloud Console
- Frontend .env (`VITE_OAUTH_REDIRECT_URI`)
- Match exactly (including http/https, port, path)

### CORS Errors
Check that `FRONTEND_URL` in backend/.env matches your frontend URL exactly.

### Database Errors
Reset the database:
```bash
cd backend
rm database.sqlite
npm run init-db
```

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev  # Auto-reloads on changes
```

### Frontend Development
```bash
npm run dev  # Auto-reloads on changes
```

### View Database
```bash
cd backend
sqlite3 database.sqlite
.tables
SELECT * FROM users;
.quit
```

## API Testing

You can test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Get products (no auth required)
curl http://localhost:3000/api/entities/Product

# Create a product (requires auth token)
curl -X POST http://localhost:3000/api/entities/Product \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":29.99}'
```

## Next Steps

1. **Add More OAuth Providers:** See `backend/src/services/oauthService.js`
2. **Customize Entities:** The system supports any entity type
3. **Add File Upload:** Implement file storage for product images
4. **Deploy:** See deployment guide in backend/README.md
5. **Add Email:** Integrate email service for notifications

## Resources

- [Backend API Documentation](backend/README.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure Google OAuth is configured properly
4. Check that both frontend and backend are running
5. Review the logs in both terminal windows

## License

MIT
