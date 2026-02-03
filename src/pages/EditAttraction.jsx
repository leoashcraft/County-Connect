import React, { useState, useEffect } from "react";
import { Attraction, User, Town } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Landmark, ArrowLeft, Save, MapPin, Clock } from "lucide-react";

export default function EditAttraction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const attractionId = searchParams.get("id");
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
    hours: "",
    admission_info: "",
    is_free: false,
    year_established: "",
    history: "",
    additional_info: "",
    lat: "",
    lng: "",
    status: "active"
  });

  useEffect(() => {
    loadData();
  }, [attractionId]);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      if (!userData) {
        navigate(createPageUrl("Attractions"));
        return;
      }
      setUser(userData);

      const allTowns = await Town.list('name');
      setTowns(allTowns.filter(t => t.name !== 'County-wide'));

      if (attractionId) {
        const attraction = await Attraction.get(attractionId);
        if (attraction) {
          // Check permissions
          const canEdit = userData.id === attraction.adopted_by ||
                         userData.id === attraction.created_by ||
                         userData.role === 'admin';
          if (!canEdit) {
            navigate(createPageUrl(`AttractionDetail?id=${attractionId}`));
            return;
          }
          setFormData({
            ...attraction,
            lat: attraction.lat || "",
            lng: attraction.lng || "",
            year_established: attraction.year_established || ""
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const attractionData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        year_established: formData.year_established ? parseInt(formData.year_established) : null
      };

      await Attraction.update(attractionId, attractionData);
      navigate(createPageUrl(`AttractionDetail?id=${attractionId}`));
    } catch (error) {
      console.error("Error updating attraction:", error);
    }
    setSaving(false);
  };

  const handleTownChange = (townName) => {
    const town = towns.find(t => t.name === townName);
    setFormData(prev => ({
      ...prev,
      town: townName,
      town_id: town?.id || ""
    }));
  };

  const categories = [
    { value: "park", label: "Park & Nature" },
    { value: "lake", label: "Lake & Waterway" },
    { value: "recreation", label: "Recreation Area" },
    { value: "golf_course", label: "Golf Course" },
    { value: "historic_site", label: "Historic Site" },
    { value: "historic_marker", label: "Texas Historical Marker" },
    { value: "museum", label: "Museum" },
    { value: "landmark", label: "Landmark" },
    { value: "monument", label: "Monument & Memorial" },
    { value: "architecture", label: "Notable Architecture" },
    { value: "entertainment", label: "Entertainment Venue" },
    { value: "cultural", label: "Cultural Center" },
    { value: "other", label: "Other" }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
      <Landmark className="w-12 h-12 text-amber-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl(`AttractionDetail?id=${attractionId}`))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Attraction
        </Button>

        <Card className="border-2 border-amber-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="w-6 h-6 text-amber-600" />
              Edit Attraction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                <div>
                  <Label htmlFor="name">Attraction Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="year_established">Year Established</Label>
                    <Input
                      id="year_established"
                      type="number"
                      value={formData.year_established}
                      onChange={(e) => setFormData(prev => ({ ...prev, year_established: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="history">History</Label>
                  <Textarea
                    id="history"
                    value={formData.history}
                    onChange={(e) => setFormData(prev => ({ ...prev, history: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Location
                </h3>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="town">Town</Label>
                  <Select value={formData.town} onValueChange={handleTownChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.name}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>

              {/* Hours & Admission */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Hours & Admission
                </h3>

                <div>
                  <Label htmlFor="hours">Hours of Operation</Label>
                  <Textarea
                    id="hours"
                    value={formData.hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_free: checked }))}
                  />
                  <Label htmlFor="is_free">Free Admission</Label>
                </div>

                {!formData.is_free && (
                  <div>
                    <Label htmlFor="admission_info">Admission Information</Label>
                    <Textarea
                      id="admission_info"
                      value={formData.admission_info}
                      onChange={(e) => setFormData(prev => ({ ...prev, admission_info: e.target.value }))}
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Media</h3>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <Label htmlFor="additional_info">Additional Information</Label>
                <Textarea
                  id="additional_info"
                  value={formData.additional_info}
                  onChange={(e) => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl(`AttractionDetail?id=${attractionId}`))}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.name || !formData.category}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
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
