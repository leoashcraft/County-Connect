import React, { useState, useEffect } from "react";
import { Town, User, Restaurant } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Edit, Trash2, Eye, Users, ExternalLink, Utensils, X, Star } from "lucide-react";
import { generateSlug } from "@/components/utils/slugUtils";

export default function AdminTowns() {
  const navigate = useNavigate();
  const [towns, setTowns] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTown, setEditingTown] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    county: "Navarro County",
    description: "",
    population: "",
    zip_codes: "",
    image_url: "",
    lat: "",
    lng: "",
    history: "",
    known_for: "",
    getting_around: "",
    official_website: "",
    chamber_website: "",
    meta_title: "",
    meta_description: "",
    featured_restaurant_ids: []
  });

  useEffect(() => {
    loadTowns();
  }, []);

  // Auto-generate slug when name changes (only for new towns)
  useEffect(() => {
    if (!editingTown && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.name)
      }));
    }
  }, [formData.name, editingTown]);

  const loadTowns = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Check if user is admin
      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("AdminDashboard"));
        return;
      }

      const [allTowns, allRestaurants] = await Promise.all([
        Town.list('name'),
        Restaurant.filter({ status: 'active' }, 'name')
      ]);
      setTowns(allTowns);
      setRestaurants(allRestaurants);
    } catch (error) {
      console.error("Error loading towns:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a town name");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Please enter a URL slug");
      return;
    }

    try {
      const townData = {
        ...formData,
        population: formData.population ? parseInt(formData.population) : null,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null
      };

      if (editingTown) {
        await Town.update(editingTown.id, townData);
        alert("Town updated successfully");
      } else {
        await Town.create(townData);
        alert("Town added successfully");
      }

      resetForm();
      await loadTowns();
    } catch (error) {
      console.error("Error saving town:", error);
      alert("Failed to save town");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      county: "Navarro County",
      description: "",
      population: "",
      zip_codes: "",
      image_url: "",
      lat: "",
      lng: "",
      history: "",
      known_for: "",
      getting_around: "",
      official_website: "",
      chamber_website: "",
      meta_title: "",
      meta_description: "",
      featured_restaurant_ids: []
    });
    setShowAddForm(false);
    setEditingTown(null);
  };

  const handleEdit = (town) => {
    setEditingTown(town);
    setFormData({
      name: town.name || "",
      slug: town.slug || generateSlug(town.name || ""),
      county: town.county || "Navarro County",
      description: town.description || "",
      population: town.population || "",
      zip_codes: town.zip_codes || "",
      image_url: town.image_url || "",
      lat: town.lat || "",
      lng: town.lng || "",
      history: town.history || "",
      known_for: town.known_for || "",
      getting_around: town.getting_around || "",
      official_website: town.official_website || "",
      chamber_website: town.chamber_website || "",
      meta_title: town.meta_title || "",
      meta_description: town.meta_description || "",
      featured_restaurant_ids: town.featured_restaurant_ids || []
    });
    setShowAddForm(true);
  };

  // Add a restaurant to featured list
  const addFeaturedRestaurant = (restaurantId) => {
    if (!restaurantId || formData.featured_restaurant_ids.includes(restaurantId)) return;
    setFormData(prev => ({
      ...prev,
      featured_restaurant_ids: [...prev.featured_restaurant_ids, restaurantId]
    }));
  };

  // Remove a restaurant from featured list
  const removeFeaturedRestaurant = (restaurantId) => {
    setFormData(prev => ({
      ...prev,
      featured_restaurant_ids: prev.featured_restaurant_ids.filter(id => id !== restaurantId)
    }));
  };

  // Get restaurant by ID
  const getRestaurantById = (id) => restaurants.find(r => r.id === id);

  const handleDelete = async (townId) => {
    if (!confirm("Are you sure you want to delete this town? This may affect existing listings.")) {
      return;
    }

    try {
      await Town.delete(townId);
      await loadTowns();
      alert("Town deleted successfully");
    } catch (error) {
      console.error("Error deleting town:", error);
      alert("Failed to delete town. It may be in use by existing listings.");
    }
  };

  const seedInitialTowns = async () => {
    const initialTowns = [
      "Angus", "Barry", "Blooming Grove", "Corsicana", "Dawson", "Emhouse",
      "Eureka", "Frost", "Goodlow", "Kerens", "Mildred", "Mustang", "Navarro",
      "Oak Valley", "Powell", "Retreat", "Richland", "Rice", "Chatfield",
      "Emmett", "Montfort", "Purdon", "Pursley"
    ];

    if (!confirm(`This will add ${initialTowns.length} towns to the database. Continue?`)) {
      return;
    }

    try {
      for (const townName of initialTowns) {
        await Town.create({
          name: townName,
          slug: generateSlug(townName),
          county: "Navarro County"
        });
      }
      alert("All towns added successfully!");
      await loadTowns();
    } catch (error) {
      console.error("Error seeding towns:", error);
      alert("Failed to seed towns");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <MapPin className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-orange-600" />
                Towns & Cities Management
              </h1>
              <p className="text-gray-600 mt-2">Manage towns and cities in Navarro County</p>
            </div>
            <div className="flex gap-2">
              {towns.length === 0 && (
                <Button
                  onClick={seedInitialTowns}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  Seed Initial Towns
                </Button>
              )}
              <Button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingTown(null);
                  resetForm();
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Town
              </Button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="border-2 border-orange-300 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingTown ? "Edit Town" : "Add New Town"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Town/City Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Corsicana"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="e.g., corsicana"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Page will be available at: /{formData.slug || "town-name"}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={formData.county}
                      onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                      placeholder="Navarro County"
                    />
                  </div>

                  <div>
                    <Label htmlFor="population">Population</Label>
                    <Input
                      id="population"
                      type="number"
                      value={formData.population}
                      onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
                      placeholder="e.g., 23000"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description / About</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief description of the town - what makes it special, community character, etc."
                    rows={3}
                  />
                </div>

                {/* Zip Codes */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip_codes">Zip Code(s)</Label>
                    <Input
                      id="zip_codes"
                      value={formData.zip_codes}
                      onChange={(e) => setFormData(prev => ({ ...prev, zip_codes: e.target.value }))}
                      placeholder="e.g., 75110, 75109"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple zip codes with commas</p>
                  </div>
                  <div>
                    <Label htmlFor="known_for">Known For</Label>
                    <Input
                      id="known_for"
                      value={formData.known_for}
                      onChange={(e) => setFormData(prev => ({ ...prev, known_for: e.target.value }))}
                      placeholder="e.g., Historic downtown, agriculture, fruitcake"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of what the town is known for</p>
                  </div>
                </div>

                {/* History */}
                <div>
                  <Label htmlFor="history">History</Label>
                  <Textarea
                    id="history"
                    value={formData.history}
                    onChange={(e) => setFormData(prev => ({ ...prev, history: e.target.value }))}
                    placeholder="Brief history of the town - founding, notable events, historical significance..."
                    rows={3}
                  />
                </div>

                {/* Getting Around */}
                <div>
                  <Label htmlFor="getting_around">Getting Around</Label>
                  <Textarea
                    id="getting_around"
                    value={formData.getting_around}
                    onChange={(e) => setFormData(prev => ({ ...prev, getting_around: e.target.value }))}
                    placeholder="Major highways, distance to nearby cities, transportation info..."
                    rows={2}
                  />
                </div>

                {/* Official Links */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="official_website">Official City Website</Label>
                    <Input
                      id="official_website"
                      type="url"
                      value={formData.official_website}
                      onChange={(e) => setFormData(prev => ({ ...prev, official_website: e.target.value }))}
                      placeholder="https://cityofcorsicana.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chamber_website">Chamber of Commerce Website</Label>
                    <Input
                      id="chamber_website"
                      type="url"
                      value={formData.chamber_website}
                      onChange={(e) => setFormData(prev => ({ ...prev, chamber_website: e.target.value }))}
                      placeholder="https://corsicana.org"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor="image_url">Hero Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                      placeholder="e.g., 32.0954"
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
                      placeholder="e.g., -96.4689"
                    />
                  </div>
                </div>

                {/* Featured Restaurants */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Featured Restaurants Nearby
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Select restaurants to feature on this town's page. You can add restaurants from any town in the county.
                  </p>

                  {/* Selected restaurants */}
                  {formData.featured_restaurant_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.featured_restaurant_ids.map(id => {
                        const restaurant = getRestaurantById(id);
                        if (!restaurant) return null;
                        return (
                          <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
                            <Utensils className="w-3 h-3" />
                            {restaurant.name}
                            {restaurant.town && <span className="text-xs opacity-70">({restaurant.town})</span>}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 hover:bg-red-100"
                              onClick={() => removeFeaturedRestaurant(id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Restaurant selector */}
                  <Select onValueChange={addFeaturedRestaurant}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Add a restaurant to feature..." />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants
                        .filter(r => !formData.featured_restaurant_ids.includes(r.id))
                        .map(restaurant => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            {restaurant.name} {restaurant.town && `(${restaurant.town})`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* SEO Fields */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">SEO Settings (Optional)</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                        placeholder="Custom page title for search engines"
                      />
                    </div>

                    <div>
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="Custom description for search engines (150-160 characters recommended)"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    {editingTown ? "Update Town" : "Add Town"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Towns List */}
        <Card className="border-2 border-orange-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">All Towns ({towns.length})</h2>

            {towns.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No towns added yet</h3>
                <p className="text-gray-600 mb-4">Add towns to enable location features across the platform</p>
                <Button
                  onClick={seedInitialTowns}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  Seed Initial Towns
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {towns.map(town => (
                  <Card key={town.id} className="border border-gray-200 hover:border-orange-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{town.name}</h3>
                          {town.county && (
                            <p className="text-sm text-gray-600">{town.county}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/${town.slug}`)}
                            title="View Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(town)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(town.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {town.slug && (
                          <Badge variant="outline" className="text-xs">
                            /{town.slug}
                          </Badge>
                        )}
                        {town.population && (
                          <Badge variant="secondary" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {town.population.toLocaleString()}
                          </Badge>
                        )}
                        {town.featured_restaurant_ids && town.featured_restaurant_ids.length > 0 && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            {town.featured_restaurant_ids.length} Featured
                          </Badge>
                        )}
                      </div>

                      {town.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{town.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
