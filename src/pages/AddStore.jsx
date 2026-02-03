
import React, { useState, useEffect } from "react";
import { Store, User, Town } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

export default function AddStore() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    slug: "", // Added slug to form data
    description: "",
    category: "",
    location: "",
    contact_phone: "",
    contact_email: "",
    logo_url: "",
    banner_url: ""
  });
  const [uploading, setUploading] = useState({ logo: false, banner: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugError, setSlugError] = useState(""); // Added slugError state
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    loadTowns();
  }, []);

  const loadTowns = async () => {
    try {
      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading towns:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces and hyphens)
        .replace(/\s+/g, '-')    // Replace spaces with hyphens
        .replace(/-+/g, '-')    // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, '');// Remove leading/trailing hyphens
      setFormData(prev => ({ ...prev, slug }));
      setSlugError(""); // Clear slug error when name changes
    }
    
    // Clear slug error if slug is manually changed
    if (field === 'slug') {
      setSlugError("");
    }
  };

  const handleFileUpload = async (file, type) => {
    setUploading(prev => ({ ...prev, [type]: true }));
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange(type === 'logo' ? 'logo_url' : 'banner_url', file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload image. Please try again.");
    }
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.slug) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setError("");
    setSlugError(""); // Clear previous slug error

    // Basic slug validation
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formData.slug)) {
      setSlugError("Slug can only contain lowercase letters, numbers, and hyphens, and cannot start/end with a hyphen.");
      setSaving(false);
      return;
    }
    
    try {
      const user = await User.me(); // User context might be needed for store ownership, but not directly used in storeData currently.
      
      // Check if slug is unique
      const existingStores = await Store.list();
      if (existingStores.some(s => s.slug === formData.slug)) {
        setSlugError("This URL is already taken. Please choose a different one.");
        setSaving(false);
        return;
      }
      
      const storeData = {
        name: formData.name,
        slug: formData.slug, // Included slug in storeData
        description: formData.description || "",
        category: formData.category,
        location: formData.location || "",
        contact_phone: formData.contact_phone || "",
        contact_email: formData.contact_email || "",
        logo_url: formData.logo_url || "",
        banner_url: formData.banner_url || "",
        is_active: true,
        co_owners: []
      };

      console.log("Creating store with data:", storeData);
      
      await Store.create(storeData);
      navigate(createPageUrl("MyStores"));
    } catch (error) {
      console.error("Failed to create store:", error);
      setError(error.message || "Failed to create store. Please try again.");
      setSaving(false);
    }
  };

  const categories = [
    { value: "retail", label: "Retail Store" },
    { value: "food_beverage", label: "Food & Beverage" },
    { value: "services", label: "Professional Services" },
    { value: "home_services", label: "Home Services" },
    { value: "automotive", label: "Automotive Services" },
    { value: "health_beauty", label: "Health & Beauty" },
    { value: "business_services", label: "Business Services" },
    { value: "technology", label: "Technology & IT" },
    { value: "education", label: "Education & Training" },
    { value: "construction", label: "Construction & Trades" },
    { value: "creative", label: "Creative & Design" },
    { value: "legal_financial", label: "Legal & Financial" },
    { value: "hospitality", label: "Hospitality & Events" },
    { value: "healthcare", label: "Healthcare" },
    { value: "real_estate", label: "Real Estate" },
    { value: "home_garden", label: "Home & Garden" },
    { value: "sports_fitness", label: "Sports & Fitness" },
    { value: "transportation", label: "Transportation & Logistics" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("MyStores"))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Your Business</h1>
            <p className="text-gray-600 mt-1">Set up your business to offer products, services, and job postings</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your business or brand name"
                  required
                />
              </div>

              {/* New Slug Field */}
              <div className="space-y-2">
                <Label htmlFor="slug">Web Address (URL) *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/Store/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="your-business-name"
                    required
                    className={slugError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  />
                </div>
                {slugError && (
                  <p className="text-sm text-red-600">{slugError}</p>
                )}
                <p className="text-xs text-gray-500">
                  This will be your unique web address. Only lowercase letters, numbers, and hyphens allowed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what you offer and what makes you unique"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.name}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    {formData.logo_url && (
                      <img src={formData.logo_url} alt="Logo" className="w-20 h-20 object-cover rounded-lg border-2 border-orange-200" />
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
                        {uploading.logo ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm">{formData.logo_url ? 'Change Logo' : 'Upload Logo'}</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'logo')}
                        disabled={uploading.logo}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cover Image / Banner</Label>
                  <div className="flex items-center gap-4">
                    {formData.banner_url && (
                      <img src={formData.banner_url} alt="Banner" className="w-40 h-20 object-cover rounded-lg border-2 border-orange-200" />
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
                        {uploading.banner ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm">{formData.banner_url ? 'Change Banner' : 'Upload Banner'}</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'banner')}
                        disabled={uploading.banner}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("MyStores"))}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.name || !formData.category || !formData.slug || !!slugError}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
