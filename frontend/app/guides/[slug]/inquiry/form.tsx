'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Check, X, Search } from 'lucide-react';

interface GuideOption {
  title: string;
  slug: string;
}

interface InquiryFormProps {
  guideSlug: string;
  guideTitle: string;
  allGuides: GuideOption[];
}

export function InquiryForm({ guideSlug, guideTitle, allGuides }: InquiryFormProps) {
  const { data: session } = useSession();

  // Pre-select the current guide
  const [selectedGuides, setSelectedGuides] = useState<string[]>([guideSlug]);
  const [guideSearch, setGuideSearch] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    yearsInBusiness: '',
    contactName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    website: '',
    streetAddress: '',
    city: 'Corsicana',
    description: '',
    valueProposition: '',
    suggestedGuides: '',
    agreedToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setSubmitting(true);

    try {
      const token = (session?.user as any)?.strapiToken;
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/service-inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: {
            guideSlug,
            guideTitle,
            selectedGuides: selectedGuides.join(', '),
            suggestedGuides: formData.suggestedGuides,
            businessName: formData.businessName,
            yearsInBusiness: formData.yearsInBusiness,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            streetAddress: formData.streetAddress,
            city: formData.city,
            county: 'Navarro County, TX',
            description: formData.description,
            valueProposition: formData.valueProposition,
          },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('Failed to submit inquiry. Please try again.');
    }
    setSubmitting(false);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGuide = (slug: string) => {
    setSelectedGuides((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Filter guides based on search
  const filteredGuides = allGuides.filter((g) =>
    g.title.toLowerCase().includes(guideSearch.toLowerCase())
  );

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Inquiry Submitted!</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Thank you for your interest in claiming the <strong>{guideTitle}</strong> page.
          We&apos;ll review your inquiry and get back to you within 1-2 business days.
        </p>
        <Link
          href={`/guides/${guideSlug}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
        >
          Return to Guide Page
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Guide Pages Selection */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Guide Pages You&apos;re Interested In
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Select all the guide pages you&apos;d like to feature your business on. You can choose multiple pages.
        </p>

        {/* Selected guides display */}
        {selectedGuides.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">{`Selected (${selectedGuides.length}):`}</p>
            <div className="flex flex-wrap gap-2">
              {selectedGuides.map((slug) => {
                const guide = allGuides.find((g) => g.slug === slug);
                return (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-medium"
                  >
                    {guide?.title || slug}
                    <button
                      type="button"
                      onClick={() => toggleGuide(slug)}
                      className="hover:bg-brand-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={guideSearch}
            onChange={(e) => setGuideSearch(e.target.value)}
            placeholder="Search guide pages..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Guide list */}
        <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => {
              const isSelected = selectedGuides.includes(guide.slug);
              return (
                <button
                  key={guide.slug}
                  type="button"
                  onClick={() => toggleGuide(guide.slug)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 last:border-b-0 transition-colors ${
                    isSelected ? 'bg-brand-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-brand-600 border-brand-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${isSelected ? 'font-medium text-brand-700' : 'text-gray-700'}`}>
                    {guide.title}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-4 py-8 text-center text-gray-500 text-sm">
              No guides found matching &quot;{guideSearch}&quot;
            </p>
          )}
        </div>

        {/* Suggest new guides */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Suggest New Guide Pages
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Don&apos;t see a guide page that fits your business? Let us know what topics you&apos;d like us to add.
          </p>
          <textarea
            rows={2}
            value={formData.suggestedGuides}
            onChange={(e) => updateField('suggestedGuides', e.target.value)}
            placeholder="e.g., Pool Cleaning, Tree Trimming, Mobile Notary..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Business Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Business Information
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => updateField('businessName', e.target.value)}
              placeholder="Your Business Name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Years in Business
            </label>
            <input
              type="text"
              value={formData.yearsInBusiness}
              onChange={(e) => updateField('yearsInBusiness', e.target.value)}
              placeholder="e.g., 15 years"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Contact Information
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@yourbusiness.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="(903) 555-0123"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://yourbusiness.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Location
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) => updateField('streetAddress', e.target.value)}
              placeholder="123 Main Street"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Corsicana"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              County
            </label>
            <input
              type="text"
              disabled
              value="Navarro County, TX"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* About Your Business */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          About Your Business
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Business Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your business, services offered, and what sets you apart..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Why Should Customers Choose You?
            </label>
            <textarea
              rows={3}
              value={formData.valueProposition}
              onChange={(e) => updateField('valueProposition', e.target.value)}
              placeholder="Share your unique value proposition, certifications, awards, or guarantees..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={(e) => updateField('agreedToTerms', e.target.checked)}
            className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <Link href="/terms" className="text-brand-600 hover:text-brand-700 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand-600 hover:text-brand-700 underline">
              Privacy Policy
            </Link>
            . I understand that claiming a guide page involves a sponsorship agreement.
          </span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
