'use client';

import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface HoursData {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

interface BusinessHoursProps {
  hours?: HoursData | null;
  className?: string;
  compact?: boolean;
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
const DAY_LABELS: Record<string, string> = {
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};

function formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return minutes ? `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}` : `${displayHours} ${period}`;
}

function isOpenNow(hours: HoursData): { isOpen: boolean; closesAt?: string; opensAt?: string } {
  const now = new Date();
  const currentDay = DAYS[now.getDay()];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayHours = hours[currentDay as keyof HoursData];

  if (!todayHours || todayHours.closed) {
    // Find next open day
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (now.getDay() + i) % 7;
      const nextDay = DAYS[nextDayIndex];
      const nextHours = hours[nextDay as keyof HoursData];
      if (nextHours && !nextHours.closed && nextHours.open) {
        return {
          isOpen: false,
          opensAt: `${DAY_LABELS[nextDay]} ${formatTime(nextHours.open)}`
        };
      }
    }
    return { isOpen: false };
  }

  const [openHours, openMinutes] = todayHours.open.split(':').map(Number);
  const [closeHours, closeMinutes] = todayHours.close.split(':').map(Number);
  const openTime = openHours * 60 + openMinutes;
  const closeTime = closeHours * 60 + closeMinutes;

  if (currentTime >= openTime && currentTime < closeTime) {
    return { isOpen: true, closesAt: formatTime(todayHours.close) };
  }

  if (currentTime < openTime) {
    return { isOpen: false, opensAt: `Today ${formatTime(todayHours.open)}` };
  }

  // After close, find next open
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (now.getDay() + i) % 7;
    const nextDay = DAYS[nextDayIndex];
    const nextHours = hours[nextDay as keyof HoursData];
    if (nextHours && !nextHours.closed && nextHours.open) {
      return {
        isOpen: false,
        opensAt: i === 1 ? `Tomorrow ${formatTime(nextHours.open)}` : `${DAY_LABELS[nextDay]} ${formatTime(nextHours.open)}`
      };
    }
  }

  return { isOpen: false };
}

export function BusinessHours({ hours, className = '', compact = false }: BusinessHoursProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!hours || Object.keys(hours).length === 0) {
    return null;
  }

  const status = isOpenNow(hours);
  const today = DAYS[new Date().getDay()];

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
          status.isOpen
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-green-500' : 'bg-gray-400'}`} />
          {status.isOpen ? 'Open' : 'Closed'}
        </span>
        {status.isOpen && status.closesAt && (
          <span className="text-xs text-gray-500">until {status.closesAt}</span>
        )}
        {!status.isOpen && status.opensAt && (
          <span className="text-xs text-gray-500">Opens {status.opensAt}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                status.isOpen
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                {status.isOpen ? 'Open Now' : 'Closed'}
              </span>
              {status.isOpen && status.closesAt && (
                <span className="text-sm text-gray-500">Closes at {status.closesAt}</span>
              )}
              {!status.isOpen && status.opensAt && (
                <span className="text-sm text-gray-500">Opens {status.opensAt}</span>
              )}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-2">
          {DAYS.map((day) => {
            const dayHours = hours[day as keyof HoursData];
            const isToday = day === today;

            return (
              <div
                key={day}
                className={`flex items-center justify-between text-sm ${
                  isToday ? 'font-medium text-gray-900' : 'text-gray-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                  {DAY_LABELS[day]}
                </span>
                <span>
                  {!dayHours || dayHours.closed
                    ? 'Closed'
                    : `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OpenNowBadge({ hours }: { hours?: HoursData | null }) {
  if (!hours) return null;

  const status = isOpenNow(hours);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      status.isOpen
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-100 text-gray-600'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-green-500' : 'bg-gray-400'}`} />
      {status.isOpen ? 'Open' : 'Closed'}
    </span>
  );
}
