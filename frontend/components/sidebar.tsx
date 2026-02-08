'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Store, ShoppingBag, LayoutDashboard, LogOut, User as UserIcon,
  ShoppingCart, Heart, MessageSquare, LifeBuoy, Briefcase,
  ScrollText, Truck, Calendar, MapPin, Utensils, Building2,
  Church, Trophy, GraduationCap, Compass, Home, X, BookOpen
} from 'lucide-react';
import { WeatherWidget } from '@/components/weather-widget';

// Sidebar-wide theme applied based on current route
type SidebarTheme = {
  logo: string;
  btn: string;
  btnHover: string;
  avatar: string;
  accountActive: string;
  accountHover: string;
};

const SIDEBAR_THEMES: Record<string, SidebarTheme> = {
  brand:   { logo: 'from-brand-700 to-brand-500', btn: 'from-brand-700 to-brand-500', btnHover: 'hover:from-brand-800 hover:to-brand-600', avatar: 'from-brand-500 to-brand-400', accountActive: 'bg-brand-50 text-brand-700', accountHover: 'hover:bg-brand-50 hover:text-brand-700' },
  emerald: { logo: 'from-emerald-500 to-teal-500', btn: 'from-emerald-500 to-teal-500', btnHover: 'hover:from-emerald-600 hover:to-teal-600', avatar: 'from-emerald-400 to-teal-400', accountActive: 'bg-emerald-50 text-emerald-700', accountHover: 'hover:bg-emerald-50 hover:text-emerald-700' },
  blue:    { logo: 'from-blue-500 to-indigo-500', btn: 'from-blue-500 to-indigo-500', btnHover: 'hover:from-blue-600 hover:to-indigo-600', avatar: 'from-blue-400 to-indigo-400', accountActive: 'bg-blue-50 text-blue-700', accountHover: 'hover:bg-blue-50 hover:text-blue-700' },
  sky:     { logo: 'from-sky-400 to-blue-400', btn: 'from-sky-400 to-blue-400', btnHover: 'hover:from-sky-500 hover:to-blue-500', avatar: 'from-sky-400 to-blue-400', accountActive: 'bg-sky-50 text-sky-700', accountHover: 'hover:bg-sky-50 hover:text-sky-700' },
  purple:  { logo: 'from-purple-500 to-indigo-500', btn: 'from-purple-500 to-indigo-500', btnHover: 'hover:from-purple-600 hover:to-indigo-600', avatar: 'from-purple-400 to-indigo-400', accountActive: 'bg-purple-50 text-purple-700', accountHover: 'hover:bg-purple-50 hover:text-purple-700' },
  lime:    { logo: 'from-lime-500 to-green-500', btn: 'from-lime-500 to-green-500', btnHover: 'hover:from-lime-600 hover:to-green-600', avatar: 'from-lime-400 to-green-400', accountActive: 'bg-lime-50 text-lime-700', accountHover: 'hover:bg-lime-50 hover:text-lime-700' },
  rose:    { logo: 'from-rose-500 to-pink-400', btn: 'from-rose-500 to-pink-400', btnHover: 'hover:from-rose-600 hover:to-pink-500', avatar: 'from-rose-500 to-pink-400', accountActive: 'bg-rose-50 text-rose-700', accountHover: 'hover:bg-rose-50 hover:text-rose-700' },
  red:     { logo: 'from-red-500 to-rose-500', btn: 'from-red-500 to-rose-500', btnHover: 'hover:from-red-600 hover:to-rose-600', avatar: 'from-red-400 to-rose-400', accountActive: 'bg-red-50 text-red-700', accountHover: 'hover:bg-red-50 hover:text-red-700' },
  yellow:  { logo: 'from-yellow-600 to-amber-500', btn: 'from-yellow-600 to-amber-500', btnHover: 'hover:from-yellow-700 hover:to-amber-600', avatar: 'from-yellow-500 to-amber-400', accountActive: 'bg-yellow-50 text-yellow-700', accountHover: 'hover:bg-yellow-50 hover:text-yellow-700' },
  indigo:  { logo: 'from-indigo-500 to-violet-500', btn: 'from-indigo-500 to-violet-500', btnHover: 'hover:from-indigo-600 hover:to-violet-600', avatar: 'from-indigo-400 to-violet-400', accountActive: 'bg-indigo-50 text-indigo-700', accountHover: 'hover:bg-indigo-50 hover:text-indigo-700' },
  teal:    { logo: 'from-teal-500 to-emerald-500', btn: 'from-teal-500 to-emerald-500', btnHover: 'hover:from-teal-600 hover:to-emerald-600', avatar: 'from-teal-400 to-emerald-400', accountActive: 'bg-teal-50 text-teal-700', accountHover: 'hover:bg-teal-50 hover:text-teal-700' },
  cyan:    { logo: 'from-cyan-500 to-sky-500', btn: 'from-cyan-500 to-sky-500', btnHover: 'hover:from-cyan-600 hover:to-sky-600', avatar: 'from-cyan-400 to-sky-400', accountActive: 'bg-cyan-50 text-cyan-700', accountHover: 'hover:bg-cyan-50 hover:text-cyan-700' },
  violet:  { logo: 'from-violet-500 to-purple-500', btn: 'from-violet-500 to-purple-500', btnHover: 'hover:from-violet-600 hover:to-purple-600', avatar: 'from-violet-400 to-purple-400', accountActive: 'bg-violet-50 text-violet-700', accountHover: 'hover:bg-violet-50 hover:text-violet-700' },
  slate:   { logo: 'from-slate-500 to-gray-500', btn: 'from-slate-500 to-gray-500', btnHover: 'hover:from-slate-600 hover:to-gray-600', avatar: 'from-slate-400 to-gray-400', accountActive: 'bg-slate-100 text-slate-700', accountHover: 'hover:bg-slate-100 hover:text-slate-700' },
  amber:   { logo: 'from-amber-600 to-yellow-600', btn: 'from-amber-600 to-yellow-600', btnHover: 'hover:from-amber-700 hover:to-yellow-700', avatar: 'from-amber-500 to-yellow-500', accountActive: 'bg-amber-50 text-amber-700', accountHover: 'hover:bg-amber-50 hover:text-amber-700' },
  pink:    { logo: 'from-pink-400 to-rose-400', btn: 'from-pink-400 to-rose-400', btnHover: 'hover:from-pink-500 hover:to-rose-500', avatar: 'from-pink-400 to-rose-400', accountActive: 'bg-pink-50 text-pink-700', accountHover: 'hover:bg-pink-50 hover:text-pink-700' },
};

