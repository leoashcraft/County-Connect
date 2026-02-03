import React, { useState, useEffect } from "react";
import { CommunityResource, User } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart, MapPin, Phone, Globe, Clock, ArrowLeft, Edit,
  Mail, Users, CheckCircle, AlertCircle, Calendar
} from "lucide-react";
import ClaimPageBanner from "@/components/ClaimPageBanner";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function CommunityResourceDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, resourceSlug } = useParams();
  const queryId = searchParams.get("id");
  const [resourceId, setResourceId] = useState(queryId);
  const [resource, setResource] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    loadData();
  }, [queryId, townSlug, resourceSlug]);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let resourceData = null;
      let resolvedId = queryId;

      // Try slug-based routing first
      if (townSlug && resourceSlug) {
        const resources = await CommunityResource.filter({ slug: resourceSlug, town_slug: townSlug });
        if (resources.length > 0) {
          resourceData = resources[0];
          resolvedId = resourceData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        resourceData = await CommunityResource.get(queryId);
      }

      if (resourceData) {
        setResource(resourceData);
        setResourceId(resolvedId);
      }
    } catch (error) {
      console.error("Error loading resource:", error);
    }
    setLoading(false);
  };

  const categories = {
    food_pantry: "Food Pantry",
    food_bank: "Food Bank",
    soup_kitchen: "Soup Kitchen / Meal Service",
    shelter: "Shelter / Housing",
    clothing: "Clothing Assistance",
    utility_assistance: "Utility Assistance",
    medical: "Medical / Health Services",
    mental_health: "Mental Health Services",
    senior_services: "Senior Services",
    youth_services: "Youth Services",
    veterans: "Veterans Services",
    job_assistance: "Job Training / Employment",
    education: "Education / Tutoring",
    legal_aid: "Legal Aid",
    crisis: "Crisis Hotline / Support",
    other: "Other"
  };

  const getCategoryColor = (category) => {
    const colors = {
      food_pantry: "bg-green-100 text-green-800",
      food_bank: "bg-green-100 text-green-800",
      soup_kitchen: "bg-orange-100 text-orange-800",
      shelter: "bg-blue-100 text-blue-800",
      clothing: "bg-purple-100 text-purple-800",
      utility_assistance: "bg-yellow-100 text-yellow-800",
      medical: "bg-red-100 text-red-800",
      mental_health: "bg-pink-100 text-pink-800",
      senior_services: "bg-indigo-100 text-indigo-800",
      youth_services: "bg-cyan-100 text-cyan-800",
      veterans: "bg-slate-100 text-slate-800",
      job_assistance: "bg-teal-100 text-teal-800",
      education: "bg-amber-100 text-amber-800",
      legal_aid: "bg-gray-100 text-gray-800",
      crisis: "bg-rose-100 text-rose-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const isOpenNow = () => {
    if (!resource?.operating_hours || resource.operating_hours.length === 0) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = resource.operating_hours.find(h => h.day === currentDay);
    if (!todayHours || todayHours.is_closed) return false;

    return currentTime >= todayHours.open_time && currentTime <= todayHours.close_time;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-rose-600 animate-pulse" />
    </div>;
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Heart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource not found</h2>
          <Button onClick={() => navigate(createPageUrl("CommunityResources"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.id === resource.owner_id || user.id === resource.created_by || user.role === 'admin');
  const openStatus = isOpenNow();

  return (
    <>
      <MetaTags
        title={`${resource.name} - Community Resource in ${settings.county_name || 'Navarro'} County`}
        description={resource.description || `Find information about ${resource.name}, a community resource in ${settings.county_name || 'Navarro'} County.`}
      />
      <JsonLdSchema type="communityResource" data={resource} />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("CommunityResources"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Button>

        <ClaimPageBanner
          entityType="CommunityResource"
          entityId={resource.id}
          entityName={resource.name}
          ownerId={resource.owner_id}
          user={user}
        />

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Header Card */}
          <Card className="border-2 border-rose-100 overflow-hidden">
            {resource.image_url && (
              <div className="h-64 bg-gray-200">
                <img
                  src={resource.image_url}
                  alt={resource.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(resource.category)}>
                      {categories[resource.category] || resource.category}
                    </Badge>
                    {openStatus !== null && (
                      openStatus ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Open Now
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Closed
                        </Badge>
                      )
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">{resource.name}</h1>
                </div>
                {canEdit && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(createPageUrl(`EditCommunityResource?id=${resource.id}`))}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {resource.description && (
                <p className="text-gray-600 mb-4">{resource.description}</p>
              )}

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                {resource.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-rose-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">{resource.address}</p>
                    </div>
                  </div>
                )}
                {resource.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-rose-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${resource.phone}`} className="text-rose-600 hover:underline">
                        {resource.phone}
                      </a>
                    </div>
                  </div>
                )}
                {resource.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-rose-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <SafeEmail email={resource.email} className="text-rose-600" />
                    </div>
                  </div>
                )}
                {resource.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-rose-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services Offered */}
          {resource.services_offered && resource.services_offered.length > 0 && (
            <Card className="border-2 border-rose-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-rose-600" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resource.services_offered.map((service, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility Requirements */}
          {resource.eligibility_requirements && (
            <Card className="border-2 border-rose-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-600" />
                  Eligibility Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{resource.eligibility_requirements}</p>
              </CardContent>
            </Card>
          )}

          {/* What to Bring */}
          {resource.what_to_bring && resource.what_to_bring.length > 0 && (
            <Card className="border-2 border-rose-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  What to Bring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {resource.what_to_bring.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Operating Hours */}
          {resource.operating_hours && resource.operating_hours.length > 0 && (
            <Card className="border-2 border-rose-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-600" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dayOrder.map(day => {
                    const hours = resource.operating_hours.find(h => h.day === day);
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;

                    return (
                      <div
                        key={day}
                        className={`flex justify-between py-1 ${isToday ? 'bg-rose-50 px-2 rounded font-medium' : ''}`}
                      >
                        <span className="capitalize">{day}</span>
                        <span className="text-gray-600">
                          {hours && !hours.is_closed
                            ? `${formatTime(hours.open_time)} - ${formatTime(hours.close_time)}`
                            : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map */}
          {resource.lat && resource.lng && (
            <Card className="border-2 border-rose-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full">
                  <MapContainer
                    center={[resource.lat, resource.lng]}
                    zoom={15}
                    className="h-full w-full rounded-b-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[resource.lat, resource.lng]}>
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-bold">{resource.name}</h3>
                          <p className="text-xs text-gray-600">{resource.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Notes */}
          {resource.additional_notes && (
            <Card className="border-2 border-rose-100">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{resource.additional_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
