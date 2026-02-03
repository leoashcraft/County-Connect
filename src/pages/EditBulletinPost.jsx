import React, { useState, useEffect } from "react";
import { BulletinPost, User, Town } from "@/api/entities";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, ScrollText } from "lucide-react";

export default function EditBulletinPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const postId = urlParams.get('id');

  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [towns, setTowns] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    town_id: "",
    location: "",
    event_date: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    expires_in_days: "30"
  });

  useEffect(() => {
    loadPost();
    loadTowns();
  }, [postId]);

  const loadTowns = async () => {
    try {
      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading towns:", error);
    }
  };

  const loadPost = async () => {
    if (!postId) {
      navigate(createPageUrl("MyBulletinPosts"));
      return;
    }

    try {
      const postData = await BulletinPost.get(postId);
      if (!postData) {
        alert("Post not found");
        navigate(createPageUrl("MyBulletinPosts"));
        return;
      }

      const userData = await User.me();
      if (userData.email !== postData.created_by) {
        alert("You don't have permission to edit this post");
        navigate(createPageUrl("MyBulletinPosts"));
        return;
      }

      setPost(postData);
      setUser(userData);

      // Calculate expires_in_days from expires_at
      let expiresInDays = "30";
      if (postData.expires_at) {
        const now = new Date();
        const expiryDate = new Date(postData.expires_at);
        const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        if (daysLeft > 0) {
          expiresInDays = daysLeft.toString();
        }
      }

      setFormData({
        title: postData.title || "",
        description: postData.description || "",
        category: postData.category || "",
        town_id: postData.town_id || "",
        location: postData.location || "",
        event_date: postData.event_date ? postData.event_date.split('T')[0] : "",
        contact_name: postData.contact_name || "",
        contact_email: postData.contact_email || "",
        contact_phone: postData.contact_phone || "",
        expires_in_days: expiresInDays
      });

      setLoading(false);
    } catch (error) {
      console.error("Error loading bulletin post:", error);
      navigate(createPageUrl("MyBulletinPosts"));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Calculate new expiry date from today
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(formData.expires_in_days));

      const postData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        town_id: formData.town_id || undefined,
        location: formData.location,
        event_date: formData.event_date || undefined,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        expires_at: expiryDate.toISOString(),
        slug: generateSlug(formData.title)
      };

      await BulletinPost.update(postId, postData);
      navigate(createPageUrl("MyBulletinPosts"));
    } catch (error) {
      console.error("Failed to update bulletin post:", error);
      alert("Failed to update post: " + error.message);
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
    { value: "general", label: "General" },
    { value: "free_swap", label: "Free/Swap" },
    { value: "rideshare", label: "Ride Share" },
    { value: "babysitters", label: "Babysitters" },
    { value: "church_nonprofit", label: "Church/Nonprofit" },
    { value: "volunteers", label: "Volunteers" }
  ];

  const expiryOptions = [
    { value: "7", label: "7 days" },
    { value: "14", label: "14 days" },
    { value: "21", label: "21 days" },
    { value: "30", label: "30 days" }
  ];

  if (loading || !post) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("MyBulletinPosts"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Notice</h1>
            <p className="text-gray-600 mt-1">Update {post.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-orange-600" />
                Notice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Free Furniture, Looking for Carpool, Volunteer Opportunity"
                  required
                />
              </div>

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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide details about your notice"
                  rows={6}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="town_id">Town/City *</Label>
                  <Select value={formData.town_id} onValueChange={(value) => handleInputChange('town_id', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    This helps filter posts by location
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_date">Event Date (if applicable)</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_in_days">Extend Post Duration *</Label>
                <Select value={formData.expires_in_days} onValueChange={(value) => handleInputChange('expires_in_days', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expiryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Setting this will extend the expiry date from today
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Your Name *</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange('contact_name', e.target.value)}
                  placeholder="How should people address you?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone (Optional)</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("MyBulletinPosts"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Notice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
