import React, { useState, useEffect } from "react";
import { Church, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { generateSlug } from "@/utils/slugUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Church as ChurchIcon, ArrowLeft, Plus, X, Save, Clock } from "lucide-react";
import { toast } from "sonner";
import DuplicateListingAlert from "@/components/DuplicateListingAlert";

export default function AddChurch() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    denomination: "",
    pastor_name: "",
    description: "",
    mission_statement: "",
    address: "",
    town: "",
    town_id: "",
    phone: "",
    email: "",
    website: "",
    facebook_url: "",
    youtube_url: "",
    livestream_url: "",
    image_url: "",
    service_times: [],
    ministries: [],
    lat: "",
    lng: "",
    status: "active"
  });

  const [newMinistry, setNewMinistry] = useState("");
  const [newService, setNewService] = useState({ day: 'sunday', time: '', name: '' });
  const [duplicateError, setDuplicateError] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  useEffect(() => {
    loadData();
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
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const denominations = [
    { value: "baptist", label: "Baptist" },
    { value: "methodist", label: "Methodist" },
    { value: "catholic", label: "Catholic" },
    { value: "lutheran", label: "Lutheran" },
    { value: "presbyterian", label: "Presbyterian" },
    { value: "pentecostal", label: "Pentecostal" },
    { value: "church_of_christ", label: "Church of Christ" },
    { value: "assembly_of_god", label: "Assembly of God" },
    { value: "episcopal", label: "Episcopal" },
    { value: "non_denominational", label: "Non-Denominational" },
    { value: "other", label: "Other" }
  ];

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const handleAddMinistry = () => {
    if (newMinistry.trim()) {
      setFormData(prev => ({
        ...prev,
        ministries: [...prev.ministries, newMinistry.trim()]
      }));
      setNewMinistry("");
    }
  };

  const handleRemoveMinistry = (index) => {
    setFormData(prev => ({
      ...prev,
      ministries: prev.ministries.filter((_, i) => i !== index)
    }));
  };

  const handleAddService = () => {
    if (newService.day && newService.time) {
      setFormData(prev => ({
        ...prev,
        service_times: [...prev.service_times, { ...newService }]
      }));
      setNewService({ day: 'sunday', time: '', name: '' });
    }
  };

  const handleRemoveService = (index) => {
    setFormData(prev => ({
      ...prev,
      service_times: prev.service_times.filter((_, i) => i !== index)
    }));
  };

  const handleTownChange = (townId) => {
    const town = towns.find(t => t.id === townId);
    setFormData(prev => ({
      ...prev,
      town_id: townId,
      town: town?.name || ""
    }));
    // Reset duplicate error when town changes
    setDuplicateError(false);
  };

  const checkForDuplicate = async (name, townId) => {
    if (!name || !townId) return false;

    const town = towns.find(t => t.id === townId);
    if (!town) return false;

    const slug = generateSlug(name);
    const townSlug = generateSlug(town.name);

    try {
      const existing = await Church.filter({ slug, town_slug: townSlug });
      return existing.length > 0;
    } catch (error) {
      console.error("Error checking for duplicate:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.denomination) {
      toast.error("Please fill in the required fields");
      return;
    }

    if (!formData.town_id) {
      toast.error("Please select a town");
      return;
    }

    setSaving(true);
    setCheckingDuplicate(true);

    try {
      // Check for duplicate
      const isDuplicate = await checkForDuplicate(formData.name, formData.town_id);
      setCheckingDuplicate(false);

      if (isDuplicate) {
        setDuplicateError(true);
        setSaving(false);
        toast.error("A church with this name already exists in this town");
        return;
      }

      // Generate slugs
      const town = towns.find(t => t.id === formData.town_id);
      const slug = generateSlug(formData.name);
      const townSlug = generateSlug(town?.name || '');

      const churchData = {
        ...formData,
        slug,
        town_slug: townSlug,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
      };

      await Church.create(churchData);
      toast.success("Church added successfully!");
      navigate(createPageUrl("MyChurches"));
    } catch (error) {
      console.error("Error creating church:", error);
      toast.error("Failed to add church");
    }
    setSaving(false);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <ChurchIcon className="w-12 h-12 text-indigo-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Churches"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Churches
        </Button>

        <Card className="border-2 border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChurchIcon className="w-6 h-6 text-indigo-600" />
              Add Church
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Duplicate Error Alert */}
              {duplicateError && (
                <DuplicateListingAlert
                  entityType="Church"
                  entityName={formData.name}
                  townName={formData.town}
                />
              )}

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Church Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      setDuplicateError(false);
                    }}
                    placeholder="e.g., First Baptist Church of Corsicana"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="denomination">Denomination *</Label>
                    <Select
                      value={formData.denomination}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, denomination: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select denomination" />
                      </SelectTrigger>
                      <SelectContent>
                        {denominations.map(d => (
                          <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pastor">Pastor Name</Label>
                    <Input
                      id="pastor"
                      value={formData.pastor_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, pastor_name: e.target.value }))}
                      placeholder="Pastor John Smith"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell people about your church..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={formData.mission_statement}
                    onChange={(e) => setFormData(prev => ({ ...prev, mission_statement: e.target.value }))}
                    placeholder="Your church's mission..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Church Photo URL</Label>
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
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Church St, Corsicana, TX 75110"
                  />
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
                      placeholder="info@church.org"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.yourchurch.org"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      value={formData.lat}
                      onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                      placeholder="32.0954"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      value={formData.lng}
                      onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                      placeholder="-96.4689"
                    />
                  </div>
                </div>
              </div>

              {/* Social & Streaming */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Social Media & Streaming</h3>

                <div>
                  <Label htmlFor="facebook">Facebook Page</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/yourchurch"
                  />
                </div>

                <div>
                  <Label htmlFor="youtube">YouTube Channel</Label>
                  <Input
                    id="youtube"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://youtube.com/@yourchurch"
                  />
                </div>

                <div>
                  <Label htmlFor="livestream">Live Stream URL</Label>
                  <Input
                    id="livestream"
                    value={formData.livestream_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, livestream_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Service Times */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Service Times
                </h3>

                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Day</Label>
                    <Select
                      value={newService.day}
                      onValueChange={(value) => setNewService(prev => ({ ...prev, day: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(d => (
                          <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newService.time}
                      onChange={(e) => setNewService(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Service Name</Label>
                    <Input
                      value={newService.name}
                      onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Morning Worship"
                    />
                  </div>
                  <Button type="button" onClick={handleAddService}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.service_times.length > 0 && (
                  <div className="space-y-2">
                    {formData.service_times.map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-indigo-50 rounded">
                        <span className="capitalize">
                          {service.day} - {formatTime(service.time)}
                          {service.name && ` (${service.name})`}
                        </span>
                        <button type="button" onClick={() => handleRemoveService(idx)}>
                          <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ministries */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Ministries & Programs</h3>
                <div className="flex gap-2">
                  <Input
                    value={newMinistry}
                    onChange={(e) => setNewMinistry(e.target.value)}
                    placeholder="e.g., Youth Ministry, Women's Group..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMinistry())}
                  />
                  <Button type="button" onClick={handleAddMinistry}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ministries.map((ministry, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {ministry}
                      <button type="button" onClick={() => handleRemoveMinistry(idx)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Churches"))}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Add Church"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
