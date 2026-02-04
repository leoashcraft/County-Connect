import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { Star, Sparkles } from "lucide-react";

/**
 * FeaturedSpot Component
 * 
 * Displays either a featured business or an empty "Claim this spot!" placeholder
 * 
 * @param {Object} props
 * @param {Object} props.business - The featured business data (optional)
 * @param {string} props.spotType - Type of spot (restaurant, foodtruck, school, etc.)
 * @param {number} props.spotNumber - Which spot number (1, 2, 3)
 * @param {Function} props.renderBusiness - Custom render function for the business card
 * @param {string} props.emptyIcon - Lucide icon component for empty state
 */
export default function FeaturedSpot({ 
  business, 
  spotType = "business",
  spotNumber = 1,
  renderBusiness,
  emptyIcon: EmptyIcon = Star,
  className = ""
}) {
  const navigate = useNavigate();

  // If we have a business, render it with a "Featured" badge
  if (business && renderBusiness) {
    return (
      <div className={`relative ${className}`}>
        {/* Featured Badge */}
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        </div>
        {/* Render the business with a golden border */}
        <div className="ring-2 ring-amber-400 rounded-lg overflow-hidden">
          {renderBusiness(business)}
        </div>
      </div>
    );
  }

  // Empty state - "Claim this spot!"
  return (
    <Card 
      className={`border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all cursor-pointer group bg-gradient-to-br from-gray-50 to-white ${className}`}
      onClick={() => navigate(createPageUrl(`ClaimListing?type=featured_${spotType}&spot=${spotNumber}`))}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center mb-4 transition-colors">
          <Sparkles className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </div>
        <h3 className="font-bold text-gray-600 group-hover:text-orange-600 mb-2 transition-colors">
          Claim This Spot!
        </h3>
        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
          Get featured placement for your business
        </p>
        <div className="mt-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * FeaturedSpotSection Component
 * 
 * A section containing multiple featured spots (typically 3)
 */
export function FeaturedSpotSection({
  title = "Featured",
  spotType = "business",
  featuredItems = [],
  renderItem,
  icon: SectionIcon = Star,
  maxSpots = 3,
  className = ""
}) {
  const spots = [];
  
  for (let i = 0; i < maxSpots; i++) {
    const business = featuredItems[i] || null;
    spots.push(
      <FeaturedSpot
        key={i}
        business={business}
        spotType={spotType}
        spotNumber={i + 1}
        renderBusiness={renderItem}
      />
    );
  }

  return (
    <section className={`mb-8 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <SectionIcon className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent ml-2" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {spots}
      </div>
    </section>
  );
}
