import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'https',
        hostname: 'cms.navarrocounty.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Redirect old SPA routes to new paths
      { source: '/ServiceDirectory', destination: '/services', permanent: true },
      { source: '/Jobs', destination: '/directory/jobs', permanent: true },
      { source: '/Restaurants', destination: '/directory/restaurants', permanent: true },
      { source: '/Churches', destination: '/directory/churches', permanent: true },
      { source: '/Schools', destination: '/directory/schools', permanent: true },
      { source: '/Events', destination: '/directory/events', permanent: true },
      { source: '/FoodTrucks', destination: '/directory/food-trucks', permanent: true },
      { source: '/Realty', destination: '/directory/real-estate', permanent: true },
      { source: '/CommunityResources', destination: '/directory/community-resources', permanent: true },
      { source: '/SportsTeams', destination: '/directory/sports-teams', permanent: true },
      { source: '/Attractions', destination: '/directory/attractions', permanent: true },
      { source: '/BulletinBoard', destination: '/community/bulletin', permanent: true },
      { source: '/LostAndFound', destination: '/community/lost-and-found', permanent: true },
      { source: '/TownSquare', destination: '/community/forum', permanent: true },
    ];
  },
};

export default nextConfig;
