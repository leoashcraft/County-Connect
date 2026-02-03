
import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Store as StoreEntity, Product, Service, Follow, StorePage, StoreNavigationItem } from "@/api/entities";
import { User } from "@/api/entities";
import { useParams, useNavigate } from "react-router-dom"; // Added useParams, removed useLocation
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store as StoreIcon,
  MapPin,
  Phone,
  Mail,
  Package,
  Briefcase,
  Heart,
  MessageSquare,
  ArrowLeft,
  Loader2,
  ChevronDown
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { createStoreUrl, createProductUrl, createServiceUrl } from "@/components/utils/slugUtils";

export default function Store() {
  const navigate = useNavigate();
  
  // Use useParams to extract URL parameters
  // Assuming the route definition is something like /Store/:storeSlug/:content?
  const { storeSlug: paramStoreSlug, content: contentParam } = useParams();

  // Determine the actual storeSlug, pageSlug, and view variables
  const storeSlug = paramStoreSlug;
  const isViewType = contentParam === 'Products' || contentParam === 'Services';
  const view = isViewType ? contentParam : null;
  const pageSlug = isViewType ? null : contentParam; // If it's not a view type, it's a page slug (or undefined for homepage)

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homepage, setHomepage] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [navigationItems, setNavigationItems] = useState([]);
  const [showDefaultView, setShowDefaultView] = useState(false);
  const [allStorePages, setAllStorePages] = useState([]); // Store all pages for slug lookup

  // useEffect to load store data when route parameters change
  useEffect(() => {
    // Reset states for a new store/page view to prevent old data flickering
    setStore(null);
    setProducts([]);
    setServices([]);
    setIsFollowing(false);
    setFollowId(null);
    setLoading(true); // Set loading true at the start of every data load cycle
    setError(null);
    setHomepage(null);
    setCurrentPage(null);
    setNavigationItems([]);
    setShowDefaultView(false);

    if (storeSlug) {
      console.log('Store component re-evaluating for params:', { storeSlug, pageSlug, view });
      loadStoreData();
    } else {
      setError("Store URL is invalid or missing a slug.");
      setLoading(false);
    }
  }, [storeSlug, pageSlug, view]); // Depend on these derived variables from useParams

  const loadStoreData = async () => {
    try {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (err) {
        console.log("User not authenticated or session expired.");
      }

      console.log('Fetching stores...');
      const stores = await StoreEntity.list();
      console.log('All stores fetched. Looking for slug:', storeSlug);
      
      const storeData = stores.find(s => s.slug === storeSlug);
      
      if (!storeData) {
        setError("Store not found");
        setLoading(false);
        return;
      }
      
      setStore(storeData);

      // Fetch follow status only if user is logged in
      if (user && storeData.id) {
        const follows = await Follow.filter({ follower_email: user.email, following_store_id: storeData.id });
        if (follows.length > 0) {
          setIsFollowing(true);
          setFollowId(follows[0].id);
        } else {
          setIsFollowing(false);
          setFollowId(null);
        }
      }

      const [allProducts, allServices] = await Promise.all([
        Product.filter({ store_id: storeData.id, status: "active" }, "-created_date"),
        Service.filter({ store_id: storeData.id, is_available: true })
      ]);

      console.log(`Found ${allProducts.length} products and ${allServices.length} services for store ${storeSlug}.`);

      setProducts(allProducts);
      setServices(allServices);

      const [pages, navItems] = await Promise.all([
        StorePage.filter({ store_id: storeData.id, is_published: true }),
        StoreNavigationItem.filter({ store_id: storeData.id }, "order")
      ]);

      setAllStorePages(pages); // Store pages for slug lookup

      const completeNavigation = [...navItems];
      
      const hasProductsNav = navItems.some(item => item.link_type === 'products');
      if (!hasProductsNav && allProducts.length > 0) {
        completeNavigation.push({
          id: 'auto-products',
          store_id: storeData.id,
          label: 'Products',
          link_type: 'products',
          order: 9998,
          is_visible: true,
          _isAutoGenerated: true
        });
      }

      const hasServicesNav = navItems.some(item => item.link_type === 'services');
      if (!hasServicesNav && allServices.length > 0) {
        completeNavigation.push({
          id: 'auto-services',
          store_id: storeData.id,
          label: 'Services',
          link_type: 'services',
          order: 9999,
          is_visible: true,
          _isAutoGenerated: true
        });
      }

      completeNavigation.sort((a, b) => a.order - b.order);
      setNavigationItems(completeNavigation.filter(item => item.is_visible));

      const homepageData = pages.find(p => p.is_homepage);
      setHomepage(homepageData);

      console.log('Page navigation debug:', {
        pageSlug,
        availablePages: pages.map(p => ({ id: p.id, title: p.title, slug: p.slug, is_homepage: p.is_homepage }))
      });

      if (pageSlug) {
        const requestedPage = pages.find(p => p.slug === pageSlug);
        console.log('Requested page by slug:', pageSlug, 'Found:', requestedPage);
        setCurrentPage(requestedPage);
        setShowDefaultView(false);
        if (!requestedPage) {
          setError(`Page "${pageSlug}" not found for this store.`);
        }
      } else if (view === 'Products' || view === 'Services') {
        setCurrentPage(null); // Not viewing a custom page
        setShowDefaultView(false);
      } else if (homepageData) {
        setCurrentPage(homepageData);
        setShowDefaultView(false);
      } else {
        // If no page slug, no view, and no homepage is defined, show default products/services
        setCurrentPage(null);
        setShowDefaultView(true);
      }

      console.log('Store data loaded successfully for:', storeSlug);
      setLoading(false);
    } catch (err) {
      console.error("Error loading store:", err);
      setError(err.message || "Failed to load store data.");
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      await User.login();
      // Re-evaluate current user after login
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (err) {
        console.error("Failed to re-fetch user data after login:", err);
        return; // Exit if user data still not available
      }
      if (!user) return; // If login was unsuccessful or user is still null
    }

    try {
      if (isFollowing && followId) {
        await Follow.delete(followId);
        setIsFollowing(false);
        setFollowId(null);
      } else {
        const newFollow = await Follow.create({
          follower_email: user.email,
          following_store_id: store.id
        });
        setIsFollowing(true);
        setFollowId(newFollow.id);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      // Potentially show a user-friendly error message
    }
  };

  const handleContactStore = () => {
    if (!user) {
      User.login();
      return;
    }
    navigate(createPageUrl(`Messages?to=${store.created_by}`));
  };

  const getPageSlug = (pageId) => {
    const page = allStorePages.find(p => p.id === pageId);
    return page?.slug || pageId;
  };

  const renderPageContent = (page) => {
    console.log('Rendering page content for:', page);

    if (!page) {
      console.log('No page provided');
      return <div className="text-center py-12 text-gray-500">No content available for this page.</div>;
    }

    if (!page.content) {
      console.log('Page has no content property');
      return <div className="text-center py-12 text-gray-500">No content available for this page.</div>;
    }

    if (!page.content.sections) {
      console.log('Page content has no sections property');
      return <div className="text-center py-12 text-gray-500">No content available for this page.</div>;
    }

    if (page.content.sections.length === 0) {
      console.log('Page has empty sections array');
      return <div className="text-center py-12 text-gray-500">This page has no content yet. Add content in the page editor.</div>;
    }

    console.log('Rendering sections:', page.content.sections);

    return (
      <div className="space-y-8">
        {page.content.sections.map((section, index) => {
          console.log('Rendering section:', section.type, section);
          return (
          <div key={section.id || index}>
            {section.type === 'hero' && (
              <div className="relative h-96 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl overflow-hidden">
                {section.content.image && (
                  <img src={section.content.image} alt={section.content.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                  <div className="text-center text-white px-6">
                    <h1 className="text-5xl font-bold mb-4">{section.content.title}</h1>
                    <p className="text-xl mb-6">{section.content.subtitle}</p>
                    {section.content.cta_text && (
                      <Button 
                        onClick={() => section.content.cta_link && (window.location.href = section.content.cta_link)}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        {section.content.cta_text}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {section.type === 'text' && (
              <div className="max-w-4xl mx-auto">
                {section.content.heading && (
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.content.heading}</h2>
                )}
                <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                  {section.content.body}
                </div>
              </div>
            )}

            {section.type === 'image' && section.content.image && (
              <div className="max-w-4xl mx-auto">
                <img 
                  src={section.content.image} 
                  alt={section.content.alt || 'Image'} 
                  className="w-full rounded-xl shadow-lg"
                />
                {section.content.caption && (
                  <p className="text-center text-gray-600 mt-3 italic">{section.content.caption}</p>
                )}
              </div>
            )}

            {section.type === 'html' && (
              <div
                className="max-w-4xl mx-auto prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content.html || '') }}
              />
            )}

            {/* Fallback for unknown section types */}
            {section.type !== 'hero' && section.type !== 'text' && section.type !== 'image' && section.type !== 'html' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">Unknown section type: {section.type}</p>
                <pre className="text-xs mt-2">{JSON.stringify(section, null, 2)}</pre>
              </div>
            )}
          </div>
          );
        })}
      </div>
    );
  };

  const renderNavigation = () => {
    // Filter out pages that are not published or hidden
    const visibleNavItems = navigationItems.filter(item => item.is_visible);
    const topLevelItems = visibleNavItems.filter(item => !item.parent_id);
    
    return (
      <nav className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 py-4 overflow-x-auto">
            {topLevelItems.map(item => {
              const hasChildren = visibleNavItems.some(n => n.parent_id === item.id);
              
              const isActive = (item.link_type === 'page' && pageSlug === (item.slug || item.page_id)) ||
                               (item.link_type === 'products' && view === 'Products') ||
                               (item.link_type === 'services' && view === 'Services');

              const linkClasses = `flex items-center gap-1 font-medium whitespace-nowrap ${
                isActive ? 'text-orange-600 border-b-2 border-orange-600 pb-1' : 'text-gray-700 hover:text-orange-600'
              }`;

              if (item.link_type === 'page' && item.page_id) {
                return (
                  <div key={item.id} className="relative group flex-shrink-0">
                    <a
                      href={createStoreUrl(store.slug, getPageSlug(item.page_id))}
                      className={linkClasses}
                    >
                      {item.label}
                      {hasChildren && <ChevronDown className="w-4 h-4" />}
                    </a>
                    {hasChildren && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {visibleNavItems
                          .filter(n => n.parent_id === item.id)
                          .map(subItem => (
                            <a
                              key={subItem.id}
                              href={createStoreUrl(store.slug, getPageSlug(subItem.page_id))}
                              className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {subItem.label}
                            </a>
                          ))}
                      </div>
                    )}
                  </div>
                );
              } else if (item.link_type === 'url') {
                return (
                  <div key={item.id} className="relative group flex-shrink-0">
                    <a 
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClasses}
                    >
                      {item.label}
                      {hasChildren && <ChevronDown className="w-4 h-4" />}
                    </a>
                    {/* External links usually don't have children in this context, but including for completeness */}
                    {hasChildren && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {visibleNavItems
                          .filter(n => n.parent_id === item.id)
                          .map(subItem => (
                            <a
                              key={subItem.id}
                              href={subItem.external_url} // Assuming sub-items of external are also external
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {subItem.label}
                            </a>
                          ))}
                      </div>
                    )}
                  </div>
                );
              } else if (item.link_type === 'products') {
                return (
                  <a
                    key={item.id}
                    href={`/Store/${store.slug}/Products`}
                    className={linkClasses}
                  >
                    {item.label}
                  </a>
                );
              } else if (item.link_type === 'services') {
                return (
                  <a
                    key={item.id}
                    href={`/Store/${store.slug}/Services`}
                    className={linkClasses}
                  >
                    {item.label}
                  </a>
                );
              } else {
                // For navigation items that are just headers or parent placeholders without direct links
                return (
                  <div key={item.id} className="relative group flex-shrink-0">
                    <span className="flex items-center gap-1 text-gray-700 font-medium whitespace-nowrap cursor-default">
                      {item.label}
                      {hasChildren && <ChevronDown className="w-4 h-4" />}
                    </span>
                    {hasChildren && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {visibleNavItems
                          .filter(n => n.parent_id === item.id)
                          .map(subItem => (
                            <a
                              key={subItem.id}
                              href={createStoreUrl(store.slug, getPageSlug(subItem.page_id))}
                              className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {subItem.label}
                            </a>
                          ))}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <StoreIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 mb-4">{error || "Store not found"}</p>
          <a href={createPageUrl("Marketplace")}>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              Back to Marketplace
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
        {store.banner_url ? (
          <img 
            src={store.banner_url} 
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <StoreIcon className="w-32 h-32 text-orange-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <a href={createPageUrl("Marketplace")}>
            <Button variant="outline" className="bg-white/90 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-12">
        <Card className="border-2 border-orange-200 mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {store.logo_url && (
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-white rounded-xl border-4 border-white shadow-xl overflow-hidden">
                    <img 
                      src={store.logo_url} 
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {store.name}
                    </h1>
                    <Badge className="bg-orange-100 text-orange-800">
                      {store.category.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleFollowToggle}
                      variant={isFollowing ? "default" : "outline"}
                      className={isFollowing ? "bg-red-500 hover:bg-red-600" : "border-orange-200"}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-white' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button
                      onClick={handleContactStore}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>

                {store.description && (
                  <p className="text-gray-600 mb-4">
                    {store.description}
                  </p>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  {store.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <span className="text-sm">{store.location}</span>
                    </div>
                  )}
                  {store.contact_phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5 text-orange-600" />
                      <span className="text-sm">{store.contact_phone}</span>
                    </div>
                  )}
                  {store.contact_email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-5 h-5 text-orange-600" />
                      <span className="text-sm">{store.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {navigationItems.length > 0 && renderNavigation()}

        {view === 'Products' ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-600" />
              Products
            </h2>
            {products.length === 0 ? (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No products yet</h3>
                  <p className="text-gray-600">This store hasn't listed any products.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => {
                  const productSlug = product.slug || product.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') || product.id;
                  return (
                    <a key={product.id} href={createProductUrl(store.slug, productSlug)}>
                      <Card className="border-2 border-orange-100 hover:shadow-xl transition-all h-full">
                        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-orange-300" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-2xl font-bold text-orange-600 mb-3">
                            ${product.price.toFixed(2)}
                          </p>
                          <Badge className="bg-orange-100 text-orange-800">
                            {product.category.replace(/_/g, ' ')}
                          </Badge>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ) : view === 'Services' ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-purple-600" />
              Services
            </h2>
            {services.length === 0 ? (
              <Card className="border-2 border-purple-100">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No services yet</h3>
                  <p className="text-gray-600">This store hasn't listed any services.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => {
                  const serviceSlug = service.slug || service.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') || service.id;
                  return (
                    <Card key={service.id} className="border-2 border-purple-100 hover:shadow-xl transition-all">
                      <div className="relative h-48 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                        {service.image_url ? (
                          <img 
                            src={service.image_url} 
                            alt={service.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Briefcase className="w-16 h-16 text-purple-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-bold text-purple-600">
                            ${service.price.toFixed(2)}
                            <span className="text-sm text-gray-500 font-normal ml-1">
                              {service.price_type === 'hourly' ? '/hr' : 
                               service.price_type === 'per_project' ? '/project' : 
                               service.price_type === 'negotiable' ? '(negotiable)' : ''}
                            </span>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">
                            {service.category.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        {service.availability && (
                          <p className="text-xs text-gray-500 mb-4">
                            Available: {service.availability}
                          </p>
                        )}
                        <Button
                          onClick={handleContactStore}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Request Quote
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : currentPage ? (
          <div className="mt-8">
            {renderPageContent(currentPage)}
          </div>
        ) : showDefaultView ? (
          <>
            {products.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-orange-600" />
                  Products
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => {
                    const productSlug = product.slug || product.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') || product.id;
                    return (
                      <a key={product.id} href={createProductUrl(store.slug, productSlug)}>
                        <Card className="border-2 border-orange-100 hover:shadow-xl transition-all h-full">
                          <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-orange-300" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-2xl font-bold text-orange-600 mb-3">
                              ${product.price.toFixed(2)}
                            </p>
                            <Badge className="bg-orange-100 text-orange-800">
                              {product.category.replace(/_/g, ' ')}
                            </Badge>
                          </CardContent>
                        </Card>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {services.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  Services
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => {
                    const serviceSlug = service.slug || service.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') || service.id;
                    return (
                      <Card key={service.id} className="border-2 border-purple-100 hover:shadow-xl transition-all">
                        <div className="relative h-48 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                          {service.image_url ? (
                            <img 
                              src={service.image_url} 
                              alt={service.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Briefcase className="w-16 h-16 text-purple-300" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl font-bold text-purple-600">
                              ${service.price.toFixed(2)}
                              <span className="text-sm text-gray-500 font-normal ml-1">
                                {service.price_type === 'hourly' ? '/hr' : 
                                 service.price_type === 'per_project' ? '/project' : 
                                 service.price_type === 'negotiable' ? '(negotiable)' : ''}
                              </span>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800">
                              {service.category.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          {service.availability && (
                            <p className="text-xs text-gray-500 mb-4">
                              Available: {service.availability}
                            </p>
                          )}
                          <Button
                            onClick={handleContactStore}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Request Quote
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {products.length === 0 && services.length === 0 && (
              <Card className="border-2 border-orange-100 mt-8">
                <CardContent className="p-12 text-center">
                  <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No products or services yet</h3>
                  <p className="text-gray-600">This store hasn't listed anything yet.</p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="mt-8 text-center py-12">
            <p className="text-gray-600">No content available for this store, page, or view.</p>
            {homepage && !pageSlug && !view && (
                <p className="text-gray-600 mt-2">Try navigating to the <a href={createStoreUrl(store.slug, homepage.slug)} className="text-orange-600 hover:underline">homepage</a>.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
