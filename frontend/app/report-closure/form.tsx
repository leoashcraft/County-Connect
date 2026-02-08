'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface ReportClosureFormProps {
  listingName: string;
  listingType: string;
  listingId: string;
}

export function ReportClosureForm({ listingName, listingType, listingId }: ReportClosureFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    closureType: '',
    details: '',
    lastVisitDate: '',
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${STRAPI_URL}/api/closure-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            listingName,
            listingType,
            listingId,
            closureType: formData.closureType,
            details: formData.details,
            lastVisitDate: formData.lastVisitDate,
            reporterName: formData.reporterName || null,
            reporterEmail: formData.reporterEmail || null,
            reporterPhone: formData.reporterPhone || null,
            status: 'pending',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Failed to submit report');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h2>
        <p className="text-gray-600 mb-6">
          Thank you for helping keep our directory accurate. We&apos;ll review your report and update the listing if needed.
        </p>
        {listingType && listingId ? (
          <Link
            href={`/directory/${listingType}/${listingId}`}
            className="inline-block px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Return to Listing
          </Link>
        ) : (
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Return Home
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Closure Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type of Closure <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="closureType"
              value="permanent"
              checked={formData.closureType === 'permanent'}
              onChange={handleChange}
              required
              className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
            />
            <div>
              <span className="font-medium text-gray-900">Permanent Closure</span>
              <p className="text-sm text-gray-500">The business has closed permanently</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="closureType"
              value="temporary"
              checked={formData.closureType === 'temporary'}
              onChange={handleChange}
              className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
            />
            <div>
              <span className="font-medium text-gray-900">Temporary Closure</span>
              <p className="text-sm text-gray-500">Closed for renovations, vacation, or other temporary reason</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="closureType"
              value="unsure"
              checked={formData.closureType === 'unsure'}
              onChange={handleChange}
              className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
            />
            <div>
              <span className="font-medium text-gray-900">Not Sure</span>
              <p className="text-sm text-gray-500">I noticed it&apos;s closed but don&apos;t know the details</p>
            </div>
          </label>
        </div>
      </div>

      {/* Details */}
      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Details
        </label>
        <textarea
          id="details"
          name="details"
          rows={3}
          value={formData.details}
          onChange={handleChange}
          placeholder="Any additional information (e.g., sign on the door, what you observed)..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
      </div>

      {/* Last Visit Date */}
      <div>
        <label htmlFor="lastVisitDate" className="block text-sm font-medium text-gray-700 mb-1">
          When did you notice the closure?
        </label>
        <input
          type="text"
          id="lastVisitDate"
          name="lastVisitDate"
          value={formData.lastVisitDate}
          onChange={handleChange}
          placeholder="e.g., Last week, January 2026, Yesterday"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      {/* Contact Info (Optional) */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-1">Contact Information (Optional)</h3>
        <p className="text-xs text-gray-500 mb-4">
          Only needed if we have questions about your report
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="reporterName"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label htmlFor="reporterEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="reporterEmail"
              name="reporterEmail"
              value={formData.reporterEmail}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label htmlFor="reporterPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="reporterPhone"
              name="reporterPhone"
              value={formData.reporterPhone}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.closureType}
        className="w-full py-3 px-6 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Report'
        )}
      </button>
    </form>
  );
}
