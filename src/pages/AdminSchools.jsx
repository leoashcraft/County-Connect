import React, { useState, useEffect } from "react";
import { School, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap, Search, Eye, CheckCircle, XCircle, ArrowLeft, Pause, MapPin
} from "lucide-react";

export default function AdminSchools() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("Dashboard"));
        return;
      }

      const allSchools = await School.list('name');
      setSchools(allSchools);
    } catch (error) {
      console.error("Error loading schools:", error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (school, newStatus) => {
    try {
      await School.update(school.id, { status: newStatus });
      setSchools(schools.map(s =>
        s.id === school.id ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      console.error("Error updating school:", error);
      alert("Failed to update school status");
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      daycare: "bg-rose-100 text-rose-800",
      pre_k: "bg-pink-100 text-pink-800",
      elementary: "bg-green-100 text-green-800",
      middle: "bg-blue-100 text-blue-800",
      high: "bg-purple-100 text-purple-800",
      college: "bg-orange-100 text-orange-800",
      charter: "bg-teal-100 text-teal-800",
      private: "bg-indigo-100 text-indigo-800",
      alternative: "bg-yellow-100 text-yellow-800",
      vocational: "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const schoolTypes = [
    { value: "all", label: "All Types" },
    { value: "daycare", label: "Daycare / Childcare" },
    { value: "pre_k", label: "Pre-K / Preschool" },
    { value: "elementary", label: "Elementary" },
    { value: "middle", label: "Middle School" },
    { value: "high", label: "High School" },
    { value: "college", label: "College" },
    { value: "charter", label: "Charter" },
    { value: "private", label: "Private" },
    { value: "alternative", label: "Alternative" },
    { value: "vocational", label: "Vocational" }
  ];

  const filteredSchools = schools.filter(school => {
    const matchesSearch = !searchTerm ||
      school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.town?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || school.status === statusFilter;
    const matchesType = typeFilter === "all" ||
      school.school_type === typeFilter ||
      (school.school_types && school.school_types.includes(typeFilter));

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <GraduationCap className="w-12 h-12 text-blue-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("AdminDashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            Manage Schools
          </h1>
          <p className="text-gray-600 mt-2">Review and moderate school listings</p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-blue-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search schools, districts..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schoolTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-blue-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{schools.length}</p>
              <p className="text-sm text-gray-600">Total Schools</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {schools.filter(s => s.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {schools.filter(s => s.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">
                {schools.filter(s => s.status === 'suspended').length}
              </p>
              <p className="text-sm text-gray-600">Suspended</p>
            </CardContent>
          </Card>
        </div>

        {/* Schools List */}
        <div className="space-y-4">
          {filteredSchools.length === 0 ? (
            <Card className="border-2 border-blue-100">
              <CardContent className="p-12 text-center">
                <GraduationCap className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No schools found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredSchools.map(school => (
              <Card key={school.id} className="border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {(school.school_types || [school.school_type]).filter(Boolean).map(type => (
                          <Badge key={type} className={getTypeColor(type)}>
                            {type?.replace('_', ' ')}
                          </Badge>
                        ))}
                        <Badge className={getStatusColor(school.status)}>
                          {school.status}
                        </Badge>
                        {school.owner_id && (
                          <Badge variant="outline" className="text-blue-600">
                            Claimed
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{school.name}</h3>
                      {school.district && (
                        <p className="text-gray-600">{school.district}</p>
                      )}
                      {school.town && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {school.town}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`SchoolDetail?id=${school.id}`))}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      {school.status !== 'active' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(school, 'active')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}

                      {school.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-yellow-600"
                          onClick={() => handleStatusChange(school, 'suspended')}
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {school.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                          onClick={() => handleStatusChange(school, 'active')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
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
