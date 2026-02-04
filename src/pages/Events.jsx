import React, { useState, useEffect } from "react";
import { Event as EventEntity, TruckStop, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, MapPin, Clock, Users, Truck } from "lucide-react";
import { format, isFuture, isPast } from "date-fns";
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { FeaturedSpotSection } from "@/components/FeaturedSpot";

export default function Events() {
  const navigate = useNavigate();
  const { state: filterState } = useLocationFilter();
  const { settings } = useSiteSettings();
  const [events, setEvents] = useState([]);
  const [truckStops, setTruckStops] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("upcoming"); // upcoming, past, all
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      // Load user's preferred town if they have one
      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
      }

      // Load all towns for the filter modal
      const allTowns = await Town.list('name');
      setTowns(allTowns);

      const allEvents = await EventEntity.list('-event_date');
      setEvents(allEvents);

      // Load all truck stops to count trucks per event
      const allStops = await TruckStop.list('-start_datetime');
      setTruckStops(allStops);
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setLoading(false);
  };

  const getTruckCount = (eventId) => {
    return truckStops.filter(stop => stop.event_id === eventId).length;
  };

  const getEventStatus = (event) => {
    const eventDate = new Date(event.event_date);
    const now = new Date();

    if (isFuture(eventDate)) {
      return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
    } else if (isPast(eventDate)) {
      return { label: "Past", color: "bg-gray-100 text-gray-800" };
    } else {
      return { label: "Today", color: "bg-green-100 text-green-800" };
    }
  };

  // Apply search and time filters
  const searchAndTimeFiltered = events.filter(event => {
    const matchesSearch = !searchTerm ||
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const eventDate = new Date(event.event_date);

    const matchesTime =
      timeFilter === "all" ||
      (timeFilter === "upcoming" && isFuture(eventDate)) ||
      (timeFilter === "past" && isPast(eventDate));

    return matchesSearch && matchesTime;
  });

  // Apply location filter using global filter state
  const filteredEvents = applyLocationFilter(
    searchAndTimeFiltered,
    filterState,
    userTown,
    (event) => event.town_id
  );

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Calendar className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Events in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Discover upcoming events in ${settings.county_name || 'Navarro'} County, Texas. Find local festivals, community gatherings, and activities.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                Local Events
              </h1>
              <p className="text-gray-600 mt-2">Discover food truck gatherings, festivals, and community events</p>
            </div>
            <Button
              onClick={async () => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', createPageUrl("AddEvent"));
                  await User.login();
                  return;
                }
                navigate(createPageUrl("AddEvent"));
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add an Event
            </Button>
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="events"
        />

        {/* Featured Events */}
        <FeaturedSpotSection
          title="Featured Events"
          spotType="event"
          featuredItems={events.filter(e => e.is_featured && isFuture(new Date(e.event_date))).slice(0, 3)}
          icon={Calendar}
          renderItem={(event) => {
            const eventDate = new Date(event.event_date);
            return (
              <Card
                className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => navigate(createPageUrl(`EventDetail?id=${event.id}`))}
              >
                {event.image_url && (
                  <div className="h-32 bg-gray-200 overflow-hidden">
                    <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-4">
                  <Badge className="bg-blue-100 text-blue-800 text-xs mb-2">
                    {format(eventDate, 'MMM d, yyyy')}
                  </Badge>
                  <h3 className="font-bold text-gray-900 mb-1">{event.name}</h3>
                  {event.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {event.location}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          }}
        />

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                  <SelectItem value="all">All Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No events found</h3>
                  <p className="text-gray-600">Check back later for upcoming events</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredEvents.map(event => {
              const status = getEventStatus(event);
              const truckCount = getTruckCount(event.id);
              const eventDate = new Date(event.event_date);

              return (
                <Card
                  key={event.id}
                  className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(createPageUrl(`EventDetail?id=${event.id}`))}
                >
                  {event.image_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                      {truckCount > 0 && (
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <Truck className="w-4 h-4" />
                          <span className="font-semibold">{truckCount}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>

                    {event.location && (
                      <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" />
                      {format(eventDate, 'EEEE, MMMM d, yyyy')}
                    </p>

                    {event.start_time && event.end_time && (
                      <p className="text-sm text-gray-600 ml-6 mb-3">
                        {event.start_time} - {event.end_time}
                      </p>
                    )}

                    {event.description && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                        {event.description}
                      </p>
                    )}

                    {event.expected_attendance && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Expected: {event.expected_attendance.toLocaleString()} people</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      </div>
    </>
  );
}
