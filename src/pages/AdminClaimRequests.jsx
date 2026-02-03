import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield, Search, Eye, CheckCircle, XCircle, ArrowLeft, Clock,
  Church, Heart, Trophy, Utensils, Building2, Phone, Mail
} from "lucide-react";

// Helper to fetch claim requests
const fetchClaimRequests = async () => {
  const response = await fetch('/api/entities/ClaimRequest', {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch claim requests');
  return response.json();
};

// Helper to update claim request
const updateClaimRequest = async (id, data) => {
  const response = await fetch(`/api/entities/ClaimRequest/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update claim request');
  return response.json();
};

// Helper to update entity owner
const updateEntityOwner = async (entityType, entityId, ownerId) => {
  const response = await fetch(`/api/entities/${entityType}/${entityId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ owner_id: ownerId })
  });
  if (!response.ok) throw new Error('Failed to update entity owner');
  return response.json();
};

const ENTITY_ICONS = {
  Church: Church,
  CommunityResource: Heart,
  SportsTeam: Trophy,
  Restaurant: Utensils
};

const ENTITY_COLORS = {
  Church: "indigo",
  CommunityResource: "rose",
  SportsTeam: "emerald",
  Restaurant: "orange"
};

export default function AdminClaimRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("Dashboard"));
        return;
      }

      const allRequests = await fetchClaimRequests();
      // Sort by created_date descending
      allRequests.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setRequests(allRequests);
    } catch (error) {
      console.error("Error loading claim requests:", error);
    }
    setLoading(false);
  };

  const handleApprove = async (request) => {
    if (!confirm(`Approve claim by ${request.user_name} for "${request.entity_name}"? This will give them ownership of the listing.`)) {
      return;
    }

    try {
      // Update the entity to set owner_id
      await updateEntityOwner(request.entity_type, request.entity_id, request.user_id);

      // Update the claim request status
      await updateClaimRequest(request.id, {
        status: "approved",
        resolved_date: new Date().toISOString(),
        resolved_by: user.id
      });

      alert(`Claim approved! ${request.user_name} now owns "${request.entity_name}"`);
      await loadRequests();
    } catch (error) {
      console.error("Error approving claim:", error);
      alert("Failed to approve claim. Please try again.");
    }
  };

  const handleReject = async (request) => {
    const reason = prompt("Please provide a reason for rejection (optional):");

    if (!confirm(`Reject claim by ${request.user_name} for "${request.entity_name}"?`)) {
      return;
    }

    try {
      await updateClaimRequest(request.id, {
        status: "rejected",
        rejection_reason: reason || "",
        resolved_date: new Date().toISOString(),
        resolved_by: user.id
      });

      alert("Claim request rejected.");
      await loadRequests();
    } catch (error) {
      console.error("Error rejecting claim:", error);
      alert("Failed to reject claim. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDetailPageUrl = (entityType, entityId) => {
    const pageMap = {
      Church: "ChurchDetail",
      CommunityResource: "CommunityResourceDetail",
      SportsTeam: "SportsTeamDetail",
      Restaurant: "RestaurantDetail"
    };
    return createPageUrl(`${pageMap[entityType] || entityType + "Detail"}?id=${entityId}`);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm ||
      request.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Shield className="w-12 h-12 text-blue-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Page Claim Requests
              </h1>
              <p className="text-gray-600 mt-2">Review and approve ownership claims for listings</p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="border-2 border-blue-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by listing or user..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="border-2 border-blue-100">
              <CardContent className="p-12 text-center">
                <Shield className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No claim requests found</h3>
                <p className="text-gray-600">
                  {statusFilter === "pending" ? "No pending claims to review!" : "Try adjusting your filters"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map(request => {
              const EntityIcon = ENTITY_ICONS[request.entity_type] || Building2;
              const entityColor = ENTITY_COLORS[request.entity_type] || "gray";

              return (
                <Card key={request.id} className={`border-2 ${request.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-blue-100'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Entity Icon */}
                      <div className={`p-4 rounded-lg bg-${entityColor}-100`}>
                        <EntityIcon className={`w-8 h-8 text-${entityColor}-600`} />
                      </div>

                      {/* Request Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          <Badge variant="outline">
                            {request.entity_type}
                          </Badge>
                          {request.status === 'pending' && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(request.created_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {request.entity_name}
                        </h3>

                        <div className="bg-white rounded-lg p-4 border mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Claim requested by:</p>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Name:</span>{" "}
                              <span className="font-medium">{request.user_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a href={`mailto:${request.user_email}`} className="text-blue-600 hover:underline">
                                {request.user_email}
                              </a>
                            </div>
                            <div>
                              <span className="text-gray-500">Role:</span>{" "}
                              <span className="font-medium">{request.your_role}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a href={`tel:${request.contact_phone}`} className="text-blue-600 hover:underline">
                                {request.contact_phone}
                              </a>
                            </div>
                          </div>

                          {request.verification_info && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm font-semibold text-gray-700 mb-1">Verification Info:</p>
                              <p className="text-sm text-gray-600">{request.verification_info}</p>
                            </div>
                          )}
                        </div>

                        {request.status === 'rejected' && request.rejection_reason && (
                          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{request.rejection_reason}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(getDetailPageUrl(request.entity_type, request.entity_id))}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Listing
                        </Button>

                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(request)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
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
