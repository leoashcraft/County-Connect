'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Users, Check, Star } from 'lucide-react';
import Link from 'next/link';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface EventRsvpProps {
  eventId: string;
  eventTitle: string;
  className?: string;
  showCounts?: boolean;
}

type RsvpStatus = 'interested' | 'going' | null;

export function EventRsvp({ eventId, eventTitle, className = '', showCounts = true }: EventRsvpProps) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<RsvpStatus>(null);
  const [counts, setCounts] = useState({ interested: 0, going: 0 });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const token = (session as any)?.strapiToken;
  const userId = (session as any)?.strapiUserId;

  // Fetch current RSVP status and counts
  useEffect(() => {
    const fetchRsvpData = async () => {
      try {
        // Fetch counts (public) - larger limit needed to count all RSVPs
        // TODO: Consider server-side aggregation for very large events
        const countsRes = await fetch(
          `${STRAPI_URL}/api/event-rsvps?filters[event][documentId][$eq]=${eventId}&pagination[pageSize]=500`
        );
        if (countsRes.ok) {
          const countsData = await countsRes.json();
          const rsvps = countsData.data || [];
          setCounts({
            interested: rsvps.filter((r: any) => r.status === 'interested').length,
            going: rsvps.filter((r: any) => r.status === 'going').length,
          });
        }

        // Fetch user's RSVP if authenticated
        if (token && userId) {
          const userRes = await fetch(
            `${STRAPI_URL}/api/event-rsvps?filters[event][documentId][$eq]=${eventId}&filters[user][id][$eq]=${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.data?.length > 0) {
              setStatus(userData.data[0].status);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching RSVP data:', e);
      }
      setInitialLoad(false);
    };

    fetchRsvpData();
  }, [eventId, token, userId]);

  const handleRsvp = async (newStatus: RsvpStatus) => {
    if (!token) return;
    setLoading(true);

    try {
      // First check if user already has an RSVP
      const existingRes = await fetch(
        `${STRAPI_URL}/api/event-rsvps?filters[event][documentId][$eq]=${eventId}&filters[user][id][$eq]=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const existingData = await existingRes.json();
      const existingRsvp = existingData.data?.[0];

      if (existingRsvp) {
        if (newStatus === status) {
          // Remove RSVP if clicking same button
          await fetch(`${STRAPI_URL}/api/event-rsvps/${existingRsvp.documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          // Update counts
          setCounts(prev => ({
            ...prev,
            [status as string]: Math.max(0, prev[status as keyof typeof prev] - 1),
          }));
          setStatus(null);
        } else {
          // Update existing RSVP
          await fetch(`${STRAPI_URL}/api/event-rsvps/${existingRsvp.documentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: { status: newStatus } }),
          });

          // Update counts
          setCounts(prev => ({
            interested: prev.interested + (newStatus === 'interested' ? 1 : 0) - (status === 'interested' ? 1 : 0),
            going: prev.going + (newStatus === 'going' ? 1 : 0) - (status === 'going' ? 1 : 0),
          }));
          setStatus(newStatus);
        }
      } else {
        // Create new RSVP
        await fetch(`${STRAPI_URL}/api/event-rsvps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              event: eventId,
              user: userId,
              status: newStatus,
            },
          }),
        });

        setCounts(prev => ({
          ...prev,
          [newStatus as string]: prev[newStatus as keyof typeof prev] + 1,
        }));
        setStatus(newStatus);
      }
    } catch (e) {
      console.error('Error updating RSVP:', e);
    }
    setLoading(false);
  };

  if (initialLoad) {
    return (
      <div className={`animate-pulse flex gap-2 ${className}`}>
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <Link
          href={`/login?callbackUrl=/directory/events/${eventId}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Sign in to RSVP
        </Link>
        {showCounts && (counts.interested > 0 || counts.going > 0) && (
          <p className="text-sm text-gray-500 flex items-center gap-3">
            {counts.going > 0 && (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-500" />
                {counts.going} going
              </span>
            )}
            {counts.interested > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" />
                {counts.interested} interested
              </span>
            )}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex gap-2">
        <button
          onClick={() => handleRsvp('interested')}
          disabled={loading}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            status === 'interested'
              ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
          }`}
        >
          <Star className={`w-4 h-4 ${status === 'interested' ? 'fill-amber-500' : ''}`} />
          Interested
          {showCounts && counts.interested > 0 && (
            <span className="text-sm opacity-70">({counts.interested})</span>
          )}
        </button>
        <button
          onClick={() => handleRsvp('going')}
          disabled={loading}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            status === 'going'
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
          }`}
        >
          <Check className={`w-4 h-4 ${status === 'going' ? '' : ''}`} />
          Going
          {showCounts && counts.going > 0 && (
            <span className="text-sm opacity-70">({counts.going})</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Simple badge showing attendee counts
export function EventAttendeeBadge({ eventId }: { eventId: string }) {
  const [counts, setCounts] = useState({ interested: 0, going: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/event-rsvps?filters[event][documentId][$eq]=${eventId}&pagination[pageSize]=500`
        );
        if (res.ok) {
          const data = await res.json();
          const rsvps = data.data || [];
          setCounts({
            interested: rsvps.filter((r: any) => r.status === 'interested').length,
            going: rsvps.filter((r: any) => r.status === 'going').length,
          });
        }
      } catch (e) {
        // Ignore errors for badge display
      }
    };
    fetchCounts();
  }, [eventId]);

  if (counts.interested === 0 && counts.going === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Users className="w-4 h-4" />
      {counts.going > 0 && <span>{counts.going} going</span>}
      {counts.going > 0 && counts.interested > 0 && <span>·</span>}
      {counts.interested > 0 && <span>{counts.interested} interested</span>}
    </div>
  );
}
