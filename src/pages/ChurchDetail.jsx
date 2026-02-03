import React, { useState, useEffect } from "react";
import { Church, User, Event, EntityPage, EntityNavigationItem, EntityPhoto } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Church as ChurchIcon, MapPin, Phone, Globe, Clock, ArrowLeft, Edit,
  Mail, Users, Calendar, Heart, Facebook, Youtube, Layout, Image as ImageIcon
} from "lucide-react";
import ClaimPageBanner from "@/components/ClaimPageBanner";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import EntityPhotoGallery from "@/components/entity/EntityPhotoGallery";
import EntityPageRenderer from "@/components/entity/EntityPageRenderer";
import EntityCMS from "@/components/entity/EntityCMS";
import EntityPageEditor from "@/components/entity/EntityPageEditor";
import EntityNavEditor from "@/components/entity/EntityNavEditor";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ChurchDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, churchSlug } = useParams();
  const queryId = searchParams.get("id");
  const [churchId, setChurchId] = useState(queryId);
  const [church, setChurch] = useState(null);
  const [user, setUser] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  // Mini-website state
  const [entityPages, setEntityPages] = useState([]);
  const [entityNavItems, setEntityNavItems] = useState([]);
  const [entityPhotos, setEntityPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedPage, setSelectedPage] = useState(null);

  // CMS editing state
  const [cmsMode, setCmsMode] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingNavId, setEditingNavId] = useState(null);
  const [editingNavParentId, setEditingNavParentId] = useState(null);

  useEffect(() => {
    loadData();
  }, [queryId, townSlug, churchSlug]);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let churchData = null;
      let resolvedChurchId = queryId;

      // Try slug-based routing first
      if (townSlug && churchSlug) {
        const churches = await Church.filter({ slug: churchSlug, town_slug: townSlug });
        if (churches.length > 0) {
          churchData = churches[0];
          resolvedChurchId = churchData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        churchData = await Church.get(queryId);
      }

      if (churchData) {
        setChurch(churchData);
        setChurchId(resolvedChurchId);

        // Load upcoming events for this church
        const events = await Event.filter({
          organizer_id: resolvedChurchId,
          status: 'active'
        }, 'event_date');
        setUpcomingEvents(events.slice(0, 3));

        // Load mini-website data
        const [pages, navItems, photos] = await Promise.all([
          EntityPage.filter({ entity_type: "Church", entity_id: resolvedChurchId }).catch(() => []),
          EntityNavigationItem.filter({ entity_type: "Church", entity_id: resolvedChurchId }).catch(() => []),
          EntityPhoto.filter({ entity_type: "Church", entity_id: resolvedChurchId }).catch(() => [])
        ]);

        setEntityPages(pages.filter(p => p.is_published).sort((a, b) => (a.order || 0) - (b.order || 0)));
        setEntityNavItems(navItems.filter(n => n.is_visible).sort((a, b) => (a.order || 0) - (b.order || 0)));
        setEntityPhotos(photos);

        const homepage = pages.find(p => p.is_homepage && p.is_published);
        if (homepage) {
          setSelectedPage(homepage);
        }
      }
    } catch (error) {
      console.error("Error loading church:", error);
    }
    setLoading(false);
  };

  const reloadEntityData = async () => {
    try {
      const [pages, navItems, photos] = await Promise.all([
        EntityPage.filter({ entity_type: "Church", entity_id: churchId }).catch(() => []),
        EntityNavigationItem.filter({ entity_type: "Church", entity_id: churchId }).catch(() => []),
        EntityPhoto.filter({ entity_type: "Church", entity_id: churchId }).catch(() => [])
      ]);

      setEntityPages(pages.filter(p => p.is_published).sort((a, b) => (a.order || 0) - (b.order || 0)));
      setEntityNavItems(navItems.filter(n => n.is_visible).sort((a, b) => (a.order || 0) - (b.order || 0)));
      setEntityPhotos(photos);
    } catch (error) {
      console.error("Error reloading entity data:", error);
    }
  };

  const handleEditPage = (pageId) => {
    setEditingPageId(pageId);
    setCmsMode('edit-page');
  };

  const handleEditNav = (itemId, parentId = null) => {
    setEditingNavId(itemId);
    setEditingNavParentId(parentId);
    setCmsMode('edit-nav');
  };

  const handleCmsSave = async () => {
    await reloadEntityData();
    setCmsMode('dashboard');
    setEditingPageId(null);
    setEditingNavId(null);
  };

  const handleCmsCancel = () => {
    if (cmsMode === 'edit-page' || cmsMode === 'edit-nav') {
      setCmsMode('dashboard');
    } else {
      setCmsMode(null);
    }
    setEditingPageId(null);
    setEditingNavId(null);
  };

  const denominations = {
    baptist: "Baptist",
    methodist: "Methodist",
    catholic: "Catholic",
    lutheran: "Lutheran",
    presbyterian: "Presbyterian",
    pentecostal: "Pentecostal",
    church_of_christ: "Church of Christ",
    assembly_of_god: "Assembly of God",
    episcopal: "Episcopal",
    non_denominational: "Non-Denominational",
    other: "Other"
  };

  const formatTime = (time) => {
    if (!time) return '';
    // If time already contains AM/PM, return as-is
    if (time.toUpperCase().includes('AM') || time.toUpperCase().includes('PM')) {
      return time;
    }
    // Otherwise convert from 24-hour format
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <ChurchIcon className="w-12 h-12 text-indigo-600 animate-pulse" />
    </div>;
  }

  if (!church) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <ChurchIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Church not found</h2>
          <Button onClick={() => navigate(createPageUrl("Churches"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Churches
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.id === church.owner_id || user.id === church.created_by || user.role === 'admin');

  // CMS Mode Views
  if (cmsMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <EntityCMS
            entityType="Church"
            entityId={churchId}
            entityName={church.name}
            entitySlug={church.slug}
            onBack={() => setCmsMode(null)}
            onEditPage={handleEditPage}
            onEditNav={handleEditNav}
            onViewEntity={() => setCmsMode(null)}
            accentColor="purple"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <EntityPageEditor
            entityType="Church"
            entityId={churchId}
            entityName={church.name}
            pageId={editingPageId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="purple"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-nav') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <EntityNavEditor
            entityType="Church"
            entityId={churchId}
            entityName={church.name}
            itemId={editingNavId}
            parentId={editingNavParentId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="purple"
          />
        </div>
      </div>
    );
  }

  // Prepare photos for gallery
  const galleryPhotos = [
    ...(church.image_url ? [{ url: church.image_url, caption: 'Main Photo' }] : []),
    ...(church.photos || []).map(p => typeof p === 'string' ? { url: p } : p),
    ...entityPhotos.map(p => ({ url: p.url, caption: p.caption }))
  ];

  const hasCustomPages = entityPages.length > 0;
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <>
      <MetaTags
        title={`${church.name} - Church in ${settings.county_name || 'Navarro'} County`}
        description={church.description || `Visit ${church.name}, a ${church.denomination || ''} church serving the ${settings.county_name || 'Navarro'} County community.`}
      />
      <JsonLdSchema type="church" data={church} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Churches"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Churches
        </Button>

        <ClaimPageBanner
          entityType="Church"
          entityId={church.id}
          entityName={church.name}
          ownerId={church.owner_id}
          user={user}
        />

        <div className="grid gap-6">
          {/* Header Card */}
          <Card className="border-2 border-indigo-100 overflow-hidden">
            {church.image_url && (
              <div className="h-64 bg-gray-200">
                <img
                  src={church.image_url}
                  alt={church.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-indigo-100 text-indigo-800 mb-2">
                    {denominations[church.denomination] || church.denomination}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900">{church.name}</h1>
                  {church.pastor_name && (
                    <p className="text-lg text-gray-600 mt-1">Pastor: {church.pastor_name}</p>
                  )}
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCmsMode('dashboard')}
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      <Layout className="w-4 h-4 mr-2" />
                      Manage Website
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(createPageUrl(`EditChurch?id=${church.id}`))}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Info
                    </Button>
                  </div>
                )}
              </div>

              {church.description && (
                <p className="text-gray-600 mb-6">{church.description}</p>
              )}

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                {church.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">{church.address}</p>
                    </div>
                  </div>
                )}
                {church.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${church.phone}`} className="text-indigo-600 hover:underline">
                        {church.phone}
                      </a>
                    </div>
                  </div>
                )}
                {church.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <SafeEmail email={church.email} className="text-indigo-600" />
                    </div>
                  </div>
                )}
                {church.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={church.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(church.facebook_url || church.youtube_url || church.livestream_url) && (
                <div className="flex gap-3 mt-4 pt-4 border-t">
                  {church.facebook_url && (
                    <a
                      href={church.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {church.youtube_url && (
                    <a
                      href={church.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </a>
                  )}
                  {church.livestream_url && (
                    <a
                      href={church.livestream_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-600 hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Live Stream
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          {hasPhotos && (
            <Card className="border-2 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EntityPhotoGallery
                  photos={galleryPhotos}
                  entityName={church.name}
                  columns={3}
                  showMainPhoto={false}
                />
              </CardContent>
            </Card>
          )}

          {/* Mini-Website Custom Pages */}
          {(hasCustomPages || entityNavItems.length > 0) && (
            <Card className="border-2 border-indigo-100">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 border-b border-indigo-200 pb-3 mb-4">
                  <Button
                    variant={activeTab === 'about' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => { setActiveTab('about'); setSelectedPage(null); }}
                    className={activeTab === 'about' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                  >
                    About
                  </Button>

                  {entityNavItems.map(navItem => {
                    if (navItem.link_type === 'page' && navItem.page_id) {
                      const page = entityPages.find(p => p.id === navItem.page_id);
                      if (page) {
                        return (
                          <Button
                            key={navItem.id}
                            variant={selectedPage?.id === page.id ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => { setActiveTab('page'); setSelectedPage(page); }}
                            className={selectedPage?.id === page.id ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                          >
                            {navItem.label}
                          </Button>
                        );
                      }
                    }
                    return null;
                  })}

                  {entityPages.filter(p =>
                    !entityNavItems.some(n => n.page_id === p.id)
                  ).map(page => (
                    <Button
                      key={page.id}
                      variant={selectedPage?.id === page.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => { setActiveTab('page'); setSelectedPage(page); }}
                      className={selectedPage?.id === page.id ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                    >
                      {page.title}
                    </Button>
                  ))}
                </div>

                {activeTab === 'page' && selectedPage && (
                  <EntityPageRenderer
                    sections={selectedPage.content?.sections || []}
                    entityName={church.name}
                    accentColor="purple"
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Service Times */}
          {church.service_times && church.service_times.length > 0 && (
            <Card className="border-2 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Service Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {church.service_times.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{service.day}</p>
                        <p className="text-sm text-gray-600">{service.name || 'Worship Service'}</p>
                      </div>
                      <Badge variant="secondary">{formatTime(service.time)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ministries */}
          {church.ministries && church.ministries.length > 0 && (
            <Card className="border-2 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-indigo-600" />
                  Ministries & Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {church.ministries.map((ministry, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                      {ministry}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <Card className="border-2 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => navigate(createPageUrl(`EventDetail?id=${event.id}`))}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.event_date}</p>
                        </div>
                        <Badge variant="outline">{event.event_type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate(createPageUrl("Events"))}
                >
                  View All Events
                </Button>
              </CardContent>
            </Card>
          )}

          {/* About / Mission Statement */}
          {church.mission_statement && (
            <Card className="border-2 border-indigo-100">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{church.mission_statement}</p>
              </CardContent>
            </Card>
          )}

          {/* Map */}
          {church.lat && church.lng && (
            <Card className="border-2 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full">
                  <MapContainer
                    center={[church.lat, church.lng]}
                    zoom={15}
                    className="h-full w-full rounded-b-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[church.lat, church.lng]}>
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-bold">{church.name}</h3>
                          <p className="text-xs text-gray-600">{church.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
