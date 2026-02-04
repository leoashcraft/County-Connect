import React, { useState, useEffect } from "react";
import { ServicePage, User } from "@/api/entities";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Loader2,
  MoveUp,
  MoveDown,
  Briefcase,
  Save,
  Eye,
  Search,
  FileText,
  HelpCircle,
  Link as LinkIcon,
  Image
} from "lucide-react";

const CATEGORIES = [
  { value: "home_services", label: "Home Services" },
  { value: "professional_services", label: "Professional Services" },
  { value: "health_wellness", label: "Health & Wellness" },
  { value: "automotive", label: "Automotive" },
  { value: "events_entertainment", label: "Events & Entertainment" },
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "agriculture_rural", label: "Agriculture & Rural" },
  { value: "construction_trades", label: "Construction & Trades" },
  { value: "beauty_personal", label: "Beauty & Personal Care" },
  { value: "education_childcare", label: "Education & Childcare" },
  { value: "retail", label: "Retail" },
  { value: "lodging_travel", label: "Lodging & Travel" },
  { value: "industrial_commercial", label: "Industrial & Commercial" }
];

const LAYOUTS = [
  { value: 1, label: "Layout 1 - Standard" },
  { value: 2, label: "Layout 2 - Split Content" },
  { value: 3, label: "Layout 3 - Cards Grid" },
  { value: 4, label: "Layout 4 - Timeline" },
  { value: 5, label: "Layout 5 - Magazine" }
];

const ICON_COLORS = [
  { value: "slate", label: "Slate" },
  { value: "gray", label: "Gray" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "amber", label: "Amber" },
  { value: "yellow", label: "Yellow" },
  { value: "lime", label: "Lime" },
  { value: "green", label: "Green" },
  { value: "emerald", label: "Emerald" },
  { value: "teal", label: "Teal" },
  { value: "cyan", label: "Cyan" },
  { value: "sky", label: "Sky" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "violet", label: "Violet" },
  { value: "purple", label: "Purple" },
  { value: "fuchsia", label: "Fuchsia" },
  { value: "pink", label: "Pink" },
  { value: "rose", label: "Rose" }
];

