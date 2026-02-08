'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Globe, Filter, X, Check, Info } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useLocationFilter, LocationFilterMode } from '@/lib/use-location-filter';
import { cn } from '@/lib/utils';

interface Town {
  id: string;
  name: string;
  slug: string;
}

interface LocationFilterProps {
  userPreferredTown?: Town;
  allTowns: Town[];
  onFilterChange?: (filter: { mode: LocationFilterMode; townIds: string[] }) => void;
}

export function LocationFilter({
  userPreferredTown,
  allTowns,
  onFilterChange,
}: LocationFilterProps) {
  const { mode, customTownIds, isInitialized, setMode, setCustomTowns } = useLocationFilter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);

  // Initialize modal selection when opening
  useEffect(() => {
    if (isModalOpen) {
      setSelectedTowns(customTownIds);
    }
  }, [isModalOpen, customTownIds]);

  // Notify parent of filter changes
  useEffect(() => {
    if (!isInitialized) return;

    let townIds: string[] = [];
    if (mode === 'my_town' && userPreferredTown) {
      townIds = [userPreferredTown.id];
    } else if (mode === 'custom') {
      townIds = customTownIds;
    }
    // county_wide means no filter (empty townIds)

    onFilterChange?.({ mode, townIds });
  }, [mode, customTownIds, userPreferredTown, isInitialized, onFilterChange]);

  const handleModeChange = useCallback(
    (newMode: LocationFilterMode) => {
      if (newMode === 'custom') {
        setIsModalOpen(true);
      } else {
        setMode(newMode);
      }
    },
    [setMode]
  );

  const handleSelectAll = () => {
    setSelectedTowns(allTowns.map((t) => t.id));
  };

  const handleDeselectAll = () => {
    setSelectedTowns([]);
  };

  const handleToggleTown = (townId: string) => {
    setSelectedTowns((prev) =>
      prev.includes(townId) ? prev.filter((id) => id !== townId) : [...prev, townId]
    );
  };

  const handleApply = () => {
    setCustomTowns(selectedTowns);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedTowns(customTownIds);
    setIsModalOpen(false);
  };

  // Generate display text for current filter
  const getFilterDisplayText = (): string => {
    if (mode === 'my_town') {
      return userPreferredTown ? userPreferredTown.name : 'My Town';
    }
    if (mode === 'county_wide') {
      return 'All County';
    }
    if (mode === 'custom') {
      if (customTownIds.length === 0) {
        return 'No towns selected';
      }
      if (customTownIds.length === 1) {
        const town = allTowns.find((t) => t.id === customTownIds[0]);
        return town ? town.name : '1 town selected';
      }
      return `${customTownIds.length} towns selected`;
    }
    return 'All County';
  };

  // Show profile prompt when user has no preferred town and tries to use my_town mode
  const showProfilePrompt = mode === 'my_town' && !userPreferredTown;

  if (!isInitialized) {
    // Return placeholder to prevent layout shift
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filter buttons */}
      <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
        <button
          onClick={() => handleModeChange('my_town')}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            mode === 'my_town'
              ? 'bg-brand-100 text-brand-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">My Town</span>
        </button>

        <button
          onClick={() => handleModeChange('county_wide')}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            mode === 'county_wide'
              ? 'bg-brand-100 text-brand-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">All County</span>
        </button>

        <button
          onClick={() => handleModeChange('custom')}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            mode === 'custom'
              ? 'bg-brand-100 text-brand-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Custom</span>
        </button>
      </div>

      {/* Current filter display */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span>Showing: {getFilterDisplayText()}</span>
      </div>

      {/* Profile prompt for users without preferred town */}
      {showProfilePrompt && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              Set your preferred town in your profile to see personalized local content.
            </p>
            <Link
              href="/account/profile"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Go to Profile Settings
            </Link>
          </div>
        </div>
      )}

      {/* Town selection modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-200 bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Select Towns
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Selection controls */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {selectedTowns.length} of {allTowns.length} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm font-medium text-brand-600 hover:text-brand-800"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm font-medium text-brand-600 hover:text-brand-800"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Town list */}
            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
              {allTowns.map((town) => {
                const isSelected = selectedTowns.includes(town.id);
                return (
                  <label
                    key={town.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 transition-colors',
                      isSelected ? 'bg-brand-50' : 'hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                        isSelected
                          ? 'border-brand-600 bg-brand-600'
                          : 'border-gray-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleTown(town.id)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'text-sm',
                        isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                      )}
                    >
                      {town.name}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={selectedTowns.length === 0}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  selectedTowns.length > 0
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'cursor-not-allowed bg-gray-200 text-gray-400'
                )}
              >
                Apply Filter
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
