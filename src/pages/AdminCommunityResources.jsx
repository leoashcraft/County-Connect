import React, { useState, useEffect } from "react";
import { CommunityResource, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Eye, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";

const CATEGORY_LABELS = {
  food_pantry: "Food Pantry",
  shelter: "Shelter",
  medical: "Medical Assistance",
  utility: "Utility Assistance",
  clothing: "Clothing",
  crisis: "Crisis Services",
  senior: "Senior Services",
  disability: "Disability Services",
  veteran: "Veteran Services",
  other: "Other"
};

export default function AdminCommunityResources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("CommunityResources"));
        return;
      }

      const allResources = await CommunityResource.list('-created_date');
      setResources(allResources);
    } catch (error) {
      console.error("Error loading resources:", error);
      navigate(createPageUrl("CommunityResources"));
    }
    setLoading(false);
  };

  const updateResourceStatus = async (resourceId, newStatus) => {
    const resource = resources.find(r => r.id === resourceId);
    const confirmMessage = newStatus === 'suspended'
      ? `Are you sure you want to suspend ${resource.name}? This will hide it from public view.`
      : `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'change status of'} ${resource.name}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await CommunityResource.update(resourceId, { status: newStatus });
      await loadResources();
      alert(`${resource.name} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating resource status:", error);
      alert("Failed to update resource status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchTerm ||
      resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.town?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || resource.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingCount = resources.filter(r => r.status === 'pending').length;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-rose-600 animate-pulse" />
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
                <Heart className="w-8 h-8 text-rose-600" />
                Community Resources Moderation
              </h1>
              <p className="text-gray-600 mt-2">Review and manage community resource listings</p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="border-2 border-rose-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search resources..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.length === 0 ? (
            <Card className="border-2 border-rose-100">
              <CardContent className="p-12 text-center">
                <Heart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No resources found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredResources.map(resource => (
              <Card key={resource.id} className={`border-2 ${resource.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-rose-100'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Resource Image */}
                    {resource.image_url && (
                      <img
                        src={resource.image_url}
                        alt={resource.name}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-rose-200"
                      />
                    )}

                    {/* Resource Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-3">
                        <Badge className={getStatusColor(resource.status)}>
                          {resource.status || 'pending'}
                        </Badge>
                        {resource.category && (
                          <Badge variant="outline">
                            {CATEGORY_LABELS[resource.category] || resource.category}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{resource.name}</h3>

                      {resource.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                      )}

                      <div className="grid md:grid-cols-3 gap-4">
                        {resource.town && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Town</p>
                            <p className="text-gray-900">{resource.town}</p>
                          </div>
                        )}

                        {resource.phone && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Phone</p>
                            <p className="text-gray-900">{resource.phone}</p>
                          </div>
                        )}

                        {resource.email && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Email</p>
                            <p className="text-gray-900">{resource.email}</p>
                          </div>
                        )}
                      </div>

                      {resource.eligibility_requirements && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-600">Eligibility</p>
                          <p className="text-gray-900 text-sm">{resource.eligibility_requirements}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${resource.id}`))}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>

                      {resource.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateResourceStatus(resource.id, 'active')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateResourceStatus(resource.id, 'suspended')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {resource.status === 'active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateResourceStatus(resource.id, 'suspended')}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      )}

                      {resource.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateResourceStatus(resource.id, 'active')}
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
