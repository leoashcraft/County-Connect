import React, { useState, useEffect } from "react";
import {
  User,
  Store,
  Order,
  Job,
  BulletinPost,
  LostAndFound,
  Restaurant,
  FoodTruck,
  Church,
  School,
  SportsTeam,
  RealtyListing,
  CommunityResource
} from "@/api/entities";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Store as StoreIcon,
  Package,
  ShoppingBag,
  TrendingUp,
  Briefcase,
  ScrollText,
  Heart,
  Utensils,
  Truck,
  Calendar,
  LayoutDashboard,
  UserCircle,
  Building2,
  Church as ChurchIcon,
  GraduationCap,
  Trophy,
  Home,
  Users,
  ChevronDown,
  ChevronUp,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

const STORAGE_KEY = "dashboard_tile_visibility";

// Tiles that should always be visible (core features)
const ALWAYS_VISIBLE = ["My Profile", "Vendor Dashboard", "My Businesses", "My Orders"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [itemCounts, setItemCounts] = useState({});
  const [visibilityOverrides, setVisibilityOverrides] = useState({});

  const managementSections = [
    {
      key: "profile",
      title: "My Profile",
      url: createPageUrl("MyProfile"),
      icon: UserCircle,
      description: "Manage your personal information",
      color: "indigo",
      alwaysVisible: true
    },
    {
      key: "vendor",
      title: "Vendor Dashboard",
      url: createPageUrl("VendorDashboard"),
      icon: TrendingUp,
      description: "View sales analytics and performance",
      color: "green",
      alwaysVisible: true
    },
    {
      key: "stores",
      title: "My Businesses",
      url: createPageUrl("MyStores"),
      icon: Building2,
      description: "Manage your businesses, products, services, and jobs",
      color: "slate",
      alwaysVisible: true,
      entityKey: "stores"
    },
    {
      key: "orders",
      title: "My Orders",
      url: createPageUrl("MyOrders"),
      icon: ShoppingBag,
      description: "Track your purchases and orders",
      color: "blue",
      alwaysVisible: true,
      entityKey: "orders"
    },
    {
      key: "jobs",
      title: "My Jobs & Gigs",
      url: createPageUrl("MyJobs"),
      icon: Briefcase,
      description: "Manage job and gig postings",
      color: "orange",
      entityKey: "jobs"
    },
    {
      key: "bulletin",
      title: "My Bulletin Posts",
      url: createPageUrl("MyBulletinPosts"),
      icon: ScrollText,
      description: "Manage bulletin board posts",
      color: "yellow",
      entityKey: "bulletinPosts"
    },
    {
      key: "lostfound",
      title: "My Lost & Found",
      url: createPageUrl("MyLostAndFound"),
      icon: Heart,
      description: "Manage lost & found items",
      color: "pink",
      entityKey: "lostAndFound"
    },
    {
      key: "restaurants",
      title: "My Restaurants",
      url: createPageUrl("MyRestaurants"),
      icon: Utensils,
      description: "Manage your restaurants",
      color: "red",
      entityKey: "restaurants"
    },
    {
      key: "foodtrucks",
      title: "My Food Trucks",
      url: createPageUrl("MyFoodTrucks"),
      icon: Truck,
      description: "Manage your food trucks and truck stops",
      color: "amber",
      entityKey: "foodTrucks"
    },
    {
      key: "churches",
      title: "My Churches",
      url: createPageUrl("MyChurches"),
      icon: ChurchIcon,
      description: "Manage your church listings",
      color: "purple",
      entityKey: "churches"
    },
    {
      key: "schools",
      title: "My Schools",
      url: createPageUrl("MySchools"),
      icon: GraduationCap,
      description: "Manage your school listings",
      color: "cyan",
      entityKey: "schools"
    },
    {
      key: "sports",
      title: "My Sports Teams",
      url: createPageUrl("MySportsTeams"),
      icon: Trophy,
      description: "Manage your sports team listings",
      color: "green",
      entityKey: "sportsTeams"
    },
    {
      key: "realty",
      title: "My Real Estate",
      url: createPageUrl("MyRealtyListings"),
      icon: Home,
      description: "Manage your real estate listings",
      color: "teal",
      entityKey: "realtyListings"
    },
    {
      key: "community",
      title: "My Community Resources",
      url: createPageUrl("MyCommunityResources"),
      icon: Users,
      description: "Manage community resource listings",
      color: "indigo",
      entityKey: "communityResources"
    }
  ];

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadItemCounts();
      loadVisibilityPreferences();
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const loadItemCounts = async () => {
    if (!user) return;

    try {
      const [
        stores,
        orders,
        jobs,
        bulletinPosts,
        lostAndFound,
        restaurants,
        foodTrucks,
        churches,
        schools,
        sportsTeams,
        realtyListings,
        communityResources
      ] = await Promise.all([
        Store.filter({ created_by: user.id }).catch(() => []),
        Order.filter({ user_id: user.id }).catch(() => []),
        Job.filter({ created_by: user.id }).catch(() => []),
        BulletinPost.filter({ created_by: user.id }).catch(() => []),
        LostAndFound.filter({ created_by: user.id }).catch(() => []),
        Restaurant.filter({ created_by: user.id }).catch(() => []),
        FoodTruck.filter({ created_by: user.id }).catch(() => []),
        Church.filter({ created_by: user.id }).catch(() => []),
        School.filter({ created_by: user.id }).catch(() => []),
        SportsTeam.filter({ created_by: user.id }).catch(() => []),
        RealtyListing.filter({ created_by: user.id }).catch(() => []),
        CommunityResource.filter({ created_by: user.id }).catch(() => [])
      ]);

      setItemCounts({
        stores: stores.length,
        orders: orders.length,
        jobs: jobs.length,
        bulletinPosts: bulletinPosts.length,
        lostAndFound: lostAndFound.length,
        restaurants: restaurants.length,
        foodTrucks: foodTrucks.length,
        churches: churches.length,
        schools: schools.length,
        sportsTeams: sportsTeams.length,
        realtyListings: realtyListings.length,
        communityResources: communityResources.length
      });
    } catch (error) {
      console.error("Error loading item counts:", error);
    }
  };

  const loadVisibilityPreferences = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setVisibilityOverrides(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading visibility preferences:", error);
    }
  };

  const saveVisibilityPreferences = (newOverrides) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOverrides));
    } catch (error) {
      console.error("Error saving visibility preferences:", error);
    }
  };

  const toggleVisibility = (section) => {
    const newOverrides = {
      ...visibilityOverrides,
      [section.key]: !isVisible(section)
    };
    setVisibilityOverrides(newOverrides);
    saveVisibilityPreferences(newOverrides);
  };

  const isVisible = (section) => {
    // If there's an explicit override, use it
    if (visibilityOverrides.hasOwnProperty(section.key)) {
      return visibilityOverrides[section.key];
    }

    // Always visible tiles
    if (section.alwaysVisible) {
      return true;
    }

    // Default: show if user has items in this category
    if (section.entityKey && itemCounts[section.entityKey] > 0) {
      return true;
    }

    // Default to hidden for "My X" tiles without items
    return false;
  };

  const visibleSections = managementSections.filter(isVisible);
  const hiddenSections = managementSections.filter(s => !isVisible(s));

  const getColorClasses = (color) => {
    const colors = {
      indigo: "text-indigo-600",
      green: "text-green-600",
      purple: "text-purple-600",
      cyan: "text-cyan-600",
      slate: "text-slate-600",
      blue: "text-blue-600",
      orange: "text-orange-600",
      yellow: "text-yellow-600",
      pink: "text-pink-600",
      red: "text-red-600",
      amber: "text-amber-600",
      teal: "text-teal-600"
    };
    return colors[color] || "text-orange-600";
  };

  const getBgColorClasses = (color) => {
    const colors = {
      indigo: "bg-indigo-100",
      green: "bg-green-100",
      purple: "bg-purple-100",
      cyan: "bg-cyan-100",
      slate: "bg-slate-100",
      blue: "bg-blue-100",
      orange: "bg-orange-100",
      yellow: "bg-yellow-100",
      pink: "bg-pink-100",
      red: "bg-red-100",
      amber: "bg-amber-100",
      teal: "bg-teal-100"
    };
    return colors[color] || "bg-orange-100";
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-gray-600">Loading dashboard...</div>
    </div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Please sign in to access your dashboard</p>
        </div>
        <Card className="border-2 border-orange-100">
          <CardContent className="p-12 text-center">
            <LayoutDashboard className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h3>
            <p className="text-gray-600 mb-6">You need to be signed in to access your dashboard</p>
            <Button
              onClick={() => User.login()}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.full_name || user.email}!</p>
        </div>

        {/* Profile Completion Banner */}
        {!user.profile_completed && (
          <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <UserCircle className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Complete Your Profile</h3>
                  <p className="text-blue-800 mb-4">
                    Welcome to CountyConnect! Take a moment to complete your profile and set your preferred town.
                    This helps us personalize your experience and connect you with local businesses and services.
                  </p>
                  <Button
                    onClick={() => navigate(createPageUrl("MyProfile"))}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Complete Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customize Dashboard Section */}
        <Card className="border-2 border-orange-100 mb-6">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-orange-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-900">Customize Dashboard</span>
              {hiddenSections.length > 0 && (
                <span className="text-sm text-gray-500">
                  ({hiddenSections.length} hidden)
                </span>
              )}
            </div>
            {settingsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {settingsOpen && (
            <CardContent className="pt-0 pb-4 px-4 border-t border-orange-100">
              <p className="text-sm text-gray-600 mb-4">
                Choose which sections to display on your dashboard. Sections with items you've created are shown by default.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {managementSections.map((section) => {
                  const hasItems = section.entityKey && itemCounts[section.entityKey] > 0;
                  const visible = isVisible(section);

                  return (
                    <label
                      key={section.key}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        visible
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        checked={visible}
                        onCheckedChange={() => toggleVisibility(section)}
                        disabled={section.alwaysVisible}
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <section.icon className={`w-4 h-4 flex-shrink-0 ${getColorClasses(section.color)}`} />
                        <span className="text-sm font-medium truncate">{section.title}</span>
                      </div>
                      {hasItems && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getBgColorClasses(section.color)} ${getColorClasses(section.color)}`}>
                          {itemCounts[section.entityKey]}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Management Cards */}
        {visibleSections.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <EyeOff className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Sections Visible</h3>
              <p className="text-gray-600 mb-4">
                All dashboard sections are currently hidden. Use the settings above to show sections.
              </p>
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {visibleSections.map((section) => {
              const count = section.entityKey ? itemCounts[section.entityKey] : null;

              return (
                <Link key={section.key} to={section.url}>
                  <Card className="border-2 border-orange-100 hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardContent className="p-6 text-center relative">
                      {count > 0 && (
                        <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${getBgColorClasses(section.color)} ${getColorClasses(section.color)} font-semibold`}>
                          {count}
                        </span>
                      )}
                      <section.icon className={`w-12 h-12 mx-auto mb-3 ${getColorClasses(section.color)}`} />
                      <h3 className="font-bold text-gray-900 mb-1">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
