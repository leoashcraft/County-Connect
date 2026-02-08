'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LifeBuoy, MessageSquare, Clock, User, ChevronRight, AlertCircle, ShieldX } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-100 text-red-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function AdminSupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  const isAdmin = (session?.user as any)?.isAdmin;

  useEffect(() => {
    // Redirect non-admins
    if (status === 'authenticated' && !isAdmin) {
      router.push('/');
      return;
    }
    if (session && isAdmin) loadTickets();
  }, [session, filter, status, isAdmin, router]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const token = (session?.user as any)?.strapiToken;
      const filterQuery = filter !== 'all' ? `&filters[status][$eq]=${filter}` : '';
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/support-tickets?populate=submitter&sort=createdAt:desc${filterQuery}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const data = await res.json();
      setTickets(data.data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
    setLoading(false);
  };

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  // Access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <ShieldX className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <LifeBuoy className="w-7 h-7 text-red-500" />
            Support Tickets
          </h1>
          <p className="text-gray-600 mt-1">Manage customer support requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'open', 'in-progress', 'resolved', 'closed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === s ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
        </div>
      ) : tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket: any) => (
            <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{ticket.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.medium}`}>
                      {ticket.priority}
                    </span>
                    {ticket.submitter && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <User className="w-3.5 h-3.5" />
                        {ticket.submitter.username || ticket.submitter.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No tickets found</h2>
          <p className="text-gray-500">
            {filter !== 'all' ? `No ${filter} tickets. Try changing the filter.` : 'No support tickets yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
