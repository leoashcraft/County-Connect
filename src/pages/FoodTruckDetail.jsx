import React, { useState, useEffect } from "react";
import { FoodTruck as FoodTruckEntity, TruckStop, User, EntityPage, EntityNavigationItem, EntityPhoto } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, ArrowLeft, MapPin, Phone, Globe, Star, Calendar, Clock, Edit, Trash2, DollarSign, Layout, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import ClaimPageBanner from "@/components/ClaimPageBanner";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import EntityPhotoGallery from "@/components/entity/EntityPhotoGallery";
import EntityPageRenderer from "@/components/entity/EntityPageRenderer";
import EntityCMS from "@/components/entity/EntityCMS";
import EntityPageEditor from "@/components/entity/EntityPageEditor";
import EntityNavEditor from "@/components/entity/EntityNavEditor";

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function FoodTruckDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, truckSlug } = useParams();
  const queryId = searchParams.get('id');
  const [truckId, setTruckId] = useState(queryId);

  const [truck, setTruck] = useState(null);
  const [stops, setStops] = useState([]);
  const [user, setUser] = useState(null);
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
    if (queryId || (townSlug && truckSlug)) {
      loadTruck();
    } else {
      navigate(createPageUrl("FoodTrucks"));
    }
  }, [queryId, townSlug, truckSlug]);

  const loadTruck = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let truckData = null;
      let resolvedId = queryId;

      // Try slug-based routing first
      if (townSlug && truckSlug) {
        const trucks = await FoodTruckEntity.filter({ slug: truckSlug, town_slug: townSlug });
        if (trucks.length > 0) {
          truckData = trucks[0];
          resolvedId = truckData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        truckData = await FoodTruckEntity.get(queryId);
      }

      if (!truckData) {
        navigate(createPageUrl("FoodTrucks"));
        return;
      }

      setTruck(truckData);
      setTruckId(resolvedId);

      // Load upcoming stops for this truck
      const allStops = await TruckStop.list('-start_datetime');
      const truckStops = allStops.filter(stop => stop.truck_id === resolvedId);

      // Filter future and current stops
      const now = new Date();
      const upcomingStops = truckStops.filter(stop => {
        const endTime = new Date(stop.end_datetime);
        return endTime >= now;
      }).slice(0, 5); // Show next 5 stops

      setStops(upcomingStops);

      // Load mini-website data
      const [pages, navItems, photos] = await Promise.all([
        EntityPage.filter({ entity_type: "FoodTruck", entity_id: resolvedId }).catch(() => []),
        EntityNavigationItem.filter({ entity_type: "FoodTruck", entity_id: resolvedId }).catch(() => []),
        EntityPhoto.filter({ entity_type: "FoodTruck", entity_id: resolvedId }).catch(() => [])
      ]);

      setEntityPages(pages.filter(p => p.is_published).sort((a, b) => (a.order || 0) - (b.order || 0)));
      setEntityNavItems(navItems.filter(n => n.is_visible).sort((a, b) => (a.order || 0) - (b.order || 0)));
      setEntityPhotos(photos);

      const homepage = pages.find(p => p.is_homepage && p.is_published);
      if (homepage) {
        setSelectedPage(homepage);
      }
    } catch (error) {
      console.error("Error loading food truck:", error);
      navigate(createPageUrl("FoodTrucks"));
    }
    setLoading(false);
  };

  const reloadEntityData = async () => {
    try {
      const [pages, navItems, photos] = await Promise.all([
        EntityPage.filter({ entity_type: "FoodTruck", entity_id: truckId }).catch(() => []),
        EntityNavigationItem.filter({ entity_type: "FoodTruck", entity_id: truckId }).catch(() => []),
        EntityPhoto.filter({ entity_type: "FoodTruck", entity_id: truckId }).catch(() => [])
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

  const deleteTruck = async () => {
    if (!confirm("Are you sure you want to delete this food truck?")) {
      return;
    }

    try {
      await FoodTruckEntity.delete(truckId);
      navigate(createPageUrl("MyFoodTrucks"));
    } catch (error) {
      console.error("Error deleting truck:", error);
      alert("Failed to delete food truck");
    }
  };

  const getStopStatus = (stop) => {
    const now = new Date();
    const start = new Date(stop.start_datetime);
    const end = new Date(stop.end_datetime);

    if (now < start) return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    if (now > end) return { label: 'Ended', color: 'bg-gray-100 text-gray-800' };

    switch (stop.status) {
      case 'prepping': return { label: 'Prepping', color: 'bg-yellow-100 text-yellow-800' };
      case 'serving': return { label: 'Serving Now!', color: 'bg-green-100 text-green-800' };
      case 'sold_out': return { label: 'Sold Out', color: 'bg-red-100 text-red-800' };
      case 'closed': return { label: 'Closed', color: 'bg-gray-100 text-gray-800' };
      default: return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Truck className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  if (!truck) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Truck className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Food truck not found</h2>
        <Button onClick={() => navigate(createPageUrl("FoodTrucks"))}>
          Back to Food Trucks
        </Button>
      </div>
    </div>;
  }

  const isOwner = user && user.id === truck.created_by;

  // CMS Mode Views
  if (cmsMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-6xl mx-auto">
          <EntityCMS
            entityType="FoodTruck"
            entityId={truckId}
            entityName={truck.name}
            entitySlug={truck.slug}
            onBack={() => setCmsMode(null)}
            onEditPage={handleEditPage}
            onEditNav={handleEditNav}
            onViewEntity={() => setCmsMode(null)}
            accentColor="orange"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          <EntityPageEditor
            entityType="FoodTruck"
            entityId={truckId}
            entityName={truck.name}
            pageId={editingPageId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="orange"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-nav') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-3xl mx-auto">
          <EntityNavEditor
            entityType="FoodTruck"
            entityId={truckId}
            entityName={truck.name}
            itemId={editingNavId}
            parentId={editingNavParentId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="orange"
          />
        </div>
      </div>
    );
  }

  // Prepare photos for gallery
  const galleryPhotos = [
    ...(truck.logo_url ? [{ url: truck.logo_url, caption: 'Main Photo' }] : []),
    ...(truck.photos || []).map(p => typeof p === 'string' ? { url: p } : p),
    ...entityPhotos.map(p => ({ url: p.url, caption: p.caption }))
  ];

  const hasCustomPages = entityPages.length > 0;
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <>
      <MetaTags
        title={`${truck.name} - Food Truck in ${settings.county_name || 'Navarro'} County`}
        description={truck.description || `${truck.name} is a food truck serving ${truck.cuisine_types?.join(', ') || 'delicious food'} in ${settings.county_name || 'Navarro'} County.`}
      />
      <JsonLdSchema type="localBusiness" data={truck} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("FoodTrucks"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Food Trucks
          </Button>

          {/* Hero Image/Logo */}
          {truck.logo_url && (
            <Card className="border-2 border-orange-100 mb-6 overflow-hidden">
              <div className="h-80 bg-gray-200">
                <img
                  src={truck.logo_url}
                  alt={truck.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{truck.name}</h1>

              {truck.cuisine_types && truck.cuisine_types.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {truck.cuisine_types.map(cuisine => (
                    <Badge key={cuisine} variant="secondary">
                      {formatLabel(cuisine)}
                    </Badge>
                  ))}
                </div>
              )}

              {truck.rating_avg > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{truck.rating_avg.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">({truck.rating_count} ratings)</span>
                </div>
              )}

              {truck.base_town && (
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Based in {truck.base_town}
                </p>
              )}
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCmsMode('dashboard')}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Layout className="w-4 h-4 mr-2" />
                  Manage Website
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl(`EditFoodTruck?id=${truck.id}`))}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Info
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={deleteTruck}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Claim Page Banner */}
        <ClaimPageBanner
          entityType="Food Truck"
          entityId={truck.id}
          entityName={truck.name}
          ownerId={truck.owner_id}
          user={user}
        />

        {/* Photo Gallery */}
        {hasPhotos && (
          <Card className="border-2 border-orange-100 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntityPhotoGallery
                photos={galleryPhotos}
                entityName={truck.name}
                columns={4}
                showMainPhoto={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Mini-Website Custom Pages */}
        {(hasCustomPages || entityNavItems.length > 0) && (
          <Card className="border-2 border-orange-100 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 border-b border-orange-200 pb-3 mb-4">
                <Button
                  variant={activeTab === 'about' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => { setActiveTab('about'); setSelectedPage(null); }}
                  className={activeTab === 'about' ? 'bg-orange-500 hover:bg-orange-600' : ''}
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
                          className={selectedPage?.id === page.id ? 'bg-orange-500 hover:bg-orange-600' : ''}
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
                    className={selectedPage?.id === page.id ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  >
                    {page.title}
                  </Button>
                ))}
              </div>

              {activeTab === 'page' && selectedPage && (
                <EntityPageRenderer
                  sections={selectedPage.content?.sections || []}
                  entityName={truck.name}
                  accentColor="orange"
                />
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Upcoming Stops */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  Upcoming Stops
                </h2>

                {stops.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No upcoming stops scheduled</p>
                ) : (
                  <div className="space-y-4">
                    {stops.map(stop => {
                      const status = getStopStatus(stop);
                      const startDate = new Date(stop.start_datetime);
                      const endDate = new Date(stop.end_datetime);

                      return (
                        <Card
                          key={stop.id}
                          className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(createPageUrl(`TruckStopDetail?id=${stop.id}`))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <Badge className={status.color}>
                                {status.label}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {format(startDate, 'MMM d, yyyy')}
                              </span>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{stop.location_name}</h3>
                            {stop.address && (
                              <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {stop.address}
                              </p>
                            )}

                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                            </div>

                            {stop.specials_today && (
                              <p className="text-sm text-orange-600 mt-2 font-medium">
                                ⭐ {stop.specials_today}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {isOwner && (
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    onClick={() => navigate(createPageUrl("AddTruckStop"))}
                  >
                    Schedule New Stop
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Menu Highlights */}
            {truck.menu_highlights && truck.menu_highlights.length > 0 && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Menu Highlights</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {truck.menu_highlights.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Typical Hours */}
            {truck.typical_hours_note && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Typical Hours</h2>
                  <p className="text-gray-700">{truck.typical_hours_note}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact</h2>

                <div className="space-y-3">
                  {truck.phone && (
                    <a
                      href={`tel:${truck.phone}`}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                    >
                      <Phone className="w-4 h-4" />
                      {truck.phone}
                    </a>
                  )}

                  {truck.website && (
                    <a
                      href={truck.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}

                  {truck.preorder_url && (
                    <a
                      href={truck.preorder_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                        Order Ahead
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Features</h2>

                <div className="space-y-2">
                  {truck.dietary_flags && truck.dietary_flags.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Dietary Options:</h3>
                      <div className="flex flex-wrap gap-1">
                        {truck.dietary_flags.map(flag => (
                          <Badge key={flag} variant="outline" className="text-xs">
                            {formatLabel(flag)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {truck.payment_methods && truck.payment_methods.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Payment:
                      </h3>
                      <p className="text-sm text-gray-600">
                        {truck.payment_methods.join(', ')}
                      </p>
                    </div>
                  )}

                  {truck.family_friendly && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Family Friendly</span>
                    </div>
                  )}

                  {truck.accepts_preorders && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Accepts Pre-orders</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {truck.social_links && Object.keys(truck.social_links).length > 0 && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Follow Us</h2>
                  <div className="space-y-2">
                    {Object.entries(truck.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-orange-600 hover:text-orange-700 capitalize"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
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
