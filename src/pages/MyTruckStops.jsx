import React, { useState, useEffect } from "react";
import { TruckStop, FoodTruck, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Edit, Trash2, Plus, Calendar, ArrowLeft } from "lucide-react";
import { format, isPast, isFuture } from "date-fns";

export default function MyTruckStops() {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // upcoming, past, all

  useEffect(() => {
    loadMyStops();
  }, []);

  const loadMyStops = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Get all trucks owned by this user
      const allTrucks = await FoodTruck.list('-created_date');
      const myTrucks = allTrucks.filter(truck => truck.created_by === userData.id);
      setTrucks(myTrucks);

      // Get all stops for these trucks
      const allStops = await TruckStop.list('-start_datetime');
      const myTruckIds = myTrucks.map(t => t.id);
      const myStops = allStops.filter(stop => myTruckIds.includes(stop.truck_id));
      setStops(myStops);
    } catch (error) {
      console.error("Error loading truck stops:", error);
      navigate(createPageUrl("MyFoodTrucks"));
    }
    setLoading(false);
  };

  const deleteStop = async (stopId) => {
    if (!confirm("Are you sure you want to delete this truck stop?")) {
      return;
    }

    try {
      await TruckStop.delete(stopId);
      await loadMyStops();
    } catch (error) {
      console.error("Error deleting stop:", error);
      alert("Failed to delete truck stop");
    }
  };

  const getTruckName = (truckId) => {
    const truck = trucks.find(t => t.id === truckId);
    return truck ? truck.name : "Unknown Truck";
  };

  const getStatusColor = (stop) => {
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

  const getStatusLabel = (stop) => {
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

  const filteredStops = stops.filter(stop => {
    const endDate = new Date(stop.end_datetime);
    const now = new Date();

    if (filter === "upcoming") {
      return endDate >= now;
    } else if (filter === "past") {
      return endDate < now;
    }
    return true; // all
  });

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
                <Calendar className="w-8 h-8 text-orange-600" />
                My Truck Stops
              </h1>
              <p className="text-gray-600 mt-2">Manage your scheduled stops</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl("AddTruckStop"))}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Stop
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                onClick={() => setFilter("upcoming")}
                className={filter === "upcoming" ? "bg-gradient-to-r from-orange-500 to-amber-500" : ""}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === "past" ? "default" : "outline"}
                onClick={() => setFilter("past")}
                className={filter === "past" ? "bg-gradient-to-r from-orange-500 to-amber-500" : ""}
              >
                Past
              </Button>
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-gradient-to-r from-orange-500 to-amber-500" : ""}
              >
                All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stops List */}
        <div className="space-y-4">
          {filteredStops.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Calendar className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {filter === "upcoming" ? "No upcoming stops" : filter === "past" ? "No past stops" : "No stops yet"}
                </h3>
                <p className="text-gray-600 mb-6">Schedule your first truck stop</p>
                <Button
                  onClick={() => navigate(createPageUrl("AddTruckStop"))}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Stop
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredStops.map(stop => {
              const startDate = new Date(stop.start_datetime);
              const endDate = new Date(stop.end_datetime);
              const isCurrentlyActive = new Date() >= startDate && new Date() <= endDate;

              return (
                <Card key={stop.id} className={`border-2 ${isCurrentlyActive ? 'border-green-300 bg-green-50' : 'border-orange-100'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getStatusColor(stop)}>
                            {getStatusLabel(stop)}
                          </Badge>
                          {isCurrentlyActive && (
                            <Badge className="bg-green-600 text-white">
                              ACTIVE NOW
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {getTruckName(stop.truck_id)}
                        </h3>
                        <h4 className="text-lg text-gray-700 mb-3">{stop.location_name}</h4>

                        <div className="space-y-2 mb-4">
                          {stop.address && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {stop.address}
                            </p>
                          )}

                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {format(startDate, 'EEEE, MMMM d, yyyy')}
                          </p>

                          <p className="text-sm text-gray-600 ml-6">
                            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                          </p>
                        </div>

                        {stop.specials_today && (
                          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-semibold text-yellow-900">⭐ {stop.specials_today}</p>
                          </div>
                        )}

                        {stop.wait_minutes > 0 && (
                          <p className="text-sm text-orange-600 font-semibold">
                            Current wait: {stop.wait_minutes} minutes
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(createPageUrl(`TruckStopDetail?id=${stop.id}`))}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(createPageUrl(`EditTruckStop?id=${stop.id}`))}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteStop(stop.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