// Route prefix → theme key
const ROUTE_THEMES: [string, string][] = [
  ['/marketplace', 'blue'],
  ['/directory/jobs', 'sky'],
  ['/services', 'brand'],
  ['/directory/businesses', 'blue'],
  ['/community/forum', 'purple'],
  ['/community/bulletin', 'lime'],
  ['/community/lost-and-found', 'rose'],
  ['/directory/restaurants', 'red'],
  ['/directory/food-trucks', 'yellow'],
  ['/directory/churches', 'indigo'],
  ['/directory/sports-teams', 'emerald'],
  ['/directory/community-resources', 'teal'],
  ['/directory/schools', 'cyan'],
  ['/directory/attractions', 'violet'],
  ['/directory/public-services', 'slate'],
  ['/directory/real-estate', 'amber'],
  ['/directory/events', 'pink'],
];

function getRouteTheme(pathname: string): SidebarTheme {
  for (const [prefix, key] of ROUTE_THEMES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return SIDEBAR_THEMES[key];
    }
  }
  return SIDEBAR_THEMES.brand;
}

const publicNavItems = [
  { title: 'Local Guides', href: '/guides', icon: BookOpen, active: 'bg-brand-50 text-brand-700', hover: 'hover:bg-brand-50 hover:text-brand-700' },
  { title: 'Products & Goods', href: '/marketplace', icon: ShoppingBag, active: 'bg-blue-50 text-blue-700', hover: 'hover:bg-blue-50 hover:text-blue-700' },
  { title: 'Jobs & Gigs', href: '/directory/jobs', icon: Briefcase, active: 'bg-sky-50 text-sky-700', hover: 'hover:bg-sky-50 hover:text-sky-700' },
  { title: 'Services & Rentals', href: '/services', icon: Briefcase, active: 'bg-brand-50 text-brand-700', hover: 'hover:bg-brand-50 hover:text-brand-700' },
  { title: 'Business Directory', href: '/directory/businesses', icon: Building2, active: 'bg-blue-50 text-blue-700', hover: 'hover:bg-blue-50 hover:text-blue-700' },
  { title: 'Town Square', href: '/community/forum', icon: MessageSquare, active: 'bg-purple-50 text-purple-700', hover: 'hover:bg-purple-50 hover:text-purple-700' },
  { title: 'Bulletin Board', href: '/community/bulletin', icon: ScrollText, active: 'bg-lime-50 text-lime-700', hover: 'hover:bg-lime-50 hover:text-lime-700' },
  { title: 'Lost & Found', href: '/community/lost-and-found', icon: Heart, active: 'bg-rose-50 text-rose-700', hover: 'hover:bg-rose-50 hover:text-rose-700' },
  { title: 'Restaurants', href: '/directory/restaurants', icon: Utensils, active: 'bg-red-50 text-red-700', hover: 'hover:bg-red-50 hover:text-red-700' },
  { title: 'Food Trucks', href: '/directory/food-trucks', icon: Truck, active: 'bg-yellow-50 text-yellow-700', hover: 'hover:bg-yellow-50 hover:text-yellow-700' },
  { title: 'Churches', href: '/directory/churches', icon: Church, active: 'bg-indigo-50 text-indigo-700', hover: 'hover:bg-indigo-50 hover:text-indigo-700' },
  { title: 'Sports Teams', href: '/directory/sports-teams', icon: Trophy, active: 'bg-emerald-50 text-emerald-700', hover: 'hover:bg-emerald-50 hover:text-emerald-700' },
  { title: 'Community Resources', href: '/directory/community-resources', icon: Heart, active: 'bg-teal-50 text-teal-700', hover: 'hover:bg-teal-50 hover:text-teal-700' },
  { title: 'Schools & Childcare', href: '/directory/schools', icon: GraduationCap, active: 'bg-cyan-50 text-cyan-700', hover: 'hover:bg-cyan-50 hover:text-cyan-700' },
  { title: 'Explore Navarro', href: '/directory/attractions', icon: Compass, active: 'bg-violet-50 text-violet-700', hover: 'hover:bg-violet-50 hover:text-violet-700' },
  { title: 'Public Services', href: '/directory/public-services', icon: Building2, active: 'bg-slate-100 text-slate-700', hover: 'hover:bg-slate-100 hover:text-slate-700' },
  { title: 'Real Estate', href: '/directory/real-estate', icon: Home, active: 'bg-amber-50 text-amber-700', hover: 'hover:bg-amber-50 hover:text-amber-700' },
  { title: 'Local Events', href: '/directory/events', icon: Calendar, active: 'bg-pink-50 text-pink-700', hover: 'hover:bg-pink-50 hover:text-pink-700' },
];

