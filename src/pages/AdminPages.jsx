import React, { useState, useEffect } from "react";
import { Page, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Search
} from "lucide-react";

export default function AdminPages() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

      const pagesData = await Page.list('-created_date');
      setPages(pagesData);
    } catch (error) {
      console.error("Error loading pages:", error);
      navigate(createPageUrl("Dashboard"));
    }
    setLoading(false);
  };

  const handleDelete = async (pageId, pageTitle) => {
    if (!confirm(`Are you sure you want to delete "${pageTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      await Page.delete(pageId);
      setPages(pages.filter(p => p.id !== pageId));
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page");
    }
  };

  const togglePublished = async (page) => {
    try {
      await Page.update(page.id, { is_published: !page.is_published });
      setPages(pages.map(p =>
        p.id === page.id ? { ...p, is_published: !p.is_published } : p
      ));
    } catch (error) {
      console.error("Error updating page:", error);
      alert("Failed to update page");
    }
  };

  const filteredPages = pages.filter(page =>
    page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <FileText className="w-12 h-12 text-orange-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
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
              <FileText className="w-8 h-8 text-orange-600" />
              Page Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage custom pages for your site</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("EditPage"))}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>

        {/* Search */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search pages by title or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pages List */}
        <Card className="border-2 border-orange-100">
          <CardHeader>
            <CardTitle>All Pages ({filteredPages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No pages yet</p>
                <p className="text-sm">Create your first custom page to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPages.map(page => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-orange-200 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{page.title}</h3>
                        {page.is_published ? (
                          <Badge className="bg-green-100 text-green-800">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        /{page.slug}
                      </p>
                      {page.meta_description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                          {page.meta_description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {page.is_published && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(page)}
                        title={page.is_published ? "Unpublish" : "Publish"}
                      >
                        {page.is_published ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`EditPage?id=${page.id}`))}
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

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Custom pages are accessible at their slug URL (e.g., /web-design-navarro-county).
            Make sure to add important pages to the navigation menu via Navigation Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
