import React, { useState, useEffect } from "react";
import { LostAndFound, User, Town } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Heart, Upload, MapPin, Award } from "lucide-react";

export default function EditLostAndFound() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('id');

  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [towns, setTowns] = useState([]);

  const [formData, setFormData] = useState({
    type: "",
    title: "",
    pet_name: "",
    breed: "",
    color: "",
    description: "",
    distinguishing_features: "",
    photo_url: "",
    town_id: "",
    last_seen_location: "",
    last_seen_date: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    has_reward: false,
    reward_amount: "",
    shelter_crosspost: false,
    status: "active"
  });

  useEffect(() => {
    if (itemId) {
      loadItem();
    } else {
      navigate(createPageUrl("MyLostAndFound"));
    }
    loadTowns();
  }, [itemId]);

  const loadTowns = async () => {
    try {
      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading towns:", error);
    }
  };

  const loadItem = async () => {
    try {
      const itemData = await LostAndFound.get(itemId);
      if (!itemData) {
        alert("Item not found");
        navigate(createPageUrl("MyLostAndFound"));
        return;
      }

      const userData = await User.me();
      if (userData.email !== itemData.created_by) {
        alert("You don't have permission to edit this listing");
        navigate(createPageUrl("MyLostAndFound"));
        return;
      }

      setItem(itemData);
      setUser(userData);

      setFormData({
        type: itemData.type || "",
        title: itemData.title || "",
        pet_name: itemData.pet_name || "",
        breed: itemData.breed || "",
        color: itemData.color || "",
        description: itemData.description || "",
        distinguishing_features: itemData.distinguishing_features || "",
        photo_url: itemData.photo_url || "",
        town_id: itemData.town_id || "",
        last_seen_location: itemData.last_seen_location || "",
        last_seen_date: itemData.last_seen_date || "",
        contact_name: itemData.contact_name || "",
        contact_phone: itemData.contact_phone || "",
        contact_email: itemData.contact_email || "",
        has_reward: itemData.has_reward || false,
        reward_amount: itemData.reward_amount ? itemData.reward_amount.toString() : "",
        shelter_crosspost: itemData.shelter_crosspost || false,
        status: itemData.status || "active"
      });

      if (itemData.photo_url) {
        setImagePreview(itemData.photo_url);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading item:", error);
      navigate(createPageUrl("MyLostAndFound"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        handleInputChange('photo_url', data.url);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const itemData = {
        ...formData,
        slug: generateSlug(formData.pet_name || formData.title)
      };

      // Convert reward amount to number
      if (itemData.has_reward && itemData.reward_amount) {
        itemData.reward_amount = parseFloat(itemData.reward_amount);
      }

      await LostAndFound.update(itemId, itemData);
      navigate(createPageUrl("MyLostAndFound"));
    } catch (error) {
      console.error("Failed to update listing:", error);
      alert("Failed to update listing: " + error.message);
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

  const types = [
    { value: "lost_pet", label: "Lost Pet" },
    { value: "found_pet", label: "Found Pet" },
    { value: "lost_item", label: "Lost Item" },
    { value: "found_item", label: "Found Item" }
  ];

  const statuses = [
    { value: "active", label: "Active" },
    { value: "reunited", label: "Reunited/Found" }
  ];

  const isPet = formData.type === 'lost_pet' || formData.type === 'found_pet';

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("MyLostAndFound"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
            <p className="text-gray-600 mt-1">Update your lost/found report</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-600" />
                Type & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Mark as "Reunited/Found" when resolved
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPet ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pet_name">Pet Name *</Label>
                    <Input
                      id="pet_name"
                      value={formData.pet_name}
                      onChange={(e) => handleInputChange('pet_name', e.target.value)}
                      placeholder="e.g., Max, Bella"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed *</Label>
                    <Input
                      id="breed"
                      value={formData.breed}
                      onChange={(e) => handleInputChange('breed', e.target.value)}
                      placeholder="e.g., Golden Retriever, Tabby Cat"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="title">Item Name *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Black Wallet, Blue Bicycle"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="e.g., Brown, Black and White"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distinguishing_features">Distinguishing Features</Label>
                <Textarea
                  id="distinguishing_features"
                  value={formData.distinguishing_features}
                  onChange={(e) => handleInputChange('distinguishing_features', e.target.value)}
                  placeholder="Any unique markings, scars, or characteristics"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-600" />
                Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload').click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">Recommended for better visibility</span>
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-orange-200"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Last Seen Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Last Seen Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="town_id">Town/City *</Label>
                <Select value={formData.town_id} onValueChange={(value) => handleInputChange('town_id', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your town" />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map(town => (
                      <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  This helps filter items by location
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_seen_location">Location *</Label>
                <Select value={formData.last_seen_location} onValueChange={(value) => handleInputChange('last_seen_location', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map(town => (
                      <SelectItem key={town.id} value={town.name}>{town.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select the town where this was last seen
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_seen_date">Date *</Label>
                <Input
                  id="last_seen_date"
                  type="date"
                  value={formData.last_seen_date}
                  onChange={(e) => handleInputChange('last_seen_date', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Your Name *</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange('contact_name', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number *</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                Additional Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_reward"
                  checked={formData.has_reward}
                  onCheckedChange={(checked) => handleInputChange('has_reward', checked)}
                />
                <Label htmlFor="has_reward" className="cursor-pointer">
                  Offering a reward
                </Label>
              </div>

              {formData.has_reward && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="reward_amount">Reward Amount</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">$</span>
                    <Input
                      id="reward_amount"
                      type="number"
                      step="0.01"
                      value={formData.reward_amount}
                      onChange={(e) => handleInputChange('reward_amount', e.target.value)}
                      placeholder="100.00"
                      className="w-32"
                    />
                  </div>
                </div>
              )}

              {isPet && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shelter_crosspost"
                    checked={formData.shelter_crosspost}
                    onCheckedChange={(checked) => handleInputChange('shelter_crosspost', checked)}
                  />
                  <Label htmlFor="shelter_crosspost" className="cursor-pointer">
                    Cross-post to local animal shelters
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("MyLostAndFound"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
