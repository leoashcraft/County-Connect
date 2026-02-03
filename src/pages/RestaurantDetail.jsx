import React, { useState, useEffect } from "react";
import { Restaurant as RestaurantEntity, User, EntityPage, EntityNavigationItem, EntityPhoto } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, ArrowLeft, MapPin, Phone, Globe, Star, Clock, Edit, Trash2, DollarSign, Wine, Accessibility, Car, Baby, Dog, Wifi, CreditCard, AlertTriangle, Layout, Image as ImageIcon, Settings } from "lucide-react";
import ClaimPageBanner from "@/components/ClaimPageBanner";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import EntityPhotoGallery from "@/components/entity/EntityPhotoGallery";
import EntityPageRenderer from "@/components/entity/EntityPageRenderer";
import EntityCMS from "@/components/entity/EntityCMS";
import EntityPageEditor from "@/components/entity/EntityPageEditor";
import EntityNavEditor from "@/components/entity/EntityNavEditor";

// Format category labels (convert "gluten_free" to "Gluten-Free")
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
};

export default function RestaurantDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, restaurantSlug } = useParams();
  const queryId = searchParams.get('id');
  const [restaurantId, setRestaurantId] = useState(queryId);
  const { settings } = useSiteSettings();

  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mini-website state
  const [entityPages, setEntityPages] = useState([]);
  const [entityNavItems, setEntityNavItems] = useState([]);
  const [entityPhotos, setEntityPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedPage, setSelectedPage] = useState(null);

  // CMS editing state
  const [cmsMode, setCmsMode] = useState(null); // null, 'dashboard', 'edit-page', 'edit-nav'
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingNavId, setEditingNavId] = useState(null);
  const [editingNavParentId, setEditingNavParentId] = useState(null);

  useEffect(() => {
    if (queryId || (townSlug && restaurantSlug)) {
      loadRestaurant();
    } else {
      navigate(createPageUrl("Restaurants"));
    }
  }, [queryId, townSlug, restaurantSlug]);

  const loadRestaurant = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let restaurantData = null;
      let resolvedId = queryId;

      // Try slug-based routing first
      if (townSlug && restaurantSlug) {
        const restaurants = await RestaurantEntity.filter({ slug: restaurantSlug, town_slug: townSlug });
        if (restaurants.length > 0) {
          restaurantData = restaurants[0];
          resolvedId = restaurantData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        restaurantData = await RestaurantEntity.get(queryId);
      }

      if (restaurantData) {
        setRestaurant(restaurantData);
        setRestaurantId(resolvedId);

        // Load mini-website data
        const [pages, navItems, photos] = await Promise.all([
          EntityPage.filter({ entity_type: "Restaurant", entity_id: resolvedId }).catch(() => []),
          EntityNavigationItem.filter({ entity_type: "Restaurant", entity_id: resolvedId }).catch(() => []),
          EntityPhoto.filter({ entity_type: "Restaurant", entity_id: resolvedId }).catch(() => [])
        ]);

        setEntityPages(pages.filter(p => p.is_published).sort((a, b) => (a.order || 0) - (b.order || 0)));
        setEntityNavItems(navItems.filter(n => n.is_visible).sort((a, b) => (a.order || 0) - (b.order || 0)));
        setEntityPhotos(photos);

        // Set homepage as selected page if exists
        const homepage = pages.find(p => p.is_homepage && p.is_published);
        if (homepage) {
          setSelectedPage(homepage);
        }
      }
    } catch (error) {
      console.error("Error loading restaurant:", error);
      navigate(createPageUrl("Restaurants"));
    }
    setLoading(false);
  };

  const reloadEntityData = async () => {
    try {
      const [pages, navItems, photos] = await Promise.all([
        EntityPage.filter({ entity_type: "Restaurant", entity_id: restaurantId }).catch(() => []),
        EntityNavigationItem.filter({ entity_type: "Restaurant", entity_id: restaurantId }).catch(() => []),
        EntityPhoto.filter({ entity_type: "Restaurant", entity_id: restaurantId }).catch(() => [])
      ]);

      setEntityPages(pages.filter(p => p.is_published).sort((a, b) => (a.order || 0) - (b.order || 0)));
      setEntityNavItems(navItems.filter(n => n.is_visible).sort((a, b) => (a.order || 0) - (b.order || 0)));
      setEntityPhotos(photos);
    } catch (error) {
      console.error("Error reloading entity data:", error);
    }
  };

  // Handle CMS navigation
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

  const deleteRestaurant = async () => {
    if (!confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      await RestaurantEntity.delete(restaurantId);
      navigate(createPageUrl("MyRestaurants"));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Failed to delete restaurant");
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayLabel = (day) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return days[day] || day;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Utensils className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  if (!restaurant) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Utensils className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
        <Button onClick={() => navigate(createPageUrl("Restaurants"))}>
          Back to Restaurants
        </Button>
      </div>
    </div>;
  }

  const isOwner = user && (user.id === restaurant.owner_id || user.id === restaurant.created_by || user.role === 'admin');

  const cuisineText = restaurant.cuisine_types?.length > 0
    ? restaurant.cuisine_types.map(formatLabel).join(', ')
    : 'Restaurant';

  // CMS Mode Views
  if (cmsMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-6xl mx-auto">
          <EntityCMS
            entityType="Restaurant"
            entityId={restaurantId}
            entityName={restaurant.name}
            entitySlug={restaurant.slug}
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
            entityType="Restaurant"
            entityId={restaurantId}
            entityName={restaurant.name}
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
            entityType="Restaurant"
            entityId={restaurantId}
            entityName={restaurant.name}
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
    ...(restaurant.logo_url ? [{ url: restaurant.logo_url, caption: 'Main Photo' }] : []),
    ...(restaurant.photos || []).map(p => typeof p === 'string' ? { url: p } : p),
    ...entityPhotos.map(p => ({ url: p.url, caption: p.caption }))
  ];

  // Build navigation tabs from entity navigation items
  const hasCustomPages = entityPages.length > 0;
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <>
      <MetaTags
        title={`${restaurant.name} - ${cuisineText} in ${settings.county_name || 'Navarro'} County`}
        description={restaurant.description || `${restaurant.name} is a ${cuisineText.toLowerCase()} restaurant located at ${restaurant.address || settings.county_seat || 'Corsicana'}, TX. View menu, hours, and contact information.`}
        image={restaurant.logo_url}
      />
      <JsonLdSchema type="restaurant" data={restaurant} />
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Restaurants"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurants
          </Button>

          {/* Hero Image/Logo */}
          {restaurant.logo_url && (
            <Card className="border-2 border-orange-100 mb-6 overflow-hidden">
              <div className="h-80 bg-gray-200">
                <img
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>

              {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {restaurant.cuisine_types.map(cuisine => (
                    <Badge key={cuisine} variant="secondary">
                      {formatLabel(cuisine)}
                    </Badge>
                  ))}
                </div>
              )}

              {restaurant.rating_avg > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{restaurant.rating_avg.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">({restaurant.rating_count} ratings)</span>
                </div>
              )}

              {restaurant.address && (
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {restaurant.address}
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
                  onClick={() => navigate(createPageUrl(`EditRestaurant?id=${restaurant.id}`))}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Info
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={deleteRestaurant}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Business Status Banner */}
        {restaurant.business_status && restaurant.business_status !== 'open' && (
          <Card className={`border-2 mb-6 ${restaurant.business_status === 'permanently_closed' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-6 h-6 ${restaurant.business_status === 'permanently_closed' ? 'text-red-600' : 'text-yellow-600'}`} />
                <div>
                  <h3 className={`font-bold ${restaurant.business_status === 'permanently_closed' ? 'text-red-800' : 'text-yellow-800'}`}>
                    {restaurant.business_status === 'permanently_closed' ? 'Permanently Closed' : 'Temporarily Closed'}
                  </h3>
                  {restaurant.closure_note && (
                    <p className="text-sm text-gray-600 mt-1">{restaurant.closure_note}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Claim Page Banner */}
        <ClaimPageBanner
          entityType="Restaurant"
          entityId={restaurant.id}
          entityName={restaurant.name}
          ownerId={restaurant.owner_id}
          user={user}
        />

        {/* Photo Gallery */}
        {hasPhotos && (
          <Card className="border-2 border-orange-100 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                Photos
              </h2>
              <EntityPhotoGallery
                photos={galleryPhotos}
                entityName={restaurant.name}
                columns={4}
                showMainPhoto={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Mini-Website Navigation Tabs */}
        {(hasCustomPages || entityNavItems.length > 0) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-orange-200 pb-2">
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
          </div>
        )}

        {/* Custom Page Content */}
        {activeTab === 'page' && selectedPage && (
          <Card className="border-2 border-orange-100 mb-6">
            <CardContent className="p-6">
              <EntityPageRenderer
                sections={selectedPage.content?.sections || []}
                entityName={restaurant.name}
                accentColor="orange"
              />
            </CardContent>
          </Card>
        )}

        {/* Default About Content */}
        {activeTab === 'about' && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Operating Hours */}
            {(restaurant.operating_hours && restaurant.operating_hours.length > 0) || restaurant.hours ? (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-orange-600" />
                    Hours of Operation
                  </h2>

                  {restaurant.operating_hours && restaurant.operating_hours.length > 0 ? (
                    <div className="space-y-2">
                      <table className="w-full">
                        <tbody>
                          {restaurant.operating_hours.map((hours) => (
                            <tr key={hours.day} className="border-b border-gray-200 last:border-0">
                              <td className="py-2 font-semibold capitalize w-32">
                                {getDayLabel(hours.day)}
                              </td>
                              <td className="py-2">
                                {hours.is_closed ? (
                                  <span className="text-gray-500">Closed</span>
                                ) : (
                                  <span>
                                    {formatTime(hours.open_time)} - {formatTime(hours.close_time)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : restaurant.hours ? (
                    <p className="text-gray-700">{restaurant.hours}</p>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {/* Full Menu */}
            {restaurant.menu_sections && restaurant.menu_sections.length > 0 && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Menu</h2>

                  <div className="space-y-6">
                    {restaurant.menu_sections.map((section) => (
                      <div key={section.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <h3 className="text-xl font-bold mb-1">{section.name}</h3>
                        {section.description && (
                          <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                        )}

                        <div className="space-y-3">
                          {section.items && section.items.map((item) => (
                            <div key={item.id} className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold">{item.name}</h4>
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    )}
                                  </div>
                                  <span className="font-semibold text-orange-600 ml-4">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                {item.dietary_flags && item.dietary_flags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.dietary_flags.map(flag => (
                                      <Badge key={flag} variant="outline" className="text-xs">
                                        {formatLabel(flag)}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Menu Highlights (fallback if no full menu) */}
            {(!restaurant.menu_sections || restaurant.menu_sections.length === 0) &&
             restaurant.menu_highlights && restaurant.menu_highlights.length > 0 && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Menu Highlights</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {restaurant.menu_highlights.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
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
                  {restaurant.phone && (
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                    >
                      <Phone className="w-4 h-4" />
                      {restaurant.phone}
                    </a>
                  )}

                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}

                  {restaurant.reservation_url && (
                    <a
                      href={restaurant.reservation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                        Make a Reservation
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
                  {restaurant.dietary_flags && restaurant.dietary_flags.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Dietary Options:</h3>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.dietary_flags.map(flag => (
                          <Badge key={flag} variant="outline" className="text-xs">
                            {formatLabel(flag)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {restaurant.payment_methods && restaurant.payment_methods.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Payment:
                      </h3>
                      <p className="text-sm text-gray-600">
                        {restaurant.payment_methods.map(formatLabel).join(', ')}
                      </p>
                    </div>
                  )}

                  {restaurant.seating_capacity && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">Seating Capacity:</span>
                      <span>{restaurant.seating_capacity}</span>
                    </div>
                  )}

                  {restaurant.parking_available && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Parking Available</span>
                    </div>
                  )}

                  {restaurant.delivery_available && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Delivery Available</span>
                    </div>
                  )}

                  {restaurant.takeout_available && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Takeout Available</span>
                    </div>
                  )}

                  {restaurant.accepts_reservations && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Accepts Reservations</span>
                    </div>
                  )}

                  {restaurant.family_friendly && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Family Friendly</span>
                    </div>
                  )}

                  {restaurant.outdoor_seating && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Outdoor Seating</span>
                    </div>
                  )}

                  {restaurant.serves_alcohol && (
                    <div className="flex items-center gap-2 text-sm">
                      <Wine className="w-4 h-4 text-purple-600" />
                      <span>
                        {restaurant.serves_alcohol === 'full_bar' ? 'Full Bar' :
                         restaurant.serves_alcohol === 'beer_wine' ? 'Beer & Wine Only' :
                         restaurant.serves_alcohol === 'byob' ? 'BYOB' : 'Serves Alcohol'}
                      </span>
                    </div>
                  )}

                  {restaurant.wheelchair_accessible && (
                    <div className="flex items-center gap-2 text-sm">
                      <Accessibility className="w-4 h-4 text-blue-600" />
                      <span>Wheelchair Accessible</span>
                    </div>
                  )}

                  {restaurant.restroom_accessible && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Accessible Restroom</span>
                    </div>
                  )}

                  {restaurant.free_wifi && (
                    <div className="flex items-center gap-2 text-sm">
                      <Wifi className="w-4 h-4 text-blue-500" />
                      <span>Free WiFi</span>
                    </div>
                  )}

                  {restaurant.pet_friendly && (
                    <div className="flex items-center gap-2 text-sm">
                      <Dog className="w-4 h-4 text-amber-600" />
                      <span>Pet Friendly</span>
                    </div>
                  )}

                  {restaurant.high_chairs_available && (
                    <div className="flex items-center gap-2 text-sm">
                      <Baby className="w-4 h-4 text-pink-500" />
                      <span>High Chairs Available</span>
                    </div>
                  )}

                  {restaurant.accepts_credit_cards !== false && (
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span>Accepts Credit Cards</span>
                    </div>
                  )}

                  {restaurant.drive_thru && (
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-gray-600" />
                      <span>Drive-Thru</span>
                    </div>
                  )}

                  {restaurant.curbside_pickup && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Curbside Pickup</span>
                    </div>
                  )}

                  {restaurant.dine_in && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Dine-In Available</span>
                    </div>
                  )}

                  {restaurant.live_music && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Live Music</span>
                    </div>
                  )}

                  {restaurant.happy_hour && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Happy Hour</span>
                    </div>
                  )}

                  {restaurant.private_dining && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Private Dining Available</span>
                    </div>
                  )}

                  {restaurant.catering && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>Catering Services</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {restaurant.social_links && Object.keys(restaurant.social_links).length > 0 && (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Follow Us</h2>
                  <div className="space-y-2">
                    {Object.entries(restaurant.social_links).map(([platform, url]) => (
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
        )}
      </div>
    </div>
    </>
  );
}
