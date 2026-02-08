'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  CheckCircle,
  MessageSquarePlus,
  Ticket,
  Clock,
  AlertCircle,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'report-issue', label: 'Report Issue' },
  { value: 'other', label: 'Other' },
];

interface SupportTicket {
  id: number;
  documentId: string;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
  });

  useEffect(() => {
    if (session) {
      loadTickets();
    }
  }, [session]);

  const loadTickets = async () => {
    try {
      const token = (session?.user as any)?.strapiToken;
      const userId = (session?.user as any)?.strapiUserId;

      if (!token || !userId) return;

      const res = await fetch(
        `${STRAPI_URL}/api/support-tickets?filters[user][id][$eq]=${userId}&sort=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!session?.user) {
        throw new Error('Authentication required');
      }

      // Token is now handled server-side for security
      const res = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Failed to submit ticket');
      }

      setSuccess(true);
      setFormData({ subject: '', category: '', message: '' });

      // Reload tickets after a brief delay
      setTimeout(() => {
        loadTickets();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <AlertCircle className="w-3 h-3" />
            Open
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/account" className="hover:text-brand-600">
              Account
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Support</span>
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">Get help or report an issue</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit a Support Request */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquarePlus className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Submit a Support Request</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Describe your issue and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ticket Submitted</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We&apos;ll respond to your request soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please describe your issue in detail..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !formData.subject || !formData.category || !formData.message}
                  className="w-full py-3 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquarePlus className="w-5 h-5" />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* My Support Tickets */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Ticket className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">My Support Tickets</h2>
                <p className="text-gray-600 text-sm mt-1">
                  View and track your previous support requests.
                </p>
              </div>
            </div>

            {tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/account/support/${ticket.documentId}`}
                    className="block p-4 border border-gray-200 rounded-xl hover:border-brand-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {ticket.category.replace('-', ' ')}
                        </p>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(ticket.createdAt)}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No tickets yet</h3>
                <p className="text-gray-500 text-sm">
                  You haven&apos;t submitted any support requests.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
