'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Calendar, Star, MessageSquare, Tag, Heart,
  Users, Clock, RefreshCw
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface ActivityItem {
  id: string;
  documentId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  entityUrl: string;
  createdAt: string;
  user?: {
    username?: string;
    full_name?: string;
  };
  town?: {
    name: string;
  };
}

const ACTION_CONFIG: Record<string, { icon: any; verb: string; color: string }> = {
  listing_created: { icon: ShoppingBag, verb: 'listed', color: 'text-blue-500' },
  event_created: { icon: Calendar, verb: 'added event', color: 'text-pink-500' },
  review_posted: { icon: Star, verb: 'reviewed', color: 'text-amber-500' },
  deal_posted: { icon: Tag, verb: 'posted a deal at', color: 'text-green-500' },
  forum_post: { icon: MessageSquare, verb: 'started a discussion', color: 'text-purple-500' },
  rsvp: { icon: Users, verb: 'is going to', color: 'text-indigo-500' },
  saved_item: { icon: Heart, verb: 'saved', color: 'text-red-500' },
};

interface ActivityFeedProps {
  townId?: string;
  limit?: number;
  className?: string;
  showRefresh?: boolean;
}

export function ActivityFeed({ townId, limit = 10, className = '', showRefresh = true }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = async () => {
    try {
      let url = `${STRAPI_URL}/api/activity-logs?sort=createdAt:desc&pagination[pageSize]=${limit}&populate=user,town&filters[isPublic][$eq]=true`;

      if (townId) {
        url += `&filters[town][documentId][$eq]=${townId}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching activity feed:', e);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [townId, limit]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showRefresh && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      <div className="space-y-2">
        {activities.map((activity) => {
          const config = ACTION_CONFIG[activity.actionType] || {
            icon: Star,
            verb: 'interacted with',
            color: 'text-gray-500',
          };
          const Icon = config.icon;
          const userName = activity.user?.full_name || activity.user?.username || 'Someone';

          return (
            <div
              key={activity.documentId}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{userName}</span>
                  {' '}{config.verb}{' '}
                  {activity.entityUrl ? (
                    <Link href={activity.entityUrl} className="font-medium text-brand-600 hover:text-brand-700">
                      {activity.entityTitle}
                    </Link>
                  ) : (
                    <span className="font-medium">{activity.entityTitle}</span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(activity.createdAt)}</span>
                  {activity.town?.name && (
                    <>
                      <span>·</span>
                      <span>{activity.town.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
