/**
 * Global location filter state management
 * Provides a centralized way to manage location filtering across the app
 */

const STORAGE_KEY = 'location_filter_state';

/**
 * Get the current location filter state from localStorage
 * @returns {Object} { mode: 'my_town' | 'county_wide' | 'custom', selectedTownIds: string[] }
 */
export function getLocationFilterState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading location filter state:', error);
  }

  // Default state
  return {
    mode: 'my_town', // 'my_town', 'county_wide', or 'custom'
    selectedTownIds: [] // For custom mode - array of town IDs
  };
}

/**
 * Save the location filter state to localStorage
 * @param {Object} state - { mode: string, selectedTownIds: string[] }
 */
export function setLocationFilterState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Dispatch custom event so other components can listen for changes
    window.dispatchEvent(new CustomEvent('locationFilterChanged', { detail: state }));
  } catch (error) {
    console.error('Error saving location filter state:', error);
  }
}

/**
 * Set the filter mode
 * @param {string} mode - 'my_town', 'county_wide', or 'custom'
 */
export function setFilterMode(mode) {
  const currentState = getLocationFilterState();
  setLocationFilterState({
    ...currentState,
    mode
  });
}

/**
 * Set the selected town IDs for custom mode
 * @param {string[]} townIds - Array of town IDs
 */
export function setSelectedTownIds(townIds) {
  const currentState = getLocationFilterState();
  setLocationFilterState({
    mode: 'custom',
    selectedTownIds: townIds
  });
}

/**
 * Toggle between my_town and county_wide modes
 */
export function toggleMode() {
  const currentState = getLocationFilterState();
  const newMode = currentState.mode === 'my_town' ? 'county_wide' : 'my_town';
  setFilterMode(newMode);
}

/**
 * Apply location filter to an array of items
 * @param {Array} items - Array of items to filter
 * @param {Object} filterState - Current filter state
 * @param {Object} userTown - User's preferred town object
 * @param {Function} getTownId - Function to extract town_id from an item
 * @returns {Array} Filtered items
 */
export function applyLocationFilter(items, filterState, userTown, getTownId) {
  if (!items || items.length === 0) {
    return items;
  }

  const { mode, selectedTownIds } = filterState;

  // County-wide mode - show all items
  if (mode === 'county_wide') {
    return items;
  }

  // My town mode - show only user's town
  if (mode === 'my_town') {
    if (!userTown || !userTown.id) {
      return items; // If no user town set, show all
    }
    return items.filter(item => {
      const townId = getTownId(item);
      return townId === userTown.id;
    });
  }

  // Custom mode - show selected towns
  if (mode === 'custom') {
    if (!selectedTownIds || selectedTownIds.length === 0) {
      return items; // If no towns selected, show all
    }
    return items.filter(item => {
      const townId = getTownId(item);
      return selectedTownIds.includes(townId);
    });
  }

  return items;
}
