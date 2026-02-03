import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

export default function TownChurchCard({ church }) {
  const navigate = useNavigate();

  const getDenominationLabel = (denom) => {
    const labels = {
      baptist: "Baptist",
      methodist: "Methodist",
      catholic: "Catholic",
      lutheran: "Lutheran",
      presbyterian: "Presbyterian",
      episcopal: "Episcopal",
      pentecostal: "Pentecostal",
      church_of_christ: "Church of Christ",
      assembly_of_god: "Assembly of God",
      non_denominational: "Non-Denominational",
      other: "Other"
    };
    return labels[denom] || denom?.replace(/_/g, ' ');
  };

  const getDenominationColor = (denom) => {
    const colors = {
      baptist: "bg-blue-50 text-blue-700",
      methodist: "bg-green-50 text-green-700",
      catholic: "bg-purple-50 text-purple-700",
      lutheran: "bg-amber-50 text-amber-700",
      presbyterian: "bg-teal-50 text-teal-700",
      episcopal: "bg-rose-50 text-rose-700",
      pentecostal: "bg-orange-50 text-orange-700",
      church_of_christ: "bg-indigo-50 text-indigo-700",
      assembly_of_god: "bg-red-50 text-red-700",
      non_denominational: "bg-gray-50 text-gray-700"
    };
    return colors[denom] || "bg-gray-50 text-gray-700";
  };

  return (
    <Card
      className="border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(createPageUrl(`ChurchDetail?id=${church.id}`))}
    >
      <CardContent className="p-4">
        {church.image_url && (
          <div className="h-32 -mx-4 -mt-4 mb-3 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={church.image_url}
              alt={church.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {church.denomination && (
          <div className="mb-2">
            <Badge variant="secondary" className={`text-xs ${getDenominationColor(church.denomination)}`}>
              {getDenominationLabel(church.denomination)}
            </Badge>
          </div>
        )}
        <h3 className="font-semibold text-gray-900 line-clamp-1">{church.name}</h3>
        {church.address && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {church.address.split(',')[0]}
          </p>
        )}
        {church.sunday_service_time && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Clock className="w-3 h-3" />
            <span>Sunday {church.sunday_service_time}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
