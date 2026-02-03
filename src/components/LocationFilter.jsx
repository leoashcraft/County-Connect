import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Filter } from "lucide-react";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import TownFilterModal from "@/components/TownFilterModal";

/**
 * Global location filter component
 * Uses global state so filter selection persists across all pages
 *
 * @param {Object} props
 * @param {Object} props.userTown - User's preferred town object with id and name
 * @param {Array} props.towns - All available towns for the modal
 * @param {string} props.itemName - Name of items being filtered (e.g., "events", "restaurants")
 */
export default function LocationFilter({
  userTown,
  towns = [],
  itemName = "items"
}) {
  const { state, setMode, setCustomTowns } = useLocationFilter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggle = () => {
    // Toggle between my_town and county_wide
    if (state.mode === 'my_town') {
      setMode('county_wide');
    } else {
      setMode('my_town');
    }
  };

  const handleApplyCustomFilter = (townIds) => {
    setCustomTowns(townIds);
  };

  // Get selected town names for custom mode display
  const getSelectedTownNames = () => {
    if (!state.selectedTownIds || state.selectedTownIds.length === 0) {
      return [];
    }
    return towns
      .filter(town => state.selectedTownIds.includes(town.id))
      .map(town => town.name);
  };

  // If user has no preferred town, show a prompt
  if (!userTown) {
    return (
      <Card className="border-2 border-blue-100 bg-blue-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                Set your preferred town in your profile to see personalized local content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedTownNames = getSelectedTownNames();

  return (
    <>
      <Card className="border-2 border-orange-100 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {state.mode === 'my_town' && (
                <>
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{userTown.name}</p>
                    <p className="text-sm text-gray-600">Showing {itemName} in your town</p>
                  </div>
                </>
              )}

              {state.mode === 'county_wide' && (
                <>
                  <Globe className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">County-wide</p>
                    <p className="text-sm text-gray-600">Showing all {itemName}</p>
                  </div>
                </>
              )}

              {state.mode === 'custom' && (
                <>
                  <Filter className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Custom Filter</p>
                    <p className="text-sm text-gray-600">
                      {selectedTownNames.length === 0 ? (
                        `Showing all ${itemName}`
                      ) : selectedTownNames.length === 1 ? (
                        `Showing ${itemName} in ${selectedTownNames[0]}`
                      ) : (
                        `Showing ${itemName} in ${selectedTownNames.length} towns`
                      )}
                    </p>
                    {selectedTownNames.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedTownNames.slice(0, 3).join(", ")}
                        {selectedTownNames.length > 3 && ` +${selectedTownNames.length - 3} more`}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggle}
                className="border-orange-200 hover:bg-orange-50"
              >
                {state.mode === 'my_town' ? (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Show All
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    My Town
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(true)}
                className="border-orange-200 hover:bg-orange-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Custom
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TownFilterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        towns={towns}
        selectedTownIds={state.selectedTownIds || []}
        onApply={handleApplyCustomFilter}
      />
    </>
  );
}
