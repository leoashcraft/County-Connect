import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Trash2, GripVertical, Image, Type, Layout, List, Code, Clock,
  Phone, MapPin, ChevronUp, ChevronDown, Save, ArrowLeft
} from "lucide-react";
import { EntityPage, EntityNavigationItem } from "@/api/entities";
import { toast } from "sonner";

/**
 * EntityPageEditor - A reusable page editor component for entity mini-websites
 *
 * @param {Object} props
 * @param {string} props.entityType - Type of entity (Restaurant, Church, School, etc.)
 * @param {string} props.entityId - ID of the entity
 * @param {string} props.entityName - Name of the entity
 * @param {string} props.pageId - Optional page ID for editing existing pages
 * @param {Function} props.onSave - Callback when page is saved
 * @param {Function} props.onCancel - Callback when editing is cancelled
 * @param {string} props.accentColor - Accent color for the editor (amber, green, blue, etc.)
 */
export default function EntityPageEditor({
  entityType,
  entityId,
  entityName,
  pageId,
  onSave,
  onCancel,
  accentColor = "amber"
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState({
    title: "",
    slug: "",
    is_published: true,
    is_homepage: false,
    meta_title: "",
    meta_description: "",
    content: {
      sections: []
    }
  });

  const [addToNav, setAddToNav] = useState(false);
  const [navLabel, setNavLabel] = useState("");
  const [navOrder, setNavOrder] = useState(0);

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    setLoading(true);
    try {
      const pageData = await EntityPage.get(pageId);
      setPage(pageData);
    } catch (error) {
      console.error("Error loading page:", error);
      toast.error("Failed to load page");
    }
    setLoading(false);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title) => {
    setPage(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
    if (!navLabel) {
      setNavLabel(title);
    }
  };

  const sectionTypes = [
    { value: 'hero', label: 'Hero Image', icon: Layout },
    { value: 'text', label: 'Text Block', icon: Type },
    { value: 'image', label: 'Single Image', icon: Image },
    { value: 'gallery', label: 'Photo Gallery', icon: Image },
    { value: 'features', label: 'Features List', icon: List },
    { value: 'menu', label: 'Menu Section', icon: List },
    { value: 'hours', label: 'Operating Hours', icon: Clock },
    { value: 'contact', label: 'Contact Info', icon: Phone },
    { value: 'cta', label: 'Call to Action', icon: Layout },
    { value: 'html', label: 'Custom HTML', icon: Code }
  ];

  const addSection = (type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type)
    };

    setPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: [...(prev.content?.sections || []), newSection]
      }
    }));
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'hero':
        return { title: '', subtitle: '', image: '', buttonText: '', buttonUrl: '' };
      case 'text':
        return { heading: '', body: '' };
      case 'image':
        return { url: '', caption: '', alt: '' };
      case 'gallery':
        return { title: '', images: [], columns: 3 };
      case 'features':
        return { title: '', features: [] };
      case 'menu':
        return { title: '', sections: [] };
      case 'hours':
        return { title: 'Hours of Operation', hours: [] };
      case 'contact':
        return { title: 'Contact Us', phone: '', email: '', address: '', city: '', state: '', zip_code: '' };
      case 'cta':
        return { title: '', description: '', buttonText: '', buttonUrl: '' };
      case 'html':
        return { html: '' };
      default:
        return {};
    }
  };

  const updateSection = (sectionId, updates) => {
    setPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: (prev.content?.sections || []).map(section =>
          section.id === sectionId
            ? { ...section, content: { ...section.content, ...updates } }
            : section
        )
      }
    }));
  };

  const removeSection = (sectionId) => {
    setPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: (prev.content?.sections || []).filter(s => s.id !== sectionId)
      }
    }));
  };

  const moveSection = (index, direction) => {
    const sections = [...(page.content?.sections || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sections.length) return;

    [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];

    setPage(prev => ({
      ...prev,
      content: { ...prev.content, sections }
    }));
  };

  const handleSave = async () => {
    if (!page.title.trim()) {
      toast.error("Please enter a page title");
      return;
    }

    setSaving(true);
    try {
      const pageData = {
        ...page,
        entity_type: entityType,
        entity_id: entityId
      };

      let savedPage;
      if (pageId) {
        savedPage = await EntityPage.update(pageId, pageData);
      } else {
        savedPage = await EntityPage.create(pageData);
      }

      // Add to navigation if requested
      if (addToNav && !pageId) {
        await EntityNavigationItem.create({
          entity_type: entityType,
          entity_id: entityId,
          label: navLabel || page.title,
          link_type: 'page',
          page_id: savedPage.id,
          order: navOrder,
          is_visible: true
        });
      }

      toast.success(pageId ? "Page updated!" : "Page created!");
      if (onSave) onSave(savedPage);
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    }
    setSaving(false);
  };

  const colorClasses = {
    amber: "border-amber-100",
    green: "border-green-100",
    blue: "border-blue-100",
    purple: "border-purple-100",
    orange: "border-orange-100"
  };

  const borderColor = colorClasses[accentColor] || colorClasses.amber;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {pageId ? "Edit Page" : "Create New Page"}
          </h2>
          <p className="text-gray-600">{entityName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>

      {/* Page Settings */}
      <Card className={`border-2 ${borderColor}`}>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                value={page.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., About Us, Our Menu"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={page.slug}
                onChange={(e) => setPage(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="about-us"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="is_published"
                checked={page.is_published}
                onCheckedChange={(checked) => setPage(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="is_published">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_homepage"
                checked={page.is_homepage}
                onCheckedChange={(checked) => setPage(prev => ({ ...prev, is_homepage: checked }))}
              />
              <Label htmlFor="is_homepage">Set as Homepage</Label>
            </div>
          </div>

          {!pageId && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <Switch
                  id="add_to_nav"
                  checked={addToNav}
                  onCheckedChange={setAddToNav}
                />
                <Label htmlFor="add_to_nav">Add to Navigation Menu</Label>
              </div>

              {addToNav && (
                <div className="grid md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label htmlFor="nav_label">Navigation Label</Label>
                    <Input
                      id="nav_label"
                      value={navLabel}
                      onChange={(e) => setNavLabel(e.target.value)}
                      placeholder="Menu label"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nav_order">Order</Label>
                    <Input
                      id="nav_order"
                      type="number"
                      value={navOrder}
                      onChange={(e) => setNavOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card className={`border-2 ${borderColor}`}>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={page.meta_title}
              onChange={(e) => setPage(prev => ({ ...prev, meta_title: e.target.value }))}
              placeholder="Custom page title for search engines"
            />
          </div>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={page.meta_description}
              onChange={(e) => setPage(prev => ({ ...prev, meta_description: e.target.value }))}
              placeholder="Brief description for search engines (150-160 characters)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <Card className={`border-2 ${borderColor}`}>
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Existing Sections */}
          <div className="space-y-4 mb-6">
            {(page.content?.sections || []).map((section, index) => (
              <SectionEditor
                key={section.id}
                section={section}
                index={index}
                totalSections={page.content?.sections?.length || 0}
                onUpdate={(updates) => updateSection(section.id, updates)}
                onRemove={() => removeSection(section.id)}
                onMoveUp={() => moveSection(index, 'up')}
                onMoveDown={() => moveSection(index, 'down')}
                borderColor={borderColor}
              />
            ))}
          </div>

          {/* Add Section */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            <p className="text-center text-gray-600 mb-4">Add a content section</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {sectionTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  className="flex flex-col items-center py-4 h-auto"
                  onClick={() => addSection(type.value)}
                >
                  <type.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * SectionEditor - Editor for individual content sections
 */
function SectionEditor({
  section,
  index,
  totalSections,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  borderColor
}) {
  const [expanded, setExpanded] = useState(true);

  const sectionLabels = {
    hero: 'Hero Image',
    text: 'Text Block',
    image: 'Single Image',
    gallery: 'Photo Gallery',
    features: 'Features List',
    menu: 'Menu Section',
    hours: 'Operating Hours',
    contact: 'Contact Info',
    cta: 'Call to Action',
    html: 'Custom HTML'
  };

  return (
    <Card className={`border ${borderColor}`}>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <span className="font-medium">
              {sectionLabels[section.type] || section.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={index === 0}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={index === totalSections - 1}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={onRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <SectionContentEditor
            type={section.type}
            content={section.content}
            onUpdate={onUpdate}
          />
        </CardContent>
      )}
    </Card>
  );
}

/**
 * SectionContentEditor - Content editor based on section type
 */
function SectionContentEditor({ type, content, onUpdate }) {
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Hero title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content?.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Hero subtitle"
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={content?.image || ''}
              onChange={(e) => onUpdate({ image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label>Heading (optional)</Label>
            <Input
              value={content?.heading || ''}
              onChange={(e) => onUpdate({ heading: e.target.value })}
              placeholder="Section heading"
            />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              value={content?.body || ''}
              onChange={(e) => onUpdate({ body: e.target.value })}
              placeholder="Enter your text content..."
              rows={6}
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <Label>Image URL</Label>
            <Input
              value={content?.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label>Caption</Label>
            <Input
              value={content?.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Image caption"
            />
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={content?.alt || ''}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Describe the image for accessibility"
            />
          </div>
        </div>
      );

    case 'gallery':
      return <GalleryEditor content={content} onUpdate={onUpdate} />;

    case 'features':
      return <FeaturesEditor content={content} onUpdate={onUpdate} />;

    case 'menu':
      return <MenuEditor content={content} onUpdate={onUpdate} />;

    case 'hours':
      return <HoursEditor content={content} onUpdate={onUpdate} />;

    case 'contact':
      return (
        <div className="space-y-4">
          <div>
            <Label>Section Title</Label>
            <Input
              value={content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Contact Us"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={content?.phone || ''}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={content?.email || ''}
                onChange={(e) => onUpdate({ email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={content?.address || ''}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>City</Label>
              <Input
                value={content?.city || ''}
                onChange={(e) => onUpdate({ city: e.target.value })}
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                value={content?.state || ''}
                onChange={(e) => onUpdate({ state: e.target.value })}
              />
            </div>
            <div>
              <Label>ZIP Code</Label>
              <Input
                value={content?.zip_code || ''}
                onChange={(e) => onUpdate({ zip_code: e.target.value })}
              />
            </div>
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Ready to get started?"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Brief description or call to action text"
              rows={2}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={content?.buttonText || ''}
                onChange={(e) => onUpdate({ buttonText: e.target.value })}
                placeholder="Contact Us"
              />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input
                value={content?.buttonUrl || ''}
                onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                placeholder="https://example.com/contact"
              />
            </div>
          </div>
        </div>
      );

    case 'html':
      return (
        <div>
          <Label>HTML Content</Label>
          <Textarea
            value={content?.html || ''}
            onChange={(e) => onUpdate({ html: e.target.value })}
            placeholder="<div>Your custom HTML here...</div>"
            rows={8}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            HTML will be sanitized for security. Use with caution.
          </p>
        </div>
      );

    default:
      return <p className="text-gray-500">Unknown section type</p>;
  }
}

/**
 * GalleryEditor - Editor for photo gallery sections
 */
function GalleryEditor({ content, onUpdate }) {
  const [newImageUrl, setNewImageUrl] = useState('');

  const addImage = () => {
    if (newImageUrl.trim()) {
      onUpdate({
        images: [...(content?.images || []), { url: newImageUrl.trim(), caption: '' }]
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    const newImages = [...(content?.images || [])];
    newImages.splice(index, 1);
    onUpdate({ images: newImages });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Gallery Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Photo Gallery"
        />
      </div>

      <div className="flex gap-2">
        <Input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Add image URL"
          className="flex-1"
        />
        <Button onClick={addImage} variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(content?.images || []).map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt=""
              className="w-full h-20 object-cover rounded"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 w-6 h-6 p-0"
              onClick={() => removeImage(index)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * FeaturesEditor - Editor for features list sections
 */
function FeaturesEditor({ content, onUpdate }) {
  const addFeature = () => {
    onUpdate({
      features: [...(content?.features || []), { title: '', description: '' }]
    });
  };

  const updateFeature = (index, updates) => {
    const newFeatures = [...(content?.features || [])];
    newFeatures[index] = { ...newFeatures[index], ...updates };
    onUpdate({ features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = [...(content?.features || [])];
    newFeatures.splice(index, 1);
    onUpdate({ features: newFeatures });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Section Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Our Features"
        />
      </div>

      {(content?.features || []).map((feature, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1 grid md:grid-cols-2 gap-2">
            <Input
              value={feature.title}
              onChange={(e) => updateFeature(index, { title: e.target.value })}
              placeholder="Feature title"
            />
            <Input
              value={feature.description}
              onChange={(e) => updateFeature(index, { description: e.target.value })}
              placeholder="Description"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={() => removeFeature(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={addFeature}>
        <Plus className="w-4 h-4 mr-2" />
        Add Feature
      </Button>
    </div>
  );
}

/**
 * MenuEditor - Editor for menu sections
 */
function MenuEditor({ content, onUpdate }) {
  const addSection = () => {
    onUpdate({
      sections: [...(content?.sections || []), { name: 'New Section', items: [] }]
    });
  };

  const updateSection = (index, updates) => {
    const newSections = [...(content?.sections || [])];
    newSections[index] = { ...newSections[index], ...updates };
    onUpdate({ sections: newSections });
  };

  const removeSection = (index) => {
    const newSections = [...(content?.sections || [])];
    newSections.splice(index, 1);
    onUpdate({ sections: newSections });
  };

  const addItem = (sectionIndex) => {
    const newSections = [...(content?.sections || [])];
    newSections[sectionIndex].items = [
      ...(newSections[sectionIndex].items || []),
      { name: '', description: '', price: '' }
    ];
    onUpdate({ sections: newSections });
  };

  const updateItem = (sectionIndex, itemIndex, updates) => {
    const newSections = [...(content?.sections || [])];
    newSections[sectionIndex].items[itemIndex] = {
      ...newSections[sectionIndex].items[itemIndex],
      ...updates
    };
    onUpdate({ sections: newSections });
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const newSections = [...(content?.sections || [])];
    newSections[sectionIndex].items.splice(itemIndex, 1);
    onUpdate({ sections: newSections });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Menu Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Our Menu"
        />
      </div>

      {(content?.sections || []).map((section, sIndex) => (
        <Card key={sIndex} className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Input
                value={section.name}
                onChange={(e) => updateSection(sIndex, { name: e.target.value })}
                placeholder="Section name (e.g., Appetizers)"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => removeSection(sIndex)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 mb-3">
              {(section.items || []).map((item, iIndex) => (
                <div key={iIndex} className="flex gap-2 items-start">
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(sIndex, iIndex, { name: e.target.value })}
                    placeholder="Item name"
                    className="flex-1"
                  />
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(sIndex, iIndex, { description: e.target.value })}
                    placeholder="Description"
                    className="flex-1"
                  />
                  <Input
                    value={item.price}
                    onChange={(e) => updateItem(sIndex, iIndex, { price: e.target.value })}
                    placeholder="$0.00"
                    className="w-24"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => removeItem(sIndex, iIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={() => addItem(sIndex)}>
              <Plus className="w-3 h-3 mr-1" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addSection}>
        <Plus className="w-4 h-4 mr-2" />
        Add Menu Section
      </Button>
    </div>
  );
}

/**
 * HoursEditor - Editor for operating hours sections
 */
function HoursEditor({ content, onUpdate }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const initializeHours = () => {
    if (!content?.hours?.length) {
      onUpdate({
        hours: days.map(day => ({
          day,
          open_time: '09:00',
          close_time: '17:00',
          is_closed: false
        }))
      });
    }
  };

  useEffect(() => {
    initializeHours();
  }, []);

  const updateDay = (index, updates) => {
    const newHours = [...(content?.hours || [])];
    newHours[index] = { ...newHours[index], ...updates };
    onUpdate({ hours: newHours });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Section Title</Label>
        <Input
          value={content?.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Hours of Operation"
        />
      </div>

      <div className="space-y-2">
        {(content?.hours || []).map((day, index) => (
          <div key={day.day} className="flex items-center gap-3">
            <span className="w-24 font-medium">{dayLabels[day.day]}</span>
            <div className="flex items-center gap-2">
              <Switch
                checked={!day.is_closed}
                onCheckedChange={(open) => updateDay(index, { is_closed: !open })}
              />
              <span className="text-sm text-gray-500 w-12">
                {day.is_closed ? 'Closed' : 'Open'}
              </span>
            </div>
            {!day.is_closed && (
              <>
                <Input
                  type="time"
                  value={day.open_time}
                  onChange={(e) => updateDay(index, { open_time: e.target.value })}
                  className="w-32"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={day.close_time}
                  onChange={(e) => updateDay(index, { close_time: e.target.value })}
                  className="w-32"
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
