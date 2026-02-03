import express from 'express';
import { dbQuery, getDatabaseType } from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin access' });
  }
};

// Get analytics data from Umami API
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const umamiApiUrl = process.env.UMAMI_API_URL || 'https://api.umami.is';
    const umamiApiKey = process.env.UMAMI_API_KEY;
    const umamiWebsiteId = process.env.VITE_UMAMI_WEBSITE_ID;

    if (!umamiApiKey || !umamiWebsiteId) {
      return res.json({
        success: true,
        data: {
          configured: false,
          message: 'Umami analytics not configured. Set UMAMI_API_KEY and VITE_UMAMI_WEBSITE_ID in environment variables.',
        },
      });
    }

    // Calculate date range (default to last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const startAt = start.getTime();
    const endAt = end.getTime();

    // Fetch stats from Umami API
    const headers = {
      'Authorization': `Bearer ${umamiApiKey}`,
      'Content-Type': 'application/json',
    };

    // Fetch website stats
    const statsResponse = await fetch(
      `${umamiApiUrl}/api/websites/${umamiWebsiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );

    if (!statsResponse.ok) {
      const errorText = await statsResponse.text();
      console.error('Umami API error:', errorText);
      return res.json({
        success: true,
        data: {
          configured: true,
          error: `Failed to fetch analytics: ${statsResponse.status} ${statsResponse.statusText}`,
        },
      });
    }

    const stats = await statsResponse.json();

    // Fetch top pages
    const pagesResponse = await fetch(
      `${umamiApiUrl}/api/websites/${umamiWebsiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=url`,
      { headers }
    );

    let topPages = [];
    if (pagesResponse.ok) {
      topPages = await pagesResponse.json();
    }

    // Fetch referrers
    const referrersResponse = await fetch(
      `${umamiApiUrl}/api/websites/${umamiWebsiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=referrer`,
      { headers }
    );

    let referrers = [];
    if (referrersResponse.ok) {
      referrers = await referrersResponse.json();
    }

    // Fetch browsers
    const browsersResponse = await fetch(
      `${umamiApiUrl}/api/websites/${umamiWebsiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=browser`,
      { headers }
    );

    let browsers = [];
    if (browsersResponse.ok) {
      browsers = await browsersResponse.json();
    }

    res.json({
      success: true,
      data: {
        configured: true,
        stats: {
          pageviews: { value: stats.pageviews?.value || 0 },
          visitors: { value: stats.visitors?.value || 0 },
          visits: { value: stats.visits?.value || 0 },
          bounces: { value: stats.bounces?.value || 0 },
          totalTime: { value: stats.totalTime?.value || 0 },
        },
        topPages: topPages.slice(0, 10),
        referrers: referrers.slice(0, 10),
        browsers: browsers.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.json({
      success: true,
      data: {
        configured: true,
        error: `Failed to fetch analytics: ${error.message}`,
      },
    });
  }
});

// Get analytics settings
router.get('/settings/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await dbQuery.get(
      `SELECT setting_value FROM site_settings WHERE setting_key = 'analytics_settings'`
    );

    if (settings) {
      const value = typeof settings.setting_value === 'string' 
        ? JSON.parse(settings.setting_value) 
        : settings.setting_value;
      res.json({ success: true, data: value });
    } else {
      res.json({ success: true, data: { ga4Enabled: true, umamiEnabled: true } });
    }
  } catch (error) {
    console.error('Error fetching analytics settings:', error);
    res.json({ success: true, data: { ga4Enabled: true, umamiEnabled: true } });
  }
});

// Update analytics settings
router.put('/settings/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { ga4Enabled, umamiEnabled } = req.body;
    const dbType = getDatabaseType();
    const settingsValue = JSON.stringify({ ga4Enabled, umamiEnabled });
    const now = new Date().toISOString();

    if (dbType === 'mysql') {
      await dbQuery.run(
        `INSERT INTO site_settings (setting_key, setting_value, updated_at)
         VALUES ('analytics_settings', ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = VALUES(updated_at)`,
        [settingsValue, now]
      );
    } else {
      await dbQuery.run(
        `INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at)
         VALUES ('analytics_settings', ?, datetime('now'))`,
        [settingsValue]
      );
    }

    res.json({ success: true, data: { ga4Enabled, umamiEnabled } });
  } catch (error) {
    console.error('Error saving analytics settings:', error);
    res.status(500).json({ message: 'Error saving analytics settings' });
  }
});

export default router;
