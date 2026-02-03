import React, { useState, useEffect } from "react";
import { BulletinPost, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Edit, Eye, Trash2, Plus, Calendar, AlertCircle, ArrowLeft } from "lucide-react";

export default function MyBulletinPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const allPosts = await BulletinPost.list('-created_date');
      const myPosts = allPosts.filter(post => post.created_by === userData.id);
      setPosts(myPosts);
    } catch (error) {
      console.error("Error loading bulletin posts:", error);
      navigate(createPageUrl("BulletinBoard"));
    }
    setLoading(false);
  };

  const deletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      await BulletinPost.delete(postId);
      await loadMyPosts();
    } catch (error) {
      console.error("Error deleting bulletin post:", error);
      alert("Failed to delete notice");
    }
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

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <ScrollText className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ScrollText className="w-8 h-8 text-orange-600" />
                My Bulletin Notices
              </h1>
              <p className="text-gray-600 mt-2">Manage your community posts</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl("AddBulletinPost"))}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Notice
            </Button>
          </div>
        </div>

        {/* Bulletin Posts */}
        <div className="grid md:grid-cols-2 gap-4">
          {posts.length === 0 ? (
            <div className="col-span-2">
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <ScrollText className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No notices yet</h3>
                  <p className="text-gray-600 mb-6">Post your first community notice</p>
                  <Button
                    onClick={() => navigate(createPageUrl("AddBulletinPost"))}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post a Notice
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            posts.map(post => {
              const daysLeft = getDaysUntilExpiry(post.expires_at);
              const expired = isExpired(post.expires_at);

              return (
                <Card key={post.id} className={`border-2 ${expired ? 'border-red-200 bg-red-50/30' : 'border-orange-100'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryLabel(post.category)}
                      </Badge>
                      {expired ? (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Expired
                        </Badge>
                      ) : daysLeft !== null && daysLeft <= 7 && (
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          <Calendar className="w-3 h-3 mr-1" />
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>

                    {post.description && (
                      <p className="text-gray-700 mb-3 line-clamp-2">{post.description}</p>
                    )}

                    <div className="text-sm text-gray-600 mb-4">
                      {post.created_date && (
                        <span>Posted {new Date(post.created_date).toLocaleDateString()}</span>
                      )}
                      {post.expires_at && !expired && (
                        <>
                          {' • '}
                          <span>Expires {new Date(post.expires_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`BulletinPostDetail?id=${post.id}`))}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`EditBulletinPost?id=${post.id}`))}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
