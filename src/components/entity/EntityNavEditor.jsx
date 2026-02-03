import React, { useState, useEffect } from "react";
import { EntityPage, EntityNavigationItem } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

/**
 * EntityNavEditor - A reusable navigation item editor for entity mini-websites
 *
 * @param {Object} props
 * @param {string} props.entityType - Type of entity (Restaurant, Church, School, etc.)
 * @param {string} props.entityId - ID of the entity
 * @param {string} props.entityName - Display name of the entity
 * @param {string} props.itemId - Optional ID of navigation item to edit
 * @param {string} props.parentId - Optional parent ID for creating submenu items
 * @param {Function} props.onSave - Callback when item is saved
 * @param {Function} props.onCancel - Callback when editing is cancelled
 * @param {string} props.accentColor - Theme color (amber, green, blue, purple, orange)
 */
export default function EntityNavEditor({
  entityType,
  entityId,
  entityName,
  itemId,
  parentId,
  onSave,
  onCancel,
  accentColor = "amber"
}) {
  const [pages, setPages] = useState([]);
  const [existingNavItems, setExistingNavItems] = useState([]);
  const [formData, setFormData] = useState({
    label: "",
    link_type: "page",
    page_id: "",
    external_url: "",
    parent_id: parentId || "",
    order: 0,
    is_visible: true,
    icon: ""
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const colorClasses = {
    amber: { border: "border-amber-200", button: "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" },
    green: { border: "border-green-200", button: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" },
    blue: { border: "border-blue-200", button: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" },
    purple: { border: "border-purple-200", button: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" },
    orange: { border: "border-orange-200", button: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" }
  };

  const colors = colorClasses[accentColor] || colorClasses.amber;

  useEffect(() => {
    loadData();
  }, [entityId, itemId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entityPages, navItems] = await Promise.all([
        EntityPage.filter({ entity_type: entityType, entity_id: entityId }),
        EntityNavigationItem.filter({ entity_type: entityType, entity_id: entityId })
      ]);

      setPages(entityPages.filter(p => p.is_published));
      setExistingNavItems(navItems);

      if (itemId) {
        const item = navItems.find(n => n.id === itemId);
        if (item) {
          setFormData({
            label: item.label || "",
            link_type: item.link_type || "page",
            page_id: item.page_id || "",
            external_url: item.external_url || "",
            parent_id: item.parent_id || "",
            order: item.order || 0,
            is_visible: item.is_visible !== false,
            icon: item.icon || ""
          });
        }
      } else if (parentId) {
        // Calculate next order for submenu
        const siblingItems = navItems.filter(n => n.parent_id === parentId);
        const maxOrder = Math.max(0, ...siblingItems.map(n => n.order || 0));
        setFormData(prev => ({ ...prev, parent_id: parentId, order: maxOrder + 1 }));
      } else {
        // Calculate next order for top-level
        const topLevelItems = navItems.filter(n => !n.parent_id);
        const maxOrder = Math.max(0, ...topLevelItems.map(n => n.order || 0));
        setFormData(prev => ({ ...prev, order: maxOrder + 1 }));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.label.trim()) {
      toast.error("Please enter a label");
      return;
    }

    if (formData.link_type === "page" && !formData.page_id) {
      toast.error("Please select a page");
      return;
    }

    if (formData.link_type === "url" && !formData.external_url) {
      toast.error("Please enter a URL");
      return;
    }

    setSaving(true);
    try {
      const navData = {
        ...formData,
        entity_type: entityType,
        entity_id: entityId,
        // Clear unused fields based on link type
        page_id: formData.link_type === "page" ? formData.page_id : null,
        external_url: formData.link_type === "url" ? formData.external_url : null
      };

      let savedItem;
      if (itemId) {
        savedItem = await EntityNavigationItem.update(itemId, navData);
        toast.success("Navigation item updated!");
      } else {
        savedItem = await EntityNavigationItem.create(navData);
        toast.success("Navigation item created!");
      }

      if (onSave) onSave(savedItem);
    } catch (error) {
      console.error("Failed to save navigation item:", error);
      toast.error("Failed to save navigation item");
    }
    setSaving(false);
  };

  // Get parent items for potential nesting (only top-level items)
  const potentialParents = existingNavItems.filter(n => !n.parent_id && n.id !== itemId);

  // Link type options based on entity type
  const getLinkTypeOptions = () => {
    const baseOptions = [
      { value: "page", label: "Page" },
      { value: "url", label: "External URL" }
    ];

    // Add entity-specific options
    if (entityType === "Restaurant" || entityType === "FoodTruck") {
      baseOptions.push({ value: "menu", label: "Menu" });
    }

    baseOptions.push(
      { value: "gallery", label: "Photo Gallery" },
      { value: "contact", label: "Contact" },
      { value: "hours", label: "Hours" }
    );

    return baseOptions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {itemId ? "Edit Navigation Item" : "Add Navigation Item"}
          </h1>
          <p className="text-gray-600 mt-1">{entityName}</p>
        </div>
      </div>

      <Card className={`border-2 ${colors.border}`}>
        <CardHeader>
          <CardTitle>Navigation Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => handleInputChange("label", e.target.value)}
                placeholder="Home, About, Menu, Gallery..."
                required
              />
            </div>

            {/* Link Type */}
            <div className="space-y-2">
              <Label htmlFor="link_type">Link Type *</Label>
              <Select
                value={formData.link_type}
                onValueChange={(value) => handleInputChange("link_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getLinkTypeOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {formData.link_type === "page" && "Link to one of your custom pages"}
                {formData.link_type === "url" && "Link to an external website"}
                {formData.link_type === "menu" && "Show the menu section"}
                {formData.link_type === "gallery" && "Show the photo gallery"}
                {formData.link_type === "contact" && "Show contact information"}
                {formData.link_type === "hours" && "Show operating hours"}
              </p>
            </div>

            {/* Page Selection (for page link type) */}
            {formData.link_type === "page" && (
              <div className="space-y-2">
                <Label htmlFor="page_id">Select Page *</Label>
                <Select
                  value={formData.page_id}
                  onValueChange={(value) => handleInputChange("page_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.length === 0 ? (
                      <SelectItem value="" disabled>
                        No published pages available
                      </SelectItem>
                    ) : (
                      pages.map(page => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {pages.length === 0 && (
                  <p className="text-xs text-amber-600">
                    Create and publish a page first to link to it
                  </p>
                )}
              </div>
            )}

            {/* External URL (for url link type) */}
            {formData.link_type === "url" && (
              <div className="space-y-2">
                <Label htmlFor="external_url">External URL *</Label>
                <Input
                  id="external_url"
                  type="url"
                  value={formData.external_url}
                  onChange={(e) => handleInputChange("external_url", e.target.value)}
                  placeholder="https://example.com"
                  required={formData.link_type === "url"}
                />
              </div>
            )}

            {/* Parent (for submenu) */}
            {!parentId && potentialParents.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="parent_id">Parent Item (optional)</Label>
                <Select
                  value={formData.parent_id || "none"}
                  onValueChange={(value) => handleInputChange("parent_id", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level)</SelectItem>
                    {potentialParents.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select a parent to make this a submenu item
                </p>
              </div>
            )}

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                min="0"
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-3">
              <Switch
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => handleInputChange("is_visible", checked)}
              />
              <Label htmlFor="is_visible">Visible in navigation</Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || !formData.label}
                className={`bg-gradient-to-r ${colors.button}`}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {itemId ? "Update" : "Add"} Navigation Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
