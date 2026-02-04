import React, { useState, useEffect } from "react";
import { ServicePage, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  Filter,
  Briefcase,
  CheckCircle,
  Clock
} from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
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

export default function AdminServicePages() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        alert("Admin access required");
        navigate(createPageUrl("Dashboard"));
        return;
      }
      setUser(userData);

      const pagesData = await ServicePage.list('title');
      setPages(pagesData);
    } catch (error) {
      console.error("Error loading service pages:", error);
      navigate(createPageUrl("Dashboard"));
    }
    setLoading(false);
  };

  const handleDelete = async (pageId, pageTitle) => {
    if (!confirm(`Are you sure you want to delete "${pageTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      await ServicePage.delete(pageId);
      setPages(pages.filter(p => p.id !== pageId));
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page");
    }
  };

  const toggleStatus = async (page) => {
    const newStatus = page.status === 'active' ? 'draft' : 'active';
    try {
      await ServicePage.update(page.id, { status: newStatus });
      setPages(pages.map(p =>
        p.id === page.id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error("Error updating page:", error);
      alert("Failed to update page");
    }
  };

  const getCategoryLabel = (value) => {
    const cat = CATEGORIES.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = !searchTerm ||
      page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || page.category === categoryFilter;
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "claimed" && page.claimedBusinessId) ||
      (statusFilter === "unclaimed" && !page.claimedBusinessId) ||
      (statusFilter === "active" && page.status === "active") ||
      (statusFilter === "draft" && page.status === "draft");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats
  const stats = {
    total: pages.length,
    active: pages.filter(p => p.status === 'active').length,
    claimed: pages.filter(p => p.claimedBusinessId).length,
    draft: pages.filter(p => p.status === 'draft').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Briefcase className="w-12 h-12 text-orange-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("AdminDashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-orange-600" />
              Service Pages
            </h1>
            <p className="text-gray-600 mt-2">Manage local service landing pages for monetization</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("EditServicePage"))}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Service Page
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Pages</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-500">Active</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.claimed}</div>
              <div className="text-sm text-gray-500">Claimed</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-500">{stats.draft}</div>
              <div className="text-sm text-gray-500">Draft</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by title or URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="claimed">Claimed</SelectItem>
                  <SelectItem value="unclaimed">Unclaimed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pages List */}
        <Card className="border-2 border-orange-100">
          <CardHeader>
            <CardTitle>Service Pages ({filteredPages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No service pages found</p>
                <p className="text-sm">Create service pages or adjust your filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPages.map(page => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-orange-200 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{page.title}</h3>
                        {page.status === 'active' ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                        {page.claimedBusinessId ? (
                          <Badge className="bg-orange-100 text-orange-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Claimed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            Available
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(page.category)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {page.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                          title="View Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(page)}
                        title={page.status === 'active' ? "Set to Draft" : "Publish"}
                      >
                        {page.status === 'active' ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`EditServicePage?id=${page.id}`))}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(page.id, page.title)}
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

        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>About Service Pages:</strong> These pages are SEO-optimized landing pages for local services.
              Each page provides valuable information to visitors while offering a monetization opportunity through
              the "claim this page" feature. Unclaimed pages show educational content; claimed pages feature the
              business prominently.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Monetization:</strong> Businesses can claim exclusive ownership of a service page through
              the inquiry form. Claimed pages prominently feature the business while maintaining the educational
              content that drives organic search traffic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
