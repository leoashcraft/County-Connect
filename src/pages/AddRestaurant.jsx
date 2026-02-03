import React, { useState, useEffect, useCallback, useRef } from "react";
import { Restaurant, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils, ArrowLeft, Upload, X, MapPin, Loader2 } from "lucide-react";
import OperatingHoursBuilder from "@/components/OperatingHoursBuilder";
import MenuBuilder from "@/components/MenuBuilder";
import { geocodeTexasAddress } from "@/utils/geocoding";
import { toast } from "sonner";

export default function AddRestaurant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [towns, setTowns] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    photo_urls: [],
    cuisine_types: [],
    dietary_flags: [],
    payment_methods: [],
    address: "",
    town: "",
    town_id: "",
    lat: null,
    lng: null,
    phone: "",
    website: "",
    reservation_url: "",
    social_links: {},
    operating_hours: [
      { day: "monday", open_time: "09:00", close_time: "17:00", is_closed: false },
      { day: "tuesday", open_time: "09:00", close_time: "17:00", is_closed: false },
      { day: "wednesday", open_time: "09:00", close_time: "17:00", is_closed: false },
      { day: "thursday", open_time: "09:00", close_time: "17:00", is_closed: false },
      { day: "friday", open_time: "09:00", close_time: "17:00", is_closed: false },
      { day: "saturday", open_time: "10:00", close_time: "18:00", is_closed: false },
      { day: "sunday", open_time: "10:00", close_time: "18:00", is_closed: false }
    ],
    menu_sections: [],
    menu_highlights: [],
    seating_capacity: "",
    parking_available: false,
    delivery_available: false,
    takeout_available: false,
    accepts_reservations: false,
    family_friendly: false,
    outdoor_seating: false,
    status: "pending"
  });

  const [photoInput, setPhotoInput] = useState("");
  const [menuItem, setMenuItem] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeTimeoutRef = useRef(null);

  // Auto-geocode when address changes
  const handleAddressChange = useCallback((address) => {
    handleInputChange("address", address);

    // Clear any pending geocode request
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }

    // Don't geocode if address is too short
    if (!address || address.length < 10) {
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
            lat: result.lat,
            lng: result.lng
          }));
          toast.success("Location coordinates found!");
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      // Pre-populate town_id from user's preferred town
      if (userData?.preferred_town_id) {
        setFormData(prev => ({
          ...prev,
          town_id: userData.preferred_town_id
        }));
      }

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading data:", error);
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
      alert("Please enter a restaurant name");
      return;
    }

    if (formData.cuisine_types.length === 0) {
      alert("Please select at least one cuisine type");
      return;
    }

    if (!formData.address.trim()) {
      alert("Please enter an address");
      return;
    }

    if (!formData.town_id) {
      alert("Please select a town");
      return;
    }

    setLoading(true);

    try {
      const restaurantData = {
        ...formData,
        seating_capacity: formData.seating_capacity ? parseInt(formData.seating_capacity) : null,
        // Initialize rating fields
        rating_avg: 0,
        rating_count: 0
      };

      await Restaurant.create(restaurantData);
      navigate(createPageUrl("MyRestaurants"));
    } catch (error) {
      console.error("Error creating restaurant:", error);
      alert("Failed to create restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("MyRestaurants"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Restaurants
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Utensils className="w-8 h-8 text-orange-600" />
            Add Restaurant
          </h1>
          <p className="text-gray-600 mt-2">Create your restaurant profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., The Corner Bistro"
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
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="123 Main St, City, State, ZIP"
                      required
                    />
                    {isGeocoding && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter a full address to auto-detect map coordinates</p>
                </div>

                <div>
                  <Label htmlFor="town_id">Town/City *</Label>
                  <Select value={formData.town_id} onValueChange={(value) => handleInputChange("town_id", value)} required>
                    <SelectTrigger id="town_id">
                      <SelectValue placeholder="Select your town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">This helps filter restaurants by location</p>
                </div>

                <div>
                  <Label htmlFor="town">Town (Display Name)</Label>
                  <Input
                    id="town"
                    value={formData.town}
                    onChange={(e) => handleInputChange("town", e.target.value)}
                    placeholder="e.g., Corsicana"
                  />
                  <p className="text-sm text-gray-600 mt-1">Optional: Enter town name for display purposes</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <Label>Map Coordinates</Label>
                    {formData.lat && formData.lng && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Auto-detected</span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={formData.lat || ""}
                        onChange={(e) => handleInputChange("lat", e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="32.0954"
                      />
                      <p className="text-xs text-gray-400 mt-1">Latitude</p>
                    </div>
                    <div>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={formData.lng || ""}
                        onChange={(e) => handleInputChange("lng", e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="-96.4689"
                      />
                      <p className="text-xs text-gray-400 mt-1">Longitude</p>
                    </div>
                  </div>
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

          {/* Operating Hours */}
          <OperatingHoursBuilder
            hours={formData.operating_hours}
            onChange={(hours) => handleInputChange("operating_hours", hours)}
          />

          {/* Menu Builder */}
          <MenuBuilder
            sections={formData.menu_sections}
            onChange={(sections) => handleInputChange("menu_sections", sections)}
          />

          {/* Menu Highlights (Simple) */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Menu Highlights (Alternative to Full Menu)</h2>
              <p className="text-sm text-gray-600 mb-4">
                If you don't want to build a full menu, you can add simple menu highlights here.
              </p>

              <div className="flex gap-2 mb-4">
                <Input
                  value={menuItem}
                  onChange={(e) => setMenuItem(e.target.value)}
                  placeholder="e.g., Signature Burger"
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
                  <Label htmlFor="reservation_url">Reservation URL</Label>
                  <Input
                    id="reservation_url"
                    type="url"
                    value={formData.reservation_url}
                    onChange={(e) => handleInputChange("reservation_url", e.target.value)}
                    placeholder="https://reservations.yoursite.com"
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

          {/* Features */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="seating_capacity">Seating Capacity</Label>
                  <Input
                    id="seating_capacity"
                    type="number"
                    value={formData.seating_capacity}
                    onChange={(e) => handleInputChange("seating_capacity", e.target.value)}
                    placeholder="e.g., 50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.parking_available}
                      onCheckedChange={(checked) => handleInputChange("parking_available", checked)}
                    />
                    <span className="text-sm">Parking Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.delivery_available}
                      onCheckedChange={(checked) => handleInputChange("delivery_available", checked)}
                    />
                    <span className="text-sm">Delivery Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.takeout_available}
                      onCheckedChange={(checked) => handleInputChange("takeout_available", checked)}
                    />
                    <span className="text-sm">Takeout Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.accepts_reservations}
                      onCheckedChange={(checked) => handleInputChange("accepts_reservations", checked)}
                    />
                    <span className="text-sm">Accepts Reservations</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.family_friendly}
                      onCheckedChange={(checked) => handleInputChange("family_friendly", checked)}
                    />
                    <span className="text-sm">Family Friendly</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.outdoor_seating}
                      onCheckedChange={(checked) => handleInputChange("outdoor_seating", checked)}
                    />
                    <span className="text-sm">Outdoor Seating</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("MyRestaurants"))}
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
              {loading ? "Creating..." : "Create Restaurant"}
            </Button>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Your restaurant will be submitted for approval. You'll be notified when it's approved and goes live.
          </p>
        </form>
      </div>
    </div>
  );
}
