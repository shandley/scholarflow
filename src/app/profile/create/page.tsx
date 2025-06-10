'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createOrcidClient } from '@/lib/orcid';
import type { ProfileFormData, Publication } from '@/types/profile';

export default function CreateProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [importingOrcid, setImportingOrcid] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    currentPosition: '',
    currentInstitution: '',
    currentDepartment: '',
    website: '',
    template: 'minimal',
    visibility: 'public',
  });

  const importOrcidData = useCallback(async () => {
    if (!session?.user.orcidId || !session?.user.accessToken) return;

    setImportingOrcid(true);
    try {
      const orcidClient = createOrcidClient(session.user.accessToken);
      const works = await orcidClient.fetchWorks(session.user.orcidId);
      setPublications(works);
    } catch (error) {
      console.error('Error importing ORCID data:', error);
    } finally {
      setImportingOrcid(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Pre-fill form with session data
    if (session.user) {
      const nameParts = session.user.name?.split(' ') || [];
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user.email || '',
      }));

      // Auto-import ORCID data if available
      if (session.user.orcidId && session.user.accessToken) {
        importOrcidData();
      }
    }
  }, [session, status, router, importOrcidData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the profile data
      const profileData = {
        ...formData,
        orcidId: session?.user.orcidId,
        publications: publications,
        socialLinks: [],
      };

      // Save the profile to database
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create profile');
      }

      // Redirect to the new profile
      router.push(`/profile/${result.profile.username}`);
    } catch (error) {
      console.error('Error creating profile:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-warm-beige flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-sage-green mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-beige min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-charcoal mb-4 text-3xl font-bold">
              Create Your Academic Profile
            </h1>
            <p className="text-gray-600">
              Set up your professional academic presence in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-charcoal mb-6 text-xl font-semibold">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="text-charcoal mb-2 block text-sm font-medium"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="text-charcoal mb-2 block text-sm font-medium"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="text-charcoal mb-2 block text-sm font-medium"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="bio"
                  className="text-charcoal mb-2 block text-sm font-medium"
                >
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your research interests, expertise, and academic background..."
                  className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                />
              </div>
            </div>

            {/* Current Position */}
            <div className="card">
              <h2 className="text-charcoal mb-6 text-xl font-semibold">
                Current Position
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="currentPosition"
                    className="text-charcoal mb-2 block text-sm font-medium"
                  >
                    Position/Title
                  </label>
                  <input
                    type="text"
                    id="currentPosition"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    placeholder="e.g., Assistant Professor, PhD Student"
                    className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currentInstitution"
                    className="text-charcoal mb-2 block text-sm font-medium"
                  >
                    Institution
                  </label>
                  <input
                    type="text"
                    id="currentInstitution"
                    name="currentInstitution"
                    value={formData.currentInstitution}
                    onChange={handleInputChange}
                    placeholder="e.g., University of Example"
                    className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="currentDepartment"
                  className="text-charcoal mb-2 block text-sm font-medium"
                >
                  Department/School
                </label>
                <input
                  type="text"
                  id="currentDepartment"
                  name="currentDepartment"
                  value={formData.currentDepartment}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Biology"
                  className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="website"
                  className="text-charcoal mb-2 block text-sm font-medium"
                >
                  Personal Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://your-website.com"
                  className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                />
              </div>
            </div>

            {/* ORCID Data Import */}
            {session?.user.orcidId && (
              <div className="card">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-charcoal text-xl font-semibold">
                    Publications from ORCID
                  </h2>
                  <button
                    type="button"
                    onClick={importOrcidData}
                    disabled={importingOrcid}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    {importingOrcid ? 'Importing...' : 'Refresh'}
                  </button>
                </div>

                {publications.length > 0 ? (
                  <div className="space-y-4">
                    <p className="mb-4 text-sm text-gray-600">
                      Found {publications.length} publications from your ORCID
                      profile
                    </p>
                    <div className="max-h-64 space-y-3 overflow-y-auto">
                      {publications.slice(0, 5).map((pub) => (
                        <div
                          key={pub.id}
                          className="bg-light-gray rounded-lg p-3"
                        >
                          <h4 className="text-charcoal text-sm font-medium">
                            {pub.title}
                          </h4>
                          <p className="mt-1 text-xs text-gray-600">
                            {pub.journal && `${pub.journal} • `}
                            {pub.year}
                            {pub.authors.length > 0 &&
                              ` • ${pub.authors[0]}${pub.authors.length > 1 ? ' et al.' : ''}`}
                          </p>
                        </div>
                      ))}
                    </div>
                    {publications.length > 5 && (
                      <p className="text-center text-xs text-gray-500">
                        and {publications.length - 5} more publications...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {importingOrcid
                      ? 'Importing publications...'
                      : 'No publications found or not yet imported.'}
                  </p>
                )}
              </div>
            )}

            {/* Profile Settings */}
            <div className="card">
              <h2 className="text-charcoal mb-6 text-xl font-semibold">
                Profile Settings
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="template"
                    className="text-charcoal mb-2 block text-sm font-medium"
                  >
                    Profile Template
                  </label>
                  <select
                    id="template"
                    name="template"
                    value={formData.template}
                    onChange={handleInputChange}
                    className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                  >
                    <option value="minimal">Minimal Academic</option>
                    <option value="research-focused">Research-Focused</option>
                    <option value="teaching-oriented">Teaching-Oriented</option>
                    <option value="industry-hybrid">Industry Hybrid</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="visibility"
                    className="text-charcoal mb-2 block text-sm font-medium"
                  >
                    Profile Visibility
                  </label>
                  <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="focus:ring-sage-green w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">
                      Unlisted (accessible via link)
                    </option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating Profile...
                  </div>
                ) : (
                  'Create My Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
