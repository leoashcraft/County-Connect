import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/auth/authService';
import { useAuth } from '@/auth/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, refreshUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        throw new Error(searchParams.get('error_description') || 'Authentication failed');
      }

      if (!code || !state) {
        throw new Error('Missing authentication parameters');
      }

      // Handle the OAuth callback
      const { user, nextUrl } = await authService.handleCallback(code, state);

      setUser(user);

      // Check for stored redirect URL from "Add" buttons
      const storedRedirect = localStorage.getItem('redirectAfterLogin');
      if (storedRedirect) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(storedRedirect, { replace: true });
        return;
      }

      // Redirect to the original page or home
      const redirectUrl = nextUrl || '/marketplace';
      navigate(redirectUrl, { replace: true });

    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err.message);

      // Redirect to marketplace after 3 seconds
      setTimeout(() => {
        navigate('/marketplace', { replace: true });
      }, 3000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
          <p className="text-gray-600">Please wait while we complete your authentication...</p>
        </div>
      </div>
    </div>
  );
}
