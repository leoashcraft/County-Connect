import React, { useState, useEffect } from "react";
import { BulletinPost, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Search, Calendar, MessageCircle, Plus } from "lucide-react";
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function BulletinBoard() {
  const navigate = useNavigate();
  const { state: filterState } = useLocationFilter();
  const { settings } = useSiteSettings();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      // Load user's preferred town if they have one
      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
      }

      // Load all towns for the filter modal
      const allTowns = await Town.list('name');
      setTowns(allTowns);

      const allPosts = await BulletinPost.list('-created_date');

      // Filter out expired posts
      const activePosts = allPosts.filter(post => {
        if (!post.expires_at) return true;
        return new Date(post.expires_at) > new Date();
      });

      setPosts(activePosts);
    } catch (error) {
      console.error("Error loading bulletin posts:", error);
    }
    setLoading(false);
  };

  // Apply search and category filters
  const searchAndCategoryFiltered = posts.filter(post => {
    const matchesSearch = !searchTerm ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Apply location filter using global filter state
  const filteredPosts = applyLocationFilter(
    searchAndCategoryFiltered,
    filterState,
    userTown,
    (post) => post.town_id
  );

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "free_swap", label: "Free/Swap" },
    { value: "rideshare", label: "Ride Share" },
    { value: "babysitters", label: "Babysitters" },
    { value: "church_nonprofit", label: "Church/Nonprofit" },
    { value: "volunteers", label: "Volunteers" }
  ];

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

  const getDaysUntilExpiry = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <ScrollText className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Bulletin Board - ${settings.county_name || 'Navarro'} County, TX`}
        description={`Community bulletin board for ${settings.county_name || 'Navarro'} County, Texas. Post announcements, classifieds, and community notices.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ScrollText className="w-8 h-8 text-orange-600" />
                Community Bulletin Board
              </h1>
              <p className="text-gray-600 mt-2">Share and discover community notices</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate(createPageUrl("AddBulletinPost"))}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Notice
              </Button>
            )}
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="bulletin posts"
        />

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulletin Posts */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPosts.length === 0 ? (
            <div className="col-span-2">
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <ScrollText className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No notices found</h3>
                  <p className="text-gray-600">
                    {searchTerm || categoryFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Be the first to post a community notice!"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredPosts.map(post => {
              const daysLeft = getDaysUntilExpiry(post.expires_at);

              return (
                <Card
                  key={post.id}
                  className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(createPageUrl(`BulletinPostDetail?id=${post.id}`))}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getCategoryColor(post.category)}>
                        {categories.find(c => c.value === post.category)?.label || post.category}
                      </Badge>
                      {daysLeft !== null && daysLeft <= 7 && (
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          <Calendar className="w-3 h-3 mr-1" />
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>

                    {post.description && (
                      <p className="text-gray-700 mb-3 line-clamp-3">{post.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-orange-100">
                      {post.contact_name && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.contact_name}
                        </div>
                      )}
                      {post.created_date && (
                        <span>Posted {new Date(post.created_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
    </>
  );
}
