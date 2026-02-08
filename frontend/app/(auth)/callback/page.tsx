'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Validate redirect URL to prevent open redirect attacks
function getSafeRedirectUrl(callbackUrl: string | null): string {
  if (!callbackUrl) return '/';

  try {
    const url = new URL(callbackUrl, window.location.origin);

    // Only allow same-origin redirects
    if (url.origin !== window.location.origin) {
      console.warn('Blocked external redirect attempt:', callbackUrl);
      return '/';
    }

    // Only allow path-based redirects (no protocol handlers like javascript:)
    if (!url.pathname.startsWith('/')) {
      return '/';
    }

    return url.pathname + url.search + url.hash;
  } catch {
    // Invalid URL, redirect to home
    return '/';
  }
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // NextAuth handles the callback automatically via the [...nextauth] route
    // This page is a fallback for the old OAuth flow
    const callbackUrl = searchParams.get('callbackUrl');
    const safeRedirect = getSafeRedirectUrl(callbackUrl);
    router.replace(safeRedirect);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
