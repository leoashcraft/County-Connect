'use client';

import { useState, useEffect, useCallback } from 'react';

export type LocationFilterMode = 'my_town' | 'county_wide' | 'custom';

export interface LocationFilterState {
  mode: LocationFilterMode;
  customTownIds: string[];
}

const STORAGE_KEY = 'location_filter_state';
const EVENT_NAME = 'locationFilterChanged';

const DEFAULT_STATE: LocationFilterState = {
  mode: 'county_wide',
  customTownIds: [],
};

function getStoredState(): LocationFilterState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (
        parsed &&
        typeof parsed === 'object' &&
        ['my_town', 'county_wide', 'custom'].includes(parsed.mode) &&
        Array.isArray(parsed.customTownIds)
      ) {
        return parsed as LocationFilterState;
      }
    }
  } catch {
    // Invalid stored state, use default
  }
  return DEFAULT_STATE;
}

function persistState(state: LocationFilterState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable
  }
}

function emitChange(state: LocationFilterState): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, { detail: state })
  );
}

export function useLocationFilter() {
  const [state, setState] = useState<LocationFilterState>(DEFAULT_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedState = getStoredState();
    setState(storedState);
    setIsInitialized(true);
  }, []);

  // Listen for changes from other components
  useEffect(() => {
    const handleChange = (event: Event) => {
      const customEvent = event as CustomEvent<LocationFilterState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      }
    };

    window.addEventListener(EVENT_NAME, handleChange);
    return () => window.removeEventListener(EVENT_NAME, handleChange);
  }, []);

  const setMode = useCallback((mode: LocationFilterMode) => {
    setState((prev) => {
      const newState = { ...prev, mode };
      persistState(newState);
      emitChange(newState);
      return newState;
    });
  }, []);

  const setCustomTowns = useCallback((customTownIds: string[]) => {
    setState((prev) => {
      const newState = { ...prev, customTownIds, mode: 'custom' as LocationFilterMode };
      persistState(newState);
      emitChange(newState);
      return newState;
    });
  }, []);

  const clearFilter = useCallback(() => {
    const newState = DEFAULT_STATE;
    setState(newState);
    persistState(newState);
    emitChange(newState);
  }, []);

  return {
    mode: state.mode,
    customTownIds: state.customTownIds,
    isInitialized,
    setMode,
    setCustomTowns,
    clearFilter,
  };
}
