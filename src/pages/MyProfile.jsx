import React, { useState, useEffect } from "react";
import { User, UserEntity, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserCircle, Save, MapPin } from "lucide-react";

export default function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    preferred_town_id: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    bio: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load towns for dropdown
      const townsData = await Town.list('name');
      setTowns(townsData);

      // Populate form with existing user data
      setFormData({
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        preferred_town_id: userData.preferred_town_id || "",
        street_address: userData.street_address || "",
        city: userData.city || "",
        state: userData.state || "",
        zip_code: userData.zip_code || "",
        bio: userData.bio || ""
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate(createPageUrl("Dashboard"));
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update user profile using User.updateMe (which hits /api/auth/me)
      const updatedUser = await User.updateMe({
        full_name: formData.full_name,
        phone: formData.phone,
        preferred_town_id: formData.preferred_town_id || null,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        bio: formData.bio,
        profile_completed: true
      });

      alert("Profile updated successfully!");

      // Update local state with the returned user data
      setUser(updatedUser);

      // Update form data to reflect saved values
      setFormData({
        full_name: updatedUser.full_name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        preferred_town_id: updatedUser.preferred_town_id || "",
        street_address: updatedUser.street_address || "",
        city: updatedUser.city || "",
        state: updatedUser.state || "",
        zip_code: updatedUser.zip_code || "",
        bio: updatedUser.bio || ""
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <UserCircle className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-orange-600" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-2 border-orange-100 mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="preferred_town_id">Preferred Town/City</Label>
                  <Select
                    value={formData.preferred_town_id || undefined}
                    onValueChange={(value) => handleChange("preferred_town_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a town..." />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>
                          {town.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used to personalize your experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  value={formData.street_address}
                  onChange={(e) => handleChange("street_address", e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Springfield"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="CA"
                    maxLength={2}
                  />
                </div>

                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => handleChange("zip_code", e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 mb-6">
            <CardHeader>
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be visible on your public profile if you become a vendor
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Profile"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
            >
              Cancel
            </Button>
          </div>
        </form>

        {user?.profile_completed && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ✓ Your profile is complete!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