export default function EditServicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const pageId = urlParams.get('id');

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: "home_services",
    subcategory: "",
    layout: 1,
    icon: "Briefcase",
    iconColor: "blue",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    heroContent: "",
    localContext: "",
    sections: [],
    faqs: [],
    relatedServices: [],
    externalResources: [],
    claimedBusinessId: null,
    status: "draft"
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

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
        const pageData = await ServicePage.get(pageId);
        if (pageData) {
          setFormData({
            ...formData,
            ...pageData,
            sections: pageData.sections || [],
            faqs: pageData.faqs || [],
            relatedServices: pageData.relatedServices || [],
            externalResources: pageData.externalResources || []
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-generate slug from title for new pages
    if (field === 'title' && !pageId) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      return file_url;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Section management
  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      type: "guide",
      heading: "",
      content: ""
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  const deleteSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const sections = [...prev.sections];
      [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
      return { ...prev, sections };
    });
  };

  const moveSectionDown = (index) => {
    if (index === formData.sections.length - 1) return;
    setFormData(prev => {
      const sections = [...prev.sections];
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      return { ...prev, sections };
    });
  };

  // FAQ management
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const updateFaq = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((f, i) =>
        i === index ? { ...f, [field]: value } : f
      )
    }));
  };

  const deleteFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Related services management
  const addRelatedService = () => {
    setFormData(prev => ({
      ...prev,
      relatedServices: [...prev.relatedServices, ""]
    }));
  };

  const updateRelatedService = (index, value) => {
    setFormData(prev => ({
      ...prev,
      relatedServices: prev.relatedServices.map((s, i) =>
        i === index ? value : s
      )
    }));
  };

  const deleteRelatedService = (index) => {
    setFormData(prev => ({
      ...prev,
      relatedServices: prev.relatedServices.filter((_, i) => i !== index)
    }));
  };

  // External resources management
  const addExternalResource = () => {
    setFormData(prev => ({
      ...prev,
      externalResources: [...prev.externalResources, { name: "", url: "" }]
    }));
  };

  const updateExternalResource = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      externalResources: prev.externalResources.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    }));
  };

  const deleteExternalResource = (index) => {
    setFormData(prev => ({
      ...prev,
      externalResources: prev.externalResources.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (pageId) {
        await ServicePage.update(pageId, formData);
      } else {
        await ServicePage.create(formData);
      }
      navigate(createPageUrl("AdminServicePages"));
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save service page: " + error.message);
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
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("AdminServicePages"))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-orange-600" />
              {pageId ? 'Edit' : 'Create'} Service Page
            </h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={saving || !formData.title || !formData.slug}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {pageId ? 'Update' : 'Create'} Page
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="links">Links & SEO</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Foundation Repair"
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
                        placeholder="foundation-repair"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      placeholder="structural"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Layout Style</Label>
                    <Select value={String(formData.layout)} onValueChange={(v) => handleInputChange('layout', parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LAYOUTS.map(l => (
                          <SelectItem key={l.value} value={String(l.value)}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Different layouts prevent template detection</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon Name (Lucide)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      placeholder="Home"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon Color</Label>
                    <Select value={formData.iconColor} onValueChange={(v) => handleInputChange('iconColor', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_COLORS.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Published</Label>
                    <p className="text-sm text-gray-500 mt-1">Make this page visible to the public</p>
                  </div>
                  <Switch
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => handleInputChange('status', checked ? 'active' : 'draft')}
                  />
                </div>

                {formData.claimedBusinessId && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-100 text-orange-800">Claimed</Badge>
                    </div>
                    <p className="text-sm text-orange-800">
                      This page has been claimed by a business. Business ID: {formData.claimedBusinessId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle>Main Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Hero Content (Introduction)</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    The main introductory paragraph that appears at the top. Make it compelling and locally relevant.
                  </p>
                  <RichTextEditor
                    content={formData.heroContent}
                    onChange={(html) => handleInputChange('heroContent', html)}
                    placeholder="Write an engaging introduction about this service in Navarro County..."
                    onImageUpload={handleImageUpload}
                    minHeight="200px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Local Context</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Specific information about why this service matters in Navarro County (soil conditions, climate, local industries, etc.)
                  </p>
                  <RichTextEditor
                    content={formData.localContext}
                    onChange={(html) => handleInputChange('localContext', html)}
                    placeholder="Explain the local factors that make this service unique in Navarro County..."
                    onImageUpload={handleImageUpload}
                    minHeight="200px"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections">
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Content Sections</CardTitle>
                  <Button type="button" variant="outline" onClick={addSection}>
                    <Plus className="w-4 h-4 mr-2" /> Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.sections.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No sections yet. Add sections to provide detailed information.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.sections.map((section, index) => (
                      <Card key={section.id || index} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Section {index + 1}</Badge>
                              <Select
                                value={section.type}
                                onValueChange={(v) => updateSection(index, 'type', v)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="guide">Guide</SelectItem>
                                  <SelectItem value="comparison">Comparison</SelectItem>
                                  <SelectItem value="local_info">Local Info</SelectItem>
                                  <SelectItem value="checklist">Checklist</SelectItem>
                                  <SelectItem value="services">Services</SelectItem>
                                  <SelectItem value="prevention">Prevention</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
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
                                disabled={index === formData.sections.length - 1}
                              >
                                <MoveDown className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSection(index)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Section Heading</Label>
                              <Input
                                value={section.heading || ''}
                                onChange={(e) => updateSection(index, 'heading', e.target.value)}
                                placeholder="Section heading (H2)"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Section Content</Label>
                              <RichTextEditor
                                content={section.content || ''}
                                onChange={(html) => updateSection(index, 'content', html)}
                                placeholder="Write detailed content for this section..."
                                onImageUpload={handleImageUpload}
                                minHeight="250px"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      FAQs generate rich snippets in Google search results (FAQPage schema)
                    </p>
                  </div>
                  <Button type="button" variant="outline" onClick={addFaq}>
                    <Plus className="w-4 h-4 mr-2" /> Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.faqs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No FAQs yet. Add common questions about this service.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.faqs.map((faq, index) => (
                      <Card key={index} className="border border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <Badge className="bg-blue-100 text-blue-800">FAQ #{index + 1}</Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFaq(index)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Input
                                value={faq.question}
                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                placeholder="What question do people commonly ask?"
                                className="font-medium"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Answer</Label>
                              <Textarea
                                value={faq.answer}
                                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                placeholder="Provide a helpful, detailed answer..."
                                rows={4}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Links & SEO Tab */}
          <TabsContent value="links">
            <div className="space-y-6">
              {/* SEO Settings */}
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      placeholder="Foundation Repair in Navarro County, TX | Expert Services"
                    />
                    <p className="text-xs text-gray-500">
                      {formData.metaTitle?.length || 0}/60 characters (recommended)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      placeholder="Foundation repair services in Corsicana and Navarro County. Expert solutions for settling foundations, cracks, and drainage issues."
                      rows={2}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.metaDescription?.length || 0}/160 characters (recommended)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                      placeholder="foundation repair corsicana, foundation repair navarro county, pier and beam"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Related Services */}
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="w-5 h-5" />
                      Related Services
                    </CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addRelatedService}>
                      <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Slugs of related service pages for internal linking
                  </p>
                </CardHeader>
                <CardContent>
                  {formData.relatedServices.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No related services added</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.relatedServices.map((service, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={service}
                            onChange={(e) => updateRelatedService(index, e.target.value)}
                            placeholder="plumber"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRelatedService(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* External Resources */}
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="w-5 h-5" />
                      External Resources
                    </CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addExternalResource}>
                      <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Authority links to government sites, licensing boards, etc. (builds E-E-A-T)
                  </p>
                </CardHeader>
                <CardContent>
                  {formData.externalResources.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No external resources added</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.externalResources.map((resource, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={resource.name}
                            onChange={(e) => updateExternalResource(index, 'name', e.target.value)}
                            placeholder="Resource name"
                            className="w-1/3"
                          />
                          <Input
                            value={resource.url}
                            onChange={(e) => updateExternalResource(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExternalResource(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Save Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("AdminServicePages"))}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !formData.title || !formData.slug}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {pageId ? 'Update' : 'Create'} Page
          </Button>
        </div>
      </div>
    </div>
  );
}
