import React, { useState, useEffect } from "react";
import { User, SiteSetting, NavigationItem, Page } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, GripVertical, LayoutDashboard, Eye, EyeOff, RotateCcw, Plus, Edit, Trash2, Link, FileText, ExternalLink } from "lucide-react";

export default function AdminNavigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    type: 'external',
    label: '',
    url: '',
    pageId: ''
  });

  // Default menu structure
  const defaultMenuItems = [
    { id: "marketplace", title: "Products & Goods", visible: true, category: "public" },
    { id: "jobs", title: "Jobs & Gigs", visible: true, category: "public" },
    { id: "service-directory", title: "Services & Rentals", visible: true, category: "public" },
    { id: "business-directory", title: "Business Directory", visible: true, category: "public" },
    { id: "town-square", title: "Town Square", visible: true, category: "public" },
    { id: "bulletin-board", title: "Bulletin Board", visible: true, category: "public" },
    { id: "lost-found", title: "Lost & Found", visible: true, category: "public" },
    { id: "restaurants", title: "Restaurants", visible: true, category: "public" },
    { id: "food-trucks", title: "Food Trucks", visible: true, category: "public" },
    { id: "churches", title: "Churches", visible: true, category: "public" },
    { id: "sports-teams", title: "Sports Teams", visible: true, category: "public" },
    { id: "community-resources", title: "Community Resources", visible: true, category: "public" },
    { id: "schools", title: "Schools & Childcare", visible: true, category: "public" },
    { id: "events", title: "Local Events", visible: true, category: "public" },
    { id: "dashboard", title: "Dashboard", visible: true, category: "user" },
    { id: "cart", title: "Shopping Cart", visible: true, category: "user" },
    { id: "wishlist", title: "Wishlist", visible: true, category: "user" },
    { id: "messages", title: "Messages", visible: true, category: "user" },
    { id: "support", title: "Support", visible: true, category: "user" },
  ];

  useEffect(() => {
    loadNavigationSettings();
  }, []);

  const loadNavigationSettings = async () => {
    try {
      const userData = await User.me();

      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("Dashboard"));
        return;
      }

      setUser(userData);

      // Load saved navigation order from database
      try {
        const settings = await SiteSetting.filter({ setting_key: 'navigation_order' });
        if (settings && settings.length > 0) {
          setMenuItems(settings[0].setting_value);
        } else {
          setMenuItems(defaultMenuItems);
        }
      } catch (error) {
        console.log("No saved navigation settings found, using defaults");
        setMenuItems(defaultMenuItems);
      }

      // Load custom navigation items
      try {
        const customNavItems = await NavigationItem.list('order');
        setCustomItems(customNavItems);
      } catch (error) {
        console.log("No custom navigation items found");
      }

      // Load pages for dropdown
      try {
        const pagesData = await Page.list();
        setPages(pagesData.filter(p => p.is_published));
      } catch (error) {
        console.log("No pages found");
      }
    } catch (error) {
      console.error("Error loading navigation settings:", error);
      navigate(createPageUrl("Dashboard"));
    }
    setLoading(false);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (!draggedItem) return;

    const draggedIndex = menuItems.findIndex(item => item.id === draggedItem.id);
    if (draggedIndex === index) return;

    const newItems = [...menuItems];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setMenuItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const toggleVisibility = (itemId) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, visible: !item.visible } : item
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Check if setting already exists
      const existing = await SiteSetting.filter({ setting_key: 'navigation_order' });

      if (existing && existing.length > 0) {
        // Update existing setting
        await SiteSetting.update(existing[0].id, {
          setting_value: menuItems,
          updated_date: new Date().toISOString()
        });
      } else {
        // Create new setting
        await SiteSetting.create({
          setting_key: 'navigation_order',
          setting_value: menuItems,
          created_date: new Date().toISOString()
        });
      }

      alert("Navigation settings saved successfully! All users will see the changes immediately.");
    } catch (error) {
      console.error("Error saving navigation settings:", error);
      alert("Failed to save navigation settings: " + error.message);
    }
    setSaving(false);
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset to default navigation order?")) {
      try {
        // Delete the setting from database
        const existing = await SiteSetting.filter({ setting_key: 'navigation_order' });
        if (existing && existing.length > 0) {
          await SiteSetting.delete(existing[0].id);
        }

        setMenuItems(defaultMenuItems);
        alert("Navigation has been reset to default for all users!");
      } catch (error) {
        console.error("Error resetting navigation:", error);
        alert("Failed to reset navigation settings");
      }
    }
  };

  const handleAddCustomItem = async () => {
    try {
      const itemData = {
        label: newItem.label,
        link_type: newItem.type,
        url: newItem.type === 'external' ? newItem.url : `/${pages.find(p => p.id === newItem.pageId)?.slug}`,
        page_id: newItem.type === 'page' ? newItem.pageId : null,
        order: customItems.length,
        is_visible: true,
        category: 'custom'
      };

      const created = await NavigationItem.create(itemData);
      setCustomItems([...customItems, created]);
      setShowAddDialog(false);
      setNewItem({ type: 'external', label: '', url: '', pageId: '' });
    } catch (error) {
      console.error("Error adding custom item:", error);
      alert("Failed to add navigation item");
    }
  };

  const handleUpdateCustomItem = async () => {
    try {
      const itemData = {
        label: editingItem.label,
        url: editingItem.link_type === 'external' ? editingItem.url : `/${pages.find(p => p.id === editingItem.page_id)?.slug}`,
        page_id: editingItem.link_type === 'page' ? editingItem.page_id : null,
      };

      await NavigationItem.update(editingItem.id, itemData);
      setCustomItems(customItems.map(item =>
        item.id === editingItem.id ? { ...item, ...itemData } : item
      ));
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating custom item:", error);
      alert("Failed to update navigation item");
    }
  };

  const handleDeleteCustomItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;

    try {
      await NavigationItem.delete(itemId);
      setCustomItems(customItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting custom item:", error);
      alert("Failed to delete navigation item");
    }
  };

  const toggleCustomItemVisibility = async (item) => {
    try {
      await NavigationItem.update(item.id, { is_visible: !item.is_visible });
      setCustomItems(customItems.map(i =>
        i.id === item.id ? { ...i, is_visible: !i.is_visible } : i
      ));
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      public: "Public Navigation",
      user: "User Navigation"
    };
    return labels[category] || category;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <LayoutDashboard className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("AdminDashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-orange-600" />
            Navigation Settings
          </h1>
          <p className="text-gray-600 mt-2">Reorder, hide, and add custom navigation items</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>

        {/* Custom Navigation Items */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5 text-orange-600" />
                Custom Navigation Items
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {customItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No custom navigation items yet.</p>
                <p className="text-sm">Add links to custom pages or external URLs.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {customItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200 ${
                      !item.is_visible ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.link_type === 'page' ? (
                          <FileText className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-green-600" />
                        )}
                        <span className="font-medium text-gray-900">{item.label}</span>
                        {!item.is_visible && (
                          <Badge variant="secondary" className="text-xs">Hidden</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCustomItemVisibility(item)}
                      >
                        {item.is_visible ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Default Navigation Order */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> Drag and drop items to reorder them. Click the eye icon to show/hide items.
                Changes will take effect immediately for all users after saving.
              </p>
            </div>

            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-8 last:mb-0">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{getCategoryLabel(category)}</h2>

                <div className="space-y-2">
                  {items.map((item, index) => {
                    const globalIndex = menuItems.findIndex(mi => mi.id === item.id);
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => handleDragOver(e, globalIndex)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200 cursor-move hover:border-orange-300 transition-all ${
                          draggedItem?.id === item.id ? 'opacity-50' : ''
                        }`}
                      >
                        <GripVertical className="w-5 h-5 text-gray-400" />

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.title}</span>
                            {!item.visible && (
                              <Badge variant="secondary" className="text-xs">Hidden</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Order: {globalIndex + 1}
                          </Badge>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(item.id)}
                          >
                            {item.visible ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Info:</strong> Navigation settings are saved to the database and apply to all users immediately.
            Custom navigation items appear after the default items in the sidebar.
          </p>
        </div>

        {/* Add Custom Item Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Navigation Item</DialogTitle>
              <DialogDescription>
                Add a custom link to the navigation menu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Link Type</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value) => setNewItem({ ...newItem, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external">External URL</SelectItem>
                    <SelectItem value="page">Custom Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="Web Design"
                />
              </div>
              {newItem.type === 'external' ? (
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={newItem.url}
                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                    placeholder="https://example.com or /custom-page"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Page</Label>
                  <Select
                    value={newItem.pageId}
                    onValueChange={(value) => setNewItem({ ...newItem, pageId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map(page => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddCustomItem}
                disabled={!newItem.label || (newItem.type === 'external' ? !newItem.url : !newItem.pageId)}
                className="bg-gradient-to-r from-orange-500 to-amber-500"
              >
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Custom Item Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Navigation Item</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={editingItem.label}
                    onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  />
                </div>
                {editingItem.link_type === 'external' ? (
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={editingItem.url}
                      onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Page</Label>
                    <Select
                      value={editingItem.page_id}
                      onValueChange={(value) => setEditingItem({ ...editingItem, page_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                      <SelectContent>
                        {pages.map(page => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCustomItem}
                className="bg-gradient-to-r from-orange-500 to-amber-500"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
