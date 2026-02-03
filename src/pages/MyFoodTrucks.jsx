import React, { useState, useEffect } from "react";
import { FoodTruck, TruckStop, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Edit, Eye, Trash2, Plus, Star, ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

export default function MyFoodTrucks() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [stops, setStops] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyTrucks();
  }, []);

  const loadMyTrucks = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const allTrucks = await FoodTruck.list('-created_date');
      const myTrucks = allTrucks.filter(truck => truck.created_by === userData.id);
      setTrucks(myTrucks);

      // Load truck stops for these trucks
      const allStops = await TruckStop.list('-start_datetime');
      const myTruckIds = myTrucks.map(t => t.id);
      const myStops = allStops.filter(stop => myTruckIds.includes(stop.truck_id));
      // Only show upcoming and active stops
      const upcomingStops = myStops.filter(stop => {
        const endDate = new Date(stop.end_datetime);
        return endDate >= new Date();
      });
      setStops(upcomingStops);
    } catch (error) {
      console.error("Error loading food trucks:", error);
      navigate(createPageUrl("FoodTrucks"));
    }
    setLoading(false);
  };

  const deleteTruck = async (truckId) => {
    if (!confirm("Are you sure you want to delete this food truck?")) {
      return;
    }

    try {
      await FoodTruck.delete(truckId);
      await loadMyTrucks();
    } catch (error) {
      console.error("Error deleting truck:", error);
      alert("Failed to delete food truck");
    }
  };

  const deleteStop = async (stopId) => {
    if (!confirm("Are you sure you want to delete this truck stop?")) {
      return;
    }

    try {
      await TruckStop.delete(stopId);
      await loadMyTrucks();
    } catch (error) {
      console.error("Error deleting stop:", error);
      alert("Failed to delete truck stop");
    }
  };

  const getTruckName = (truckId) => {
    const truck = trucks.find(t => t.id === truckId);
    return truck ? truck.name : "Unknown Truck";
  };

  const getStopStatusColor = (stop) => {
    const now = new Date();
    const start = new Date(stop.start_datetime);
    const end = new Date(stop.end_datetime);

    if (now < start) return 'bg-blue-100 text-blue-800';
    if (now > end) return 'bg-gray-100 text-gray-800';

    switch (stop.status) {
      case 'prepping': return 'bg-yellow-100 text-yellow-800';
      case 'serving': return 'bg-green-100 text-green-800';
      case 'sold_out': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStopStatusLabel = (stop) => {
    const now = new Date();
    const start = new Date(stop.start_datetime);
    const end = new Date(stop.end_datetime);

    if (now < start) return 'Scheduled';
    if (now > end) return 'Ended';

    switch (stop.status) {
      case 'prepping': return 'Prepping';
      case 'serving': return 'Serving Now!';
      case 'sold_out': return 'Sold Out';
      case 'closed': return 'Closed';
      default: return 'Scheduled';
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
      <Truck className="w-12 h-12 text-orange-600 animate-pulse" />
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
                <Truck className="w-8 h-8 text-orange-600" />
                My Food Trucks
              </h1>
              <p className="text-gray-600 mt-2">Manage your food trucks and truck stops</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Food Trucks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-6 h-6 text-orange-600" />
                Food Trucks
              </h2>
              <Button
                onClick={() => navigate(createPageUrl("AddFoodTruck"))}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Truck
              </Button>
            </div>

            <div className="space-y-4">
              {trucks.length === 0 ? (
                <Card className="border-2 border-orange-100">
                  <CardContent className="p-8 text-center">
                    <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No food trucks yet</h3>
                    <p className="text-gray-600 text-sm mb-4">Create your first food truck profile</p>
                    <Button
                      onClick={() => navigate(createPageUrl("AddFoodTruck"))}
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Food Truck
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                trucks.map(truck => (
                  <Card key={truck.id} className="border-2 border-orange-100">
                {truck.logo_url && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={truck.logo_url}
                      alt={truck.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getStatusColor(truck.status)}>
                      {getStatusLabel(truck.status)}
                    </Badge>
                    {truck.rating_avg > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{truck.rating_avg.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{truck.name}</h3>

                  {truck.cuisine_types && truck.cuisine_types.length > 0 && (
                    <p className="text-sm text-gray-600 mb-3">
                      {truck.cuisine_types.join(', ')}
                    </p>
                  )}

                  {truck.base_town && (
                    <p className="text-sm text-gray-600 mb-4">Based in {truck.base_town}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`FoodTruckDetail?id=${truck.id}`))}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`EditFoodTruck?id=${truck.id}`))}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteTruck(truck.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Truck Stops */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-600" />
                Upcoming Stops
              </h2>
              <Button
                onClick={() => navigate(createPageUrl("AddTruckStop"))}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Stop
              </Button>
            </div>

            <div className="space-y-4">
              {stops.length === 0 ? (
                <Card className="border-2 border-orange-100">
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No stops scheduled</h3>
                    <p className="text-gray-600 text-sm mb-4">Schedule your first truck stop</p>
                    <Button
                      onClick={() => navigate(createPageUrl("AddTruckStop"))}
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Stop
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                stops.map(stop => {
                  const startDate = new Date(stop.start_datetime);
                  const endDate = new Date(stop.end_datetime);
                  const isCurrentlyActive = new Date() >= startDate && new Date() <= endDate;

                  return (
                    <Card key={stop.id} className={`border-2 ${isCurrentlyActive ? 'border-green-300 bg-green-50' : 'border-orange-100'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getStopStatusColor(stop)}>
                              {getStopStatusLabel(stop)}
                            </Badge>
                            {isCurrentlyActive && (
                              <Badge className="bg-green-600 text-white text-xs">
                                ACTIVE
                              </Badge>
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-1 text-sm">
                          {getTruckName(stop.truck_id)}
                        </h3>
                        <h4 className="text-gray-700 mb-2 text-sm">{stop.location_name}</h4>

                        <div className="space-y-1 mb-3">
                          {stop.address && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {stop.address}
                            </p>
                          )}

                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(startDate, 'MMM d, h:mm a')} - {format(endDate, 'h:mm a')}
                          </p>
                        </div>

                        {stop.specials_today && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                            <p className="text-xs font-semibold text-yellow-900">⭐ {stop.specials_today}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(createPageUrl(`EditTruckStop?id=${stop.id}`))}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteStop(stop.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
