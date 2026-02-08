'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Trash2, Check, CheckCheck } from 'lucide-react';
import Link from 'next/link';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Notification {
  id: string;
  documentId: string;
  type: string;
  title: string;
  body?: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  message: '💬',
  order: '📦',
  claim: '✅',
  save: '❤️',
  forum_reply: '💭',
  event_reminder: '📅',
  listing_inquiry: '❓',
  review: '⭐',
  system: '🔔',
};

export function NotificationsClient() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const token = (session as any)?.strapiToken;

  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const filters = filter === 'unread' ? '&filters[isRead][$eq]=false' : '';
        const res = await fetch(
          `${STRAPI_URL}/api/notifications?sort=createdAt:desc&pagination[pageSize]=50&filters[user][id][$eq]=${(session as any)?.strapiUserId}${filters}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.data || []);
        }
      } catch (e) {
        console.error('Error fetching notifications:', e);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [token, filter, session]);

  const markAsRead = async (notificationId: string) => {
    if (!token) return;
    try {
      await fetch(`${STRAPI_URL}/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n.documentId === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await fetch(`${STRAPI_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!token) return;
    try {
      await fetch(`${STRAPI_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n.documentId !== notificationId));
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">{unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'unread' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Unread
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-700 mb-1">No notifications</h2>
            <p className="text-gray-500">
              {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.documentId}
                className={`flex items-start gap-4 p-4 ${!notification.isRead ? 'bg-brand-50/50' : ''}`}
              >
                <span className="text-2xl">{TYPE_ICONS[notification.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={notification.linkUrl || '#'}
                    className="block hover:text-brand-600"
                    onClick={() => !notification.isRead && markAsRead(notification.documentId)}
                  >
                    <p className={`${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    {notification.body && (
                      <p className="text-sm text-gray-500 mt-0.5">{notification.body}</p>
                    )}
                  </Link>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.documentId)}
                      className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.documentId)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
