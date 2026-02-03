
import React, { useState, useEffect } from "react";
import { Store, Town } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

export default function EditStore() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const storeId = urlParams.get('id');

  const [formData, setFormData] = useState(null);
  const [uploading, setUploading] = useState({ logo: false, banner: false });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    if (storeId) {
      loadStore();
    }
    loadTowns();
  }, [storeId]);

  const loadTowns = async () => {
    try {
      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading towns:", error);
    }
  };

  const loadStore = async () => {
    const stores = await Store.list();
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setFormData(store);
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file, type) => {
    setUploading(prev => ({ ...prev, [type]: true }));
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange(type === 'logo' ? 'logo_url' : 'banner_url', file_url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ensure slug exists - if not, generate from name
      const dataToUpdate = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      };
      
      await Store.update(storeId, dataToUpdate);
      navigate(createPageUrl("MyStores"));
    } catch (error) {
      console.error("Failed to update store:", error);
    }
    setSaving(false);
  };

  const categories = [
    { value: "food_beverage", label: "Food & Beverage" },
    { value: "crafts_art", label: "Crafts & Art" },
    { value: "home_garden", label: "Home & Garden" },
    { value: "clothing_accessories", label: "Clothing & Accessories" },
    { value: "services", label: "Services" },
    { value: "electronics", label: "Electronics" },
    { value: "sports_outdoors", label: "Sports & Outdoors" },
    { value: "health_beauty", label: "Health & Beauty" },
    { value: "automotive", label: "Automotive" },
    { value: "other", label: "Other" }
  ];

  if (loading || !formData) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("MyStores"))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Store</h1>
            <p className="text-gray-600 mt-1">Update your store information</p>
          </div>
        </div>

        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your store name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell customers about your store"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
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
                  <Select value={formData.location || ""} onValueChange={(value) => handleInputChange('location', value)}>
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
                    value={formData.contact_phone || ""}
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
                  value={formData.contact_email || ""}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="store@example.com"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Store Logo</Label>
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
                  <Label>Store Banner</Label>
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

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="is_active" className="text-base font-medium">Store Active</Label>
                  <p className="text-sm text-gray-500 mt-1">Make your store visible to customers</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("MyStores"))}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
