/**
 * Analytics Module for County Connect
 * Handles both Google Analytics 4 and Umami tracking
 * Respects admin settings for enabling/disabling each provider
 *
 * Privacy Law Compliant (GDPR, CCPA, VCDPA, CPA, CTDPA, UCPA, TDPSA, OCPA, MCDPA):
 * - GA4 requires explicit user consent before loading (opt-in)
 * - Umami is privacy-focused (no cookies, no personal data) - doesn't require consent
 */

// Environment variables (set in .env)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const UMAMI_SCRIPT_URL = import.meta.env.VITE_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';

// Check if we're in production
const isProduction = import.meta.env.PROD;

// Cookie consent key (must match CookieConsent component)
const CONSENT_KEY = "cookie-consent";

/**
 * Check if user has given cookie consent for analytics
 * For GDPR compliance, we require explicit opt-in
 */
const hasConsent = () => localStorage.getItem(CONSENT_KEY) === 'accepted';

// Check for user opt-out via localStorage
// Users can opt out by running: localStorage.setItem('analytics.disabled', 'true')
// Or individually: localStorage.setItem('ga4.disabled', 'true') / localStorage.setItem('umami.disabled', 'true')
const isOptedOut = () => localStorage.getItem('analytics.disabled') === 'true';
const isGA4OptedOut = () => isOptedOut() || localStorage.getItem('ga4.disabled') === 'true';
const isUmamiOptedOut = () => isOptedOut() || localStorage.getItem('umami.disabled') === 'true';

/**
 * Exclude your visits from analytics (for developers/admins)
 * Set to true to prevent your visits from being tracked
 */
export function setAnalyticsExcluded(excluded) {
  if (excluded) {
    localStorage.setItem('analytics.disabled', 'true');
  } else {
    localStorage.removeItem('analytics.disabled');
  }
}

/**
 * Check if visits are being excluded
 */
export function isAnalyticsExcluded() {
  return isOptedOut();
}

// Track which analytics are enabled (updated by settings fetch)
let ga4Enabled = true;
let umamiEnabled = true;

/**
 * Fetch analytics settings from the API
 */
async function fetchAnalyticsSettings() {
  try {
    const response = await fetch('/api/settings/analytics');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch analytics settings, using defaults');
  }
  // Default to enabled if fetch fails
  return { ga4Enabled: true, umamiEnabled: true };
}

/**
 * Initialize Google Analytics 4
 * IMPORTANT: Only loads if user has given explicit consent (GDPR compliant)
 */
function initGA4() {
  // Require explicit consent for GA4 (GDPR/CCPA/VCDPA/CPA/CTDPA/UCPA compliance)
  if (!GA_MEASUREMENT_ID || !isProduction || !ga4Enabled || isGA4OptedOut() || !hasConsent()) return;

  // Add gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually for SPA
  });
}

/**
 * Initialize Umami Analytics
 */
function initUmami() {
  if (!UMAMI_WEBSITE_ID || !isProduction || !umamiEnabled || isUmamiOptedOut()) return;

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = UMAMI_SCRIPT_URL;
  script.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
  document.head.appendChild(script);
}

/**
 * Initialize all analytics (fetches settings first)
 */
export async function initAnalytics() {
  if (!isProduction) {
    console.log('Analytics disabled in development mode');
    return;
  }

  // Fetch settings from API
  const settings = await fetchAnalyticsSettings();
  ga4Enabled = settings.ga4Enabled !== false;
  umamiEnabled = settings.umamiEnabled !== false;

  // Initialize enabled analytics
  if (ga4Enabled) initGA4();
  if (umamiEnabled) initUmami();
}

/**
 * Track page view
 */
export function trackPageView(path, title) {
  // GA4 page view
  if (ga4Enabled && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: path,
      page_title: title,
    });
  }

  // Umami tracks page views automatically via the script
  // But we can also manually track for SPA navigation
  if (umamiEnabled && window.umami && UMAMI_WEBSITE_ID) {
    window.umami.track(props => ({
      ...props,
      url: path,
      title: title,
    }));
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName, eventParams) {
  // GA4 event
  if (ga4Enabled && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }

  // Umami event
  if (umamiEnabled && window.umami) {
    window.umami.track(eventName, eventParams);
  }
}

/**
 * Get analytics configuration for display
 */
export function getAnalyticsConfig() {
  return {
    ga4: {
      enabled: ga4Enabled,
      measurementId: GA_MEASUREMENT_ID,
      hasConsent: hasConsent(),
      isOptedOut: isGA4OptedOut(),
    },
    umami: {
      enabled: umamiEnabled,
      websiteId: UMAMI_WEBSITE_ID,
      scriptUrl: UMAMI_SCRIPT_URL,
      isOptedOut: isUmamiOptedOut(),
    },
    isProduction,
  };
}

export default {
  initAnalytics,
  trackPageView,
  trackEvent,
  getAnalyticsConfig,
  setAnalyticsExcluded,
  isAnalyticsExcluded,
};
