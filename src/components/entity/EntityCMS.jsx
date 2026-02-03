import React, { useState, useEffect } from "react";
import { EntityPage, EntityNavigationItem } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  FileText,
  Menu,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Home,
  Globe,
  Loader2,
  Layout
} from "lucide-react";

/**
 * EntityCMS - A reusable CMS dashboard for any entity type's mini-website
 *
 * @param {Object} props
 * @param {string} props.entityType - Type of entity (Restaurant, Church, School, Attraction, etc.)
 * @param {string} props.entityId - ID of the entity
 * @param {string} props.entityName - Display name of the entity
 * @param {string} props.entitySlug - URL slug for the entity
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {Function} props.onEditPage - Callback when editing a page (receives pageId or null for new)
 * @param {Function} props.onEditNav - Callback when editing a nav item (receives itemId or null for new, and optional parentId)
 * @param {Function} props.onViewEntity - Callback to view the entity's public page
 * @param {string} props.accentColor - Theme color (amber, green, blue, purple, orange)
 */
export default function EntityCMS({
  entityType,
  entityId,
  entityName,
  entitySlug,
  onBack,
  onEditPage,
  onEditNav,
  onViewEntity,
  accentColor = "amber"
}) {
  const [pages, setPages] = useState([]);
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pages");

  const colorClasses = {
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      button: "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
      tabs: "border-amber-100"
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      button: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      tabs: "border-green-100"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      button: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      tabs: "border-blue-100"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      button: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      tabs: "border-purple-100"
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      button: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      tabs: "border-orange-100"
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.amber;

  useEffect(() => {
    if (entityId) {
      loadCMSData();
    }
  }, [entityId]);

  const loadCMSData = async () => {
    setLoading(true);
    try {
      const [allPages, allNavItems] = await Promise.all([
        EntityPage.filter({ entity_type: entityType, entity_id: entityId }),
        EntityNavigationItem.filter({ entity_type: entityType, entity_id: entityId })
      ]);

      // Sort pages by order if available
      setPages(allPages.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setNavigationItems(allNavItems.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      console.error("Error loading CMS data:", error);
    }
    setLoading(false);
  };

  const deletePage = async (pageId) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    setPages(prev => prev.filter(p => p.id !== pageId));

    try {
      await EntityPage.delete(pageId);

      // Also delete any navigation items pointing to this page
      const navItemsToDelete = navigationItems.filter(n => n.page_id === pageId);
      for (const navItem of navItemsToDelete) {
        await EntityNavigationItem.delete(navItem.id);
      }
      setNavigationItems(prev => prev.filter(n => n.page_id !== pageId));
    } catch (error) {
      console.error("Error deleting page:", error);
      await loadCMSData();
    }
  };

  const togglePagePublish = async (page) => {
    setPages(prev => prev.map(p =>
      p.id === page.id ? { ...p, is_published: !p.is_published } : p
    ));

    try {
      await EntityPage.update(page.id, { is_published: !page.is_published });
    } catch (error) {
      console.error("Error toggling page publish status:", error);
      await loadCMSData();
    }
  };

  const setAsHomepage = async (pageId) => {
    setPages(prev => prev.map(p => ({
      ...p,
      is_homepage: p.id === pageId
    })));

    try {
      const updatePromises = pages.map(p =>
        EntityPage.update(p.id, { is_homepage: p.id === pageId })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error setting homepage:", error);
      await loadCMSData();
    }
  };

  const deleteNavItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this navigation item?")) return;

    const childItems = navigationItems.filter(n => n.parent_id === itemId);
    const itemIdsToDelete = [itemId, ...childItems.map(c => c.id)];

    setNavigationItems(prev => prev.filter(item => !itemIdsToDelete.includes(item.id)));

    try {
      for (const child of childItems) {
        await EntityNavigationItem.delete(child.id);
      }
      await EntityNavigationItem.delete(itemId);
    } catch (error) {
      console.error("Error deleting navigation item:", error);
      await loadCMSData();
    }
  };

  const toggleNavVisibility = async (item) => {
    setNavigationItems(prev => prev.map(navItem =>
      navItem.id === item.id ? { ...navItem, is_visible: !navItem.is_visible } : navItem
    ));

    try {
      await EntityNavigationItem.update(item.id, { is_visible: !item.is_visible });
    } catch (error) {
      console.error("Error toggling navigation visibility:", error);
      await loadCMSData();
    }
  };

  const getPageTitle = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    return page?.title || "Unknown Page";
  };

  const topLevelNavItems = navigationItems.filter(n => !n.parent_id);
  const getSubItems = (parentId) => navigationItems.filter(n => n.parent_id === parentId);

  const homepage = pages.find(p => p.is_homepage);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
        <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-gray-600 mt-1">{entityName} - Content Management</p>
        </div>
        {onViewEntity && (
          <Button variant="outline" onClick={onViewEntity}>
            <Globe className="w-4 h-4 mr-2" />
            View Page
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className={`border-2 ${colors.border}`}>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-2xl font-bold">{pages.length}</p>
            <p className="text-sm text-gray-600">Pages</p>
          </CardContent>
        </Card>
        <Card className={`border-2 ${colors.border}`}>
          <CardContent className="p-4 text-center">
            <Menu className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-2xl font-bold">{navigationItems.length}</p>
            <p className="text-sm text-gray-600">Nav Items</p>
          </CardContent>
        </Card>
        <Card className={`border-2 ${colors.border}`}>
          <CardContent className="p-4 text-center">
            <Layout className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-2xl font-bold">{pages.filter(p => p.is_published).length}</p>
            <p className="text-sm text-gray-600">Published</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`bg-white border-2 ${colors.tabs} mb-6`}>
          <TabsTrigger value="pages">
            <FileText className="w-4 h-4 mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <Menu className="w-4 h-4 mr-2" />
            Navigation
          </TabsTrigger>
        </TabsList>

        {/* Pages Tab */}
        <TabsContent value="pages">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pages</h2>
              <p className="text-sm text-gray-600 mt-1">
                {homepage ? `Homepage: ${homepage.title}` : "No homepage set"}
              </p>
            </div>
            <Button
              className={`bg-gradient-to-r ${colors.button}`}
              onClick={() => onEditPage(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Button>
          </div>

          {pages.length === 0 ? (
            <Card className={`border-2 ${colors.border}`}>
              <CardContent className="p-12 text-center">
                <FileText className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No pages yet</h3>
                <p className="text-gray-600 mb-6">Create your first page to start building your website</p>
                <Button
                  className={`bg-gradient-to-r ${colors.button}`}
                  onClick={() => onEditPage(null)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Page
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pages.map(page => (
                <Card key={page.id} className={`border-2 ${colors.border}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{page.title}</h3>
                          {page.is_homepage && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Home className="w-3 h-3 mr-1" />
                              Homepage
                            </Badge>
                          )}
                          <Badge className={page.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {page.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        {!page.is_homepage && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAsHomepage(page.id)}
                          >
                            <Home className="w-4 h-4 mr-2" />
                            Set as Homepage
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePagePublish(page)}
                        >
                          {page.is_published ? (
                            <><EyeOff className="w-4 h-4 mr-2" /> Unpublish</>
                          ) : (
                            <><Eye className="w-4 h-4 mr-2" /> Publish</>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditPage(page.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePage(page.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Navigation Menu</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your navigation bar</p>
            </div>
            <Button
              className={`bg-gradient-to-r ${colors.button}`}
              onClick={() => onEditNav(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Navigation Item
            </Button>
          </div>

          {topLevelNavItems.length === 0 ? (
            <Card className={`border-2 ${colors.border}`}>
              <CardContent className="p-12 text-center">
                <Menu className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No navigation items</h3>
                <p className="text-gray-600 mb-6">Add items to your navigation menu</p>
                <Button
                  className={`bg-gradient-to-r ${colors.button}`}
                  onClick={() => onEditNav(null)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {topLevelNavItems.map(item => {
                const subItems = getSubItems(item.id);
                return (
                  <Card key={item.id} className={`border-2 ${colors.border}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{item.label}</h3>
                            <Badge variant="outline">
                              {item.link_type === 'page' ? 'Page' :
                               item.link_type === 'url' ? 'External URL' :
                               item.link_type === 'menu' ? 'Menu' :
                               item.link_type === 'gallery' ? 'Gallery' :
                               item.link_type === 'contact' ? 'Contact' : item.link_type}
                            </Badge>
                            {!item.is_visible && (
                              <Badge className="bg-gray-100 text-gray-800">Hidden</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {item.link_type === 'page' && item.page_id && `Links to: ${getPageTitle(item.page_id)}`}
                            {item.link_type === 'url' && `URL: ${item.external_url}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleNavVisibility(item)}
                          >
                            {item.is_visible ? (
                              <><EyeOff className="w-4 h-4 mr-2" /> Hide</>
                            ) : (
                              <><Eye className="w-4 h-4 mr-2" /> Show</>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditNav(item.id)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditNav(null, item.id)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Submenu
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNavItem(item.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Submenu Items */}
                      {subItems.length > 0 && (
                        <div className={`ml-8 mt-4 space-y-2 border-l-2 ${colors.border} pl-4`}>
                          {subItems.map(subItem => (
                            <div key={subItem.id} className={`flex items-center justify-between p-3 ${colors.bg} rounded-lg`}>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{subItem.label}</span>
                                  {!subItem.is_visible && (
                                    <Badge className="bg-gray-100 text-gray-800">Hidden</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {subItem.link_type === 'page' && subItem.page_id && `Links to: ${getPageTitle(subItem.page_id)}`}
                                  {subItem.link_type === 'url' && `URL: ${subItem.external_url}`}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleNavVisibility(subItem)}
                                >
                                  {subItem.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEditNav(subItem.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNavItem(subItem.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Export utility for creating entity CMS URLs
 */
export function createEntityCMSUrl(entityType, entityId) {
  return `entity-cms?type=${entityType}&id=${entityId}`;
}
