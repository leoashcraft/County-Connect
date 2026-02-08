'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Building2,
  FileText,
  Loader2,
  Save,
  Camera,
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Town {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

interface UserProfile {
  id: number;
  full_name: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  preferred_town: Town | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  profile_completed: boolean;
  picture: string | null;
}

interface ProfileFormProps {
  initialProfile: UserProfile;
  towns: Town[];
}

export function ProfileForm({ initialProfile, towns }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: initialProfile.full_name || '',
    phone: initialProfile.phone || '',
    bio: initialProfile.bio || '',
    preferred_town: initialProfile.preferred_town?.id?.toString() || '',
    street_address: initialProfile.street_address || '',
    city: initialProfile.city || '',
    state: initialProfile.state || 'TX',
    zip_code: initialProfile.zip_code || '',
  });

  const showCompletionBanner = !initialProfile.profile_completed;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = (session?.user as any)?.strapiToken;

      if (!token) {
        throw new Error('Authentication required');
      }

      // Check if required fields are filled for profile completion
      const isProfileComplete = formData.full_name.trim() !== '' && formData.preferred_town !== '';

      const updateData: Record<string, any> = {
        full_name: formData.full_name || null,
        phone: formData.phone || null,
        bio: formData.bio || null,
        street_address: formData.street_address || null,
        city: formData.city || null,
        state: formData.state || 'TX',
        zip_code: formData.zip_code || null,
        profile_completed: isProfileComplete,
      };

      // Handle preferred_town relation - use documentId for Strapi v5
      if (formData.preferred_town) {
        updateData.preferred_town = formData.preferred_town;
      } else {
        updateData.preferred_town = null;
      }

      // Use Next.js API route which proxies to Strapi
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');

      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Profile Completion Banner */}
      {showCompletionBanner && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800">Complete Your Profile</h3>
              <p className="text-amber-700 text-sm mt-1">
                Take a moment to complete your profile and set your preferred town. This helps us
                personalize your experience and connect you with local businesses and services.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Card */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-gray-500" />
            Profile Picture
          </h2>
          <div className="flex items-center gap-6">
            {initialProfile.picture ? (
              <img
                src={initialProfile.picture}
                alt={initialProfile.full_name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-gray-100">
                {initialProfile.full_name?.charAt(0) ||
                  initialProfile.email?.charAt(0)?.toUpperCase() ||
                  'U'}
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">
                Your profile picture is managed by your Google account.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                To change it, update your Google profile picture.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={initialProfile.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Managed by your OAuth provider</p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Bio - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio / About
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Visible on your vendor profile if you sell on the marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Preferred Town Card */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            Preferred Town
          </h2>
          <div>
            <label
              htmlFor="preferred_town"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Your Town <span className="text-red-500">*</span>
            </label>
            <div className="relative max-w-md">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="preferred_town"
                name="preferred_town"
                value={formData.preferred_town}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none"
              >
                <option value="">Select a town...</option>
                {towns.map((town) => (
                  <option key={town.id} value={String(town.id)}>
                    {town.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Your preferred town helps us show you relevant local content
            </p>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-500" />
            Address
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Street Address */}
            <div className="md:col-span-2">
              <label
                htmlFor="street_address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="street_address"
                  name="street_address"
                  value={formData.street_address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Corsicana"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="TX"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* ZIP Code */}
            <div>
              <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="75110"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
