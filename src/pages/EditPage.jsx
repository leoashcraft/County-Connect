import React, { useState, useEffect } from "react";
import { Page, NavigationItem, User } from "@/api/entities";
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
import { ArrowLeft, Plus, Trash2, Upload, Loader2, MoveUp, MoveDown, FileText, Link as LinkIcon } from "lucide-react";

export default function EditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const pageId = urlParams.get('id');

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    is_published: false,
    meta_title: "",
    meta_description: "",
    content: { sections: [] }
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
  }, [pageId]);

  const loadData = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        alert("Admin access required");
        navigate(createPageUrl("Dashboard"));
        return;
      }

      if (pageId) {
        const pageData = await Page.get(pageId);
        if (pageData) {
          const content = pageData.content && pageData.content.sections ? pageData.content : { sections: [] };
          setFormData({ ...pageData, content });

          // Check if this page has an existing navigation item
          const navItems = await NavigationItem.filter({ page_id: pageId });
          if (navItems.length > 0) {
            const navItem = navItems[0];
            setExistingNavItem(navItem);
            setNavigationData({
              addToNav: true,
              navLabel: navItem.label || pageData.title || "",
              navOrder: navItem.order || 0
            });
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'title' && !pageId) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));

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
               type === 'richtext' ? { heading: '', body: '' } :
               type === 'image' ? { image: '', caption: '', alt: '' } :
               type === 'gallery' ? { images: [] } :
               type === 'features' ? { heading: '', items: [] } :
               type === 'faq' ? { heading: 'Frequently Asked Questions', items: [] } :
               type === 'cta' ? { heading: '', text: '', button_text: '', button_link: '', style: 'primary' } :
               type === 'columns' ? { columns: [] } :
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
      alert("Failed to upload image");
    }
    setUploading(false);
  };

  const addFeatureItem = (sectionId) => {
    const section = formData.content.sections.find(s => s.id === sectionId);
    if (section) {
      const newItems = [...(section.content.items || []), { title: '', description: '', icon: '' }];
      updateSection(sectionId, { ...section.content, items: newItems });
    }
  };

  const updateFeatureItem = (sectionId, itemIndex, field, value) => {
    const section = formData.content.sections.find(s => s.id === sectionId);
    if (section) {
      const newItems = [...section.content.items];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
      updateSection(sectionId, { ...section.content, items: newItems });
    }
  };

  const deleteFeatureItem = (sectionId, itemIndex) => {
    const section = formData.content.sections.find(s => s.id === sectionId);
    if (section) {
      const newItems = section.content.items.filter((_, i) => i !== itemIndex);
      updateSection(sectionId, { ...section.content, items: newItems });
    }
  };

  const addFaqItem = (sectionId) => {
    const section = formData.content.sections.find(s => s.id === sectionId);
    if (section) {
      const newItems = [...(section.content.items || []), { question: '', answer: '' }];
      updateSection(sectionId, { ...section.content, items: newItems });
    }
  };

  const updateFaqItem = (sectionId, itemIndex, field, value) => {
    const section = formData.content.sections.find(s => s.id === sectionId);
    if (section) {
      const newItems = [...section.content.items];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
      updateSection(sectionId, { ...section.content, items: newItems });
    }
  };

  const deleteFaqItem = (sectionId, itemIndex) => {
    const section = formData.content.sections.find(s => s.id === sectionId);
    if (section) {
      const newItems = section.content.items.filter((_, i) => i !== itemIndex);
      updateSection(sectionId, { ...section.content, items: newItems });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const pageData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        is_published: formData.is_published,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description
      };

      let savedPageId = pageId;
      if (pageId) {
        await Page.update(pageId, pageData);
      } else {
        const createdPage = await Page.create(pageData);
        savedPageId = createdPage.id;
      }

      // Handle navigation item
      if (navigationData.addToNav) {
        const navItemData = {
          label: navigationData.navLabel || formData.title,
          link_type: "page",
          page_id: savedPageId,
          url: `/${formData.slug}`,
          order: navigationData.navOrder,
          is_visible: true,
          category: "custom"
        };

        if (existingNavItem) {
          await NavigationItem.update(existingNavItem.id, navItemData);
        } else {
          await NavigationItem.create(navItemData);
        }
      } else if (existingNavItem) {
        await NavigationItem.delete(existingNavItem.id);
      }

      navigate(createPageUrl("AdminPages"));
    } catch (error) {
      console.error("Failed to save page:", error);
      alert("Failed to save page: " + error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("AdminPages"))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-600" />
              {pageId ? 'Edit' : 'Create'} Page
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Page Settings */}
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
                    placeholder="Web Design Services"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="web-design-navarro-county"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="is_published" className="text-base font-medium">Published</Label>
                  <p className="text-sm text-gray-500 mt-1">Make this page visible to the public</p>
                </div>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                />
              </div>

              {/* Navigation Settings */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                  <div>
                    <Label htmlFor="add_to_nav" className="text-base font-medium">Add to Navigation Menu</Label>
                    <p className="text-sm text-gray-500 mt-1">Include this page in the site navigation</p>
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
                        placeholder="Web Design"
                        required={navigationData.addToNav}
                      />
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
                      <p className="text-xs text-gray-500">Lower numbers appear first</p>
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => handleInputChange('meta_title', e.target.value)}
                      placeholder="Web Design & Development in Navarro County, TX"
                    />
                    <p className="text-xs text-gray-500">Defaults to page title if empty</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => handleInputChange('meta_description', e.target.value)}
                      placeholder="Local web design and development services..."
                      rows={2}
                    />
                    <p className="text-xs text-gray-500">Recommended: 150-160 characters for SEO</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Page Content */}
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
                    <SelectItem value="richtext">Rich Text (Markdown)</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="features">Features List</SelectItem>
                    <SelectItem value="faq">FAQ (with Schema)</SelectItem>
                    <SelectItem value="cta">Call to Action</SelectItem>
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
                          <Badge className="capitalize">{section.type.replace('_', ' ')}</Badge>
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

                        {/* Hero Section */}
                        {section.type === 'hero' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Hero Title (H1)"
                              value={section.content.title || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })}
                            />
                            <Input
                              placeholder="Subtitle"
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

                        {/* Text Block */}
                        {section.type === 'text' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Heading (H2)"
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

                        {/* Rich Text (Markdown) */}
                        {section.type === 'richtext' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Heading (H2) - optional"
                              value={section.content.heading || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, heading: e.target.value })}
                            />
                            <Textarea
                              placeholder="Enter markdown content...&#10;&#10;## Subheading&#10;- List item 1&#10;- List item 2&#10;&#10;**Bold text** and *italic text*&#10;&#10;[Link text](https://example.com)"
                              value={section.content.body || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, body: e.target.value })}
                              rows={10}
                              className="font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500">Supports Markdown formatting</p>
                          </div>
                        )}

                        {/* Image */}
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
                              placeholder="Alt Text (for accessibility & SEO)"
                              value={section.content.alt || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, alt: e.target.value })}
                            />
                          </div>
                        )}

                        {/* Features List */}
                        {section.type === 'features' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Section Heading"
                              value={section.content.heading || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, heading: e.target.value })}
                            />
                            <div className="space-y-2">
                              {(section.content.items || []).map((item, itemIndex) => (
                                <div key={itemIndex} className="flex gap-2 items-start p-3 bg-gray-50 rounded">
                                  <div className="flex-1 space-y-2">
                                    <Input
                                      placeholder="Feature title"
                                      value={item.title || ''}
                                      onChange={(e) => updateFeatureItem(section.id, itemIndex, 'title', e.target.value)}
                                    />
                                    <Input
                                      placeholder="Description"
                                      value={item.description || ''}
                                      onChange={(e) => updateFeatureItem(section.id, itemIndex, 'description', e.target.value)}
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteFeatureItem(section.id, itemIndex)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addFeatureItem(section.id)}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add Feature
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* FAQ Section */}
                        {section.type === 'faq' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Section Heading (e.g., Frequently Asked Questions)"
                              value={section.content.heading || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, heading: e.target.value })}
                            />
                            <p className="text-xs text-green-600 font-medium">
                              This section automatically generates FAQPage schema for Google rich snippets
                            </p>
                            <div className="space-y-3">
                              {(section.content.items || []).map((item, itemIndex) => (
                                <div key={itemIndex} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-blue-700">FAQ #{itemIndex + 1}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteFaqItem(section.id, itemIndex)}
                                      className="text-red-600 -mt-1 -mr-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Question"
                                      value={item.question || ''}
                                      onChange={(e) => updateFaqItem(section.id, itemIndex, 'question', e.target.value)}
                                      className="font-medium"
                                    />
                                    <Textarea
                                      placeholder="Answer (supports markdown)"
                                      value={item.answer || ''}
                                      onChange={(e) => updateFaqItem(section.id, itemIndex, 'answer', e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addFaqItem(section.id)}
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add FAQ
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Call to Action */}
                        {section.type === 'cta' && (
                          <div className="space-y-3">
                            <Input
                              placeholder="CTA Heading"
                              value={section.content.heading || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, heading: e.target.value })}
                            />
                            <Textarea
                              placeholder="CTA Text"
                              value={section.content.text || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, text: e.target.value })}
                              rows={2}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Button Text"
                                value={section.content.button_text || ''}
                                onChange={(e) => updateSection(section.id, { ...section.content, button_text: e.target.value })}
                              />
                              <Input
                                placeholder="Button Link"
                                value={section.content.button_link || ''}
                                onChange={(e) => updateSection(section.id, { ...section.content, button_link: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        {/* Custom HTML */}
                        {section.type === 'html' && (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Enter custom HTML..."
                              value={section.content.html || ''}
                              onChange={(e) => updateSection(section.id, { ...section.content, html: e.target.value })}
                              rows={8}
                              className="font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500">
                              Supports raw HTML. Use dofollow links where appropriate.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("AdminPages"))}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !formData.title || !formData.slug}
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
