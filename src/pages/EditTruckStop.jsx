import React, { useState, useEffect } from "react";
import { TruckStop, FoodTruck, User } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowLeft, X, AlertCircle } from "lucide-react";

export default function EditTruckStop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stopId = searchParams.get('id');

  const [stop, setStop] = useState(null);
  const [truck, setTruck] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
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
    weather_note: ""
  });

  const [menuItem, setMenuItem] = useState("");

  useEffect(() => {
    if (stopId) {
      loadStop();
    } else {
      navigate(createPageUrl("MyTruckStops"));
    }
  }, [stopId]);

  const loadStop = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const stopData = await TruckStop.get(stopId);
      setStop(stopData);

      const truckData = await FoodTruck.get(stopData.truck_id);

      // Check if user owns this truck
      if (truckData.created_by !== userData.id) {
        alert("You don't have permission to edit this stop");
        navigate(createPageUrl("MyTruckStops"));
        return;
      }

      setTruck(truckData);

      // Format datetime for input fields
      const formatDatetime = (dt) => {
        if (!dt) return '';
        const date = new Date(dt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        location_name: stopData.location_name || "",
        address: stopData.address || "",
        lat: stopData.lat || "",
        lng: stopData.lng || "",
        start_datetime: formatDatetime(stopData.start_datetime),
        end_datetime: formatDatetime(stopData.end_datetime),
        status: stopData.status || "scheduled",
        specials_today: stopData.specials_today || "",
        menu_highlights: stopData.menu_highlights || [],
        wait_minutes: stopData.wait_minutes || 0,
        indoor_outdoor: stopData.indoor_outdoor || false,
        weather_note: stopData.weather_note || ""
      });
    } catch (error) {
      console.error("Error loading truck stop:", error);
      navigate(createPageUrl("MyTruckStops"));
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

  const handleQuickStatusUpdate = async (newStatus) => {
    setSaving(true);
    try {
      await TruckStop.update(stopId, { status: newStatus });
      setFormData(prev => ({ ...prev, status: newStatus }));
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const updateData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        wait_minutes: parseInt(formData.wait_minutes) || 0,
        menu_highlights: formData.menu_highlights
      };

      await TruckStop.update(stopId, updateData);
      navigate(createPageUrl(`TruckStopDetail?id=${stopId}`));
    } catch (error) {
      console.error("Error updating truck stop:", error);
      alert("Failed to update truck stop. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Calendar className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  if (!stop || !truck) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stop not found</h2>
        <Button onClick={() => navigate(createPageUrl("MyTruckStops"))}>
          Back to My Truck Stops
        </Button>
      </div>
    </div>;
  }

  const now = new Date();
  const startDate = new Date(stop.start_datetime);
  const endDate = new Date(stop.end_datetime);
  const isActive = now >= startDate && now <= endDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl(`TruckStopDetail?id=${stopId}`))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stop Details
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-600" />
            Edit Truck Stop
          </h1>
          <p className="text-gray-600 mt-2">{truck.name} at {stop.location_name}</p>
        </div>

        {/* Quick Status Update */}
        {isActive && (
          <Card className="border-2 border-green-300 bg-green-50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-green-700" />
                <h2 className="text-xl font-bold text-green-900">Quick Status Update</h2>
              </div>
              <p className="text-sm text-green-800 mb-4">This stop is currently active. Update your status:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleQuickStatusUpdate("prepping")}
                  variant={formData.status === "prepping" ? "default" : "outline"}
                  disabled={saving}
                  className={formData.status === "prepping" ? "bg-yellow-600" : ""}
                >
                  Prepping
                </Button>
                <Button
                  onClick={() => handleQuickStatusUpdate("serving")}
                  variant={formData.status === "serving" ? "default" : "outline"}
                  disabled={saving}
                  className={formData.status === "serving" ? "bg-green-600" : ""}
                >
                  Serving Now!
                </Button>
                <Button
                  onClick={() => handleQuickStatusUpdate("sold_out")}
                  variant={formData.status === "sold_out" ? "default" : "outline"}
                  disabled={saving}
                  className={formData.status === "sold_out" ? "bg-red-600" : ""}
                >
                  Sold Out
                </Button>
                <Button
                  onClick={() => handleQuickStatusUpdate("closed")}
                  variant={formData.status === "closed" ? "default" : "outline"}
                  disabled={saving}
                  className={formData.status === "closed" ? "bg-gray-600" : ""}
                >
                  Closed Early
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Queue Management */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Queue Management</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="wait_minutes">Current Wait Time (minutes)</Label>
                  <Input
                    id="wait_minutes"
                    type="number"
                    min="0"
                    value={formData.wait_minutes}
                    onChange={(e) => handleInputChange("wait_minutes", e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-600 mt-1">Set to 0 if there's no wait</p>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="prepping">Prepping</SelectItem>
                      <SelectItem value="serving">Serving Now!</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Location Details</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="location_name">Location Name *</Label>
                  <Input
                    id="location_name"
                    value={formData.location_name}
                    onChange={(e) => handleInputChange("location_name", e.target.value)}
                    placeholder="e.g., Main Street Park"
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
                    <Label htmlFor="lat">Latitude</Label>
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
                    <Label htmlFor="lng">Longitude</Label>
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
              <h2 className="text-xl font-bold mb-4">Date & Time</h2>

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
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl(`TruckStopDetail?id=${stopId}`))}
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
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
