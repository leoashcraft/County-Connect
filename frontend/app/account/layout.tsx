import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {
  LayoutDashboard,
  User,
  BarChart3,
  Package,
  ShoppingCart,
  Heart,
  MessageSquare,
  LifeBuoy,
  Settings,
  LogOut,
} from 'lucide-react';

export const metadata: Metadata = {
  title: {
    default: 'My Account',
    template: '%s | My Account | CountyConnect',
  },
};

// Core navigation links - additional sections are on the dashboard
const accountNavLinks = [
  {
    title: 'Dashboard',
    href: '/account',
    icon: LayoutDashboard,
  },
  {
    title: 'My Profile',
    href: '/account/profile',
    icon: User,
  },
  {
    title: 'Vendor Dashboard',
    href: '/account/vendor',
    icon: BarChart3,
  },
  {
    title: 'My Orders',
    href: '/account/orders',
    icon: Package,
  },
  {
    title: 'Shopping Cart',
    href: '/account/cart',
    icon: ShoppingCart,
  },
  {
    title: 'Saved',
    href: '/account/saved',
    icon: Heart,
  },
  {
    title: 'Messages',
    href: '/account/messages',
    icon: MessageSquare,
  },
  {
    title: 'Support',
    href: '/account/support',
    icon: LifeBuoy,
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: Settings,
  },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account');
  }

  const user = session.user;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden sticky top-24">
            {/* User Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-3">
              <ul className="space-y-1">
                {accountNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sign Out */}
            <div className="p-3 border-t border-gray-100">
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
