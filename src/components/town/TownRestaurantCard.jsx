import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";

export default function TownRestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getCuisineLabel = (type) => {
    const labels = {
      american: "American",
      mexican: "Mexican",
      italian: "Italian",
      chinese: "Chinese",
      bbq: "BBQ",
      seafood: "Seafood",
      pizza: "Pizza",
      fast_food: "Fast Food",
      cafe: "Cafe",
      diner: "Diner",
      steakhouse: "Steakhouse",
      asian: "Asian",
      mediterranean: "Mediterranean",
      tex_mex: "Tex-Mex",
      soul_food: "Soul Food",
      bakery: "Bakery"
    };
    return labels[type] || toTitleCase(type);
  };

  return (
    <Card
      className="border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(createPageUrl(`RestaurantDetail?id=${restaurant.id}`))}
    >
      <CardContent className="p-4">
        {restaurant.image_url && (
          <div className="h-32 -mx-4 -mt-4 mb-3 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-1 mb-2">
          {(restaurant.cuisine_types || []).slice(0, 2).map(type => (
            <Badge key={type} variant="secondary" className="text-xs bg-orange-50 text-orange-700">
              {getCuisineLabel(type)}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{restaurant.name}</h3>
        {restaurant.address && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {restaurant.address.split(',')[0]}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {restaurant.rating_avg && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{restaurant.rating_avg.toFixed(1)}</span>
            </div>
          )}
          {restaurant.price_range && (
            <span className="text-xs text-gray-500">
              {"$".repeat(restaurant.price_range)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
