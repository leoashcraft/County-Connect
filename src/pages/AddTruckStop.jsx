import React, { useState, useEffect } from "react";
import { TruckStop, FoodTruck, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowLeft, X } from "lucide-react";

export default function AddTruckStop() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    truck_id: "",
    location_name: "",
    address: "",
    lat: "",
    lng: "",
    start_datetime: "",
    end_datetime: "",
    status: "scheduled",
    specials_today: "",
    menu_highlights: [],
    wait_minutes: 0,
    indoor_outdoor: false,
    weather_note: "",
    event_id: null
  });

  const [menuItem, setMenuItem] = useState("");

  useEffect(() => {
    loadMyTrucks();
  }, []);

  const loadMyTrucks = async () => {
    try {
      const userData = await User.me();
      const allTrucks = await FoodTruck.list('-created_date');
      const myTrucks = allTrucks.filter(truck => truck.created_by === userData.id);

      if (myTrucks.length === 0) {
        alert("You need to create a food truck first");
        navigate(createPageUrl("AddFoodTruck"));
        return;
      }

      setTrucks(myTrucks);
      // Pre-select first truck if only one
      if (myTrucks.length === 1) {
        setFormData(prev => ({ ...prev, truck_id: myTrucks[0].id }));
      }
    } catch (error) {
      console.error("Error loading trucks:", error);
      navigate(createPageUrl("MyFoodTrucks"));
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.truck_id) {
      alert("Please select a food truck");
      return;
    }

    if (!formData.location_name.trim()) {
      alert("Please enter a location name");
      return;
    }

    if (!formData.start_datetime || !formData.end_datetime) {
      alert("Please select start and end times");
      return;
    }

    const start = new Date(formData.start_datetime);
    const end = new Date(formData.end_datetime);

    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    setSaving(true);

    try {
      const stopData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        wait_minutes: parseInt(formData.wait_minutes) || 0,
        menu_highlights: formData.menu_highlights
      };

      await TruckStop.create(stopData);
      navigate(createPageUrl("MyTruckStops"));
    } catch (error) {
      console.error("Error creating truck stop:", error);
      alert("Failed to create truck stop. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Calendar className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("MyTruckStops"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Truck Stops
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-600" />
            Schedule Truck Stop
          </h1>
          <p className="text-gray-600 mt-2">Add a new stop for your food truck</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Truck Selection */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Select Truck *</h2>
              <Select value={formData.truck_id} onValueChange={(value) => handleInputChange("truck_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your food truck" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map(truck => (
                    <SelectItem key={truck.id} value={truck.id}>{truck.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Location Details *</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="location_name">Location Name *</Label>
                  <Input
                    id="location_name"
                    value={formData.location_name}
                    onChange={(e) => handleInputChange("location_name", e.target.value)}
                    placeholder="e.g., Main Street Park, City Hall Plaza"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main St, Town, State"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitude (for map)</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => handleInputChange("lat", e.target.value)}
                      placeholder="31.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lng">Longitude (for map)</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => handleInputChange("lng", e.target.value)}
                      placeholder="-97.5"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Tip: Use Google Maps to find coordinates. Right-click location → Click coordinates to copy.
                </p>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="indoor_outdoor"
                    checked={formData.indoor_outdoor}
                    onCheckedChange={(checked) => handleInputChange("indoor_outdoor", checked)}
                  />
                  <Label htmlFor="indoor_outdoor" className="cursor-pointer">Indoor Location</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Date & Time *</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_datetime">Start Date & Time *</Label>
                  <Input
                    id="start_datetime"
                    type="datetime-local"
                    value={formData.start_datetime}
                    onChange={(e) => handleInputChange("start_datetime", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_datetime">End Date & Time *</Label>
                  <Input
                    id="end_datetime"
                    type="datetime-local"
                    value={formData.end_datetime}
                    onChange={(e) => handleInputChange("end_datetime", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu & Specials */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Menu & Specials</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="specials_today">Today's Special</Label>
                  <Input
                    id="specials_today"
                    value={formData.specials_today}
                    onChange={(e) => handleInputChange("specials_today", e.target.value)}
                    placeholder="e.g., Half-price tacos!"
                  />
                </div>

                <div>
                  <Label>Menu Highlights</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={menuItem}
                      onChange={(e) => setMenuItem(e.target.value)}
                      placeholder="e.g., Signature Burrito"
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
                    <div className="mt-4 space-y-2">
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Additional Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="weather_note">Weather/Setup Notes</Label>
                  <Textarea
                    id="weather_note"
                    value={formData.weather_note}
                    onChange={(e) => handleInputChange("weather_note", e.target.value)}
                    placeholder="e.g., Covered area, rain or shine"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Initial Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="prepping">Prepping</SelectItem>
                      <SelectItem value="serving">Serving</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">You can update this status later</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("MyTruckStops"))}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {saving ? "Scheduling..." : "Schedule Stop"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
