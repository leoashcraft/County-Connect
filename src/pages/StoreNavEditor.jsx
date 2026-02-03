
import React, { useState, useEffect } from "react";
import { Store, StorePage, StoreNavigationItem } from "@/api/entities";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function StoreNavEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const storeId = urlParams.get('store_id');
  const itemId = urlParams.get('item_id');
  const parentId = urlParams.get('parent_id');
  const linkType = urlParams.get('type'); // For converting auto-generated items

  const [store, setStore] = useState(null);
  const [pages, setPages] = useState([]);
  const [formData, setFormData] = useState({
    label: "",
    link_type: "page",
    page_id: "",
    external_url: "",
    parent_id: parentId || "",
    order: 0,
    is_visible: true
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [storeId, itemId, linkType]); // Added linkType to dependencies to re-run effect if type changes

  const loadData = async () => {
    try {
      const stores = await Store.list();
      const storeData = stores.find(s => s.id === storeId);
      setStore(storeData);

      const storePages = await StorePage.filter({ store_id: storeId });
      setPages(storePages);

      if (itemId) {
        const navItems = await StoreNavigationItem.list();
        const item = navItems.find(n => n.id === itemId);
        if (item) {
          setFormData(item);
        }
      } else if (linkType) {
        // Pre-fill for converting auto-generated item
        setFormData(prev => ({
          ...prev,
          link_type: linkType,
          label: linkType === 'products' ? 'Products' : 'Services'
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      navigate(createPageUrl("MyStores"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const navData = {
        ...formData,
        store_id: storeId
      };

      if (itemId) {
        await StoreNavigationItem.update(itemId, navData);
      } else {
        await StoreNavigationItem.create(navData);
      }
      
      navigate(createPageUrl(`StoreCMS?id=${storeId}`));
    } catch (error) {
      console.error("Failed to save navigation item:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl(`StoreCMS?id=${storeId}`))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {itemId ? 'Edit' : 'Add'} Navigation Item
            </h1>
            <p className="text-gray-600 mt-1">{store?.name}</p>
          </div>
        </div>

        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle>Navigation Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="label">Label *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  placeholder="Home, About, Products..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_type">Link Type *</Label>
                <Select value={formData.link_type} onValueChange={(value) => handleInputChange('link_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="url">External URL</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.link_type === 'page' && (
                <div className="space-y-2">
                  <Label htmlFor="page_id">Select Page *</Label>
                  <Select value={formData.page_id} onValueChange={(value) => handleInputChange('page_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a page" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map(page => (
                        <SelectItem key={page.id} value={page.id}>{page.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.link_type === 'url' && (
                <div className="space-y-2">
                  <Label htmlFor="external_url">External URL *</Label>
                  <Input
                    id="external_url"
                    type="url"
                    value={formData.external_url}
                    onChange={(e) => handleInputChange('external_url', e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                  placeholder="0"
                />
                <p className="text-sm text-gray-500">Lower numbers appear first</p>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate(createPageUrl(`StoreCMS?id=${storeId}`))}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.label}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {itemId ? 'Update' : 'Add'} Navigation Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
