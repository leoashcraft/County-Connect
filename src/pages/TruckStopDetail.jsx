import React, { useState, useEffect } from "react";
import { TruckStop as TruckStopEntity, FoodTruck, User } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, ArrowLeft, MapPin, Clock, Navigation, Users, Star } from "lucide-react";
import { format, formatDistanceToNow, intervalToDuration } from "date-fns";

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function TruckStopDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stopId = searchParams.get('id');
  const { settings } = useSiteSettings();

  const [stop, setStop] = useState(null);
  const [truck, setTruck] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (stopId) {
      loadStop();
    } else {
      navigate(createPageUrl("FoodTrucks"));
    }
  }, [stopId]);

  useEffect(() => {
    if (!stop) return;

    const updateCountdown = () => {
      const now = new Date();
      const start = new Date(stop.start_datetime);
      const end = new Date(stop.end_datetime);

      if (now < start) {
        // Stop hasn't started yet
        const duration = intervalToDuration({ start: now, end: start });
        setTimeRemaining({
          type: 'starts_in',
          duration,
          totalSeconds: Math.floor((start - now) / 1000)
        });
      } else if (now >= start && now <= end) {
        // Stop is currently active
        const duration = intervalToDuration({ start: now, end });
        setTimeRemaining({
          type: 'serving_for',
          duration,
          totalSeconds: Math.floor((end - now) / 1000)
        });
      } else {
        // Stop has ended
        setTimeRemaining({
          type: 'ended',
          duration: null,
          totalSeconds: 0
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [stop]);

  const loadStop = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      const stopData = await TruckStopEntity.get(stopId);
      setStop(stopData);

      const truckData = await FoodTruck.get(stopData.truck_id);
      setTruck(truckData);
    } catch (error) {
      console.error("Error loading truck stop:", error);
      navigate(createPageUrl("FoodTrucks"));
    }
    setLoading(false);
  };

  const formatDuration = (duration) => {
    if (!duration) return '';

    const parts = [];
    if (duration.days > 0) parts.push(`${duration.days}d`);
    if (duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes > 0) parts.push(`${duration.minutes}m`);
    if (duration.seconds > 0 && parts.length < 2) parts.push(`${duration.seconds}s`);

    return parts.join(' ') || '0s';
  };

  const getNavigationUrl = () => {
    if (!stop || !stop.lat || !stop.lng) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;
  };

  const getStatusColor = () => {
    if (!stop) return 'bg-gray-100 text-gray-800';

    switch (stop.status) {
      case 'prepping': return 'bg-yellow-100 text-yellow-800';
      case 'serving': return 'bg-green-100 text-green-800';
      case 'sold_out': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = () => {
    if (!stop) return '';

    switch (stop.status) {
      case 'prepping': return 'Prepping';
      case 'serving': return 'Serving Now!';
      case 'sold_out': return 'Sold Out';
      case 'closed': return 'Closed';
      default: return 'Scheduled';
    }
  };

  const getWaitTimeLabel = () => {
    if (!stop.wait_minutes) return null;

    if (stop.wait_minutes >= 60) {
      return `${Math.floor(stop.wait_minutes / 60)}+ hour wait`;
    }
    return `${stop.wait_minutes} min wait`;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Truck className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  if (!stop || !truck) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Truck className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stop not found</h2>
        <Button onClick={() => navigate(createPageUrl("FoodTrucks"))}>
          Back to Food Trucks
        </Button>
      </div>
    </div>;
  }

  const startDate = new Date(stop.start_datetime);
  const endDate = new Date(stop.end_datetime);
  const isOwner = user && user.id === truck.created_by;

  return (
    <>
      <MetaTags
        title={`${truck.name} at ${stop.location_name} - Food Truck Stop in ${settings.county_name || 'Navarro'} County`}
        description={`${truck.name} is serving at ${stop.location_name}. ${stop.specials_today || truck.description?.substring(0, 100) || `Find this food truck in ${settings.county_name || 'Navarro'} County, TX.`}`}
      />
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl(`FoodTruckDetail?id=${truck.id}`))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {truck.name}
          </Button>

          {/* Countdown Banner */}
          {timeRemaining && timeRemaining.type !== 'ended' && (
            <Card className="border-2 border-orange-500 bg-gradient-to-r from-orange-100 to-amber-100 mb-6">
              <CardContent className="p-8 text-center">
                <h2 className="text-5xl font-bold text-orange-900 mb-2">
                  {formatDuration(timeRemaining.duration)}
                </h2>
                <p className="text-xl text-orange-800">
                  {timeRemaining.type === 'serving_for' ? 'Serving for' : 'Starts in'}
                </p>
              </CardContent>
            </Card>
          )}

          {timeRemaining && timeRemaining.type === 'ended' && (
            <Card className="border-2 border-gray-300 bg-gray-100 mb-6">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">This stop has ended</h2>
                <p className="text-gray-600">
                  Ended {formatDistanceToNow(endDate, { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className={`${getStatusColor()} mb-3`}>
                {getStatusLabel()}
              </Badge>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{truck.name}</h1>
              <h2 className="text-xl text-gray-700">{stop.location_name}</h2>
            </div>

            {truck.logo_url && (
              <img
                src={truck.logo_url}
                alt={truck.name}
                className="w-24 h-24 rounded-lg object-cover border-2 border-orange-200"
              />
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Location & Time */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Location & Time</h3>

                <div className="space-y-3">
                  {stop.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">{stop.location_name}</p>
                        <p className="text-gray-600">{stop.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold">{format(startDate, 'EEEE, MMMM d, yyyy')}</p>
                      <p className="text-gray-600">
                        {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  {stop.indoor_outdoor !== undefined && (
                    <div>
                      <Badge variant="outline">
                        {stop.indoor_outdoor ? 'Indoor' : 'Outdoor'}
                      </Badge>
                    </div>
                  )}
                </div>

                {(stop.lat && stop.lng) && (
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    onClick={() => window.open(getNavigationUrl(), '_blank')}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Specials & Menu */}
            {(stop.specials_today || (stop.menu_highlights && stop.menu_highlights.length > 0)) && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4">Today's Specials</h3>

                  {stop.specials_today && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-lg font-semibold text-yellow-900">⭐ {stop.specials_today}</p>
                    </div>
                  )}

                  {stop.menu_highlights && stop.menu_highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Menu Highlights:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {stop.menu_highlights.map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Event Info */}
            {stop.event_id && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">Part of an Event</h3>
                  <p className="text-gray-600 mb-3">This truck is appearing at a special event</p>
                  <Button
                    variant="outline"
                    onClick={() => navigate(createPageUrl(`EventDetail?id=${stop.event_id}`))}
                  >
                    View Event Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Queue Status */}
            {stop.wait_minutes > 0 && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Queue
                  </h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600 mb-1">
                      {stop.wait_minutes}
                    </p>
                    <p className="text-gray-600">minute wait</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Quick Actions</h3>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(createPageUrl(`FoodTruckDetail?id=${truck.id}`))}
                  >
                    View Truck Profile
                  </Button>

                  {truck.phone && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = `tel:${truck.phone}`}
                    >
                      Call Truck
                    </Button>
                  )}

                  {truck.preorder_url && (
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      onClick={() => window.open(truck.preorder_url, '_blank')}
                    >
                      Pre-Order Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Truck Info */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">About {truck.name}</h3>

                {truck.cuisine_types && truck.cuisine_types.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold mb-1">Cuisine:</p>
                    <div className="flex flex-wrap gap-1">
                      {truck.cuisine_types.map(cuisine => (
                        <Badge key={cuisine} variant="secondary" className="text-xs">
                          {formatLabel(cuisine)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {truck.dietary_flags && truck.dietary_flags.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold mb-1">Dietary:</p>
                    <div className="flex flex-wrap gap-1">
                      {truck.dietary_flags.map(flag => (
                        <Badge key={flag} variant="outline" className="text-xs">
                          {formatLabel(flag)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {truck.rating_avg > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{truck.rating_avg.toFixed(1)}</span>
                    <span className="text-sm text-gray-600">({truck.rating_count})</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Actions */}
            {isOwner && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Manage Stop</h3>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(createPageUrl(`EditTruckStop?id=${stop.id}`))}
                  >
                    Update Status & Info
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
