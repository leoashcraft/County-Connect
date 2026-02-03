/**
 * Geocoding utility using OpenStreetMap Nominatim API
 * Free service, no API key required
 * Rate limit: 1 request per second (enforced by debouncing)
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocode an address to get latitude and longitude
 * @param {string} address - Full address string to geocode
 * @returns {Promise<{lat: number, lng: number} | null>} Coordinates or null if not found
 */
export async function geocodeAddress(address) {
  if (!address || address.trim().length < 5) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
      addressdetails: '1',
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}?${params}`, {
      headers: {
        'User-Agent': 'CountyConnect/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Geocode with Texas context for better local results
 * @param {string} address - Address to geocode
 * @param {string} city - City name (optional, will be appended if not in address)
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
export async function geocodeTexasAddress(address, city = null) {
  if (!address) return null;

  // If address doesn't include state, add Texas context
  let fullAddress = address;
  if (!address.toLowerCase().includes('tx') && !address.toLowerCase().includes('texas')) {
    if (city && !address.toLowerCase().includes(city.toLowerCase())) {
      fullAddress = `${address}, ${city}, TX`;
    } else {
      fullAddress = `${address}, TX`;
    }
  }

  return geocodeAddress(fullAddress);
}

/**
 * Create a debounced geocoding function
 * Useful for input fields to avoid too many API calls
 * @param {number} delay - Debounce delay in ms (default 1000ms per Nominatim guidelines)
 * @returns {Function} Debounced geocode function
 */
export function createDebouncedGeocoder(delay = 1000) {
  let timeoutId = null;

  return (address, callback) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      const result = await geocodeAddress(address);
      callback(result);
    }, delay);
  };
}

export default {
  geocodeAddress,
  geocodeTexasAddress,
  createDebouncedGeocoder,
};
