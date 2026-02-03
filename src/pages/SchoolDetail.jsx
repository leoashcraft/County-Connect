import React, { useState, useEffect } from "react";
import { School, User, EntityPage, EntityNavigationItem, EntityPhoto } from "@/api/entities";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, MapPin, Phone, Globe, ArrowLeft, Edit,
  Mail, Users, Calendar, Clock, Facebook, Twitter, Award, Layout, Image as ImageIcon
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ClaimPageBanner from "@/components/ClaimPageBanner";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";
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

export default function SchoolDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { townSlug, schoolSlug } = useParams();
  const queryId = searchParams.get("id");
  const [schoolId, setSchoolId] = useState(queryId);
  const { settings } = useSiteSettings();
  const [school, setSchool] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [queryId, townSlug, schoolSlug]);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      let schoolData = null;
      let resolvedId = queryId;

      // Try slug-based routing first
      if (townSlug && schoolSlug) {
        const schools = await School.filter({ slug: schoolSlug, town_slug: townSlug });
        if (schools.length > 0) {
          schoolData = schools[0];
          resolvedId = schoolData.id;
        }
      }
      // Fall back to ID-based routing
      else if (queryId) {
        schoolData = await School.get(queryId);
      }

      if (schoolData) {
        setSchool(schoolData);
        setSchoolId(resolvedId);

        // Load mini-website data
        const [pages, navItems, photos] = await Promise.all([
          EntityPage.filter({ entity_type: "School", entity_id: resolvedId }).catch(() => []),
          EntityNavigationItem.filter({ entity_type: "School", entity_id: resolvedId }).catch(() => []),
          EntityPhoto.filter({ entity_type: "School", entity_id: resolvedId }).catch(() => [])
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
      console.error("Error loading school:", error);
    }
    setLoading(false);
  };

  const reloadEntityData = async () => {
    try {
      const [pages, navItems, photos] = await Promise.all([
        EntityPage.filter({ entity_type: "School", entity_id: schoolId }).catch(() => []),
        EntityNavigationItem.filter({ entity_type: "School", entity_id: schoolId }).catch(() => []),
        EntityPhoto.filter({ entity_type: "School", entity_id: schoolId }).catch(() => [])
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

  const schoolTypes = {
    daycare: "Daycare / Childcare",
    pre_k: "Pre-K / Preschool",
    elementary: "Elementary School",
    middle: "Middle School",
    high: "High School",
    college: "College / University",
    charter: "Charter School",
    private: "Private School",
    alternative: "Alternative School",
    vocational: "Vocational / Trade School"
  };

  const getTypeColor = (type) => {
    const colors = {
      daycare: "bg-rose-100 text-rose-800",
      pre_k: "bg-pink-100 text-pink-800",
      elementary: "bg-green-100 text-green-800",
      middle: "bg-blue-100 text-blue-800",
      high: "bg-purple-100 text-purple-800",
      college: "bg-orange-100 text-orange-800",
      charter: "bg-teal-100 text-teal-800",
      private: "bg-indigo-100 text-indigo-800",
      alternative: "bg-yellow-100 text-yellow-800",
      vocational: "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <GraduationCap className="w-12 h-12 text-blue-600 animate-pulse" />
    </div>;
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <GraduationCap className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">School not found</h2>
          <Button onClick={() => navigate(createPageUrl("Schools"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.id === school.owner_id || user.id === school.created_by || user.role === 'admin');

  // CMS Mode Views
  if (cmsMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="max-w-6xl mx-auto">
          <EntityCMS
            entityType="School"
            entityId={schoolId}
            entityName={school.name}
            entitySlug={school.slug}
            onBack={() => setCmsMode(null)}
            onEditPage={handleEditPage}
            onEditNav={handleEditNav}
            onViewEntity={() => setCmsMode(null)}
            accentColor="blue"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          <EntityPageEditor
            entityType="School"
            entityId={schoolId}
            entityName={school.name}
            pageId={editingPageId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="blue"
          />
        </div>
      </div>
    );
  }

  if (cmsMode === 'edit-nav') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="max-w-3xl mx-auto">
          <EntityNavEditor
            entityType="School"
            entityId={schoolId}
            entityName={school.name}
            itemId={editingNavId}
            parentId={editingNavParentId}
            onSave={handleCmsSave}
            onCancel={handleCmsCancel}
            accentColor="blue"
          />
        </div>
      </div>
    );
  }

  // Prepare photos for gallery
  const galleryPhotos = [
    ...(school.image_url ? [{ url: school.image_url, caption: 'Main Photo' }] : []),
    ...(school.photos || []).map(p => typeof p === 'string' ? { url: p } : p),
    ...entityPhotos.map(p => ({ url: p.url, caption: p.caption }))
  ];

  const hasCustomPages = entityPages.length > 0;
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <>
      <MetaTags
        title={`${school.name} - School in ${settings.county_name || 'Navarro'} County`}
        description={school.description || `Learn about ${school.name}, a ${school.school_type || 'school'} in ${settings.county_name || 'Navarro'} County, TX.`}
      />
      <JsonLdSchema type="localBusiness" data={school} />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Schools"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schools
        </Button>

        <ClaimPageBanner
          entityType="School"
          entityId={school.id}
          entityName={school.name}
          ownerId={school.owner_id}
          user={user}
        />

        <div className="grid gap-6">
          {/* Header Card */}
          <Card className="border-2 border-blue-100 overflow-hidden">
            {school.image_url && (
              <div className="h-64 bg-gray-200">
                <img
                  src={school.image_url}
                  alt={school.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {(school.school_types || [school.school_type]).filter(Boolean).map(type => (
                      <Badge key={type} className={getTypeColor(type)}>
                        {schoolTypes[type] || type}
                      </Badge>
                    ))}
                    {school.mascot && (
                      <Badge variant="secondary">
                        {school.mascot}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
                  {school.district && (
                    <p className="text-lg text-gray-600 mt-1">{school.district}</p>
                  )}
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCmsMode('dashboard')}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Layout className="w-4 h-4 mr-2" />
                      Manage Website
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(createPageUrl(`EditSchool?id=${school.id}`))}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Info
                    </Button>
                  </div>
                )}
              </div>

              {school.description && (
                <p className="text-gray-600 mb-6">{school.description}</p>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                {school.enrollment && (
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-500">Enrollment</p>
                    <p className="text-lg font-bold text-blue-700">{school.enrollment.toLocaleString()}</p>
                  </div>
                )}
                {school.grades_served && (
                  <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-500">Grades</p>
                    <p className="text-lg font-semibold">{school.grades_served}</p>
                  </div>
                )}
                {school.founded_year && (
                  <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-500">Founded</p>
                    <p className="text-lg font-semibold">{school.founded_year}</p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                {school.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">{school.address}</p>
                    </div>
                  </div>
                )}
                {school.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${school.phone}`} className="text-blue-600 hover:underline">
                        {school.phone}
                      </a>
                    </div>
                  </div>
                )}
                {school.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <SafeEmail email={school.email} className="text-blue-600" />
                    </div>
                  </div>
                )}
                {school.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(school.facebook_url || school.twitter_url) && (
                <div className="flex gap-3 mt-4 pt-4 border-t">
                  {school.facebook_url && (
                    <a
                      href={school.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {school.twitter_url && (
                    <a
                      href={school.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sky-600 hover:underline"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter/X
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          {hasPhotos && (
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EntityPhotoGallery
                  photos={galleryPhotos}
                  entityName={school.name}
                  columns={3}
                  showMainPhoto={false}
                />
              </CardContent>
            </Card>
          )}

          {/* Mini-Website Custom Pages */}
          {(hasCustomPages || entityNavItems.length > 0) && (
            <Card className="border-2 border-blue-100">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 border-b border-blue-200 pb-3 mb-4">
                  <Button
                    variant={activeTab === 'about' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => { setActiveTab('about'); setSelectedPage(null); }}
                    className={activeTab === 'about' ? 'bg-blue-500 hover:bg-blue-600' : ''}
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
                            className={selectedPage?.id === page.id ? 'bg-blue-500 hover:bg-blue-600' : ''}
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
                      className={selectedPage?.id === page.id ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    >
                      {page.title}
                    </Button>
                  ))}
                </div>

                {activeTab === 'page' && selectedPage && (
                  <EntityPageRenderer
                    sections={selectedPage.content?.sections || []}
                    entityName={school.name}
                    accentColor="blue"
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Principal / Leadership */}
          {(school.principal || school.superintendent) && (
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Leadership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {school.principal && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-500">Principal</p>
                      <p className="font-medium">{school.principal}</p>
                    </div>
                  )}
                  {school.superintendent && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Superintendent</p>
                      <p className="font-medium">{school.superintendent}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Programs */}
          {school.programs && school.programs.length > 0 && (
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Programs & Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {school.programs.map((program, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                      {program}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* School Hours */}
          {school.school_hours && (
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  School Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{school.school_hours}</p>
              </CardContent>
            </Card>
          )}

          {/* Map */}
          {school.lat && school.lng && (
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full">
                  <MapContainer
                    center={[school.lat, school.lng]}
                    zoom={15}
                    className="h-full w-full rounded-b-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[school.lat, school.lng]}>
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-bold">{school.name}</h3>
                          <p className="text-xs text-gray-600">{school.address}</p>
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
