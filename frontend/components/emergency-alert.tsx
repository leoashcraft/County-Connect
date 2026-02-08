'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Info, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Alert {
  id: string;
  documentId: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  linkUrl?: string;
  linkText?: string;
  isDismissible: boolean;
}

const SEVERITY_STYLES = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
  },
};

export function EmergencyAlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed alerts from localStorage
    const stored = localStorage.getItem('dismissed_alerts');
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored));
      } catch (e) {}
    }

    // Fetch active alerts
    const fetchAlerts = async () => {
      try {
        const now = new Date().toISOString();
        const res = await fetch(
          `${STRAPI_URL}/api/emergency-alerts?filters[isActive][$eq]=true&filters[$or][0][startDate][$lte]=${now}&filters[$or][0][startDate][$null]=true&filters[$or][1][endDate][$gte]=${now}&filters[$or][1][endDate][$null]=true&sort=severity:desc,createdAt:desc&publicationState=live`
        );
        if (res.ok) {
          const data = await res.json();
          setAlerts(data.data || []);
        }
      } catch (e) {
        console.error('Error fetching alerts:', e);
      }
    };

    fetchAlerts();
    // Poll for new alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (alertId: string) => {
    const newDismissed = [...dismissedIds, alertId];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissed_alerts', JSON.stringify(newDismissed));
  };

  const visibleAlerts = alerts.filter(
    (alert) => !dismissedIds.includes(alert.documentId)
  );

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-0">
      {visibleAlerts.map((alert) => {
        const styles = SEVERITY_STYLES[alert.severity];
        const Icon = styles.icon;

        return (
          <div
            key={alert.documentId}
            className={`${styles.bg} ${styles.border} border-b px-4 py-3`}
          >
            <div className="max-w-6xl mx-auto flex items-start gap-3">
              <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${styles.text}`}>{alert.title}</p>
                <p className={`text-sm ${styles.text} opacity-90 mt-0.5`}>
                  {alert.message}
                </p>
                {alert.linkUrl && (
                  <Link
                    href={alert.linkUrl}
                    className={`inline-flex items-center gap-1 text-sm font-medium ${styles.text} hover:underline mt-1`}
                  >
                    {alert.linkText || 'Learn more'}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
              {alert.isDismissible && (
                <button
                  onClick={() => dismissAlert(alert.documentId)}
                  className={`p-1 ${styles.text} opacity-60 hover:opacity-100 transition-opacity`}
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
