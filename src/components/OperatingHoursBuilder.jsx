import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Clock, Copy } from "lucide-react";

export default function OperatingHoursBuilder({ hours, onChange }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" }
  ];

  const updateHours = (day, field, value) => {
    const updatedHours = hours.map(h => {
      if (h.day === day) {
        return { ...h, [field]: value };
      }
      return h;
    });
    onChange(updatedHours);
  };

  const toggleClosed = (day) => {
    const dayHours = hours.find(h => h.day === day);
    updateHours(day, "is_closed", !dayHours?.is_closed);
  };

  const copyHoursToOtherDays = (sourceDay) => {
    const sourceHours = hours.find(h => h.day === sourceDay);
    if (!sourceHours) return;

    const updatedHours = hours.map(h => ({
      ...h,
      open_time: sourceHours.open_time,
      close_time: sourceHours.close_time,
      is_closed: sourceHours.is_closed
    }));
    onChange(updatedHours);
  };

  const getDayHours = (day) => {
    return hours.find(h => h.day === day) || {
      day,
      open_time: "09:00",
      close_time: "17:00",
      is_closed: false
    };
  };

  return (
    <Card className="border-2 border-orange-100">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Operating Hours
        </h2>

        <div className="space-y-4">
          {daysOfWeek.map(({ value, label }) => {
            const dayHours = getDayHours(value);

            return (
              <div key={value} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-28 font-semibold">{label}</div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`closed-${value}`}
                    checked={dayHours.is_closed}
                    onCheckedChange={() => toggleClosed(value)}
                  />
                  <Label htmlFor={`closed-${value}`} className="cursor-pointer text-sm">
                    Closed
                  </Label>
                </div>

                {!dayHours.is_closed && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`open-${value}`} className="text-sm">
                        Open:
                      </Label>
                      <Input
                        id={`open-${value}`}
                        type="time"
                        value={dayHours.open_time}
                        onChange={(e) => updateHours(value, "open_time", e.target.value)}
                        className="w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`close-${value}`} className="text-sm">
                        Close:
                      </Label>
                      <Input
                        id={`close-${value}`}
                        type="time"
                        value={dayHours.close_time}
                        onChange={(e) => updateHours(value, "close_time", e.target.value)}
                        className="w-32"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyHoursToOtherDays(value)}
                      title="Copy these hours to all days"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Click the copy button to apply a day's hours to all other days of the week.
        </p>
      </CardContent>
    </Card>
  );
}
