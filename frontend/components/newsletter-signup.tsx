'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer';
  className?: string;
}

export function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email } }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage(data.message || 'Thanks for subscribing!');
      setEmail('');
    } catch (e: any) {
      setStatus('error');
      setMessage(e.message || 'Something went wrong. Please try again.');
    }
  };

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="text-sm font-semibold text-white mb-3">Stay Updated</h3>
        <p className="text-sm text-gray-400 mb-3">
          Get weekly updates on local events, deals, and community news.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === 'success' && <Check className="w-4 h-4" />}
            {status === 'success' ? 'Done' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p className={`text-xs mt-2 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Stay in the Loop</h3>
            <p className="text-sm text-gray-600">Weekly Navarro County updates</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg">
            <Check className="w-5 h-5" />
            <span className="font-medium">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
              Subscribe for Free
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-600 text-center">{message}</p>
            )}
          </form>
        )}
        <p className="text-xs text-gray-500 mt-3 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
        <div className="relative flex-1">
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for updates"
            required
            disabled={status === 'loading' || status === 'success'}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-6 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'success' && <Check className="w-4 h-4" />}
          {status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
