import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Admin routes require admin role
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!token?.isAdmin) {
        // Redirect non-admins to home page
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const protectedPaths = [
          '/marketplace/sell',
          '/account',
          '/admin',
          '/community/forum/new',
        ];

        const isProtected = protectedPaths.some(path =>
          req.nextUrl.pathname.startsWith(path)
        );

        if (isProtected) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/marketplace/sell/:path*',
    '/account/:path*',
    '/admin/:path*',
    '/community/forum/new',
  ],
};
