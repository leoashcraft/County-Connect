import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  ExternalLink,
  ArrowLeft,
  Settings,
  TrendingUp,
  Eye,
  Users,
  Search,
  AlertCircle,
  Info,
  Globe,
  RefreshCw,
  EyeOff
} from "lucide-react";
import { setAnalyticsExcluded, isAnalyticsExcluded } from "@/utils/analytics";

// Environment variables for configuration
const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [analyticsSettings, setAnalyticsSettings] = useState({
    ga4Enabled: true,
    umamiEnabled: true
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [excludeMyVisits, setExcludeMyVisits] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    setExcludeMyVisits(isAnalyticsExcluded());
  }, []);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, dateRange]);

  const checkAdminAccess = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        navigate(createPageUrl("Marketplace"));
        return;
      }
      setUser(userData);
      loadAnalyticsSettings();
    } catch (error) {
      console.error("Error loading admin analytics:", error);
      navigate(createPageUrl("Marketplace"));
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await fetch(`/api/admin/analytics?startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
    setAnalyticsLoading(false);
  };

  const loadAnalyticsSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/analytics', {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        setAnalyticsSettings(result.data);
      }
    } catch (error) {
      console.log("Using default analytics settings");
    }
  };

  const saveAnalyticsSettings = async () => {
    setSavingSettings(true);
    try {
      await fetch('/api/admin/settings/analytics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(analyticsSettings)
      });
    } catch (error) {
      console.error("Error saving analytics settings:", error);
    }
    setSavingSettings(false);
  };

  const handleExcludeToggle = (checked) => {
    setExcludeMyVisits(checked);
    setAnalyticsExcluded(checked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <BarChart3 className="w-12 h-12 text-orange-600 animate-pulse" />
      </div>
    );
  }

  // Not configured state
  if (analyticsData && !analyticsData.configured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              Analytics Dashboard
            </h1>
          </div>

          <Card className="border-2 border-yellow-200 bg-yellow-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                Website Analytics Not Configured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">{analyticsData.message}</p>
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-gray-800 mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Sign up for <a href="https://cloud.umami.is" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Umami Cloud</a> (free tier: 10k events/month)</li>
                  <li>Create a website and get your Website ID</li>
                  <li>Generate an API key from Settings → API Keys</li>
                  <li>Set the following environment variables:
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`VITE_UMAMI_WEBSITE_ID="your-website-id"
UMAMI_API_URL="https://api.umami.is"
UMAMI_API_KEY="your-api-key"`}
                    </pre>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* External Dashboards */}
          <ExternalDashboardLinks />
        </div>
      </div>
    );
  }

  // Error state
  if (analyticsData && analyticsData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              Analytics Dashboard
            </h1>
          </div>

          <Card className="border-2 border-red-200 bg-red-50 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-800">{analyticsData.error}</p>
              <p className="text-sm text-gray-600 mt-2">
                Try checking your Umami API credentials or visit the dashboards directly below.
              </p>
            </CardContent>
          </Card>

          <ExternalDashboardLinks />
        </div>
      </div>
    );
  }

  const stats = analyticsData?.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("AdminDashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Dashboard
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              Website Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              View site traffic and visitor statistics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={loadAnalytics}
              disabled={analyticsLoading}
            >
              <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={showSettings ? 'bg-orange-100' : ''}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {analyticsLoading && !stats ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-8 h-8 text-orange-600 animate-spin" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-2 border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Page Views</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.pageviews?.value?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Unique Visitors</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.visitors?.value?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.visits?.value?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Bounce Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.visits?.value
                          ? `${Math.round((stats.bounces?.value / stats.visits.value) * 100)}%`
                          : '0%'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Pages */}
            {analyticsData?.topPages && analyticsData.topPages.length > 0 && (
              <Card className="border-2 border-orange-100 mb-6">
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analyticsData.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm text-gray-700 truncate flex-1 mr-4" title={page.x}>
                          {page.x}
                        </span>
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {page.y?.toLocaleString()} views
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Referrers and Browsers */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {analyticsData?.referrers && analyticsData.referrers.length > 0 && (
                <Card className="border-2 border-orange-100">
                  <CardHeader>
                    <CardTitle>Top Referrers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analyticsData.referrers.map((ref, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                          <span className="text-sm text-gray-700 truncate flex-1 mr-4">
                            {ref.x || '(Direct)'}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {ref.y?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {analyticsData?.browsers && analyticsData.browsers.length > 0 && (
                <Card className="border-2 border-orange-100">
                  <CardHeader>
                    <CardTitle>Browsers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analyticsData.browsers.map((browser, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                          <span className="text-sm text-gray-700">{browser.x}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {browser.y?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : null}

        {/* External Dashboards */}
        <ExternalDashboardLinks />

        {/* Settings Panel */}
        {showSettings && (
          <Card className="border-2 border-orange-100 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                Analytics Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exclude My Visits Toggle */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-4">
                  <EyeOff className="w-8 h-8 text-yellow-600" />
                  <div>
                    <Label className="text-base font-medium">Exclude My Visits</Label>
                    <p className="text-sm text-gray-600">
                      Don't track your own visits in analytics (this browser only)
                    </p>
                  </div>
                </div>
                <Switch
                  checked={excludeMyVisits}
                  onCheckedChange={handleExcludeToggle}
                />
              </div>

              {/* GA4 Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                  <div>
                    <Label className="text-base font-medium">Google Analytics 4</Label>
                    <p className="text-sm text-gray-600">
                      {GA_MEASUREMENT_ID ? `Configured: ${GA_MEASUREMENT_ID}` : 'Not configured'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={analyticsSettings.ga4Enabled}
                  onCheckedChange={(checked) =>
                    setAnalyticsSettings({ ...analyticsSettings, ga4Enabled: checked })
                  }
                />
              </div>

              {/* Umami Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <Label className="text-base font-medium">Umami Analytics</Label>
                    <p className="text-sm text-gray-600">
                      {UMAMI_WEBSITE_ID ? 'Configured' : 'Not configured'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={analyticsSettings.umamiEnabled}
                  onCheckedChange={(checked) =>
                    setAnalyticsSettings({ ...analyticsSettings, umamiEnabled: checked })
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={saveAnalyticsSettings}
                  disabled={savingSettings}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {savingSettings ? "Saving..." : "Save Settings"}
                </Button>
              </div>

              {/* Environment Variables Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Environment Variables
                </h4>
                <p className="text-sm text-blue-700 mb-2">
                  Configure these in your .env file:
                </p>
                <code className="block bg-white p-3 rounded text-xs text-gray-700">
                  VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX<br />
                  VITE_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx<br />
                  UMAMI_API_URL=https://api.umami.is<br />
                  UMAMI_API_KEY=your-api-key
                </code>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// External Dashboard Links Component
function ExternalDashboardLinks() {
  return (
    <Card className="border-2 border-orange-100">
      <CardHeader>
        <CardTitle>External Dashboards</CardTitle>
        <CardDescription>Access full analytics dashboards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://cloud.umami.is"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-sm transition"
          >
            <TrendingUp className="w-4 h-4 text-green-600" />
            Umami Dashboard
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-sm transition"
          >
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Google Analytics
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 text-sm transition"
          >
            <Search className="w-4 h-4 text-purple-600" />
            Search Console
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
