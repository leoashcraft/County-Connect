import React, { useState, useEffect } from "react";
import { BulletinPost, User } from "@/api/entities";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Calendar, Edit, ScrollText, User as UserIcon } from "lucide-react";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function BulletinPostDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const postId = urlParams.get('id');
  const { settings } = useSiteSettings();

  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    if (!postId) {
      navigate(createPageUrl("BulletinBoard"));
      return;
    }

    try {
      const postData = await BulletinPost.get(postId);
      if (!postData) {
        alert("Post not found");
        navigate(createPageUrl("BulletinBoard"));
        return;
      }

      // Check if expired
      if (postData.expires_at && new Date(postData.expires_at) < new Date()) {
        alert("This post has expired");
        navigate(createPageUrl("BulletinBoard"));
        return;
      }

      setPost(postData);

      const userData = await User.me().catch(() => null);
      setUser(userData);
    } catch (error) {
      console.error("Error loading bulletin post:", error);
      navigate(createPageUrl("BulletinBoard"));
    }

    setLoading(false);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'free_swap': return 'bg-green-100 text-green-800';
      case 'rideshare': return 'bg-blue-100 text-blue-800';
      case 'babysitters': return 'bg-pink-100 text-pink-800';
      case 'church_nonprofit': return 'bg-purple-100 text-purple-800';
      case 'volunteers': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      general: "General",
      free_swap: "Free/Swap",
      rideshare: "Ride Share",
      babysitters: "Babysitters",
      church_nonprofit: "Church/Nonprofit",
      volunteers: "Volunteers"
    };
    return labels[category] || category;
  };

  const getDaysUntilExpiry = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const isOwner = user && post && (user.email === post.created_by);

  if (loading || !post) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <ScrollText className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  const daysLeft = getDaysUntilExpiry(post.expires_at);

  return (
    <>
      <MetaTags
        title={`${post.title} - Bulletin Board in ${settings.county_name || 'Navarro'} County`}
        description={post.content?.substring(0, 160) || `Community bulletin post in ${settings.county_name || 'Navarro'} County, TX.`}
      />
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("BulletinBoard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Notice Details</h1>
          </div>
          {isOwner && (
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl(`EditBulletinPost?id=${post.id}`))}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Post Info */}
        <Card className="border-2 border-orange-200 mb-6">
          <CardHeader className="border-b border-orange-100 bg-orange-50/50">
            <div className="flex items-start justify-between mb-3">
              <Badge className={getCategoryColor(post.category)}>
                {getCategoryLabel(post.category)}
              </Badge>
              {daysLeft !== null && (
                <Badge variant={daysLeft <= 7 ? "destructive" : "outline"} className="border-orange-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining` : 'Expires today'}
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            {post.created_date && (
              <p className="text-sm text-gray-600 mt-2">
                Posted on {new Date(post.created_date).toLocaleDateString()}
              </p>
            )}
          </CardHeader>

          <CardContent className="p-6">
            {post.description && (
              <div className="mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
              </div>
            )}

            {(post.location || post.event_date) && (
              <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
                {post.location && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Location</p>
                    <p className="text-gray-700">{post.location}</p>
                  </div>
                )}

                {post.event_date && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Event Date</p>
                    <p className="text-gray-700">{new Date(post.event_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {post.contact_name && (
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700 font-medium">{post.contact_name}</span>
                </div>
              )}

              {post.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <SafeEmail email={post.contact_email} className="text-orange-600 hover:text-orange-700 font-medium" />
                </div>
              )}

              {post.contact_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <a
                    href={`tel:${post.contact_phone}`}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {post.contact_phone}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
