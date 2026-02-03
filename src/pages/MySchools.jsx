import React, { useState, useEffect } from "react";
import { School, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";

export default function MySchools() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Get schools created by or owned by user
      const allSchools = await School.list();
      const mySchools = allSchools.filter(
        s => s.created_by === userData.id || s.owner_id === userData.id
      );
      setSchools(mySchools);
    } catch (error) {
      console.error("Error loading schools:", error);
      navigate(createPageUrl("Schools"));
    }
    setLoading(false);
  };

  const handleDelete = async (school) => {
    if (!confirm(`Are you sure you want to delete "${school.name}"?`)) {
      return;
    }

    try {
      await School.delete(school.id);
      setSchools(schools.filter(s => s.id !== school.id));
    } catch (error) {
      console.error("Error deleting school:", error);
      alert("Failed to delete school. Please try again.");
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      elementary: "bg-green-100 text-green-800",
      middle: "bg-blue-100 text-blue-800",
      high: "bg-purple-100 text-purple-800",
      college: "bg-orange-100 text-orange-800",
      pre_k: "bg-pink-100 text-pink-800",
      charter: "bg-teal-100 text-teal-800",
      private: "bg-indigo-100 text-indigo-800"
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

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <GraduationCap className="w-12 h-12 text-blue-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Schools"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schools
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              My Schools
            </h1>
            <p className="text-gray-600 mt-2">Manage schools you've added or claimed</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("AddSchool"))}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add School
          </Button>
        </div>

        {schools.length === 0 ? (
          <Card className="border-2 border-blue-100">
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No schools yet</h3>
              <p className="text-gray-600 mb-6">
                Add a school to get started, or claim an existing school listing.
              </p>
              <Button
                onClick={() => navigate(createPageUrl("AddSchool"))}
                className="bg-gradient-to-r from-blue-500 to-cyan-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First School
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {schools.map(school => (
              <Card key={school.id} className="border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(school.school_type)}>
                          {school.school_type?.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(school.status)}>
                          {school.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{school.name}</h3>
                      {school.district && (
                        <p className="text-gray-600">{school.district}</p>
                      )}
                      {school.address && (
                        <p className="text-sm text-gray-500 mt-1">{school.address}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`SchoolDetail?id=${school.id}`))}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`EditSchool?id=${school.id}`))}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(school)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
