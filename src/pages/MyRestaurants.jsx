import React, { useState, useEffect } from "react";
import { Restaurant, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, Edit, Eye, Trash2, Plus, Star, ArrowLeft } from "lucide-react";

export default function MyRestaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyRestaurants();
  }, []);

  const loadMyRestaurants = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const allRestaurants = await Restaurant.list('-created_date');
      const myRestaurants = allRestaurants.filter(restaurant => restaurant.created_by === userData.id);
      setRestaurants(myRestaurants);
    } catch (error) {
      console.error("Error loading restaurants:", error);
      navigate(createPageUrl("Restaurants"));
    }
    setLoading(false);
  };

  const deleteRestaurant = async (restaurantId) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      await Restaurant.delete(restaurantId);
      await loadMyRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Failed to delete restaurant");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending Approval",
      approved: "Approved",
      active: "Active",
      suspended: "Suspended"
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Utensils className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Utensils className="w-8 h-8 text-orange-600" />
                My Restaurants
              </h1>
              <p className="text-gray-600 mt-2">Manage your restaurant profiles</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl("AddRestaurant"))}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {restaurants.length === 0 ? (
            <div className="col-span-2">
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <Utensils className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No restaurants yet</h3>
                  <p className="text-gray-600 mb-6">Create your first restaurant profile</p>
                  <Button
                    onClick={() => navigate(createPageUrl("AddRestaurant"))}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Restaurant
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            restaurants.map(restaurant => (
              <Card key={restaurant.id} className="border-2 border-orange-100">
                {restaurant.logo_url && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={restaurant.logo_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getStatusColor(restaurant.status)}>
                      {getStatusLabel(restaurant.status)}
                    </Badge>
                    {restaurant.rating_avg > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating_avg.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>

                  {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                    <p className="text-sm text-gray-600 mb-3">
                      {restaurant.cuisine_types.join(', ')}
                    </p>
                  )}

                  {restaurant.address && (
                    <p className="text-sm text-gray-600 mb-4">{restaurant.address}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`RestaurantDetail?id=${restaurant.id}`))}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`EditRestaurant?id=${restaurant.id}`))}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteRestaurant(restaurant.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