const userNavItems = [
  { title: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { title: 'Shopping Cart', href: '/account/cart', icon: ShoppingCart },
  { title: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { title: 'Messages', href: '/account/messages', icon: MessageSquare },
  { title: 'Support', href: '/account/support', icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const theme = getRouteTheme(pathname);

  const closeMobileSidebar = () => {
    document.getElementById('mobile-sidebar')?.classList.add('-translate-x-full');
    document.getElementById('mobile-sidebar')?.classList.remove('translate-x-0');
    document.getElementById('sidebar-overlay')?.classList.add('hidden');
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 pb-4">
        <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileSidebar}>
          <div className={`w-10 h-10 bg-gradient-to-br ${theme.logo} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">CountyConnect</h2>
            <p className="text-xs text-gray-500">Navarro County, TX</p>
          </div>
        </Link>
        <div className="mt-3 min-[1440px]:hidden">
          <WeatherWidget variant="compact" />
        </div>
        <p className="text-xs text-gray-400 italic mt-2">Not affiliated with Navarro County government.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Navigation
          </p>
        </div>
        <ul className="space-y-1">
          {publicNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    isActive
                      ? `${item.active} font-medium`
                      : `text-gray-700 ${item.hover}`
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {user && (
          <>
            <div className="mt-6 mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                My Account
              </p>
            </div>
            <ul className="space-y-1">
              {userNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMobileSidebar}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? `${theme.accountActive} font-medium`
                          : `text-gray-700 ${theme.accountHover}`
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {!user && status !== 'loading' && (
          <div className="mt-6 px-3">
            <button
              onClick={() => signIn('google')}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${theme.btn} ${theme.btnHover} text-white rounded-lg transition-all duration-200 text-sm font-medium`}
            >
              <UserIcon className="w-4 h-4" />
              Sign In
            </button>
          </div>
        )}
      </nav>

      {/* User footer */}
      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${theme.avatar} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-semibold text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col bg-white/80 backdrop-blur-sm border-r border-gray-200 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        id="sidebar-overlay"
        className="hidden fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={closeMobileSidebar}
      />

      {/* Mobile sidebar */}
      <aside
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 w-72 bg-white z-50 transform -translate-x-full transition-transform duration-300 ease-in-out md:hidden flex flex-col"
      >
        <button
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
