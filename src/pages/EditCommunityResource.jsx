import React, { useState, useEffect, useCallback, useRef } from "react";
import { CommunityResource, User, Town } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, ArrowLeft, Plus, X, Save, Clock, Trash2, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { geocodeTexasAddress } from "@/utils/geocoding";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditCommunityResource() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resourceId = searchParams.get("id");
  const [user, setUser] = useState(null);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    town: "",
    town_id: "",
    phone: "",
    email: "",
    website: "",
    image_url: "",
    services_offered: [],
    eligibility_requirements: "",
    what_to_bring: [],
    operating_hours: [],
    additional_notes: "",
    lat: "",
    lng: "",
    status: "active"
  });

  const [newService, setNewService] = useState("");
  const [newItem, setNewItem] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeTimeoutRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [resourceId]);

  // Auto-geocode when address changes
  const handleAddressChange = useCallback((address) => {
    setFormData(prev => ({ ...prev, address }));

    // Clear any pending geocode request
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }

    // Don't geocode if address is too short or looks like a placeholder
    if (!address || address.length < 10 || address.toLowerCase().includes('apply online') || address.toLowerCase().includes('national')) {
      return;
    }

    // Debounce geocoding (1.5s delay to respect Nominatim rate limits)
    geocodeTimeoutRef.current = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const result = await geocodeTexasAddress(address, formData.town);
        if (result && result.lat && result.lng) {
          setFormData(prev => ({
            ...prev,
            lat: result.lat.toFixed(6),
            lng: result.lng.toFixed(6)
          }));
          toast.success("Location coordinates updated!");
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
      setIsGeocoding(false);
    }, 1500);
  }, [formData.town]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
    };
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      if (!userData) {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      setUser(userData);

      const allTowns = await Town.list('name');
      setTowns(allTowns);

      if (resourceId) {
        const resource = await CommunityResource.get(resourceId);
        if (resource) {
          if (resource.created_by !== userData.id && userData.role !== 'admin') {
            toast.error("You don't have permission to edit this resource");
            navigate(createPageUrl("CommunityResources"));
            return;
          }
          setFormData({
            ...resource,
            lat: resource.lat || "",
            lng: resource.lng || "",
            services_offered: resource.services_offered || [],
            what_to_bring: resource.what_to_bring || [],
            operating_hours: resource.operating_hours || []
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const categories = [
    { value: "food_pantry", label: "Food Pantry" },
    { value: "food_bank", label: "Food Bank" },
    { value: "soup_kitchen", label: "Soup Kitchen / Meal Service" },
    { value: "shelter", label: "Shelter / Housing" },
    { value: "clothing", label: "Clothing Assistance" },
    { value: "utility_assistance", label: "Utility Assistance" },
    { value: "medical", label: "Medical / Health Services" },
    { value: "mental_health", label: "Mental Health Services" },
    { value: "senior_services", label: "Senior Services" },
    { value: "youth_services", label: "Youth Services" },
    { value: "veterans", label: "Veterans Services" },
    { value: "job_assistance", label: "Job Training / Employment" },
    { value: "education", label: "Education / Tutoring" },
    { value: "legal_aid", label: "Legal Aid" },
    { value: "crisis", label: "Crisis Hotline / Support" },
    { value: "government", label: "Government" },
    { value: "other", label: "Other" }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services_offered: [...prev.services_offered, newService.trim()]
      }));
      setNewService("");
    }
  };

  const handleRemoveService = (index) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.filter((_, i) => i !== index)
    }));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        what_to_bring: [...prev.what_to_bring, newItem.trim()]
      }));
      setNewItem("");
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      what_to_bring: prev.what_to_bring.filter((_, i) => i !== index)
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => {
      const existingIndex = prev.operating_hours.findIndex(h => h.day === day);
      const newHours = [...prev.operating_hours];

      if (existingIndex >= 0) {
        newHours[existingIndex] = { ...newHours[existingIndex], [field]: value };
      } else {
        newHours.push({ day, [field]: value, is_closed: false });
      }

      return { ...prev, operating_hours: newHours };
    });
  };

  const getHoursForDay = (day) => {
    return formData.operating_hours.find(h => h.day === day) || { day, open_time: '', close_time: '', is_closed: true };
  };

  const handleTownChange = (townId) => {
    const town = towns.find(t => t.id === townId);
    setFormData(prev => ({
      ...prev,
      town_id: townId,
      town: town?.name || ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error("Please fill in the required fields");
      return;
    }

    setSaving(true);
    try {
      const resourceData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
      };

      await CommunityResource.update(resourceId, resourceData);
      toast.success("Resource updated successfully!");
      navigate(createPageUrl("MyCommunityResources"));
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await CommunityResource.delete(resourceId);
      toast.success("Resource deleted successfully");
      navigate(createPageUrl("CommunityResources"));
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-rose-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("MyCommunityResources"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Resources
        </Button>

        <Card className="border-2 border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-600" />
              Edit Community Resource
            </CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this resource? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Resource Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Navarro County Food Pantry"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
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

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the resource and what they offer..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="123 Main St, Corsicana, TX 75110"
                    />
                    {isGeocoding && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a full address to auto-detect map coordinates
                  </p>
                </div>

                <div>
                  <Label htmlFor="town">Town</Label>
                  <Select value={formData.town_id} onValueChange={handleTownChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(903) 555-1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@example.org"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.example.org"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <Label>Map Coordinates</Label>
                    {formData.lat && formData.lng && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Set</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        id="lat"
                        value={formData.lat}
                        onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                        placeholder="32.0954"
                      />
                      <p className="text-xs text-gray-400 mt-1">Latitude</p>
                    </div>
                    <div>
                      <Input
                        id="lng"
                        value={formData.lng}
                        onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                        placeholder="-96.4689"
                      />
                      <p className="text-xs text-gray-400 mt-1">Longitude</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Services Offered</h3>
                <div className="flex gap-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Add a service..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                  />
                  <Button type="button" onClick={handleAddService}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.services_offered.map((service, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm">
                      {service}
                      <button type="button" onClick={() => handleRemoveService(idx)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Eligibility & Requirements</h3>
                <div>
                  <Label htmlFor="eligibility">Eligibility Requirements</Label>
                  <Textarea
                    id="eligibility"
                    value={formData.eligibility_requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, eligibility_requirements: e.target.value }))}
                    placeholder="Who is eligible to receive services?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>What to Bring</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add an item..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
                    />
                    <Button type="button" onClick={handleAddItem}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.what_to_bring.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => handleRemoveItem(idx)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Operating Hours
                </h3>
                <div className="space-y-3">
                  {days.map(day => {
                    const hours = getHoursForDay(day);
                    return (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-28 capitalize font-medium">{day}</div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={!hours.is_closed}
                            onCheckedChange={(checked) => handleHoursChange(day, 'is_closed', !checked)}
                          />
                          <span className="text-sm text-gray-600">Open</span>
                        </div>
                        {!hours.is_closed && (
                          <>
                            <Input
                              type="time"
                              value={hours.open_time || ''}
                              onChange={(e) => handleHoursChange(day, 'open_time', e.target.value)}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close_time || ''}
                              onChange={(e) => handleHoursChange(day, 'close_time', e.target.value)}
                              className="w-32"
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.additional_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                  placeholder="Any other important information..."
                  rows={3}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("MyCommunityResources"))}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
