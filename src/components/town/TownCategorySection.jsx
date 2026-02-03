import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function TownCategorySection({
  title,
  icon: Icon,
  iconColor = "text-gray-600",
  items,
  renderCard,
  onViewAll,
  maxItems = 6,
  gridCols = "md:grid-cols-3"
}) {
  // Don't render section if no items
  if (!items || items.length === 0) {
    return null;
  }

  const displayItems = items.slice(0, maxItems);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
        </h2>
        {onViewAll && items.length > maxItems && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="text-sm">
            View All ({items.length}) <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
      <div className={`grid ${gridCols} gap-4`}>
        {displayItems.map(renderCard)}
      </div>
      {onViewAll && items.length > maxItems && (
        <div className="mt-4 text-center md:hidden">
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All {items.length} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </section>
  );
}
