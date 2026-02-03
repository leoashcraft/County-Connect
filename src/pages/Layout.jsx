

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Store, ShoppingBag, LayoutDashboard, Package, LogOut, User as UserIcon, ShoppingCart, TrendingUp, Heart, MessageSquare, LifeBuoy, Briefcase, ScrollText, Search, Truck, Calendar, MapPin, Utensils, Building2, Church, Trophy, GraduationCap, FileText, ExternalLink, Compass, Home } from "lucide-react";
import { User, SiteSetting, NavigationItem } from "@/api/entities";
import { Cart } from "@/api/entities";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CookieConsent, ManageCookiesButton } from "@/components/CookieConsent";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [cartCount, setCartCount] = React.useState(0);
  const [menuOrder, setMenuOrder] = React.useState(null);
  const [customNavItems, setCustomNavItems] = React.useState([]);
  const loadingCartRef = React.useRef(false);

  // Get site branding from settings
  const siteName = settings.site_name || "CountyConnect";
  const siteTagline = settings.site_tagline || "Your Local Community";

  React.useEffect(() => {
    loadUser();
    loadMenuOrder();
    // Prevent clickjacking
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  }, []);

  React.useEffect(() => {
    // Listen for cart update events
    const handleCartUpdate = () => {
      if (user) {
        loadCartCount(user.email);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      loadCartCount(userData.email);
    } catch (error) {
      console.log("Layout: User not authenticated, error:", error);
      // Don't redirect - just leave user as null
    }
    setLoading(false);
  };

  const loadMenuOrder = async () => {
    try {
      const navSettings = await SiteSetting.filter({ setting_key: 'navigation_order' });
      if (navSettings && navSettings.length > 0) {
        setMenuOrder(navSettings[0].setting_value);
      }
    } catch (error) {
      console.log("No custom navigation order found, using defaults");
    }

    // Load custom navigation items
    try {
      const customItems = await NavigationItem.list('order');
      setCustomNavItems(customItems.filter(item => item.is_visible));
    } catch (error) {
      console.log("No custom navigation items found");
    }
  };

  const loadCartCount = async (email) => {
    // Prevent multiple simultaneous loads
    if (loadingCartRef.current) {
      console.log("Cart count load already in progress, skipping");
      return;
    }

    loadingCartRef.current = true;

    try {
      const cartItems = await Cart.filter({ user_email: email });
      setCartCount(cartItems.length);
    } catch (error) {
      console.error("Error loading cart count:", error);
    } finally {
      loadingCartRef.current = false;
    }
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  // Helper to get ordered navigation items based on admin settings
  const getOrderedNavigationItems = (items) => {
    if (!menuOrder) return items;

    try {
      const itemMap = new Map(items.map(item => [getItemId(item), item]));

      // Create ordered list based on saved order, filtering out hidden items
      const orderedItems = menuOrder
        .filter(menuItem => menuItem.visible && itemMap.has(menuItem.id))
        .map(menuItem => itemMap.get(menuItem.id))
        .filter(Boolean);

      // Add any items that weren't in the saved order (newly added items)
      items.forEach(item => {
        const id = getItemId(item);
        if (!menuOrder.find(m => m.id === id)) {
          orderedItems.push(item);
        }
      });

      return orderedItems;
    } catch (error) {
      console.error("Error parsing navigation order:", error);
      return items;
    }
  };

  // Helper to map navigation items to their IDs
  const getItemId = (item) => {
    const titleToId = {
      "Marketplace": "marketplace",
      "Products & Goods": "marketplace",
      "Jobs & Gigs": "jobs",
      "Services & Rentals": "service-directory",
      "Business Directory": "business-directory",
      "Town Square": "town-square",
      "Bulletin Board": "bulletin-board",
      "Lost & Found": "lost-found",
      "Restaurants": "restaurants",
      "Food Trucks": "food-trucks",
      "Churches": "churches",
      "Sports Teams": "sports-teams",
      "Community Resources": "community-resources",
      "Schools & Childcare": "schools",
      "Local Events": "events",
      "Explore Navarro": "explore-navarro",
      "Real Estate": "real-estate",
      "Dashboard": "dashboard",
      "Shopping Cart": "cart",
      "Wishlist": "wishlist",
      "Messages": "messages",
      "Support": "support"
    };
    return titleToId[item.title] || item.title.toLowerCase().replace(/\s+/g, '-');
  };

  const defaultNavigationItems = [
    {
      title: "Products & Goods",
      url: createPageUrl("Marketplace"),
      icon: ShoppingBag,
    },
    {
      title: "Jobs & Gigs",
      url: createPageUrl("Jobs"),
      icon: Briefcase,
    },
    {
      title: "Services & Rentals",
      url: createPageUrl("ServiceDirectory"),
      icon: Briefcase,
    },
    {
      title: "Business Directory",
      url: createPageUrl("BusinessDirectory"),
      icon: Building2,
    },
    {
      title: "Town Square",
      url: createPageUrl("TownSquare"),
      icon: MessageSquare,
    },
    {
      title: "Bulletin Board",
      url: createPageUrl("BulletinBoard"),
      icon: ScrollText,
    },
    {
      title: "Lost & Found",
      url: createPageUrl("LostAndFound"),
      icon: Heart,
    },
    {
      title: "Restaurants",
      url: createPageUrl("Restaurants"),
      icon: Utensils,
    },
    {
      title: "Food Trucks",
      url: createPageUrl("FoodTrucks"),
      icon: Truck,
    },
    {
      title: "Churches",
      url: createPageUrl("Churches"),
      icon: Church,
    },
    {
      title: "Sports Teams",
      url: createPageUrl("SportsTeams"),
      icon: Trophy,
    },
    {
      title: "Community Resources",
      url: createPageUrl("CommunityResources"),
      icon: Heart,
    },
    {
      title: "Schools & Childcare",
      url: createPageUrl("Schools"),
      icon: GraduationCap,
    },
    {
      title: "Explore Navarro",
      url: createPageUrl("Attractions"),
      icon: Compass,
    },
    {
      title: "Real Estate",
      url: createPageUrl("Realty"),
      icon: Home,
    },
    {
      title: "Local Events",
      url: createPageUrl("Events"),
      icon: Calendar,
    },
    ...(user ? [
      {
        title: "Dashboard",
        url: createPageUrl("Dashboard"),
        icon: LayoutDashboard,
      },
      {
        title: "Shopping Cart",
        url: createPageUrl("Cart"),
        icon: ShoppingCart,
        badge: cartCount
      },
      {
        title: "Wishlist",
        url: createPageUrl("Wishlist"),
        icon: Heart,
      },
      {
        title: "Messages",
        url: createPageUrl("Messages"),
        icon: MessageSquare,
      },
      {
        title: "Support",
        url: createPageUrl("Support"),
        icon: LifeBuoy,
      }
    ] : []),
    ...(user?.role === 'admin' ? [
      {
        title: "Admin",
        url: createPageUrl("AdminDashboard"),
        icon: LayoutDashboard,
      }
    ] : []),
  ];

  // Apply custom ordering from admin settings
  const navigationItems = getOrderedNavigationItems(defaultNavigationItems);

  // Custom navigation items from database (pages and external links)
  const customNavigationItems = customNavItems.map(item => ({
    title: item.label,
    url: item.url,
    icon: item.link_type === 'page' ? FileText : ExternalLink,
    isExternal: item.link_type === 'external' && item.url?.startsWith('http')
  }));

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50" />;
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 28 85% 52%;
          --primary-foreground: 0 0% 100%;
          --secondary: 45 93% 47%;
          --secondary-foreground: 0 0% 100%;
          --accent: 20 90% 48%;
          --accent-foreground: 0 0% 100%;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-amber-50">
        <Sidebar className="border-r border-orange-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-orange-100 p-6">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{siteName}</h2>
                <p className="text-xs text-gray-500">{siteTagline}</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-orange-50 text-orange-700 font-medium' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-5 h-5" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge > 0 && (
                            <Badge className="bg-orange-500 text-white">{item.badge}</Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {/* Custom Navigation Items */}
                  {customNavigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-orange-50 text-orange-700 font-medium' : ''
                        }`}
                      >
                        {item.isExternal ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2">
                            <item.icon className="w-5 h-5" />
                            <span className="flex-1">{item.title}</span>
                          </a>
                        ) : (
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                            <item.icon className="w-5 h-5" />
                            <span className="flex-1">{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {!user && (
              <SidebarGroup className="mt-auto">
                <SidebarGroupContent>
                  <Button
                    onClick={() => User.login()}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          {user && (
            <SidebarFooter className="border-t border-orange-100 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{user.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </SidebarFooter>
          )}
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200" />
              <Link to={createPageUrl("Home")} className="flex items-center gap-2">
                <Store className="w-6 h-6 text-orange-600" />
                <h1 className="text-xl font-bold text-gray-900">{siteName}</h1>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Store className="w-6 h-6 text-orange-500" />
                    <span className="font-bold text-lg">{siteName}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {siteTagline}
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to={createPageUrl("Marketplace")} className="text-gray-400 hover:text-white transition">
                        Marketplace
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl("Jobs")} className="text-gray-400 hover:text-white transition">
                        Jobs
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl("CommunityResources")} className="text-gray-400 hover:text-white transition">
                        Community Resources
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl("Events")} className="text-gray-400 hover:text-white transition">
                        Events
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to={createPageUrl("PressPartnerships")} className="text-gray-400 hover:text-white transition">
                        Press & Partnerships
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl("Support")} className="text-gray-400 hover:text-white transition">
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to={createPageUrl("PrivacyPolicy")} className="text-gray-400 hover:text-white transition">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl("TermsOfService")} className="text-gray-400 hover:text-white transition">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl("CookiePolicy")} className="text-gray-400 hover:text-white transition">
                        Cookie Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">
                  &copy; 2026 Leo Ashcraft. All rights reserved.
                </p>
                <ManageCookiesButton className="text-gray-500 hover:text-white transition text-sm underline" />
              </div>
            </div>
          </footer>
        </main>

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </div>
    </SidebarProvider>
  );
}

