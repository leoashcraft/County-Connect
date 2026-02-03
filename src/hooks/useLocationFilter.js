import { useState, useEffect } from 'react';
import { getLocationFilterState, setFilterMode, setSelectedTownIds } from '@/utils/locationFilter';

/**
 * Custom hook for using location filter state in React components
 * Automatically syncs with global state changes across all components
 *
 * @returns {Object} { state, setMode, setCustomTowns, refresh }
 */
export function useLocationFilter() {
  const [state, setState] = useState(getLocationFilterState);

  useEffect(() => {
    // Listen for changes from other components
    const handleChange = (event) => {
      setState(event.detail);
    };

    window.addEventListener('locationFilterChanged', handleChange);

    return () => {
      window.removeEventListener('locationFilterChanged', handleChange);
    };
  }, []);

  const setMode = (mode) => {
    setFilterMode(mode);
    setState(getLocationFilterState());
  };

  const setCustomTowns = (townIds) => {
    setSelectedTownIds(townIds);
    setState(getLocationFilterState());
  };

  const refresh = () => {
    setState(getLocationFilterState());
  };

  return {
    state,
    setMode,
    setCustomTowns,
    refresh
  };
}
