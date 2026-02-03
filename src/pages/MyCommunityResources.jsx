import React, { useState, useEffect } from "react";
import { CommunityResource, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Edit, MapPin, ArrowLeft, Eye } from "lucide-react";

export default function MyCommunityResources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
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

      const myResources = await CommunityResource.filter({ created_by: userData.id }, '-created_date');
      setResources(myResources);
    } catch (error) {
      console.error("Error loading resources:", error);
    }
    setLoading(false);
  };

  const categories = {
    food_pantry: "Food Pantry",
    food_bank: "Food Bank",
    soup_kitchen: "Soup Kitchen / Meal Service",
    shelter: "Shelter / Housing",
    clothing: "Clothing Assistance",
    utility_assistance: "Utility Assistance",
    medical: "Medical / Health Services",
    mental_health: "Mental Health Services",
    senior_services: "Senior Services",
    youth_services: "Youth Services",
    veterans: "Veterans Services",
    job_assistance: "Job Training / Employment",
    education: "Education / Tutoring",
    legal_aid: "Legal Aid",
    crisis: "Crisis Hotline / Support",
    other: "Other"
  };

  const getCategoryColor = (category) => {
    const colors = {
      food_pantry: "bg-green-100 text-green-800",
      food_bank: "bg-green-100 text-green-800",
      soup_kitchen: "bg-orange-100 text-orange-800",
      shelter: "bg-blue-100 text-blue-800",
      clothing: "bg-purple-100 text-purple-800",
      utility_assistance: "bg-yellow-100 text-yellow-800",
      medical: "bg-red-100 text-red-800",
      mental_health: "bg-pink-100 text-pink-800",
      senior_services: "bg-indigo-100 text-indigo-800",
      youth_services: "bg-cyan-100 text-cyan-800",
      veterans: "bg-slate-100 text-slate-800",
      job_assistance: "bg-teal-100 text-teal-800",
      education: "bg-amber-100 text-amber-800",
      legal_aid: "bg-gray-100 text-gray-800",
      crisis: "bg-rose-100 text-rose-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-rose-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("CommunityResources"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Resources
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-600" />
              My Community Resources
            </h1>
            <p className="text-gray-600 mt-2">Manage the community resources you've added</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("AddCommunityResource"))}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>

        {resources.length === 0 ? (
          <Card className="border-2 border-rose-100">
            <CardContent className="p-12 text-center">
              <Heart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No resources yet</h3>
              <p className="text-gray-600 mb-6">Help your community by adding local resources like food pantries, shelters, and assistance programs.</p>
              <Button
                onClick={() => navigate(createPageUrl("AddCommunityResource"))}
                className="bg-gradient-to-r from-rose-500 to-pink-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Resource
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map(resource => (
              <Card key={resource.id} className="border-2 border-rose-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(resource.category)}>
                        {categories[resource.category] || resource.category}
                      </Badge>
                      <Badge variant={resource.status === 'active' ? 'default' : 'secondary'}>
                        {resource.status}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.name}</h3>

                  {resource.address && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4" />
                      {resource.address}
                    </p>
                  )}

                  {resource.services_offered && resource.services_offered.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.services_offered.slice(0, 3).map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {resource.services_offered.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.services_offered.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`CommunityResourceDetail?id=${resource.id}`))}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`EditCommunityResource?id=${resource.id}`))}
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
