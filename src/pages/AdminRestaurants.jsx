import React, { useState, useEffect } from "react";
import { Restaurant, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils, Search, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function AdminRestaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("Restaurants"));
        return;
      }

      const allRestaurants = await Restaurant.list('-created_date');
      setRestaurants(allRestaurants);
    } catch (error) {
      console.error("Error loading restaurants:", error);
      navigate(createPageUrl("Restaurants"));
    }
    setLoading(false);
  };

  const updateRestaurantStatus = async (restaurantId, newStatus) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const confirmMessage = newStatus === 'suspended'
      ? `Are you sure you want to suspend ${restaurant.name}? This will hide them from public view.`
      : `Are you sure you want to ${newStatus === 'approved' ? 'approve' : 'change status of'} ${restaurant.name}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await Restaurant.update(restaurantId, { status: newStatus });
      await loadRestaurants();
      alert(`${restaurant.name} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      alert("Failed to update restaurant status");
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

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = !searchTerm ||
      restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || restaurant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = restaurants.filter(r => r.status === 'pending').length;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Utensils className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Utensils className="w-8 h-8 text-orange-600" />
                Restaurant Moderation
              </h1>
              <p className="text-gray-600 mt-2">Review and approve restaurant applications</p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Restaurants List */}
        <div className="space-y-4">
          {filteredRestaurants.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Utensils className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No restaurants found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredRestaurants.map(restaurant => (
              <Card key={restaurant.id} className={`border-2 ${restaurant.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-orange-100'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Restaurant Logo */}
                    {restaurant.logo_url && (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-orange-200"
                      />
                    )}

                    {/* Restaurant Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className={getStatusColor(restaurant.status)}>
                            {getStatusLabel(restaurant.status)}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {restaurant.address && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Address</p>
                            <p className="text-gray-900">{restaurant.address}</p>
                          </div>
                        )}

                        {restaurant.town && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Town</p>
                            <p className="text-gray-900">{restaurant.town}</p>
                          </div>
                        )}

                        {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Cuisine Types</p>
                            <p className="text-gray-900">{restaurant.cuisine_types.join(', ')}</p>
                          </div>
                        )}

                        {restaurant.phone && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Phone</p>
                            <p className="text-gray-900">{restaurant.phone}</p>
                          </div>
                        )}

                        {restaurant.seating_capacity && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Seating Capacity</p>
                            <p className="text-gray-900">{restaurant.seating_capacity} seats</p>
                          </div>
                        )}

                        {restaurant.payment_methods && restaurant.payment_methods.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Payment Methods</p>
                            <p className="text-gray-900">{restaurant.payment_methods.join(', ')}</p>
                          </div>
                        )}
                      </div>

                      {restaurant.dietary_flags && restaurant.dietary_flags.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Dietary Options</p>
                          <div className="flex flex-wrap gap-1">
                            {restaurant.dietary_flags.map(flag => (
                              <Badge key={flag} variant="outline" className="text-xs">
                                {formatLabel(flag)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {restaurant.amenities && restaurant.amenities.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Amenities</p>
                          <div className="flex flex-wrap gap-1">
                            {restaurant.amenities.map(amenity => (
                              <Badge key={amenity} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`RestaurantDetail?id=${restaurant.id}`))}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>

                      {restaurant.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateRestaurantStatus(restaurant.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateRestaurantStatus(restaurant.id, 'suspended')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {restaurant.status === 'approved' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => updateRestaurantStatus(restaurant.id, 'active')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateRestaurantStatus(restaurant.id, 'suspended')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Suspend
                          </Button>
                        </>
                      )}

                      {restaurant.status === 'active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateRestaurantStatus(restaurant.id, 'suspended')}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      )}

                      {restaurant.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateRestaurantStatus(restaurant.id, 'active')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Reactivate
                        </Button>
                      )}
                    </div>
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
