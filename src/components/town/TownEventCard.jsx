import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function TownEventCard({ event }) {
  const navigate = useNavigate();

  const getCategoryLabel = (cat) => {
    const labels = {
      community: "Community",
      music: "Music",
      sports: "Sports",
      arts: "Arts & Culture",
      food: "Food & Drink",
      business: "Business",
      education: "Education",
      charity: "Charity",
      holiday: "Holiday",
      family: "Family"
    };
    return labels[cat] || cat?.replace(/_/g, ' ');
  };

  const getCategoryColor = (cat) => {
    const colors = {
      community: "bg-blue-50 text-blue-700",
      music: "bg-purple-50 text-purple-700",
      sports: "bg-green-50 text-green-700",
      arts: "bg-pink-50 text-pink-700",
      food: "bg-orange-50 text-orange-700",
      business: "bg-gray-50 text-gray-700",
      education: "bg-indigo-50 text-indigo-700",
      charity: "bg-rose-50 text-rose-700",
      holiday: "bg-red-50 text-red-700",
      family: "bg-amber-50 text-amber-700"
    };
    return colors[cat] || "bg-gray-50 text-gray-700";
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card
      className="border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(createPageUrl(`EventDetail?id=${event.id}`))}
    >
      <CardContent className="p-4">
        {event.image_url && (
          <div className="h-32 -mx-4 -mt-4 mb-3 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          {event.category && (
            <Badge variant="secondary" className={`text-xs ${getCategoryColor(event.category)}`}>
              {getCategoryLabel(event.category)}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
        {event.event_date && (
          <p className="text-sm text-indigo-600 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {formatEventDate(event.event_date)}
          </p>
        )}
        {event.location && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {event.location}
          </p>
        )}
        {event.event_time && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {event.event_time}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
