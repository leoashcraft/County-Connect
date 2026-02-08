'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, Shield, Loader2 } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface VerificationCardProps {
  isVerified: boolean;
  verificationRequested: boolean;
  userId: number;
  token: string;
}

export default function VerificationCard({
  isVerified,
  verificationRequested,
  userId,
  token,
}: VerificationCardProps) {
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestVerification = async () => {
    setRequesting(true);
    setError(null);

    try {
      const res = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verification_requested: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Failed to submit verification request');
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setRequesting(false);
    }
  };

  // Verified vendor
  if (isVerified) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Verified Vendor</h3>
            <p className="text-green-700 mt-1">
              Your account is verified. Customers can trust your listings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verification pending
  if (verificationRequested) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-800">Verification Pending</h3>
            <p className="text-amber-700 mt-1">
              Your verification request is being reviewed. This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not verified, not requested
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Get Verified</h3>
          <p className="text-gray-600 mt-1 mb-4">
            Stand out from the crowd and build customer trust.
          </p>
          <ul className="space-y-2 mb-5">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              Build trust with customers
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              Priority support from our team
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              Verified badge on all your listings
            </li>
          </ul>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleRequestVerification}
            disabled={requesting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {requesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Requesting...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Request Verification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
