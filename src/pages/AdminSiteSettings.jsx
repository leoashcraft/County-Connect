import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Settings, MapPin, Building2, Globe, Phone, Mail,
  Facebook, Twitter, Instagram, Save, ArrowLeft, Upload, X, Image, Loader2
} from "lucide-react";

export default function AdminSiteSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading, updateSettings } = useSiteSettings();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    county_name: "",
    county_state: "",
    site_name: "",
    site_tagline: "",
    hero_image_url: "",
    county_seat: "",
    county_population: "",
    county_area: "",
    county_founded: "",
    default_lat: "",
    default_lng: "",
    contact_email: "",
    contact_phone: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: ""
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (settings && !settingsLoading) {
      setFormData({
        county_name: settings.county_name || "",
        county_state: settings.county_state || "",
        site_name: settings.site_name || "",
        site_tagline: settings.site_tagline || "",
        hero_image_url: settings.hero_image_url || "",
        county_seat: settings.county_seat || "",
        county_population: settings.county_population || "",
        county_area: settings.county_area || "",
        county_founded: settings.county_founded || "",
        default_lat: settings.default_lat || "",
        default_lng: settings.default_lng || "",
        contact_email: settings.contact_email || "",
        contact_phone: settings.contact_phone || "",
        facebook_url: settings.facebook_url || "",
        twitter_url: settings.twitter_url || "",
        instagram_url: settings.instagram_url || ""
      });
    }
  }, [settings, settingsLoading]);

  const checkAdminAccess = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      setUser(userData);
    } catch (error) {
      navigate(createPageUrl("Dashboard"));
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await UploadFile({ file });
      const imageUrl = result.url || result.file_url;
      setFormData(prev => ({ ...prev, hero_image_url: imageUrl }));
      toast({
        title: "Image Uploaded",
        description: "Hero image uploaded successfully."
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const success = await updateSettings({
        ...formData,
        default_lat: formData.default_lat ? parseFloat(formData.default_lat) : null,
        default_lng: formData.default_lng ? parseFloat(formData.default_lng) : null
      });

      if (success) {
        toast({
          title: "Settings Saved",
          description: "Your site settings have been updated successfully."
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }

    setSaving(false);
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-orange-600" />
            Site Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure your county platform settings. These values are used throughout the site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* County Information */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                County Information
              </CardTitle>
              <CardDescription>
                Basic information about your county
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county_name">County Name *</Label>
                  <Input
                    id="county_name"
                    name="county_name"
                    value={formData.county_name}
                    onChange={handleChange}
                    placeholder="e.g., Navarro"
                    required
                  />
                  <p className="text-xs text-gray-500">Just the county name, without "County"</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county_state">State *</Label>
                  <Input
                    id="county_state"
                    name="county_state"
                    value={formData.county_state}
                    onChange={handleChange}
                    placeholder="e.g., TX"
                    maxLength={2}
                    required
                  />
                  <p className="text-xs text-gray-500">Two-letter state abbreviation</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county_seat">County Seat</Label>
                  <Input
                    id="county_seat"
                    name="county_seat"
                    value={formData.county_seat}
                    onChange={handleChange}
                    placeholder="e.g., Corsicana"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county_founded">Year Founded</Label>
                  <Input
                    id="county_founded"
                    name="county_founded"
                    value={formData.county_founded}
                    onChange={handleChange}
                    placeholder="e.g., 1846"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county_population">Population</Label>
                  <Input
                    id="county_population"
                    name="county_population"
                    value={formData.county_population}
                    onChange={handleChange}
                    placeholder="e.g., ~50,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county_area">Area (sq miles)</Label>
                  <Input
                    id="county_area"
                    name="county_area"
                    value={formData.county_area}
                    onChange={handleChange}
                    placeholder="e.g., 1,086"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Site Branding */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                Site Branding
              </CardTitle>
              <CardDescription>
                How your site appears to visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  name="site_name"
                  value={formData.site_name}
                  onChange={handleChange}
                  placeholder="e.g., County Connect"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_tagline">Tagline</Label>
                <Input
                  id="site_tagline"
                  name="site_tagline"
                  value={formData.site_tagline}
                  onChange={handleChange}
                  placeholder="e.g., Your Local Community Hub"
                />
              </div>

              {/* Hero Image Upload */}
              <div className="space-y-2">
                <Label>Homepage Hero Image</Label>
                <p className="text-xs text-gray-500 mb-2">
                  This image appears behind the welcome message on the homepage with a color overlay.
                </p>
                <div className="relative">
                  <label className={`relative flex flex-col items-center justify-center h-48 border-2 ${formData.hero_image_url ? 'border-orange-300' : 'border-dashed border-orange-200'} rounded-lg cursor-pointer hover:border-orange-400 transition-colors overflow-hidden`}>
                    {formData.hero_image_url && (
                      <>
                        <img
                          src={formData.hero_image_url}
                          alt="Hero preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 opacity-70" />
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="relative z-10 flex flex-col items-center">
                      {uploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-white animate-spin mb-2 drop-shadow-lg" />
                          <span className="text-sm text-white font-medium drop-shadow-lg">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Image className={`w-10 h-10 mb-2 drop-shadow-lg ${formData.hero_image_url ? 'text-white' : 'text-orange-400'}`} />
                          <span className={`text-sm font-medium drop-shadow-lg ${formData.hero_image_url ? 'text-white' : 'text-gray-500'}`}>
                            {formData.hero_image_url ? 'Click to change hero image' : 'Click to upload hero image'}
                          </span>
                          <span className={`text-xs mt-1 drop-shadow-lg ${formData.hero_image_url ? 'text-white/80' : 'text-gray-400'}`}>
                            Recommended: 1920x600px or wider
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                  {formData.hero_image_url && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 z-20"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData(prev => ({ ...prev, hero_image_url: "" }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {formData.hero_image_url && (
                  <p className="text-xs text-green-600 font-medium">
                    Image uploaded - click "Save Settings" below to apply to homepage
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Map Settings */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Map Settings
              </CardTitle>
              <CardDescription>
                Default map center coordinates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default_lat">Default Latitude</Label>
                  <Input
                    id="default_lat"
                    name="default_lat"
                    type="number"
                    step="any"
                    value={formData.default_lat}
                    onChange={handleChange}
                    placeholder="e.g., 32.0954"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_lng">Default Longitude</Label>
                  <Input
                    id="default_lng"
                    name="default_lng"
                    type="number"
                    step="any"
                    value={formData.default_lng}
                    onChange={handleChange}
                    placeholder="e.g., -96.4689"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                These coordinates are used as the default center point for maps throughout the site.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-orange-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Public contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="e.g., info@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="e.g., (903) 555-0100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-orange-600" />
                Social Media
              </CardTitle>
              <CardDescription>
                Social media profile URLs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" /> Facebook URL
                </Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" /> Twitter/X URL
                </Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" /> Instagram URL
                </Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("AdminDashboard"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
