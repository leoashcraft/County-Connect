import React, { useState, useEffect } from "react";
import { Service, Store } from "@/api/entities";
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
import { ArrowLeft, Upload, Loader2, Briefcase } from "lucide-react";

export default function EditService() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const serviceId = urlParams.get('id');

  const [service, setService] = useState(null);
  const [store, setStore] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    store_id: "",
    name: "",
    description: "",
    price: "",
    price_type: "fixed",
    category: "",
    availability: "",
    image_url: "",
    is_available: true
  });

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    if (!serviceId) {
      navigate(createPageUrl("MyStores"));
      return;
    }

    try {
      const serviceData = await Service.get(serviceId);

      if (!serviceData) {
        alert("Service not found");
        navigate(createPageUrl("MyStores"));
        return;
      }

      setService(serviceData);

      // Load store data
      const stores = await Store.list();
      const storeData = stores.find(s => s.id === serviceData.store_id);

      if (!storeData) {
        alert("Store not found");
        navigate(createPageUrl("MyStores"));
        return;
      }

      setStore(storeData);

      // Populate form with service data
      setFormData({
        store_id: serviceData.store_id || "",
        name: serviceData.name || "",
        description: serviceData.description || "",
        price: serviceData.price?.toString() || "",
        price_type: serviceData.price_type || "fixed",
        category: serviceData.category || "",
        availability: serviceData.availability || "",
        image_url: serviceData.image_url || "",
        is_available: serviceData.is_available !== false
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to load service:", error);
      alert("Failed to load service: " + error.message);
      navigate(createPageUrl("MyStores"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange('image_url', file_url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("EditService: Submitting form");
    setSaving(true);
    try {
      console.log("EditService: Updating service", serviceId);

      const serviceData = {
        ...formData,
        slug: generateSlug(formData.name),
        price: parseFloat(formData.price)
      };

      console.log("EditService: Service data:", serviceData);
      await Service.update(serviceId, serviceData);
      console.log("EditService: Service updated successfully");
      navigate(createPageUrl(`StoreManagement?id=${formData.store_id}`));
    } catch (error) {
      console.error("EditService: Failed to update service:", error);
      alert("Failed to update service: " + error.message);
    }
    setSaving(false);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const categories = [
    { value: "home_repair", label: "Home Repair" },
    { value: "cleaning", label: "Cleaning" },
    { value: "landscaping", label: "Landscaping" },
    { value: "tutoring", label: "Tutoring" },
    { value: "pet_care", label: "Pet Care" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty_wellness", label: "Beauty & Wellness" },
    { value: "photography", label: "Photography" },
    { value: "catering", label: "Catering" },
    { value: "event_planning", label: "Event Planning" },
    { value: "tech_support", label: "Tech Support" },
    { value: "handyman", label: "Handyman" },
    { value: "moving", label: "Moving" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" }
  ];

  const priceTypes = [
    { value: "fixed", label: "Fixed Price" },
    { value: "hourly", label: "Per Hour" },
    { value: "per_project", label: "Per Project" },
    { value: "negotiable", label: "Negotiable" }
  ];

  if (loading || !store || !service) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl(`StoreManagement?id=${formData.store_id}`))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
            <p className="text-gray-600 mt-1">Update {service.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., House Cleaning, Lawn Mowing, Portrait Photography"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your service, what's included, and any special features"
                  rows={5}
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
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_type">Price Type *</Label>
                  <Select value={formData.price_type} onValueChange={(value) => handleInputChange('price_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900">
                  <strong>Pricing Tips:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Fixed:</strong> One-time service with set price</li>
                    <li><strong>Per Hour:</strong> Price is per hour of work</li>
                    <li><strong>Per Project:</strong> Price varies by project scope</li>
                    <li><strong>Negotiable:</strong> Price to be discussed with client</li>
                  </ul>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="availability">When are you available?</Label>
                <Input
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  placeholder="e.g., Weekdays 9AM-5PM, Weekends by appointment"
                />
                <p className="text-xs text-gray-500">
                  Let customers know when you're typically available to provide this service
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Image */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Service Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload an image that represents your service</Label>
                <div className="flex items-center gap-4">
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Service"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-purple-200"
                    />
                  )}
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span className="text-sm">{formData.image_url ? 'Change Image' : 'Upload Image'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="is_available" className="text-base font-medium">Service Available</Label>
                  <p className="text-sm text-gray-500 mt-1">Offer this service to customers</p>
                </div>
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => handleInputChange('is_available', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl(`StoreManagement?id=${formData.store_id}`))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !formData.name || !formData.price || !formData.category}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
