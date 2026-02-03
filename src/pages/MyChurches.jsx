import React, { useState, useEffect } from "react";
import { Church, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Church as ChurchIcon, Plus, Edit, MapPin, ArrowLeft, Eye, Clock } from "lucide-react";

export default function MyChurches() {
  const navigate = useNavigate();
  const [churches, setChurches] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      if (!userData) {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      setUser(userData);

      const myChurches = await Church.filter({ created_by: userData.id }, 'name');
      setChurches(myChurches);
    } catch (error) {
      console.error("Error loading churches:", error);
    }
    setLoading(false);
  };

  const denominations = {
    baptist: "Baptist",
    methodist: "Methodist",
    catholic: "Catholic",
    lutheran: "Lutheran",
    presbyterian: "Presbyterian",
    pentecostal: "Pentecostal",
    church_of_christ: "Church of Christ",
    assembly_of_god: "Assembly of God",
    episcopal: "Episcopal",
    non_denominational: "Non-Denominational",
    other: "Other"
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <ChurchIcon className="w-12 h-12 text-indigo-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Churches"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Churches
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ChurchIcon className="w-8 h-8 text-indigo-600" />
              My Churches
            </h1>
            <p className="text-gray-600 mt-2">Manage the churches you've added to the directory</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("AddChurch"))}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Church
          </Button>
        </div>

        {churches.length === 0 ? (
          <Card className="border-2 border-indigo-100">
            <CardContent className="p-12 text-center">
              <ChurchIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No churches added yet</h3>
              <p className="text-gray-600 mb-6">Help your community find local churches by adding them to our directory.</p>
              <Button
                onClick={() => navigate(createPageUrl("AddChurch"))}
                className="bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Church
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {churches.map(church => (
              <Card key={church.id} className="border-2 border-indigo-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-indigo-100 text-indigo-800">
                        {denominations[church.denomination] || church.denomination}
                      </Badge>
                      <Badge variant={church.status === 'active' ? 'default' : 'secondary'}>
                        {church.status}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{church.name}</h3>

                  {church.pastor_name && (
                    <p className="text-sm text-gray-600 mb-2">Pastor: {church.pastor_name}</p>
                  )}

                  {church.address && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4" />
                      {church.address}
                    </p>
                  )}

                  {church.service_times && church.service_times.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <Clock className="w-4 h-4" />
                      {church.service_times.slice(0, 2).map((s, i) => (
                        <span key={i}>
                          {i > 0 && ', '}
                          {s.day}: {formatTime(s.time)}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`ChurchDetail?id=${church.id}`))}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`EditChurch?id=${church.id}`))}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
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
