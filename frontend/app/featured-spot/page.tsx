import { Metadata } from 'next';
import { FeaturedSpotForm } from './form';
import { Star, Eye, Search, MousePointer, Shield, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Claim a Featured Spot',
  description: 'Feature your business on a high-visibility page in Navarro County',
};

export default function FeaturedSpotPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Claim a Featured Spot
              </h1>
              <p className="text-gray-600 mb-8">
                Feature your business exclusively on a high-visibility page
              </p>

              <FeaturedSpotForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Page Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Featured Spot</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Homepage Featured Position</p>
                <p className="text-brand-600 font-medium">/</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Available
                </span>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Benefits of Claiming</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Exclusive Placement</h3>
                    <p className="text-sm text-gray-600">You're the only business featured in this spot</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">SEO Benefits</h3>
                    <p className="text-sm text-gray-600">High-quality, locally-focused content drives organic traffic</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Local Visibility</h3>
                    <p className="text-sm text-gray-600">Connect with customers in Navarro County</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <MousePointer className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Direct Contact</h3>
                    <p className="text-sm text-gray-600">Prominent call-to-action buttons for your business</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Your Privacy</h3>
                  <p className="text-sm text-gray-600">
                    Your information is only used to process this inquiry. We never sell or share your data with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Questions?</h3>
                  <Link href="/contact" className="text-sm text-brand-600 hover:underline">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
