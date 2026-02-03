import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin } from "lucide-react";

export default function TownSchoolCard({ school }) {
  const navigate = useNavigate();

  const getTypeLabel = (type) => {
    const labels = {
      daycare: "Daycare",
      pre_k: "Pre-K",
      elementary: "Elementary",
      middle: "Middle School",
      high: "High School",
      college: "College",
      charter: "Charter",
      private: "Private",
      alternative: "Alternative",
      vocational: "Vocational"
    };
    return labels[type] || type?.replace(/_/g, ' ');
  };

  const getTypeColor = (type) => {
    const colors = {
      daycare: "bg-rose-50 text-rose-700",
      pre_k: "bg-pink-50 text-pink-700",
      elementary: "bg-green-50 text-green-700",
      middle: "bg-blue-50 text-blue-700",
      high: "bg-purple-50 text-purple-700",
      college: "bg-orange-50 text-orange-700",
      charter: "bg-teal-50 text-teal-700",
      private: "bg-indigo-50 text-indigo-700",
      alternative: "bg-yellow-50 text-yellow-700",
      vocational: "bg-red-50 text-red-700"
    };
    return colors[type] || "bg-gray-50 text-gray-700";
  };

  const schoolTypes = school.school_types || (school.school_type ? [school.school_type] : []);

  return (
    <Card
      className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(createPageUrl(`SchoolDetail?id=${school.id}`))}
    >
      <CardContent className="p-4">
        {school.image_url && (
          <div className="h-32 -mx-4 -mt-4 mb-3 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={school.image_url}
              alt={school.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-1 mb-2">
          {schoolTypes.slice(0, 2).map(type => (
            <Badge key={type} variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
              {getTypeLabel(type)}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{school.name}</h3>
        {school.district && (
          <p className="text-xs text-gray-600 line-clamp-1">{school.district}</p>
        )}
        {school.address && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {school.address.split(',')[0]}
          </p>
        )}
        {school.enrollment && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Users className="w-3 h-3" />
            <span>{school.enrollment.toLocaleString()} students</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
