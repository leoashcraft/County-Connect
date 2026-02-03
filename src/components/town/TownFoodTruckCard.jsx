import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Star } from "lucide-react";

export default function TownFoodTruckCard({ foodTruck }) {
  const navigate = useNavigate();

  const getCuisineLabel = (type) => {
    const labels = {
      american: "American",
      mexican: "Mexican",
      bbq: "BBQ",
      tacos: "Tacos",
      burgers: "Burgers",
      seafood: "Seafood",
      asian: "Asian",
      desserts: "Desserts",
      coffee: "Coffee"
    };
    return labels[type] || type?.replace(/_/g, ' ');
  };

  return (
    <Card
      className="border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(createPageUrl(`FoodTruckDetail?id=${foodTruck.id}`))}
    >
      <CardContent className="p-4">
        {foodTruck.image_url && (
          <div className="h-32 -mx-4 -mt-4 mb-3 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={foodTruck.image_url}
              alt={foodTruck.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-4 h-4 text-amber-600" />
          {foodTruck.cuisine_type && (
            <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700">
              {getCuisineLabel(foodTruck.cuisine_type)}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{foodTruck.name}</h3>
        {foodTruck.base_town && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            Based in {foodTruck.base_town}
          </p>
        )}
        {foodTruck.rating_avg && (
          <div className="flex items-center gap-1 text-sm mt-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{foodTruck.rating_avg.toFixed(1)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
