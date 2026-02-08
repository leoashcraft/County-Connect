import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Shield, HelpCircle } from 'lucide-react';
import { ReportClosureForm } from './form';

export const metadata: Metadata = {
  title: 'Report a Closure',
  description: 'Report a permanent or temporary business closure in Navarro County',
};

export default async function ReportClosurePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const listingName = typeof params.listing === 'string' ? params.listing : '';
  const listingType = typeof params.type === 'string' ? params.type : '';
  const listingId = typeof params.id === 'string' ? params.id : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            {listingType && (
              <>
                <Link href={`/directory/${listingType}`} className="hover:text-brand-600 capitalize">
                  {listingType.replace(/-/g, ' ')}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900 font-medium">Report Closure</span>
          </nav>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Report a Closure</h1>
                  <p className="text-gray-600 mt-1">
                    Help us keep our directory accurate by reporting businesses that have closed.
                  </p>
                </div>
              </div>

              <ReportClosureForm
                listingName={listingName}
                listingType={listingType}
                listingId={listingId}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Listing Info */}
            {listingName && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Reporting About</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-900">{listingName}</p>
                  {listingType && (
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      {listingType.replace(/-/g, ' ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Why Report */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Why Report Closures?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  Helps others avoid visiting closed businesses
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  Keeps our directory accurate and trustworthy
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  Supports local community information
                </li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 text-sm">Your Privacy</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Contact info is optional and only used if we need to verify the report.
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
