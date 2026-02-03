import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Star } from "lucide-react";
import { createStoreUrl } from "@/components/utils/slugUtils";

export default function TownBusinessCard({ business }) {
  const navigate = useNavigate();

  const getCategoryLabel = (cat) => {
    const labels = {
      retail: "Retail",
      services: "Services",
      food_beverage: "Food & Beverage",
      health_beauty: "Health & Beauty",
      automotive: "Automotive",
      home_garden: "Home & Garden",
      professional: "Professional Services",
      entertainment: "Entertainment"
    };
    return labels[cat] || cat?.replace(/_/g, ' ');
  };

  const handleClick = () => {
    if (business.slug) {
      navigate(createStoreUrl(business.slug));
    }
  };

  return (
    <Card
      className="border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {business.logo_url && (
          <div className="h-32 -mx-4 -mt-4 mb-3 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={business.logo_url}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <Store className="w-4 h-4 text-teal-600" />
          {business.category && (
            <Badge variant="secondary" className="text-xs bg-teal-50 text-teal-700">
              {getCategoryLabel(business.category)}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{business.name}</h3>
        {business.tagline && (
          <p className="text-xs text-gray-600 line-clamp-1">{business.tagline}</p>
        )}
        {business.town && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {business.town}
          </p>
        )}
        {business.rating_avg && (
          <div className="flex items-center gap-1 text-sm mt-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{business.rating_avg.toFixed(1)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
