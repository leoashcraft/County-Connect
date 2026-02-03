import React, { useState, useEffect } from "react";
import { Product, Store, Brand } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Loader2, X, Plus, Image as ImageIcon } from "lucide-react";

export default function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const productId = urlParams.get('id');

  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [brands, setBrands] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    store_id: "",
    brand_id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    condition: "new",
    product_type: "physical",
    digital_file_url: "",
    images: [],
    video_url: "",
    audio_url: "",
    location_lat: "",
    location_lng: "",
    tags: [],
    stock_quantity: "",
    status: "active",
    is_available: true,
    is_promoted: false,
    allow_bidding: false,
    has_variations: false
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) {
      navigate(createPageUrl("MyStores"));
      return;
    }

    try {
      const productData = await Product.get(productId);

      if (!productData) {
        alert("Product not found");
        navigate(createPageUrl("MyStores"));
        return;
      }

      setProduct(productData);

      // Load store data
      const stores = await Store.list();
      const storeData = stores.find(s => s.id === productData.store_id);

      if (!storeData) {
        alert("Store not found");
        navigate(createPageUrl("MyStores"));
        return;
      }

      setStore(storeData);

      // Load brands
      const allBrands = await Brand.filter({ is_active: true });
      setBrands(allBrands);

      // Populate form with product data
      setFormData({
        store_id: productData.store_id || "",
        brand_id: productData.brand_id || "",
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price?.toString() || "",
        category: productData.category || "",
        condition: productData.condition || "new",
        product_type: productData.product_type || "physical",
        digital_file_url: productData.digital_file_url || "",
        images: productData.images || [],
        video_url: productData.video_url || "",
        audio_url: productData.audio_url || "",
        location_lat: productData.location_lat?.toString() || "",
        location_lng: productData.location_lng?.toString() || "",
        tags: productData.tags || [],
        stock_quantity: productData.stock_quantity?.toString() || "",
        status: productData.status || "active",
        is_available: productData.is_available !== false,
        is_promoted: productData.is_promoted || false,
        allow_bidding: productData.allow_bidding || false,
        has_variations: productData.has_variations || false
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to load product:", error);
      alert("Failed to load product: " + error.message);
      navigate(createPageUrl("MyStores"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, file_url]
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleFileUpload = async (file, field) => {
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange(field, file_url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("EditProduct: Submitting form");
    setSaving(true);
    try {
      console.log("EditProduct: Updating product", productId);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : undefined,
        location_lat: formData.location_lat ? parseFloat(formData.location_lat) : undefined,
        location_lng: formData.location_lng ? parseFloat(formData.location_lng) : undefined,
        slug: generateSlug(formData.name)
      };

      console.log("EditProduct: Product data:", productData);
      await Product.update(productId, productData);
      console.log("EditProduct: Product updated successfully");
      navigate(createPageUrl(`StoreManagement?id=${formData.store_id}`));
    } catch (error) {
      console.error("EditProduct: Failed to update product:", error);
      alert("Failed to update product: " + error.message);
    }
    setSaving(false);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const categories = [
    { value: "food", label: "Food" },
    { value: "beverages", label: "Beverages" },
    { value: "produce", label: "Produce" },
    { value: "baked_goods", label: "Baked Goods" },
    { value: "meat_fish", label: "Meat & Fish" },
    { value: "dairy", label: "Dairy" },
    { value: "crafts", label: "Crafts" },
    { value: "art", label: "Art" },
    { value: "furniture", label: "Furniture" },
    { value: "home_decor", label: "Home Decor" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "electronics", label: "Electronics" },
    { value: "books", label: "Books" },
    { value: "toys", label: "Toys" },
    { value: "sports_equipment", label: "Sports Equipment" },
    { value: "tools", label: "Tools" },
    { value: "plants", label: "Plants" },
    { value: "other", label: "Other" }
  ];

  const conditions = [
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "for_parts", label: "For Parts" }
  ];

  const productTypes = [
    { value: "physical", label: "Physical Product" },
    { value: "digital", label: "Digital Download" },
    { value: "license_key", label: "License Key" }
  ];

  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending Review" },
    { value: "active", label: "Active" },
    { value: "hidden", label: "Hidden" }
  ];

  if (loading || !store || !product) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl(`StoreManagement?id=${formData.store_id}`))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update {product.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your product"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand (Optional)</Label>
                  <Select value={formData.brand_id || "none"} onValueChange={(value) => handleInputChange('brand_id', value === "none" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Brand</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(cond => (
                        <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_type">Product Type *</Label>
                <Select value={formData.product_type} onValueChange={(value) => handleInputChange('product_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.product_type === 'digital' && (
                <div className="space-y-2">
                  <Label>Digital File</Label>
                  <div className="flex items-center gap-4">
                    {formData.digital_file_url && (
                      <Badge variant="outline" className="border-green-200 text-green-800">
                        File uploaded
                      </Badge>
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm">{formData.digital_file_url ? 'Change File' : 'Upload File'}</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'digital_file_url')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-orange-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length < 8 && (
                    <label className="cursor-pointer">
                      <div className="h-32 border-2 border-dashed border-orange-300 rounded-lg flex flex-col items-center justify-center hover:bg-orange-50 transition-colors">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-orange-400 mb-2" />
                            <span className="text-sm text-gray-600">Add Image</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500">Upload up to 8 images</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL (Optional)</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => handleInputChange('video_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio_url">Audio URL (Optional)</Label>
                  <Input
                    id="audio_url"
                    value={formData.audio_url}
                    onChange={(e) => handleInputChange('audio_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-orange-200">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location_lat">Location Latitude</Label>
                  <Input
                    id="location_lat"
                    type="number"
                    step="any"
                    value={formData.location_lat}
                    onChange={(e) => handleInputChange('location_lat', e.target.value)}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_lng">Location Longitude</Label>
                  <Input
                    id="location_lng"
                    type="number"
                    step="any"
                    value={formData.location_lng}
                    onChange={(e) => handleInputChange('location_lng', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="is_available" className="text-base font-medium">Product Available</Label>
                  <p className="text-sm text-gray-500 mt-1">Make this product available for purchase</p>
                </div>
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => handleInputChange('is_available', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="allow_bidding" className="text-base font-medium">Allow Quote Requests</Label>
                  <p className="text-sm text-gray-500 mt-1">Let customers request custom quotes</p>
                </div>
                <Switch
                  id="allow_bidding"
                  checked={formData.allow_bidding}
                  onCheckedChange={(checked) => handleInputChange('allow_bidding', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="has_variations" className="text-base font-medium">Has Variations</Label>
                  <p className="text-sm text-gray-500 mt-1">Product comes in different sizes, colors, etc.</p>
                </div>
                <Switch
                  id="has_variations"
                  checked={formData.has_variations}
                  onCheckedChange={(checked) => handleInputChange('has_variations', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl(`StoreManagement?id=${formData.store_id}`))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
