'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronDown, ChevronUp, Check, Loader2, Settings } from 'lucide-react';
import { DASHBOARD_SECTIONS, DashboardSection, DashboardSectionId } from '@/lib/dashboard-config';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface DashboardCustomizerProps {
  visibleSectionIds: DashboardSectionId[];
  contentCounts: Record<string, number>;
  preferencesId?: string;
}

export function DashboardCustomizer({
  visibleSectionIds,
  contentCounts,
  preferencesId,
}: DashboardCustomizerProps) {
  const allSections = DASHBOARD_SECTIONS;
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSections, setSelectedSections] = useState<Set<DashboardSectionId>>(
    new Set(visibleSectionIds)
  );

  const token = (session?.user as any)?.strapiToken;
  const userId = (session?.user as any)?.strapiUserId;

  const toggleSection = (sectionId: DashboardSectionId) => {
    const section = allSections.find((s) => s.id === sectionId);
    if (section?.alwaysVisible) return;

    const newSelected = new Set(selectedSections);
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId);
    } else {
      newSelected.add(sectionId);
    }
    setSelectedSections(newSelected);
  };

  const savePreferences = async () => {
    if (!token || !userId) return;

    setIsSaving(true);

    try {
      const visibleSections = Array.from(selectedSections);

      if (preferencesId) {
        // Update existing preferences
        await fetch(`${STRAPI_URL}/api/dashboard-preferences/${preferencesId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: { visibleSections },
          }),
        });
      } else {
        // Create new preferences
        await fetch(`${STRAPI_URL}/api/dashboard-preferences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              user: userId,
              visibleSections,
            },
          }),
        });
      }

      router.refresh();
    } catch (error) {
      console.error('Error saving preferences:', error);
    }

    setIsSaving(false);
  };

  const hasChanges =
    visibleSectionIds.length !== selectedSections.size ||
    !visibleSectionIds.every((id) => selectedSections.has(id));

  // Get count for a section
  const getSectionCount = (section: DashboardSection): number | null => {
    if (!section.contentType) return null;
    if (section.businessType) {
      return contentCounts[`local-businesses-${section.businessType}`] || 0;
    }
    return contentCounts[section.contentType] || 0;
  };

  // Customizable sections (exclude alwaysVisible)
  const customizableSections = allSections.filter((s) => !s.alwaysVisible);

  return (
    <div className="bg-gray-50 rounded-xl border-2 border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-500" />
          <div>
            <h3 className="font-semibold text-gray-900">Customize Dashboard</h3>
            <p className="text-sm text-gray-500">
              Choose which sections to display on your dashboard
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-4">
            Sections with items you've created are shown by default. Toggle sections on or off below.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {customizableSections.map((section) => {
              const isSelected = selectedSections.has(section.id);
              const count = getSectionCount(section);
              const hasContent = count !== null && count > 0;

              return (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <section.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        isSelected ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {section.title}
                    </p>
                    {count !== null && (
                      <p className="text-xs text-gray-500">
                        {count} {count === 1 ? 'item' : 'items'}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {hasChanges && (
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => setSelectedSections(new Set(visibleSectionIds))}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={savePreferences}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
