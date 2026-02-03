import { useState, useEffect, createContext, useContext } from 'react';
import { SiteSetting } from '@/api/entities';

const SiteSettingsContext = createContext(null);

// Default settings - used when no settings are configured
const defaultSettings = {
  county_name: "Your County",
  county_state: "TX",
  site_name: "County Connect",
  site_tagline: "Your Local Community Hub",
  county_seat: "Your City",
  county_population: "50,000",
  county_area: "1,000",
  county_founded: "1846",
  default_lat: 32.0954,
  default_lng: -96.4689,
  contact_email: "",
  contact_phone: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: ""
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await SiteSetting.filter({ setting_key: 'site_config' });
      if (allSettings && allSettings.length > 0 && allSettings[0].setting_value) {
        // Merge with defaults to ensure all keys exist
        setSettings({
          ...defaultSettings,
          ...allSettings[0].setting_value
        });
      }
    } catch (error) {
      console.log("Using default site settings");
    }
    setLoading(false);
  };

  const updateSettings = async (newSettings) => {
    try {
      const existing = await SiteSetting.filter({ setting_key: 'site_config' });
      const mergedSettings = { ...settings, ...newSettings };

      if (existing && existing.length > 0) {
        await SiteSetting.update(existing[0].id, {
          setting_key: 'site_config',
          setting_value: mergedSettings
        });
      } else {
        await SiteSetting.create({
          setting_key: 'site_config',
          setting_value: mergedSettings
        });
      }

      setSettings(mergedSettings);
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: loadSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    // Return defaults if used outside provider
    return { settings: defaultSettings, loading: false, updateSettings: () => {}, refreshSettings: () => {} };
  }
  return context;
}

// Helper function to get full county display name
export function getCountyDisplayName(settings) {
  if (!settings.county_name) return "Your County";
  if (settings.county_state) {
    return `${settings.county_name} County, ${settings.county_state}`;
  }
  return `${settings.county_name} County`;
}

// Helper for SEO title
export function getSiteTitle(pageTitle, settings) {
  const siteName = settings.site_name || "County Connect";
  if (!pageTitle) return siteName;
  return `${pageTitle} | ${siteName}`;
}

// Helper to generate county-specific URL slugs
// e.g., "Navarro" -> "navarro", "Fort Bend" -> "fort-bend"
export function getCountySlug(settings) {
  const countyName = settings?.county_name || "county";
  return countyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper to generate county-specific page URLs
// e.g., "about" + "navarro" = "/about-navarro-county"
export function createCountyPageUrl(basePage, settings) {
  const slug = getCountySlug(settings);
  return `/${basePage.toLowerCase()}-${slug}-county`;
}

// Map of base pages to their county-specific URL patterns
export const COUNTY_PAGE_ROUTES = {
  about: 'AboutCounty',
  'public-services': 'PublicServices'
};
