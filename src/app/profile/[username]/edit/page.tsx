'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ProfileData } from '@/types/profile'

export default function EditProfilePage() {
  const router = useRouter()
  const { status } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          if (data.profilePhoto) {
            setPhotoPreview(data.profilePhoto)
          }
        } else {
          setError('Failed to load profile')
        }
      } catch {
        setError('Error loading profile')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchProfile()
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be less than 5MB')
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      // Upload photo if changed
      let photoUrl = profile?.profilePhoto
      if (photoFile) {
        const formData = new FormData()
        formData.append('file', photoFile)
        formData.append('type', 'PROFILE_PHOTO')
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          photoUrl = url
        }
      }

      // Update profile
      const formData = new FormData(e.currentTarget)
      const profileData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        bio: formData.get('bio') as string,
        position: formData.get('position') as string,
        department: formData.get('department') as string,
        institution: formData.get('institution') as string,
        location: formData.get('location') as string,
        website: formData.get('website') as string,
        profilePhoto: photoUrl,
        socialLinks: profile?.socialLinks || []
      }

      const response = await fetch(`/api/profile/id/${profile?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        router.push(`/profile/${profile?.username}`)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch {
      setError('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="error-message">Profile not found</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit Profile</h1>
        <Link href={`/profile/${profile.username}`} className="btn btn-secondary">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Profile Photo</h2>
          <div className="photo-upload">
            <div className="photo-preview">
              {photoPreview ? (
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Profile" />
              ) : (
                <div className="photo-placeholder">
                  <span>No photo</span>
                </div>
              )}
            </div>
            <div className="photo-controls">
              <input
                type="file"
                id="photo"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="file-input"
              />
              <label htmlFor="photo" className="btn btn-secondary">
                Choose Photo
              </label>
              <p className="help-text">JPEG, PNG, or WebP. Max 5MB.</p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                defaultValue={profile.firstName}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                defaultValue={profile.lastName}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile.bio || ''}
              className="form-input"
              placeholder="Tell us about your research interests and background..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Professional Information</h2>
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              defaultValue={profile.position || ''}
              className="form-input"
              placeholder="e.g., Assistant Professor, PhD Student"
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              defaultValue={profile.department || ''}
              className="form-input"
              placeholder="e.g., Computer Science"
            />
          </div>

          <div className="form-group">
            <label htmlFor="institution">Institution</label>
            <input
              type="text"
              id="institution"
              name="institution"
              defaultValue={profile.institution || ''}
              className="form-input"
              placeholder="e.g., Stanford University"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={profile.location || ''}
              className="form-input"
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              defaultValue={profile.website || ''}
              className="form-input"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/profile/${profile.username}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}