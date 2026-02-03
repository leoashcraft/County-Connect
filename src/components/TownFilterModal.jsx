import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Filter } from "lucide-react";

/**
 * Modal for selecting multiple towns to filter by
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onOpenChange - Callback when open state changes
 * @param {Array} props.towns - Array of town objects with id and name
 * @param {Array} props.selectedTownIds - Currently selected town IDs
 * @param {Function} props.onApply - Callback when Apply is clicked with selected town IDs
 */
export default function TownFilterModal({
  open,
  onOpenChange,
  towns = [],
  selectedTownIds = [],
  onApply
}) {
  const [tempSelectedIds, setTempSelectedIds] = useState([]);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (open) {
      setTempSelectedIds([...selectedTownIds]);
    }
  }, [open, selectedTownIds]);

  const handleToggleTown = (townId) => {
    setTempSelectedIds(prev => {
      if (prev.includes(townId)) {
        return prev.filter(id => id !== townId);
      } else {
        return [...prev, townId];
      }
    });
  };

  const handleSelectAll = () => {
    setTempSelectedIds(towns.map(town => town.id));
  };

  const handleDeselectAll = () => {
    setTempSelectedIds([]);
  };

  const handleApply = () => {
    onApply(tempSelectedIds);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSelectedIds([...selectedTownIds]); // Reset to original
    onOpenChange(false);
  };

  const allSelected = towns.length > 0 && tempSelectedIds.length === towns.length;
  const noneSelected = tempSelectedIds.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-600" />
            Filter by Towns
          </DialogTitle>
          <DialogDescription>
            Select one or more towns to filter content. Leave empty to show all.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Select/Deselect All Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={allSelected}
              className="flex-1"
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={noneSelected}
              className="flex-1"
            >
              Deselect All
            </Button>
          </div>

          {/* Town List */}
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-3">
              {towns.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No towns available
                </p>
              ) : (
                towns.map((town) => (
                  <div key={town.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`town-${town.id}`}
                      checked={tempSelectedIds.includes(town.id)}
                      onCheckedChange={() => handleToggleTown(town.id)}
                    />
                    <Label
                      htmlFor={`town-${town.id}`}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">{town.name}</span>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Selection Count */}
          <div className="text-sm text-gray-600 text-center">
            {tempSelectedIds.length === 0 ? (
              <span>No towns selected - will show all content</span>
            ) : (
              <span>
                {tempSelectedIds.length} town{tempSelectedIds.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            Apply Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
