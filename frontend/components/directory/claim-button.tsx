'use client';

import Link from 'next/link';
import { ShieldCheck, LogIn, Flag } from 'lucide-react';

interface ClaimButtonProps {
  type: string;
  id: string;
  isAuthenticated: boolean;
  isOwner: boolean;
  hasOwner: boolean;
  theme: {
    callBg: string;
    callHoverBg: string;
  };
}

export function ClaimButton({
  type,
  id,
  isAuthenticated,
  isOwner,
  hasOwner,
  theme,
}: ClaimButtonProps) {
  // Owner sees "Your Listing" badge
  if (isOwner) {
    return (
      <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Your Listing</h3>
            <p className="text-sm text-green-600">You manage this listing</p>
          </div>
        </div>
      </div>
    );
  }

  // If someone else owns it, show nothing (or could show "Verified Listing")
  if (hasOwner) {
    return (
      <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">Verified Listing</h3>
            <p className="text-sm text-blue-600">This listing is claimed</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show sign in prompt
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Flag className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Is this your business?</h3>
            <p className="text-sm text-gray-600">Claim this listing to manage it</p>
          </div>
        </div>
        <Link
          href={`/login?callbackUrl=/directory/${type}/${id}/claim`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign In to Claim
        </Link>
      </div>
    );
  }

  // Authenticated and unclaimed - show claim button
  return (
    <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <Flag className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-800">Is this your business?</h3>
          <p className="text-sm text-amber-600">Claim it to update info and respond to reviews</p>
        </div>
      </div>
      <Link
        href={`/directory/${type}/${id}/claim`}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 ${theme.callBg} ${theme.callHoverBg} text-white rounded-lg font-medium transition-colors`}
      >
        <Flag className="w-4 h-4" />
        Claim This Listing
      </Link>
    </div>
  );
}
