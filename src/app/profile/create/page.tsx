'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createOrcidClient } from '@/lib/orcid'
import type { ProfileFormData, Publication } from '@/types/profile'

export default function CreateProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [importingOrcid, setImportingOrcid] = useState(false)
  const [publications, setPublications] = useState<Publication[]>([])
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
  })

  const importOrcidData = useCallback(async () => {
    if (!session?.user.orcidId || !session?.user.accessToken) return

    setImportingOrcid(true)
    try {
      const orcidClient = createOrcidClient(session.user.accessToken)
      const works = await orcidClient.fetchWorks(session.user.orcidId)
      setPublications(works)
    } catch (error) {
      console.error('Error importing ORCID data:', error)
    } finally {
      setImportingOrcid(false)
    }
  }, [session])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Pre-fill form with session data
    if (session.user) {
      const nameParts = session.user.name?.split(' ') || []
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user.email || '',
      }))

      // Auto-import ORCID data if available
      if (session.user.orcidId && session.user.accessToken) {
        importOrcidData()
      }
    }
  }, [session, status, router, importOrcidData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here we would save the profile to our database
      // For now, we'll simulate the process and redirect to the profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a username from the name
      const username = `${formData.firstName}-${formData.lastName}`.toLowerCase().replace(/\s+/g, '-')
      
      // Redirect to the new profile
      router.push(`/profile/${username}`)
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-4">
              Create Your Academic Profile
            </h1>
            <p className="text-gray-600">
              Set up your professional academic presence in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-charcoal mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-charcoal mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="bio" className="block text-sm font-medium text-charcoal mb-2">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your research interests, expertise, and academic background..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                />
              </div>
            </div>

            {/* Current Position */}
            <div className="card">
              <h2 className="text-xl font-semibold text-charcoal mb-6">Current Position</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currentPosition" className="block text-sm font-medium text-charcoal mb-2">
                    Position/Title
                  </label>
                  <input
                    type="text"
                    id="currentPosition"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    placeholder="e.g., Assistant Professor, PhD Student"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="currentInstitution" className="block text-sm font-medium text-charcoal mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    id="currentInstitution"
                    name="currentInstitution"
                    value={formData.currentInstitution}
                    onChange={handleInputChange}
                    placeholder="e.g., University of Example"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="currentDepartment" className="block text-sm font-medium text-charcoal mb-2">
                  Department/School
                </label>
                <input
                  type="text"
                  id="currentDepartment"
                  name="currentDepartment"
                  value={formData.currentDepartment}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Biology"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="website" className="block text-sm font-medium text-charcoal mb-2">
                  Personal Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://your-website.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                />
              </div>
            </div>

            {/* ORCID Data Import */}
            {session?.user.orcidId && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-charcoal">Publications from ORCID</h2>
                  <button
                    type="button"
                    onClick={importOrcidData}
                    disabled={importingOrcid}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    {importingOrcid ? 'Importing...' : 'Refresh'}
                  </button>
                </div>

                {publications.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Found {publications.length} publications from your ORCID profile
                    </p>
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {publications.slice(0, 5).map((pub) => (
                        <div key={pub.id} className="p-3 bg-light-gray rounded-lg">
                          <h4 className="font-medium text-charcoal text-sm">{pub.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {pub.journal && `${pub.journal} • `}{pub.year}
                            {pub.authors.length > 0 && ` • ${pub.authors[0]}${pub.authors.length > 1 ? ' et al.' : ''}`}
                          </p>
                        </div>
                      ))}
                    </div>
                    {publications.length > 5 && (
                      <p className="text-xs text-gray-500 text-center">
                        and {publications.length - 5} more publications...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {importingOrcid ? 'Importing publications...' : 'No publications found or not yet imported.'}
                  </p>
                )}
              </div>
            )}

            {/* Profile Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-charcoal mb-6">Profile Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="template" className="block text-sm font-medium text-charcoal mb-2">
                    Profile Template
                  </label>
                  <select
                    id="template"
                    name="template"
                    value={formData.template}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                  >
                    <option value="minimal">Minimal Academic</option>
                    <option value="research-focused">Research-Focused</option>
                    <option value="teaching-oriented">Teaching-Oriented</option>
                    <option value="industry-hybrid">Industry Hybrid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="visibility" className="block text-sm font-medium text-charcoal mb-2">
                    Profile Visibility
                  </label>
                  <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-green focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted (accessible via link)</option>
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
                className="btn-primary text-lg py-3 px-8"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
  )
}