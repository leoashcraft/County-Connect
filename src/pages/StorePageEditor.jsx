
import React, { useState, useEffect } from "react";
import { Store, StorePage, StoreNavigationItem } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Upload, Loader2, MoveUp, MoveDown } from "lucide-react";

export default function StorePageEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const storeId = urlParams.get('store_id');
  const pageId = urlParams.get('page_id');

  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    is_published: false,
    is_homepage: false,
    meta_title: "",
    meta_description: "",
    content: { sections: [] },
    order: 0 // Added order field
  });
  const [navigationData, setNavigationData] = useState({
    addToNav: false,
    navLabel: "",
    navOrder: 0
  });
  const [existingNavItem, setExistingNavItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [storeId, pageId]);

  const loadData = async () => {
    try {
      const stores = await Store.list();
      const storeData = stores.find(s => s.id === storeId);
      setStore(storeData);

      if (pageId) {
        const pages = await StorePage.list();
        const page = pages.find(p => p.id === pageId);
        if (page) {
          // Ensure content.sections is an array, default if null/undefined
          const content = page.content && page.content.sections ? page.content : { sections: [] };
          setFormData({ ...page, content });
        }

        // Check if this page has an existing navigation item
        const navItems = await StoreNavigationItem.filter({
          store_id: storeId,
          page_id: pageId,
          link_type: "page"
        });

        if (navItems.length > 0) {
          const navItem = navItems[0];
          setExistingNavItem(navItem);
          setNavigationData({
            addToNav: true,
            navLabel: navItem.label || page?.title || "",
            navOrder: navItem.order || 0
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      navigate(createPageUrl("MyStores"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'title' && !pageId) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));

      // Auto-populate navigation label if not manually changed
      if (!navigationData.navLabel || navigationData.navLabel === formData.title) {
        setNavigationData(prev => ({ ...prev, navLabel: value }));
      }
    }
  };

  const handleNavigationChange = (field, value) => {
    setNavigationData(prev => ({ ...prev, [field]: value }));
  };

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      content: type === 'hero' ? { title: '', subtitle: '', image: '', cta_text: '', cta_link: '' } :
               type === 'text' ? { heading: '', body: '' } :
               type === 'image' ? { image: '', caption: '', alt: '' } :
               type === 'gallery' ? { images: [] } :
               type === 'features' ? { heading: '', items: [] } :
               { html: '' }
    };
    setFormData(prev => ({
      ...prev,
      content: { sections: [...prev.content.sections, newSection] }
    }));
  };

  const updateSection = (sectionId, content) => {
    setFormData(prev => ({
      ...prev,
      content: {
        sections: prev.content.sections.map(s =>
          s.id === sectionId ? { ...s, content } : s
        )
      }
    }));
  };

  const deleteSection = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      content: {
        sections: prev.content.sections.filter(s => s.id !== sectionId)
      }
    }));
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const sections = [...prev.content.sections];
      [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
      return { ...prev, content: { sections } };
    });
  };

  const moveSectionDown = (index) => {
    if (index === formData.content.sections.length - 1) return;
    setFormData(prev => {
      const sections = [...prev.content.sections];
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      return { ...prev, content: { sections } };
    });
  };

  const handleImageUpload = async (file, callback) => {
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      callback(file_url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const pageData = {
        store_id: storeId,
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        is_published: formData.is_published,
        is_homepage: formData.is_homepage,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        order: formData.order
      };

      let savedPageId = pageId;
      if (pageId) {
        await StorePage.update(pageId, pageData);
      } else {
        const createdPage = await StorePage.create(pageData);
        savedPageId = createdPage.id;
      }

      // Handle navigation item
      if (navigationData.addToNav) {
        const navItemData = {
          store_id: storeId,
          label: navigationData.navLabel || formData.title,
          link_type: "page",
          page_id: savedPageId,
          external_url: "",
          parent_id: "",
          order: navigationData.navOrder,
          is_visible: true
        };

        if (existingNavItem) {
          // Update existing navigation item
          await StoreNavigationItem.update(existingNavItem.id, navItemData);
        } else {
          // Create new navigation item
          await StoreNavigationItem.create(navItemData);
        }
      } else if (existingNavItem) {
        // Remove navigation item if toggle is turned off
        await StoreNavigationItem.delete(existingNavItem.id);
      }

      navigate(createPageUrl(`StoreCMS?id=${storeId}`));
    } catch (error) {
      console.error("Failed to save page:", error);
    }
    setSaving(false);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl(`StoreCMS?id=${storeId}`))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pageId ? 'Edit' : 'Create'} Page</h1>
            <p className="text-gray-600 mt-1">{store?.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="About Us"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="about-us"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="is_published" className="text-base font-medium">Published</Label>
                    <p className="text-sm text-gray-500 mt-1">Make page visible on storefront</p>
                  </div>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="is_homepage" className="text-base font-medium">Set as Homepage</Label>
                    <p className="text-sm text-gray-500 mt-1">Main landing page</p>
                  </div>
                  <Switch
                    id="is_homepage"
                    checked={formData.is_homepage}
                    onCheckedChange={(checked) => handleInputChange('is_homepage', checked)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                  <div>
                    <Label htmlFor="add_to_nav" className="text-base font-medium">Add to Navigation Menu</Label>
                    <p className="text-sm text-gray-500 mt-1">Include this page in the store navigation</p>
                  </div>
                  <Switch
                    id="add_to_nav"
                    checked={navigationData.addToNav}
                    onCheckedChange={(checked) => handleNavigationChange('addToNav', checked)}
                  />
                </div>

                {navigationData.addToNav && (
                  <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                    <div className="space-y-2">
                      <Label htmlFor="nav_label">Navigation Label *</Label>
                      <Input
                        id="nav_label"
                        value={navigationData.navLabel}
                        onChange={(e) => handleNavigationChange('navLabel', e.target.value)}
                        placeholder="Label shown in navigation menu"
                        required={navigationData.addToNav}
                      />
                      <p className="text-xs text-gray-500">This is the text that will appear in the navigation menu</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nav_order">Navigation Order</Label>
                      <Input
                        id="nav_order"
                        type="number"
                        value={navigationData.navOrder}
                        onChange={(e) => handleNavigationChange('navOrder', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                      />
                      <p className="text-xs text-gray-500">Lower numbers appear first. Default is 0.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_title">SEO Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="Page title for search engines"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">SEO Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Page description for search engines"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Page Content</CardTitle>
                <Select onValueChange={addSection}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="text">Text Block</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="gallery">Image Gallery</SelectItem>
                    <SelectItem value="features">Features Grid</SelectItem>
                    <SelectItem value="html">Custom HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {formData.content.sections.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No content sections yet. Add a section to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.content.sections.map((section, index) => (
                    <Card key={section.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <Badge>{section.type}</Badge>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveSectionUp(index)}
                              disabled={index === 0}
                            >
                              <MoveUp className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveSectionDown(index)}
                              disabled={index === formData.content.sections.length - 1}
                            >
                              <MoveDown className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSection(section.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {section.type === 'hero' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Hero Title"
                              value={section.content.title || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })}
                            />
                            <Input
                              placeholder="Hero Subtitle"
                              value={section.content.subtitle || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, subtitle: e.target.value })}
                            />
                            <div className="flex items-center gap-3">
                              {section.content.image && (
                                <img src={section.content.image} alt="Hero" className="w-20 h-20 object-cover rounded" />
                              )}
                              <label className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  <span className="text-sm">Upload Image</span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], (url) => 
                                    updateSection(section.id, { ...section.content, image: url })
                                  )}
                                />
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Button Text"
                                value={section.content.cta_text || ''}
                                onChange={(e) => updateSection(section.id, { ...section.content, cta_text: e.target.value })}
                              />
                              <Input
                                placeholder="Button Link"
                                value={section.content.cta_link || ''}
                                onChange={(e) => updateSection(section.id, { ...section.content, cta_link: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        {section.type === 'text' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Heading"
                              value={section.content.heading || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, heading: e.target.value })}
                            />
                            <Textarea
                              placeholder="Body text..."
                              value={section.content.body || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, body: e.target.value })}
                              rows={6}
                            />
                          </div>
                        )}

                        {section.type === 'image' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {section.content.image && (
                                <img src={section.content.image} alt="Section" className="w-32 h-32 object-cover rounded" />
                              )}
                              <label className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  <span className="text-sm">Upload Image</span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], (url) => 
                                    updateSection(section.id, { ...section.content, image: url })
                                  )}
                                />
                              </label>
                            </div>
                            <Input
                              placeholder="Image Caption"
                              value={section.content.caption || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, caption: e.target.value })}
                            />
                            <Input
                              placeholder="Alt Text (for accessibility)"
                              value={section.content.alt || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, alt: e.target.value })}
                            />
                          </div>
                        )}

                        {section.type === 'html' && (
                          <Textarea
                            placeholder="Enter custom HTML..."
                            value={section.content.html || ''}
                            onChange={(e) => updateSection(section.id, { ...section.content, html: e.target.value })}
                            rows={8}
                            className="font-mono text-sm"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(createPageUrl(`StoreCMS?id=${storeId}`))}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !formData.title || !formData.slug || (navigationData.addToNav && !navigationData.navLabel)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {pageId ? 'Update' : 'Create'} Page
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
