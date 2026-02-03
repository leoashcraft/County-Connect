import React, { useState, useEffect } from "react";
import { Event as EventEntity, TruckStop, FoodTruck, User } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, MapPin, Clock, Users, Truck, Navigation, Star } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { format } from "date-fns";

export default function EventDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('id');

  const [event, setEvent] = useState(null);
  const [truckStops, setTruckStops] = useState([]);
  const [trucks, setTrucks] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (eventId) {
      loadEvent();
    } else {
      navigate(createPageUrl("Events"));
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      const eventData = await EventEntity.get(eventId);
      setEvent(eventData);

      // Load all truck stops for this event
      const allStops = await TruckStop.list('-start_datetime');
      const eventStops = allStops.filter(stop => stop.event_id === eventId);
      setTruckStops(eventStops);

      // Load truck details for all stops
      const truckIds = [...new Set(eventStops.map(stop => stop.truck_id))];
      const truckData = {};

      for (const truckId of truckIds) {
        try {
          const truck = await FoodTruck.get(truckId);
          truckData[truckId] = truck;
        } catch (error) {
          console.error(`Error loading truck ${truckId}:`, error);
        }
      }

      setTrucks(truckData);
    } catch (error) {
      console.error("Error loading event:", error);
      navigate(createPageUrl("Events"));
    }
    setLoading(false);
  };

  const getNavigationUrl = () => {
    if (!event || !event.lat || !event.lng) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Calendar className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
        <Button onClick={() => navigate(createPageUrl("Events"))}>
          Back to Local Events
        </Button>
      </div>
    </div>;
  }

  const eventDate = new Date(event.event_date);

  return (
    <>
      <MetaTags
        title={`${event.name} - Event in ${settings.county_name || 'Navarro'} County`}
        description={event.description || `Join us for ${event.name} in ${settings.county_name || 'Navarro'} County`}
      />
      <JsonLdSchema type="event" data={event} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Events"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Local Events
          </Button>

          {/* Hero Image */}
          {event.image_url && (
            <Card className="border-2 border-orange-100 mb-6 overflow-hidden">
              <div className="h-80 bg-gray-200">
                <img
                  src={event.image_url}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{event.name}</h1>

              <div className="space-y-2 mb-4">
                {event.location && (
                  <p className="text-lg text-gray-700 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    {event.location}
                  </p>
                )}

                <p className="text-lg text-gray-700 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  {format(eventDate, 'EEEE, MMMM d, yyyy')}
                </p>

                {event.start_time && event.end_time && (
                  <p className="text-gray-600 ml-7">
                    {event.start_time} - {event.end_time}
                  </p>
                )}

                {event.expected_attendance && (
                  <p className="text-gray-700 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Expected Attendance: {event.expected_attendance.toLocaleString()} people
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            {event.description && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Food Trucks */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-orange-600" />
                  Food Trucks ({truckStops.length})
                </h2>

                {truckStops.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No food trucks registered yet</p>
                ) : (
                  <div className="space-y-4">
                    {truckStops.map(stop => {
                      const truck = trucks[stop.truck_id];
                      if (!truck) return null;

                      return (
                        <Card
                          key={stop.id}
                          className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(createPageUrl(`TruckStopDetail?id=${stop.id}`))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {truck.logo_url && (
                                <img
                                  src={truck.logo_url}
                                  alt={truck.name}
                                  className="w-16 h-16 rounded object-cover border-2 border-orange-200"
                                />
                              )}

                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{truck.name}</h3>

                                {truck.cuisine_types && truck.cuisine_types.length > 0 && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {truck.cuisine_types.join(', ')}
                                  </p>
                                )}

                                {stop.specials_today && (
                                  <p className="text-sm text-orange-600 font-medium">
                                    ⭐ {stop.specials_today}
                                  </p>
                                )}

                                {truck.rating_avg > 0 && (
                                  <div className="flex items-center gap-1 text-sm mt-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{truck.rating_avg.toFixed(1)}</span>
                                    <span className="text-gray-600">({truck.rating_count})</span>
                                  </div>
                                )}
                              </div>

                              <Badge variant="outline">
                                View Details
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            {event.organizer_name && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Organizer Information</h2>

                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Organizer:</span> {event.organizer_name}
                    </p>

                    {event.organizer_contact && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Contact:</span> {event.organizer_contact}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Event Details</h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date</p>
                    <p className="text-gray-900">{format(eventDate, 'MMMM d, yyyy')}</p>
                  </div>

                  {event.start_time && event.end_time && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Time</p>
                      <p className="text-gray-900">{event.start_time} - {event.end_time}</p>
                    </div>
                  )}

                  {event.location && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Location</p>
                      <p className="text-gray-900">{event.location}</p>
                    </div>
                  )}

                  {event.admission_fee !== undefined && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Admission</p>
                      <p className="text-gray-900">
                        {event.admission_fee > 0 ? `$${event.admission_fee.toFixed(2)}` : "Free"}
                      </p>
                    </div>
                  )}

                  {event.parking_info && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Parking</p>
                      <p className="text-gray-900">{event.parking_info}</p>
                    </div>
                  )}
                </div>

                {(event.lat && event.lng) && (
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

            {/* Event Features */}
            {(event.family_friendly || event.pet_friendly || event.live_music) && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Features</h2>

                  <div className="space-y-2">
                    {event.family_friendly && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Family Friendly</span>
                      </div>
                    )}

                    {event.pet_friendly && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Pet Friendly</span>
                      </div>
                    )}

                    {event.live_music && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Live Music</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Website Link */}
            {event.website_url && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">More Information</h2>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(event.website_url, '_blank')}
                  >
                    Visit Event Website
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
