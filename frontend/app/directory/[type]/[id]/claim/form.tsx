'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface ClaimFormProps {
  type: string;
  entityId: string;
  entityName: string;
  strapiToken: string;
  strapiEntityType: string;
}

export function ClaimForm({ type, entityId, entityName, strapiToken, strapiEntityType }: ClaimFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    yourRole: 'owner',
    verificationInfo: '',
    businessPhone: '',
    businessEmail: '',
    additionalNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${STRAPI_URL}/api/claim-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`,
        },
        body: JSON.stringify({
          data: {
            entityType: strapiEntityType,
            entityId,
            ...formData,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Failed to submit claim request');
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Request Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your claim request. We&apos;ll review your submission and verify your ownership within 1-2 business days.
        </p>
        <button
          onClick={() => router.push(`/directory/${type}/${entityId}`)}
          className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          Return to Listing
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Claiming Listing */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">You are claiming:</p>
        <p className="text-lg font-semibold text-gray-900">{entityName}</p>
      </div>

      {/* Your Role */}
      <div>
        <label htmlFor="yourRole" className="block text-sm font-medium text-gray-700 mb-1">
          Your Role <span className="text-red-500">*</span>
        </label>
        <select
          id="yourRole"
          name="yourRole"
          required
          value={formData.yourRole}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        >
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
          <option value="representative">Authorized Representative</option>
        </select>
      </div>

      {/* Verification Information */}
      <div>
        <label htmlFor="verificationInfo" className="block text-sm font-medium text-gray-700 mb-1">
          How Can We Verify Your Claim? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="verificationInfo"
          name="verificationInfo"
          required
          rows={4}
          value={formData.verificationInfo}
          onChange={handleChange}
          placeholder="Please describe how we can verify your ownership or authorization. For example: business license number, official email domain, your position title, etc."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          We may contact you to verify this information before approving your claim.
        </p>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Business Phone
            </label>
            <input
              type="tel"
              id="businessPhone"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleChange}
              placeholder="(903) 555-0123"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Business Email
            </label>
            <input
              type="email"
              id="businessEmail"
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              placeholder="contact@yourbusiness.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={3}
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Any additional information you'd like to share..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Claim Request'
        )}
      </button>
    </form>
  );
}
