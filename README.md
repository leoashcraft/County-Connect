# County Connect

A modern, full-stack marketplace application for local communities with OAuth authentication and real-time entity management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## 🚀 Features

- **🔐 Secure Authentication**: Local OAuth 2.0 with Google integration
- **🛍️ Marketplace**: Full-featured store and product management
- **📦 Orders & Cart**: Complete e-commerce functionality
- **💬 Messaging**: Built-in communication system
- **⭐ Reviews & Wishlist**: Customer engagement features
- **👥 Multi-role Support**: Admin, vendor, and customer roles
- **📱 Responsive Design**: Works on desktop and mobile
- **🎨 Modern UI**: Built with TailwindCSS and shadcn/ui

## 📋 Quick Start

### Prerequisites

- Node.js 18 or higher
- Google Cloud Console account (for OAuth)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd county-connect
   ```

2. **Set up Google OAuth** (5 minutes)
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:5173/auth/callback`
   - Copy Client ID and Client Secret

3. **Set up Backend** (2 minutes)
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your Google OAuth credentials
   npm run init-db
   npm run dev
   ```

4. **Set up Frontend** (2 minutes)
   ```bash
   # In a new terminal, from project root
   npm install
   cp .env.example .env
   # Edit .env with your Google Client ID
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Click "Sign In" and authenticate with Google
   - Start exploring! 🎉

📖 **Detailed setup instructions:** See [SETUP.md](SETUP.md)

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- shadcn/ui components
- React Router for navigation
- Axios for API calls

**Backend:**
- Node.js with Express
- SQLite database (better-sqlite3)
- JWT authentication
- OAuth 2.0 integration
- RESTful API design

### Project Structure

```
county-connect/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── config/      # App configuration
│   │   ├── middleware/  # Auth & security
│   │   ├── models/      # Database models
│   │   ├── routes/      # API endpoints
│   │   └── services/    # Business logic
│   └── package.json
│
├── src/                  # React frontend
│   ├── api/             # API client
│   ├── auth/            # Auth context & service
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   └── App.jsx
│
├── .env.example         # Frontend env template
├── SETUP.md            # Quick setup guide
└── package.json
```

## 🔑 Authentication Flow

1. User clicks "Sign In"
2. Redirected to Google OAuth
3. User authorizes the application
4. Google redirects back with authorization code
5. Backend exchanges code for user info
6. Backend generates JWT token
7. Frontend stores token and user data
8. Authenticated requests include JWT in headers

## 📡 API Endpoints

### Authentication
- `POST /api/auth/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Entities (Store, Product, Service, Cart, Order, etc.)
- `GET /api/entities/:type` - List entities
- `GET /api/entities/:type/:id` - Get single entity
- `POST /api/entities/:type` - Create entity (auth required)
- `PUT /api/entities/:type/:id` - Update entity (auth required)
- `DELETE /api/entities/:type/:id` - Delete entity (auth required)

📖 **Full API documentation:** See [backend/README.md](backend/README.md)

## 🛠️ Development

### Running the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

### Database Management

**View database:**
```bash
cd backend
sqlite3 database.sqlite
```

**Reset database:**
```bash
cd backend
rm database.sqlite
npm run init-db
```

### Environment Variables

**Frontend (.env):**
```env
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:3000/api
```

**Backend (.env):**
```env
PORT=3000
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
FRONTEND_URL=http://localhost:5173
```

## 🚢 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Set `NODE_ENV=production`
3. Use a strong `JWT_SECRET`
4. Configure CORS for your domain
5. Set up SSL/TLS certificates
6. Use PM2 or similar for process management

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Update `VITE_API_BASE_URL` to production API URL
4. Update Google OAuth redirect URIs

Recommended platforms:
- **Backend:** Railway, Render, DigitalOcean, AWS
- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Database:** Consider upgrading to PostgreSQL for production

## 🔒 Security Features

- JWT token-based authentication
- OAuth 2.0 with Google
- CORS protection
- Rate limiting
- Helmet security headers
- SQL injection prevention
- XSS protection
- CSRF protection

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
npm test
```

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Quick setup guide
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in .env or kill process
lsof -ti:3000 | xargs kill -9
```

**OAuth redirect mismatch:**
- Ensure redirect URI matches exactly in Google Console and .env
- Include protocol (http/https), port, and path

**CORS errors:**
- Verify `FRONTEND_URL` in backend/.env matches your frontend URL

**Database locked:**
- Only one process can access SQLite at a time
- Check for hanging processes

## 🆘 Support

If you encounter issues:
1. Check the console for error messages
2. Review environment variable configuration
3. Verify Google OAuth setup
4. Ensure both servers are running
5. Check the troubleshooting section in docs

## 🙏 Acknowledgments

- React and the React team
- Express.js
- TailwindCSS
- shadcn/ui components
- All open-source contributors

---

Made with ❤️ for local communities
