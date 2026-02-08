import {
  User,
  BarChart3,
  Building2,
  Package,
  Briefcase,
  Megaphone,
  Search,
  UtensilsCrossed,
  Truck,
  Church,
  GraduationCap,
  Trophy,
  Home,
  Heart,
  ShoppingCart,
  MessageSquare,
  LifeBuoy,
  Settings,
} from 'lucide-react';

export type DashboardSectionId =
  | 'profile'
  | 'vendor'
  | 'businesses'
  | 'orders'
  | 'jobs'
  | 'bulletins'
  | 'lost-found'
  | 'restaurants'
  | 'food-trucks'
  | 'churches'
  | 'schools'
  | 'sports-teams'
  | 'real-estate'
  | 'community-resources'
  | 'saved'
  | 'cart'
  | 'messages'
  | 'support';

export interface DashboardSection {
  id: DashboardSectionId;
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  // Content type to check for auto-show (if user has created any)
  contentType?: string;
  // For local-business, filter by businessType
  businessType?: string;
  // Owner field to check (owner or organizer)
  ownerField?: string;
  // Always visible (can't be hidden)
  alwaysVisible?: boolean;
  // Visible by default even if no content
  defaultVisible?: boolean;
}

export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    id: 'profile',
    title: 'My Profile',
    description: 'Manage your personal information',
    href: '/account/profile',
    icon: User,
    color: 'bg-blue-100 text-blue-600',
    alwaysVisible: true,
    defaultVisible: true,
  },
  {
    id: 'vendor',
    title: 'Vendor Dashboard',
    description: 'View sales analytics and performance',
    href: '/account/vendor',
    icon: BarChart3,
    color: 'bg-emerald-100 text-emerald-600',
    defaultVisible: true,
  },
  {
    id: 'orders',
    title: 'My Orders',
    description: 'Track your purchases and orders',
    href: '/account/orders',
    icon: Package,
    color: 'bg-purple-100 text-purple-600',
    contentType: 'orders',
    defaultVisible: true,
  },
  {
    id: 'businesses',
    title: 'My Businesses',
    description: 'Manage your businesses and services',
    href: '/account/my-businesses',
    icon: Building2,
    color: 'bg-indigo-100 text-indigo-600',
    contentType: 'local-businesses',
    businessType: 'business',
    ownerField: 'owner',
  },
  {
    id: 'jobs',
    title: 'My Jobs & Gigs',
    description: 'Manage your job postings',
    href: '/account/my-jobs',
    icon: Briefcase,
    color: 'bg-sky-100 text-sky-600',
    contentType: 'jobs',
    ownerField: 'postedBy',
  },
  {
    id: 'bulletins',
    title: 'My Bulletin Posts',
    description: 'Manage your community announcements',
    href: '/account/my-bulletins',
    icon: Megaphone,
    color: 'bg-amber-100 text-amber-600',
    contentType: 'bulletin-posts',
    ownerField: 'author',
  },
  {
    id: 'lost-found',
    title: 'My Lost & Found',
    description: 'Manage your lost & found posts',
    href: '/account/my-lost-found',
    icon: Search,
    color: 'bg-rose-100 text-rose-600',
    contentType: 'lost-and-found-posts',
    ownerField: 'postedBy',
  },
  {
    id: 'restaurants',
    title: 'My Restaurants',
    description: 'Manage your restaurant listings',
    href: '/account/my-restaurants',
    icon: UtensilsCrossed,
    color: 'bg-red-100 text-red-600',
    contentType: 'restaurants',
    ownerField: 'owner',
  },
  {
    id: 'food-trucks',
    title: 'My Food Trucks',
    description: 'Manage your food truck listings',
    href: '/account/my-food-trucks',
    icon: Truck,
    color: 'bg-yellow-100 text-yellow-700',
    contentType: 'local-businesses',
    businessType: 'food-truck',
    ownerField: 'owner',
  },
  {
    id: 'churches',
    title: 'My Churches',
    description: 'Manage your church listings',
    href: '/account/my-churches',
    icon: Church,
    color: 'bg-violet-100 text-violet-600',
    contentType: 'churches',
    ownerField: 'owner',
  },
  {
    id: 'schools',
    title: 'My Schools',
    description: 'Manage your school listings',
    href: '/account/my-schools',
    icon: GraduationCap,
    color: 'bg-cyan-100 text-cyan-600',
    contentType: 'schools',
    ownerField: 'owner',
  },
  {
    id: 'sports-teams',
    title: 'My Sports Teams',
    description: 'Manage your sports team listings',
    href: '/account/my-sports-teams',
    icon: Trophy,
    color: 'bg-green-100 text-green-600',
    contentType: 'local-businesses',
    businessType: 'sports-team',
    ownerField: 'owner',
  },
  {
    id: 'real-estate',
    title: 'My Real Estate',
    description: 'Manage your property listings',
    href: '/account/my-real-estate',
    icon: Home,
    color: 'bg-orange-100 text-orange-600',
    contentType: 'real-estates',
    ownerField: 'listedBy',
  },
  {
    id: 'community-resources',
    title: 'My Community Resources',
    description: 'Manage your community resource listings',
    href: '/account/my-community-resources',
    icon: Heart,
    color: 'bg-teal-100 text-teal-600',
    contentType: 'local-businesses',
    businessType: 'community-resource',
    ownerField: 'owner',
  },
  {
    id: 'saved',
    title: 'Saved',
    description: 'Your saved restaurants, guides, and more',
    href: '/account/saved',
    icon: Heart,
    color: 'bg-pink-100 text-pink-600',
    defaultVisible: true,
  },
  {
    id: 'cart',
    title: 'Shopping Cart',
    description: 'Items ready for checkout',
    href: '/account/cart',
    icon: ShoppingCart,
    color: 'bg-amber-100 text-amber-600',
    defaultVisible: true,
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'Your conversations and inquiries',
    href: '/account/messages',
    icon: MessageSquare,
    color: 'bg-indigo-100 text-indigo-600',
    defaultVisible: true,
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Get help and submit tickets',
    href: '/account/support',
    icon: LifeBuoy,
    color: 'bg-red-100 text-red-600',
    defaultVisible: true,
  },
];

// Sections that are always shown and can't be customized
export const FIXED_SECTIONS = DASHBOARD_SECTIONS.filter(s => s.alwaysVisible);

// Sections shown by default (can be hidden)
export const DEFAULT_VISIBLE_SECTIONS = DASHBOARD_SECTIONS.filter(s => s.defaultVisible);

// Sections that auto-show when user has content
export const AUTO_SHOW_SECTIONS = DASHBOARD_SECTIONS.filter(s => s.contentType);
