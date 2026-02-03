import React, { useState, useEffect } from "react";
import { Attraction, User, ClaimRequest, EntityPage, EntityNavigationItem, EntityPhoto } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Landmark, MapPin, Phone, Globe, Clock, ArrowLeft, Edit,
  Mail, Calendar, Heart, Camera, Ticket, Star, Info, History,
  ExternalLink, Share2, CheckCircle, Layout, Image as ImageIcon
} from "lucide-react";
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

// Categories that represent businesses (can be claimed by owners)
const CLAIMABLE_CATEGORIES = ['golf_course', 'museum', 'entertainment', 'cultural'];

// Categories that represent public landmarks (can be adopted by community members)
const ADOPTABLE_CATEGORIES = ['park', 'lake', 'recreation', 'historic_site', 'historic_marker', 'landmark', 'monument', 'architecture'];

export default function AttractionDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, attractionSlug } = useParams();
  const queryId = searchParams.get("id");
  const [attractionId, setAttractionId] = useState(queryId);
  const [attraction, setAttraction] = useState(null);
  const [user, setUser] = useState(null);
  const [adopter, setAdopter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
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
  }, [queryId, townSlug, attractionSlug]);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let attractionData = null;
      let resolvedId = queryId;

      // Try slug-based routing first
      if (townSlug && attractionSlug) {
        const attractions = await Attraction.filter({ slug: attractionSlug, town_slug: townSlug });
        if (attractions.length > 0) {
          attractionData = attractions[0];
          resolvedId = attractionData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        attractionData = await Attraction.get(queryId);
      }

      if (attractionData) {
        setAttraction(attractionData);
        setAttractionId(resolvedId);

        // Check if user has pending claim or adoption request
        if (userData) {
          const requests = await ClaimRequest.filter({
            entity_type: 'Attraction',
            entity_id: resolvedId,
            user_id: userData.id
          });
          if (requests.length > 0) {
            setRequestSubmitted(true);
          }
        }

        // Load mini-website data
        const [pages, navItems, photos] = await Promise.all([
          EntityPage.filter({ entity_type: "Attraction", entity_id: resolvedId }).catch(() => []),
          EntityNavigationItem.filter({ entity_type: "Attraction", entity_id: resolvedId }).catch(() => []),
          EntityPhoto.filter({ entity_type: "Attraction", entity_id: resolvedId }).catch(() => [])
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
      console.error("Error loading attraction:", error);
    }
    setLoading(false);
  };

  const reloadEntityData = async () => {
    try {
      const [pages, navItems, photos] = await Promise.all([
        EntityPage.filter({ entity_type: "Attraction", entity_id: attractionId }).catch(() => []),
        EntityNavigationItem.filter({ entity_type: "Attraction", entity_id: attractionId }).catch(() => []),
        EntityPhoto.filter({ entity_type: "Attraction", entity_id: attractionId }).catch(() => [])
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

  // Determine if this attraction is a claimable business or adoptable landmark
  const isClaimableBusiness = attraction && CLAIMABLE_CATEGORIES.includes(attraction.category);
  const isAdoptableLandmark = attraction && ADOPTABLE_CATEGORIES.includes(attraction.category);

  const handleClaimOrAdoptRequest = async () => {
    if (!user) {
      User.login();
      return;
    }

    setSubmittingRequest(true);
    try {
      const requestType = isClaimableBusiness ? 'claim' : 'adoption';
      const message = isClaimableBusiness
        ? `I am the owner/manager of ${attraction.name} and would like to claim this business page.`
        : `I would like to adopt and help maintain the page for ${attraction.name}.`;

      await ClaimRequest.create({
        entity_type: 'Attraction',
        entity_id: attractionId,
        entity_name: attraction.name,
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name || user.email,
        status: 'pending',
        request_type: requestType,
        message: message
      });
      setRequestSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
    setSubmittingRequest(false);
  };

  const categories = {
    park: "Park & Nature",
    lake: "Lake & Waterway",
    recreation: "Recreation Area",
    golf_course: "Golf Course",
    historic_site: "Historic Site",
    historic_marker: "Texas Historical Marker",
    museum: "Museum",
    landmark: "Landmark",
    monument: "Monument & Memorial",
    architecture: "Notable Architecture",
    entertainment: "Entertainment Venue",
    cultural: "Cultural Center",
    other: "Other"
  };

  const getCategoryColor = (category) => {
    const colors = {
      park: "bg-green-100 text-green-800",
      lake: "bg-cyan-100 text-cyan-800",
      recreation: "bg-teal-100 text-teal-800",
      golf_course: "bg-emerald-100 text-emerald-800",
      historic_site: "bg-amber-100 text-amber-800",
      historic_marker: "bg-red-100 text-red-800",
      museum: "bg-purple-100 text-purple-800",
      landmark: "bg-blue-100 text-blue-800",
      monument: "bg-slate-100 text-slate-800",
      architecture: "bg-indigo-100 text-indigo-800",
      entertainment: "bg-pink-100 text-pink-800",
      cultural: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
      <Landmark className="w-12 h-12 text-amber-600 animate-pulse" />
    </div>;
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Landmark className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Attraction not found</h2>
          <Button onClick={() => navigate(createPageUrl("Attractions"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attractions
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.id === attraction.adopted_by || user.id === attraction.created_by || user.role === 'admin');
  const isAdopted = !!attraction.adopted_by;

  // CMS Mode Views
  if (cmsMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <EntityCMS
            entityType="Attraction"
            entityId={attractionId}
            entityName={attraction.name}
            entitySlug={attraction.slug}
            onBack={() => setCmsMode(null)}
            onEditPage={handleEditPage}
            onEditNav={handleEditNav}
            onViewEntity={() => setCmsMode(null)}
            accentColor="amber"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto">
          <EntityPageEditor
            entityType="Attraction"
            entityId={attractionId}
            entityName={attraction.name}
            pageId={editingPageId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="amber"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-nav') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="max-w-3xl mx-auto">
          <EntityNavEditor
            entityType="Attraction"
            entityId={attractionId}
            entityName={attraction.name}
            itemId={editingNavId}
            parentId={editingNavParentId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="amber"
          />
        </div>
      </div>
    );
  }

  // Prepare photos for gallery
  const galleryPhotos = [
    ...(attraction.image_url ? [{ url: attraction.image_url, caption: 'Main Photo' }] : []),
    ...(attraction.photos || []).map(p => typeof p === 'string' ? { url: p } : p),
    ...entityPhotos.map(p => ({ url: p.url, caption: p.caption }))
  ];

  const hasCustomPages = entityPages.length > 0;
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <>
      <MetaTags
        title={`${attraction.name} - ${categories[attraction.category] || 'Attraction'} in ${settings.county_name || 'Navarro'} County`}
        description={attraction.description || `Visit ${attraction.name}, a ${categories[attraction.category] || 'local attraction'} in ${settings.county_name || 'Navarro'} County, Texas.`}
      />
      <JsonLdSchema type="tourist_attraction" data={attraction} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Attractions"))}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attractions
          </Button>

          {/* Claim This Business Banner (for venues, museums, golf courses, etc.) */}
          {!isAdopted && isClaimableBusiness && (
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Is This Your Business?</h3>
                      <p className="text-sm text-gray-600">
                        Claim this page to manage your business information, respond to inquiries, and keep details up-to-date.
                      </p>
                    </div>
                  </div>
                  {requestSubmitted ? (
                    <Badge className="bg-green-100 text-green-800 px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Claim Request Submitted
                    </Badge>
                  ) : (
                    <Button
                      onClick={handleClaimOrAdoptRequest}
                      disabled={submittingRequest}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {submittingRequest ? "Submitting..." : "Claim This Business"}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Business owners can claim their page for free to manage information and engage with customers.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Adopt This Landmark Banner (for parks, historic markers, etc.) */}
          {!isAdopted && isAdoptableLandmark && (
            <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Adopt This Landmark</h3>
                      <p className="text-sm text-gray-600">
                        Help preserve local history! Adopt this page to keep information accurate and up-to-date.
                      </p>
                    </div>
                  </div>
                  {requestSubmitted ? (
                    <Badge className="bg-green-100 text-green-800 px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Adoption Request Submitted
                    </Badge>
                  ) : (
                    <Button
                      onClick={handleClaimOrAdoptRequest}
                      disabled={submittingRequest}
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {submittingRequest ? "Submitting..." : "Adopt This Page"}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Like adopting a highway, page adopters help maintain and improve landmark information for our community.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Claimed/Adopted Badge */}
          {isAdopted && (
            <Card className={`border-2 mb-6 ${isClaimableBusiness ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className={`w-5 h-5 ${isClaimableBusiness ? 'text-blue-600' : 'text-green-600'}`} />
                  <span className={`font-medium ${isClaimableBusiness ? 'text-blue-800' : 'text-green-800'}`}>
                    {isClaimableBusiness
                      ? "This business page is verified and managed by the owner."
                      : "This landmark page is lovingly maintained by a community adopter."}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {/* Header Card */}
            <Card className="border-2 border-amber-100 overflow-hidden">
              {attraction.image_url && (
                <div className="h-64 md:h-80 bg-gray-200">
                  <img
                    src={attraction.image_url}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(attraction.category)}>
                        {categories[attraction.category] || attraction.category}
                      </Badge>
                      {attraction.is_free && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Free Admission
                        </Badge>
                      )}
                      {attraction.year_established && (
                        <Badge variant="secondary">
                          Est. {attraction.year_established}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{attraction.name}</h1>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCmsMode('dashboard')}
                        className="border-amber-200 text-amber-600 hover:bg-amber-50"
                      >
                        <Layout className="w-4 h-4 mr-2" />
                        Manage Website
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(createPageUrl(`EditAttraction?id=${attraction.id}`))}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Info
                      </Button>
                    </div>
                  )}
                </div>

                {attraction.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">{attraction.description}</p>
                )}

                {/* Contact & Location Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  {(attraction.address || attraction.town) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        {attraction.address && (
                          <p className="text-gray-600">{attraction.address}</p>
                        )}
                        <p className="text-gray-600">
                          {attraction.city || attraction.town}
                          {(attraction.city || attraction.town) && ', '}
                          {attraction.state || 'TX'}
                          {attraction.zip_code && ` ${attraction.zip_code}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {attraction.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a href={`tel:${attraction.phone}`} className="text-amber-600 hover:underline">
                          {attraction.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {attraction.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a
                          href={attraction.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:underline flex items-center gap-1"
                        >
                          Visit Website <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {attraction.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <SafeEmail email={attraction.email} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            {hasPhotos && (
              <Card className="border-2 border-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EntityPhotoGallery
                    photos={galleryPhotos}
                    entityName={attraction.name}
                    columns={3}
                    showMainPhoto={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Mini-Website Navigation Tabs */}
            {(hasCustomPages || entityNavItems.length > 0) && (
              <Card className="border-2 border-amber-100">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 border-b border-amber-200 pb-3 mb-4">
                    <Button
                      variant={activeTab === 'about' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => { setActiveTab('about'); setSelectedPage(null); }}
                      className={activeTab === 'about' ? 'bg-amber-500 hover:bg-amber-600' : ''}
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
                              className={selectedPage?.id === page.id ? 'bg-amber-500 hover:bg-amber-600' : ''}
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
                        className={selectedPage?.id === page.id ? 'bg-amber-500 hover:bg-amber-600' : ''}
                      >
                        {page.title}
                      </Button>
                    ))}
                  </div>

                  {/* Custom Page Content */}
                  {activeTab === 'page' && selectedPage && (
                    <EntityPageRenderer
                      sections={selectedPage.content?.sections || []}
                      entityName={attraction.name}
                      accentColor="amber"
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Hours & Admission */}
            {(attraction.hours || attraction.admission_info) && (
              <Card className="border-2 border-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Hours & Admission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {attraction.hours && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Hours of Operation</h4>
                        <p className="text-gray-600 whitespace-pre-line">{attraction.hours}</p>
                      </div>
                    )}
                    {attraction.admission_info && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Admission</h4>
                        <p className="text-gray-600 whitespace-pre-line">{attraction.admission_info}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History */}
            {attraction.history && (
              <Card className="border-2 border-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-600" />
                    History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{attraction.history}</p>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {attraction.lat && attraction.lng && (
              <Card className="border-2 border-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64 w-full">
                    <MapContainer
                      center={[attraction.lat, attraction.lng]}
                      zoom={15}
                      className="h-full w-full rounded-b-lg"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[attraction.lat, attraction.lng]}>
                        <Popup>
                          <div className="text-sm">
                            <h3 className="font-bold">{attraction.name}</h3>
                            <p className="text-xs text-gray-600">{attraction.address}</p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            {attraction.additional_info && (
              <Card className="border-2 border-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-600" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{attraction.additional_info}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
