import React, { useState, useEffect } from "react";
import { FoodTruck, Town, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, ArrowLeft, Upload, X } from "lucide-react";
import MenuBuilder from "@/components/MenuBuilder";
import OperatingHoursBuilder from "@/components/OperatingHoursBuilder";

export default function AddFoodTruck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [towns, setTowns] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    photo_urls: [],
    cuisine_types: [],
    dietary_flags: [],
    payment_methods: [],
    preorder_url: "",
    website: "",
    phone: "",
    social_links: {},
    town_id: "",
    base_town: "",
    typical_hours_note: "",
    menu_highlights: [],
    accepts_preorders: false,
    family_friendly: false,
    status: "pending"
  });

  const [menuSections, setMenuSections] = useState([]);
  const [operatingHours, setOperatingHours] = useState([]);

  const [photoInput, setPhotoInput] = useState("");
  const [menuItem, setMenuItem] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");

  const cuisineOptions = [
    "American", "Mexican", "Italian", "Asian", "BBQ",
    "Seafood", "Desserts", "Coffee & Drinks", "Other"
  ];

  const dietaryOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten_free", label: "Gluten-Free" },
    { value: "dairy_free", label: "Dairy-Free" },
    { value: "nut_free", label: "Nut-Free" }
  ];

  const paymentOptions = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Credit/Debit Card" },
    { value: "mobile", label: "Mobile Payment (Apple Pay, Google Pay)" },
    { value: "venmo", label: "Venmo" },
    { value: "cashapp", label: "Cash App" }
  ];

  useEffect(() => {
    loadTowns();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Pre-populate town_id from user's preferred_town_id
      if (userData.preferred_town_id) {
        setFormData(prev => ({
          ...prev,
          town_id: userData.preferred_town_id
        }));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

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
  };

  const toggleCuisine = (cuisine) => {
    setFormData(prev => ({
      ...prev,
      cuisine_types: prev.cuisine_types.includes(cuisine)
        ? prev.cuisine_types.filter(c => c !== cuisine)
        : [...prev.cuisine_types, cuisine]
    }));
  };

  const toggleDietary = (flag) => {
    setFormData(prev => ({
      ...prev,
      dietary_flags: prev.dietary_flags.includes(flag)
        ? prev.dietary_flags.filter(f => f !== flag)
        : [...prev.dietary_flags, flag]
    }));
  };

  const togglePayment = (method) => {
    setFormData(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method]
    }));
  };

  const addPhoto = () => {
    if (photoInput.trim() && !formData.photo_urls.includes(photoInput.trim())) {
      setFormData(prev => ({
        ...prev,
        photo_urls: [...prev.photo_urls, photoInput.trim()]
      }));
      setPhotoInput("");
    }
  };

  const removePhoto = (url) => {
    setFormData(prev => ({
      ...prev,
      photo_urls: prev.photo_urls.filter(p => p !== url)
    }));
  };

  const addMenuItem = () => {
    if (menuItem.trim() && !formData.menu_highlights.includes(menuItem.trim())) {
      setFormData(prev => ({
        ...prev,
        menu_highlights: [...prev.menu_highlights, menuItem.trim()]
      }));
      setMenuItem("");
    }
  };

  const removeMenuItem = (item) => {
    setFormData(prev => ({
      ...prev,
      menu_highlights: prev.menu_highlights.filter(m => m !== item)
    }));
  };

  const addSocialLink = () => {
    if (socialPlatform.trim() && socialUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialPlatform.toLowerCase()]: socialUrl
        }
      }));
      setSocialPlatform("");
      setSocialUrl("");
    }
  };

  const removeSocialLink = (platform) => {
    setFormData(prev => {
      const newLinks = { ...prev.social_links };
      delete newLinks[platform];
      return { ...prev, social_links: newLinks };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a truck name");
      return;
    }

    if (formData.cuisine_types.length === 0) {
      alert("Please select at least one cuisine type");
      return;
    }

    if (!formData.town_id) {
      alert("Please select a home base town");
      return;
    }

    setLoading(true);

    try {
      const truckData = {
        ...formData,
        // Ensure arrays are properly formatted
        cuisine_types: formData.cuisine_types,
        dietary_flags: formData.dietary_flags,
        payment_methods: formData.payment_methods,
        photo_urls: formData.photo_urls,
        menu_highlights: formData.menu_highlights,
        social_links: formData.social_links,
        // Add menu and hours data
        menu_sections: menuSections,
        operating_hours: operatingHours,
        // Initialize rating fields
        rating_avg: 0,
        rating_count: 0
      };

      await FoodTruck.create(truckData);
      navigate(createPageUrl("MyFoodTrucks"));
    } catch (error) {
      console.error("Error creating food truck:", error);
      alert("Failed to create food truck. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("MyFoodTrucks"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Food Trucks
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Truck className="w-8 h-8 text-orange-600" />
            Add Food Truck
          </h1>
          <p className="text-gray-600 mt-2">Create your food truck profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Truck Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., The Taco Truck"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => handleInputChange("logo_url", e.target.value)}
                    placeholder="https://example.com/logo.jpg"
                  />
                  <p className="text-sm text-gray-600 mt-1">Upload your logo to an image hosting service and paste the URL</p>
                </div>

                <div>
                  <Label htmlFor="town_id">Home Base Town *</Label>
                  <Select value={formData.town_id} onValueChange={(value) => handleInputChange("town_id", value)}>
                    <SelectTrigger id="town_id">
                      <SelectValue placeholder="Select your primary town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    This helps filter trucks by location
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cuisine Types */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Cuisine Types *</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {cuisineOptions.map(cuisine => (
                  <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.cuisine_types.includes(cuisine)}
                      onCheckedChange={() => toggleCuisine(cuisine)}
                    />
                    <span className="text-sm">{cuisine}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary Options */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Dietary Options</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {dietaryOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.dietary_flags.includes(option.value)}
                      onCheckedChange={() => toggleDietary(option.value)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {paymentOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.payment_methods.includes(option.value)}
                      onCheckedChange={() => togglePayment(option.value)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Highlights */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Menu Highlights (Simple)</h2>
              <p className="text-sm text-gray-600 mb-4">Quick list of popular items</p>

              <div className="flex gap-2 mb-4">
                <Input
                  value={menuItem}
                  onChange={(e) => setMenuItem(e.target.value)}
                  placeholder="e.g., Signature Tacos"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMenuItem();
                    }
                  }}
                />
                <Button type="button" onClick={addMenuItem} variant="outline">
                  Add
                </Button>
              </div>

              {formData.menu_highlights.length > 0 && (
                <div className="space-y-2">
                  {formData.menu_highlights.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-orange-50 p-2 rounded">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMenuItem(item)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Full Menu (Advanced) */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Full Menu (Advanced)</h2>
              <p className="text-sm text-gray-600 mb-4">Create detailed menu with sections, items, prices, and descriptions</p>

              <MenuBuilder
                sections={menuSections}
                onChange={setMenuSections}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Additional Photos</h2>

              <div className="flex gap-2 mb-4">
                <Input
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPhoto();
                    }
                  }}
                />
                <Button type="button" onClick={addPhoto} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {formData.photo_urls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.photo_urls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(url)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact & Links */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Contact & Links</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <Label htmlFor="preorder_url">Pre-Order URL</Label>
                  <Input
                    id="preorder_url"
                    type="url"
                    value={formData.preorder_url}
                    onChange={(e) => handleInputChange("preorder_url", e.target.value)}
                    placeholder="https://order.yoursite.com"
                  />
                </div>

                <div>
                  <Label>Social Media Links</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                      placeholder="Platform (e.g., Facebook)"
                      className="flex-1"
                    />
                    <Input
                      type="url"
                      value={socialUrl}
                      onChange={(e) => setSocialUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button type="button" onClick={addSocialLink} variant="outline">
                      Add
                    </Button>
                  </div>

                  {Object.keys(formData.social_links).length > 0 && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(formData.social_links).map(([platform, url]) => (
                        <div key={platform} className="flex items-center justify-between bg-orange-50 p-2 rounded">
                          <div>
                            <span className="font-semibold capitalize">{platform}:</span>{" "}
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline text-sm">
                              {url}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSocialLink(platform)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Operating Hours</h2>
              <p className="text-sm text-gray-600 mb-4">Set your regular weekly schedule, or use the simple note below</p>

              <OperatingHoursBuilder
                hours={operatingHours}
                onChange={setOperatingHours}
              />

              <div className="mt-6">
                <Label htmlFor="typical_hours_note">Or Simple Hours Note</Label>
                <Textarea
                  id="typical_hours_note"
                  value={formData.typical_hours_note}
                  onChange={(e) => handleInputChange("typical_hours_note", e.target.value)}
                  placeholder="e.g., Mon-Fri: 11am-2pm, Sat-Sun: 10am-3pm (varies by location)"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Use this if hours vary significantly by location</p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Features</h2>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.accepts_preorders}
                    onCheckedChange={(checked) => handleInputChange("accepts_preorders", checked)}
                  />
                  <span className="text-sm">Accepts Pre-Orders</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.family_friendly}
                    onCheckedChange={(checked) => handleInputChange("family_friendly", checked)}
                  />
                  <span className="text-sm">Family Friendly</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("MyFoodTrucks"))}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {loading ? "Creating..." : "Create Food Truck"}
            </Button>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Your truck will be submitted for approval. You'll be notified when it's approved and can start scheduling stops.
          </p>
        </form>
      </div>
    </div>
  );
}
