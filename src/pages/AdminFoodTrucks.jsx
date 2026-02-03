import React, { useState, useEffect } from "react";
import { FoodTruck, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Search, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function AdminFoodTrucks() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, approved, active, suspended
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Check if user is admin
      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("FoodTrucks"));
        return;
      }

      const allTrucks = await FoodTruck.list('-created_date');
      setTrucks(allTrucks);
    } catch (error) {
      console.error("Error loading food trucks:", error);
      navigate(createPageUrl("FoodTrucks"));
    }
    setLoading(false);
  };

  const updateTruckStatus = async (truckId, newStatus) => {
    const truck = trucks.find(t => t.id === truckId);
    const confirmMessage = newStatus === 'suspended'
      ? `Are you sure you want to suspend ${truck.name}? This will hide them from public view.`
      : `Are you sure you want to ${newStatus === 'approved' ? 'approve' : 'change status of'} ${truck.name}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await FoodTruck.update(truckId, { status: newStatus });
      await loadTrucks();
      alert(`${truck.name} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating truck status:", error);
      alert("Failed to update truck status");
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

  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = !searchTerm ||
      truck.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.base_town?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || truck.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = trucks.filter(t => t.status === 'pending').length;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Truck className="w-12 h-12 text-orange-600 animate-pulse" />
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
                <Truck className="w-8 h-8 text-orange-600" />
                Food Truck Moderation
              </h1>
              <p className="text-gray-600 mt-2">Review and approve food truck applications</p>
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
                  placeholder="Search trucks..."
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

        {/* Trucks List */}
        <div className="space-y-4">
          {filteredTrucks.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Truck className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No trucks found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredTrucks.map(truck => (
              <Card key={truck.id} className={`border-2 ${truck.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-orange-100'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Truck Logo */}
                    {truck.logo_url && (
                      <img
                        src={truck.logo_url}
                        alt={truck.name}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-orange-200"
                      />
                    )}

                    {/* Truck Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className={getStatusColor(truck.status)}>
                            {getStatusLabel(truck.status)}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{truck.name}</h3>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {truck.base_town && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Base Town</p>
                            <p className="text-gray-900">{truck.base_town}</p>
                          </div>
                        )}

                        {truck.cuisine_types && truck.cuisine_types.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Cuisine Types</p>
                            <p className="text-gray-900">{truck.cuisine_types.join(', ')}</p>
                          </div>
                        )}

                        {truck.phone && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Phone</p>
                            <p className="text-gray-900">{truck.phone}</p>
                          </div>
                        )}

                        {truck.payment_methods && truck.payment_methods.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Payment Methods</p>
                            <p className="text-gray-900">{truck.payment_methods.join(', ')}</p>
                          </div>
                        )}
                      </div>

                      {truck.dietary_flags && truck.dietary_flags.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Dietary Options</p>
                          <div className="flex flex-wrap gap-1">
                            {truck.dietary_flags.map(flag => (
                              <Badge key={flag} variant="outline" className="text-xs">
                                {formatLabel(flag)}
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
                        onClick={() => navigate(createPageUrl(`FoodTruckDetail?id=${truck.id}`))}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>

                      {truck.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateTruckStatus(truck.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateTruckStatus(truck.id, 'suspended')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {truck.status === 'approved' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => updateTruckStatus(truck.id, 'active')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateTruckStatus(truck.id, 'suspended')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Suspend
                          </Button>
                        </>
                      )}

                      {truck.status === 'active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateTruckStatus(truck.id, 'suspended')}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      )}

                      {truck.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateTruckStatus(truck.id, 'active')}
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
