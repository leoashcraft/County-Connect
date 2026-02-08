'use client';

import Link from 'next/link';
import { Store, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { EmergencyAlertBanner } from './emergency-alert';
import { NotificationBell } from '@/components/notification-bell';
import { WeatherWidget } from '@/components/weather-widget';

export function Header() {
  return (
    <>
      <EmergencyAlertBanner />
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-6 py-3 md:hidden sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200"
            onClick={() => {
              // Toggle sidebar via CSS class
              document.getElementById('mobile-sidebar')?.classList.toggle('translate-x-0');
              document.getElementById('mobile-sidebar')?.classList.toggle('-translate-x-full');
              document.getElementById('sidebar-overlay')?.classList.toggle('hidden');
            }}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Store className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl font-bold text-gray-900">CountyConnect</h1>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <WeatherWidget variant="compact" />
          <NotificationBell />
        </div>
      </div>
      <p className="text-xs text-gray-400 italic text-center mt-1">Not affiliated with Navarro County government.</p>
    </header>
    </>
  );
}
