import React, { useState, useEffect, useCallback, useRef } from "react";
import { RealtyListing, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, ArrowLeft, Upload, X, MapPin, Loader2, DollarSign, Bed, Bath, Square } from "lucide-react";
import { geocodeTexasAddress } from "@/utils/geocoding";
import { toast } from "sonner";

export default function AddRealtyListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [towns, setTowns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    listing_type: "sale",
    property_type: "residential",
    price: "",
    address: "",
    city: "",
    state: "TX",
    zip_code: "",
    town: "",
    town_id: "",
    lat: null,
    lng: null,
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    lot_size: "",
    year_built: "",
    garage: "",
    description: "",
    features: [],
    image_url: "",
    photo_urls: [],
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    listing_source: "owner",
    company_name: "",
    status: "active"
  });

  const [photoInput, setPhotoInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeTimeoutRef = useRef(null);

  const listingTypes = [
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" }
  ];

  const propertyTypes = [
    { value: "residential", label: "Residential" },
    { value: "condo", label: "Condo/Townhome" },
    { value: "multi_family", label: "Multi-Family" },
    { value: "mobile", label: "Mobile/Manufactured" },
    { value: "land", label: "Land/Lot" },
    { value: "farm", label: "Farm/Ranch" },
    { value: "commercial", label: "Commercial" }
  ];

  const commonFeatures = [
    "Central Air",
    "Central Heat",
    "Hardwood Floors",
    "Carpet",
    "Tile Floors",
    "Granite Counters",
    "Stainless Appliances",
    "Fireplace",
    "Pool",
    "Hot Tub",
    "Fenced Yard",
    "Covered Patio",
    "Deck",
    "Storage Shed",
    "Workshop",
    "Sprinkler System",
    "Security System",
    "Smart Home Features",
    "Updated Kitchen",
    "Updated Bathrooms",
    "New Roof",
    "New HVAC",
    "Energy Efficient",
    "Solar Panels",
    "Well Water",
    "City Water",
    "Septic",
    "City Sewer",
    "Horse Property",
    "RV Parking",
    "Boat Storage"
  ];

  // Auto-geocode when address changes
  const handleAddressChange = useCallback((address) => {
    handleInputChange("address", address);

    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }

    if (!address || address.length < 10) {
      return;
    }

    geocodeTimeoutRef.current = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const fullAddress = `${address}, ${formData.city || formData.town}, TX ${formData.zip_code}`;
        const result = await geocodeTexasAddress(fullAddress);
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
  }, [formData.city, formData.town, formData.zip_code]);

  useEffect(() => {
    return () => {
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      if (userData) {
        setFormData(prev => ({
          ...prev,
          contact_name: userData.full_name || "",
          contact_email: userData.email || "",
          town_id: userData.preferred_town_id || ""
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

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const addCustomFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a property title");
      return;
    }

    if (!formData.price) {
      toast.error("Please enter a price");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter an address");
      return;
    }

    setLoading(true);

    try {
      const listingData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        garage: formData.garage ? parseInt(formData.garage) : null,
        created_by: user?.id
      };

      await RealtyListing.create(listingData);
      toast.success("Listing created successfully!");
      navigate(createPageUrl("MyRealtyListings"));
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6 flex items-center justify-center">
        <Card className="border-2 border-green-100 max-w-md">
          <CardContent className="p-8 text-center">
            <Home className="w-16 h-16 mx-auto mb-4 text-green-300" />
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to list a property.</p>
            <Button onClick={() => User.login()} className="bg-gradient-to-r from-green-500 to-emerald-500">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("MyRealtyListings"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Listings
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Home className="w-8 h-8 text-green-600" />
            List Your Property
          </h1>
          <p className="text-gray-600 mt-2">Create a listing for sale or rent</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Type & Property Info */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Listing Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Beautiful 3BR Home in Corsicana"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="listing_type">Listing Type *</Label>
                    <Select value={formData.listing_type} onValueChange={(value) => handleInputChange("listing_type", value)}>
                      <SelectTrigger id="listing_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {listingTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select value={formData.property_type} onValueChange={(value) => handleInputChange("property_type", value)}>
                      <SelectTrigger id="property_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">
                    {formData.listing_type === "rent" ? "Monthly Rent *" : "Price *"}
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder={formData.listing_type === "rent" ? "1500" : "250000"}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="listing_source">Listed By</Label>
                  <Select value={formData.listing_source} onValueChange={(value) => handleInputChange("listing_source", value)}>
                    <SelectTrigger id="listing_source">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner (For Sale By Owner)</SelectItem>
                      <SelectItem value="agent">Real Estate Agent</SelectItem>
                      <SelectItem value="company">Real Estate Company</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.listing_source === "agent" || formData.listing_source === "company" || formData.listing_source === "property_manager") && (
                  <div>
                    <Label htmlFor="company_name">Company/Brokerage Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange("company_name", e.target.value)}
                      placeholder="e.g., ABC Realty"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Property Address</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="123 Main St"
                      required
                    />
                    {isGeocoding && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Corsicana"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="TX"
                      disabled
                    />
                  </div>

                  <div>
                    <Label htmlFor="zip_code">ZIP Code *</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => handleInputChange("zip_code", e.target.value)}
                      placeholder="75110"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="town_id">County Town</Label>
                  <Select value={formData.town_id} onValueChange={(value) => {
                    const selectedTown = towns.find(t => t.id === value);
                    handleInputChange("town_id", value);
                    if (selectedTown) {
                      handleInputChange("town", selectedTown.name);
                    }
                  }}>
                    <SelectTrigger id="town_id">
                      <SelectValue placeholder="Select town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">Helps with local filtering</p>
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

          {/* Property Details */}
          {formData.listing_type !== "land" && (
            <Card className="border-2 border-green-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Property Details</h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                        placeholder="3"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="bathrooms"
                        type="number"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                        placeholder="2"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="square_feet">Square Feet</Label>
                    <div className="relative">
                      <Square className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="square_feet"
                        type="number"
                        value={formData.square_feet}
                        onChange={(e) => handleInputChange("square_feet", e.target.value)}
                        placeholder="1800"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lot_size">Lot Size (acres)</Label>
                    <Input
                      id="lot_size"
                      type="number"
                      step="0.01"
                      value={formData.lot_size}
                      onChange={(e) => handleInputChange("lot_size", e.target.value)}
                      placeholder="0.25"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year_built">Year Built</Label>
                    <Input
                      id="year_built"
                      type="number"
                      value={formData.year_built}
                      onChange={(e) => handleInputChange("year_built", e.target.value)}
                      placeholder="2005"
                    />
                  </div>

                  <div>
                    <Label htmlFor="garage">Garage (cars)</Label>
                    <Input
                      id="garage"
                      type="number"
                      value={formData.garage}
                      onChange={(e) => handleInputChange("garage", e.target.value)}
                      placeholder="2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Land Details (for land listings) */}
          {formData.listing_type === "land" && (
            <Card className="border-2 border-green-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Land Details</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lot_size">Acreage *</Label>
                    <Input
                      id="lot_size"
                      type="number"
                      step="0.01"
                      value={formData.lot_size}
                      onChange={(e) => handleInputChange("lot_size", e.target.value)}
                      placeholder="10.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>

              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your property... Include key features, recent updates, neighborhood highlights, etc."
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>

              <div className="grid md:grid-cols-3 gap-2 mb-4">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <Label>Add Custom Feature</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g., Wine Cellar"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCustomFeature} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              {formData.features.length > 0 && (
                <div className="mt-4">
                  <Label>Selected Features</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map(feature => (
                      <span
                        key={feature}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {feature}
                        <button type="button" onClick={() => removeFeature(feature)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Photos</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="image_url">Main Photo URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange("image_url", e.target.value)}
                    placeholder="https://example.com/main-photo.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">This will be the primary photo shown in listings</p>
                </div>

                <div>
                  <Label>Additional Photos</Label>
                  <div className="flex gap-2 mt-2">
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
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => handleInputChange("contact_name", e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange("contact_email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Realty"))}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
