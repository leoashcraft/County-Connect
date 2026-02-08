import { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard, FileText, Users, ShoppingBag,
  MessageSquare, LifeBuoy, Settings, ExternalLink,
  BarChart3, Shield, Building2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

const adminLinks = [
  {
    title: 'Strapi Admin',
    description: 'Manage all content, service pages, and listings',
    href: process.env.NEXT_PUBLIC_STRAPI_URL + '/admin',
    icon: Settings,
    external: true,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Service Pages',
    description: 'View and manage 300+ service landing pages',
    href: process.env.NEXT_PUBLIC_STRAPI_URL + '/admin/content-manager/collection-types/api::service-page.service-page',
    icon: FileText,
    external: true,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Users',
    description: 'Manage user accounts and permissions',
    href: process.env.NEXT_PUBLIC_STRAPI_URL + '/admin/content-manager/collection-types/plugin::users-permissions.user',
    icon: Users,
    external: true,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Marketplace',
    description: 'Review and moderate marketplace listings',
    href: process.env.NEXT_PUBLIC_STRAPI_URL + '/admin/content-manager/collection-types/api::marketplace-listing.marketplace-listing',
    icon: ShoppingBag,
    external: true,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Support Tickets',
    description: 'Respond to user support requests',
    href: '/admin/support',
    icon: LifeBuoy,
    external: false,
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'Forum Moderation',
    description: 'Moderate community discussions',
    href: process.env.NEXT_PUBLIC_STRAPI_URL + '/admin/content-manager/collection-types/api::forum-post.forum-post',
    icon: MessageSquare,
    external: true,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Directory Listings',
    description: 'Manage business directory entries',
    href: process.env.NEXT_PUBLIC_STRAPI_URL + '/admin/content-manager/collection-types/api::local-business.local-business',
    icon: Building2,
    external: true,
    color: 'bg-teal-100 text-teal-600',
  },
  {
    title: 'Analytics',
    description: 'View site analytics and performance',
    href: '/admin/analytics',
    icon: BarChart3,
    external: false,
    color: 'bg-orange-100 text-orange-600',
  },
];

export default async function AdminPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  // Verify admin role - defense in depth
  const isAdmin = (session.user as any)?.isAdmin;
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage your CountyConnect platform. Most content management is done through the Strapi Admin panel.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {adminLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="group bg-white rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg p-6 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center`}>
                <link.icon className="w-6 h-6" />
              </div>
              {link.external && (
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
              {link.title}
            </h3>
            <p className="text-sm text-gray-500">{link.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Content Management</h3>
            <p className="text-sm text-gray-700 mb-3">
              All content types (service pages, directory listings, forum posts, etc.) are managed through the
              Strapi Admin Panel. Click &ldquo;Strapi Admin&rdquo; above to access the full content management system.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_STRAPI_URL + '/admin'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-700 font-medium hover:underline"
            >
              Open Strapi Admin
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
