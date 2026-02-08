'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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

export default function TicketDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session && ticketId) {
      loadTicket();
    }
  }, [session, ticketId]);

  const loadTicket = async () => {
    try {
      const token = (session?.user as any)?.strapiToken;

      if (!token) {
        setError('Authentication required');
        return;
      }

      const res = await fetch(`${STRAPI_URL}/api/support-tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          setError('Ticket not found');
        } else {
          setError('Failed to load ticket');
        }
        return;
      }

      const data = await res.json();
      setTicket(data.data);
    } catch (err) {
      console.error('Error loading ticket:', err);
      setError('An error occurred while loading the ticket');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <AlertCircle className="w-4 h-4" />
            Open
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
            <Clock className="w-4 h-4" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-4 h-4" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: 'General',
      technical: 'Technical',
      billing: 'Billing',
      'report-issue': 'Report Issue',
      other: 'Other',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-brand-600">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/account" className="hover:text-brand-600">
                Account
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/account/support" className="hover:text-brand-600">
                Support
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Ticket</span>
            </nav>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {error || 'Ticket not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The ticket you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <Link
              href="/account/support"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Support
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/account" className="hover:text-brand-600">
              Account
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/account/support" className="hover:text-brand-600">
              Support
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Ticket #{ticket.id}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/account/support"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Support
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="px-2.5 py-0.5 bg-gray-100 rounded-full">
                    {getCategoryLabel(ticket.category)}
                  </span>
                  <span>Submitted {formatDate(ticket.createdAt)}</span>
                </div>
              </div>
              {getStatusBadge(ticket.status)}
            </div>
          </div>

          {/* Message */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">You</span>
                  <span className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                Last updated: {formatDate(ticket.updatedAt)}
              </span>
            </div>
            {ticket.status === 'open' && (
              <p className="text-sm text-gray-500 mt-2">
                Our team will respond to your request as soon as possible.
              </p>
            )}
            {ticket.status === 'in-progress' && (
              <p className="text-sm text-gray-500 mt-2">
                We&apos;re currently working on your request.
              </p>
            )}
            {ticket.status === 'resolved' && (
              <p className="text-sm text-green-600 mt-2">
                This ticket has been resolved. If you have further questions, please open a new ticket.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
