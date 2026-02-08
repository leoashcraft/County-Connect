import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Star, Search, MapPin, Phone, Shield, HelpCircle } from 'lucide-react';
import { strapiGet, buildQueryString } from '@/lib/strapi';
import { InquiryForm } from './form';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Claim Guide Page',
  description: 'Feature your business exclusively on a high-visibility guide page - Navarro County, Texas.',
};

export default async function GuideInquiryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch the current guide page and all available guides
  let guidePage: any = null;
  let allGuides: { title: string; slug: string }[] = [];

  try {
    const [currentRes, allRes] = await Promise.all([
      strapiGet<any[]>(`/service-pages${buildQueryString({
        filters: { slug: { $eq: slug } },
        fields: ['title', 'slug'],
      })}`),
      strapiGet<any[]>(`/service-pages${buildQueryString({
        fields: ['title', 'slug'],
        sort: 'title:asc',
        pagination: { pageSize: 500 },
      })}`),
    ]);
    guidePage = currentRes.data?.[0] || null;
    allGuides = (allRes.data || []).map((g: any) => ({ title: g.title, slug: g.slug }));
  } catch (error) {
    console.error('Error fetching guides:', error);
  }

  if (!guidePage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-brand-600">Guides</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/guides/${slug}`} className="hover:text-brand-600">{guidePage.title}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Claim Page</span>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Claim the {guidePage.title} Page
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Feature your business exclusively on this high-visibility page
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <InquiryForm
                guideSlug={slug}
                guideTitle={guidePage.title}
                allGuides={allGuides}
              />
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Page Being Claimed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Page You're Claiming</h3>
              <div className="bg-brand-50 rounded-xl p-4">
                <p className="font-bold text-brand-900 text-lg">{guidePage.title}</p>
                <p className="text-brand-700 text-sm mt-1">/{slug}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Available
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Benefits of Claiming</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Exclusive Placement</p>
                    <p className="text-sm text-gray-600">You're the only business featured on this page</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">SEO Benefits</p>
                    <p className="text-sm text-gray-600">High-quality, locally-focused content drives organic traffic</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Local Visibility</p>
                    <p className="text-sm text-gray-600">Connect with customers in Navarro County</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Direct Contact</p>
                    <p className="text-sm text-gray-600">Prominent call-to-action buttons for your business</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 text-sm">Your Privacy</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your information is only used to process this inquiry. We never sell or share your data with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Questions?</p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
