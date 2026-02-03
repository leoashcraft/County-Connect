import React, { useState, useEffect } from "react";
import { Church, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Church as ChurchIcon, Search, Eye, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";

export default function AdminChurches() {
  const navigate = useNavigate();
  const [churches, setChurches] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChurches();
  }, []);

  const loadChurches = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("Churches"));
        return;
      }

      const allChurches = await Church.list('-created_date');
      setChurches(allChurches);
    } catch (error) {
      console.error("Error loading churches:", error);
      navigate(createPageUrl("Churches"));
    }
    setLoading(false);
  };

  const updateChurchStatus = async (churchId, newStatus) => {
    const church = churches.find(c => c.id === churchId);
    const confirmMessage = newStatus === 'suspended'
      ? `Are you sure you want to suspend ${church.name}? This will hide it from public view.`
      : `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'change status of'} ${church.name}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await Church.update(churchId, { status: newStatus });
      await loadChurches();
      alert(`${church.name} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating church status:", error);
      alert("Failed to update church status");
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

  const filteredChurches = churches.filter(church => {
    const matchesSearch = !searchTerm ||
      church.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.denomination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.town?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || church.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = churches.filter(c => c.status === 'pending').length;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <ChurchIcon className="w-12 h-12 text-indigo-600 animate-pulse" />
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
                <ChurchIcon className="w-8 h-8 text-indigo-600" />
                Church Moderation
              </h1>
              <p className="text-gray-600 mt-2">Review and manage church listings</p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="border-2 border-indigo-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search churches..."
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
            </div>
          </CardContent>
        </Card>

        {/* Churches List */}
        <div className="space-y-4">
          {filteredChurches.length === 0 ? (
            <Card className="border-2 border-indigo-100">
              <CardContent className="p-12 text-center">
                <ChurchIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No churches found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredChurches.map(church => (
              <Card key={church.id} className={`border-2 ${church.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-indigo-100'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Church Image */}
                    {church.image_url && (
                      <img
                        src={church.image_url}
                        alt={church.name}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-indigo-200"
                      />
                    )}

                    {/* Church Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={getStatusColor(church.status)}>
                          {church.status || 'pending'}
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{church.name}</h3>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        {church.denomination && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Denomination</p>
                            <p className="text-gray-900">{church.denomination}</p>
                          </div>
                        )}

                        {church.town && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Town</p>
                            <p className="text-gray-900">{church.town}</p>
                          </div>
                        )}

                        {church.phone && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Phone</p>
                            <p className="text-gray-900">{church.phone}</p>
                          </div>
                        )}

                        {church.pastor_name && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Pastor</p>
                            <p className="text-gray-900">{church.pastor_name}</p>
                          </div>
                        )}
                      </div>

                      {church.service_times && church.service_times.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Service Times</p>
                          <div className="flex flex-wrap gap-1">
                            {church.service_times.map((time, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {time.day}: {time.time}
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
                        onClick={() => navigate(createPageUrl(`ChurchDetail?id=${church.id}`))}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>

                      {church.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateChurchStatus(church.id, 'active')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateChurchStatus(church.id, 'suspended')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {church.status === 'active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateChurchStatus(church.id, 'suspended')}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      )}

                      {church.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateChurchStatus(church.id, 'active')}
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
