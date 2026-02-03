import React, { useState, useEffect } from "react";
import { RealtyListing, User, ClaimRequest, EntityPage, EntityNavigationItem, EntityPhoto } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home, MapPin, Phone, Mail, ArrowLeft, Edit, Bed, Bath, Square,
  Calendar, DollarSign, Building, Car, Trees, CheckCircle, Layout, Image as ImageIcon
} from "lucide-react";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import MetaTags from "@/components/seo/MetaTags";
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

export default function RealtyDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, listingSlug } = useParams();
  const queryId = searchParams.get("id");
  const [listingId, setListingId] = useState(queryId);
  const [listing, setListing] = useState(null);
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
    loadData();
  }, [queryId, townSlug, listingSlug]);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let listingData = null;
      let resolvedId = queryId;

      // Try slug-based routing first
      if (townSlug && listingSlug) {
        const listings = await RealtyListing.filter({ slug: listingSlug, town_slug: townSlug });
        if (listings.length > 0) {
          listingData = listings[0];
          resolvedId = listingData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        listingData = await RealtyListing.get(queryId);
      }

      if (listingData) {
        setListing(listingData);
        setListingId(resolvedId);

        // Load mini-website data
        const [pages, navItems, photos] = await Promise.all([
          EntityPage.filter({ entity_type: "RealtyListing", entity_id: resolvedId }).catch(() => []),
          EntityNavigationItem.filter({ entity_type: "RealtyListing", entity_id: resolvedId }).catch(() => []),
          EntityPhoto.filter({ entity_type: "RealtyListing", entity_id: resolvedId }).catch(() => [])
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
      console.error("Error loading listing:", error);
    }
    setLoading(false);
  };

  const reloadEntityData = async () => {
    try {
      const [pages, navItems, photos] = await Promise.all([
        EntityPage.filter({ entity_type: "RealtyListing", entity_id: listingId }).catch(() => []),
        EntityNavigationItem.filter({ entity_type: "RealtyListing", entity_id: listingId }).catch(() => []),
        EntityPhoto.filter({ entity_type: "RealtyListing", entity_id: listingId }).catch(() => [])
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

  const formatPrice = (price, listingType) => {
    if (!price) return "Contact for price";
    if (listingType === "rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getTypeColor = (type) => {
    const colors = {
      sale: "bg-green-100 text-green-800",
      rent: "bg-blue-100 text-blue-800",
      land: "bg-amber-100 text-amber-800",
      commercial: "bg-purple-100 text-purple-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type) => {
    const labels = {
      sale: "For Sale",
      rent: "For Rent",
      land: "Land",
      commercial: "Commercial"
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <Home className="w-12 h-12 text-green-600 animate-pulse" />
    </div>;
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Home className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <Button onClick={() => navigate(createPageUrl("Realty"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.id === listing.created_by || user.role === 'admin');

  // CMS Mode Views
  if (cmsMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-6xl mx-auto">
          <EntityCMS
            entityType="RealtyListing"
            entityId={listingId}
            entityName={listing.title}
            entitySlug={listing.slug}
            onBack={() => setCmsMode(null)}
            onEditPage={handleEditPage}
            onEditNav={handleEditNav}
            onViewEntity={() => setCmsMode(null)}
            accentColor="green"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto">
          <EntityPageEditor
            entityType="RealtyListing"
            entityId={listingId}
            entityName={listing.title}
            pageId={editingPageId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="green"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-nav') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-3xl mx-auto">
          <EntityNavEditor
            entityType="RealtyListing"
            entityId={listingId}
            entityName={listing.title}
            itemId={editingNavId}
            parentId={editingNavParentId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="green"
          />
        </div>
      </div>
    );
  }

  // Prepare photos for gallery
  const galleryPhotos = [
    ...(listing.image_url ? [{ url: listing.image_url, caption: 'Main Photo' }] : []),
    ...(listing.photos || []).map(p => typeof p === 'string' ? { url: p } : p),
    ...entityPhotos.map(p => ({ url: p.url, caption: p.caption }))
  ];

  const hasCustomPages = entityPages.length > 0;
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <>
      <MetaTags
        title={`${listing.title} - ${getTypeLabel(listing.listing_type)} in ${listing.town || settings.county_name || 'Navarro'} County`}
        description={listing.description || `${getTypeLabel(listing.listing_type)}: ${listing.title} in ${listing.town || 'Navarro County'}. ${listing.bedrooms ? listing.bedrooms + ' bedrooms, ' : ''}${listing.bathrooms ? listing.bathrooms + ' bathrooms' : ''}`}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Realty"))}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>

          <div className="grid gap-6">
            {/* Header Card */}
            <Card className="border-2 border-green-100 overflow-hidden">
              {listing.image_url && (
                <div className="h-64 md:h-96 bg-gray-200">
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(listing.listing_type)}>
                        {getTypeLabel(listing.listing_type)}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {formatPrice(listing.price, listing.listing_type)}
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCmsMode('dashboard')}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Layout className="w-4 h-4 mr-2" />
                        Manage Website
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(createPageUrl(`EditRealtyListing?id=${listing.id}`))}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Info
                      </Button>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="flex flex-wrap items-center gap-6 mb-4 text-gray-600">
                  {listing.bedrooms && (
                    <span className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-green-600" />
                      {listing.bedrooms} Bedrooms
                    </span>
                  )}
                  {listing.bathrooms && (
                    <span className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-green-600" />
                      {listing.bathrooms} Bathrooms
                    </span>
                  )}
                  {listing.square_feet && (
                    <span className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-green-600" />
                      {listing.square_feet.toLocaleString()} sqft
                    </span>
                  )}
                  {listing.lot_size && (
                    <span className="flex items-center gap-2">
                      <Trees className="w-5 h-5 text-green-600" />
                      {listing.lot_size} acres
                    </span>
                  )}
                  {listing.year_built && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Built {listing.year_built}
                    </span>
                  )}
                  {listing.garage && (
                    <span className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-green-600" />
                      {listing.garage} Car Garage
                    </span>
                  )}
                </div>

                {(listing.address || listing.city || listing.town) && (
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      {listing.address && (
                        <p className="text-gray-600">{listing.address}</p>
                      )}
                      <p className="text-gray-600">
                        {listing.city || listing.town}
                        {(listing.city || listing.town) && ', '}
                        {listing.state || 'TX'}
                        {listing.zip_code && ` ${listing.zip_code}`}
                      </p>
                    </div>
                  </div>
                )}

                {listing.description && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            {hasPhotos && (
              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EntityPhotoGallery
                    photos={galleryPhotos}
                    entityName={listing.title}
                    columns={3}
                    showMainPhoto={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Mini-Website Custom Pages */}
            {(hasCustomPages || entityNavItems.length > 0) && (
              <Card className="border-2 border-green-100">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 border-b border-green-200 pb-3 mb-4">
                    <Button
                      variant={activeTab === 'about' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => { setActiveTab('about'); setSelectedPage(null); }}
                      className={activeTab === 'about' ? 'bg-green-500 hover:bg-green-600' : ''}
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
                              className={selectedPage?.id === page.id ? 'bg-green-500 hover:bg-green-600' : ''}
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
                        className={selectedPage?.id === page.id ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {page.title}
                      </Button>
                    ))}
                  </div>

                  {activeTab === 'page' && selectedPage && (
                    <EntityPageRenderer
                      sections={selectedPage.content?.sections || []}
                      entityName={listing.title}
                      accentColor="green"
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Features & Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            {(listing.contact_name || listing.contact_phone || listing.contact_email) && (
              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {listing.contact_name && (
                      <div>
                        <p className="font-medium text-gray-900">Listed By</p>
                        <p className="text-gray-600">{listing.contact_name}</p>
                      </div>
                    )}
                    {listing.contact_phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <a href={`tel:${listing.contact_phone}`} className="text-green-600 hover:underline">
                            {listing.contact_phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {listing.contact_email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <SafeEmail email={listing.contact_email} />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {listing.lat && listing.lng && (
              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64 w-full">
                    <MapContainer
                      center={[listing.lat, listing.lng]}
                      zoom={15}
                      className="h-full w-full rounded-b-lg"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[listing.lat, listing.lng]}>
                        <Popup>
                          <div className="text-sm">
                            <h3 className="font-bold">{listing.title}</h3>
                            <p className="text-xs text-gray-600">{listing.address}</p>
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
