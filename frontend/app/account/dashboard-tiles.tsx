'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DASHBOARD_SECTIONS, DashboardSectionId } from '@/lib/dashboard-config';

interface DashboardTilesProps {
  visibleSectionIds: DashboardSectionId[];
}

export function DashboardTiles({ visibleSectionIds }: DashboardTilesProps) {
  const sectionsToShow = DASHBOARD_SECTIONS.filter((section) =>
    visibleSectionIds.includes(section.id)
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {sectionsToShow.map((section) => (
        <Link
          key={section.id}
          href={section.href}
          className="group bg-white rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg p-6 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center`}
            >
              <section.icon className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
            {section.title}
          </h3>
          <p className="text-sm text-gray-500">{section.description}</p>
        </Link>
      ))}
    </div>
  );
}
