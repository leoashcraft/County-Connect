import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // Use Strapi's Google provider callback to create/find user and get JWT.
        // This handles email deduplication: if a user registered with email/password
        // and later signs in with Google (same email), Strapi links them automatically.
        try {
          const strapiRes = await fetch(
            `${STRAPI_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`
          );
          const strapiData = await strapiRes.json();

          if (strapiData.jwt) {
            token.strapiToken = strapiData.jwt;
            token.strapiUserId = strapiData.user?.id;

            // Fetch full profile to get is_admin flag
            const meRes = await fetch(`${STRAPI_URL}/api/users/me`, {
              headers: { Authorization: `Bearer ${strapiData.jwt}` },
            });
            if (meRes.ok) {
              const me = await meRes.json();
              token.isAdmin = me.is_admin === true;
            }
          } else {
            console.error('Strapi OAuth callback failed:', strapiData.error || strapiData);
          }
        } catch (error) {
          console.error('Error getting Strapi JWT:', error);
        }

        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        if (token.isAdmin === undefined) {
          token.isAdmin = false;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).strapiToken = token.strapiToken;
        (session.user as any).strapiUserId = token.strapiUserId;
        (session.user as any).isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};
