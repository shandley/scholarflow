import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProfileTemplate from '@/components/profile/ProfileTemplate'
import type { AcademicProfile } from '@/types/profile'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

// Fetch profile from database via API
async function getProfile(username: string): Promise<AcademicProfile | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/profile/${username}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    
    // Fallback to demo profile for development
    if (username === 'john-doe') {
    return {
      id: '1',
      username: 'john-doe',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'Dr. John Doe',
      email: 'john.doe@university.edu',
      bio: 'I am a researcher in computational biology with a focus on machine learning applications in genomics. My work spans algorithm development, data analysis, and translational research.',
      profilePhoto: '',
      currentPosition: 'Assistant Professor',
      currentInstitution: 'University of Example',
      currentDepartment: 'Computer Science',
      orcidId: '0000-0000-0000-0000',
      website: 'https://johndoe.academic.edu',
      socialLinks: [
        {
          id: '1',
          platform: 'Twitter',
          url: 'https://twitter.com/johndoe',
          displayName: '@johndoe',
        },
        {
          id: '2',
          platform: 'GitHub',
          url: 'https://github.com/johndoe',
          displayName: 'johndoe',
        },
      ],
      publications: [
        {
          id: '1',
          title: 'Machine Learning Approaches for Genomic Data Analysis',
          authors: ['John Doe', 'Jane Smith', 'Bob Johnson'],
          journal: 'Nature Computational Biology',
          year: 2024,
          doi: '10.1038/s41467-024-12345-6',
          url: 'https://doi.org/10.1038/s41467-024-12345-6',
          type: 'journal-article',
          citationCount: 45,
          abstract: 'We present novel machine learning approaches for analyzing large-scale genomic datasets...',
        },
        {
          id: '2',
          title: 'Deep Learning for Protein Structure Prediction',
          authors: ['John Doe', 'Alice Wilson'],
          journal: 'Science',
          year: 2023,
          doi: '10.1126/science.abc1234',
          url: 'https://doi.org/10.1126/science.abc1234',
          type: 'journal-article',
          citationCount: 78,
        },
        {
          id: '3',
          title: 'Computational Methods in Systems Biology',
          authors: ['John Doe'],
          journal: 'Cell Systems',
          year: 2023,
          doi: '10.1016/j.cels.2023.01.001',
          type: 'journal-article',
          citationCount: 23,
        },
      ],
      education: [
        {
          id: '1',
          institution: 'MIT',
          degree: 'PhD',
          field: 'Computer Science',
          startYear: 2015,
          endYear: 2020,
          description: 'Thesis: Machine Learning for Biological Sequence Analysis',
        },
        {
          id: '2',
          institution: 'Stanford University',
          degree: 'BS',
          field: 'Computer Science',
          startYear: 2011,
          endYear: 2015,
        },
      ],
      positions: [
        {
          id: '1',
          title: 'Assistant Professor',
          institution: 'University of Example',
          department: 'Computer Science',
          startYear: 2021,
          current: true,
        },
        {
          id: '2',
          title: 'Postdoctoral Researcher',
          institution: 'Harvard Medical School',
          department: 'Systems Biology',
          startYear: 2020,
          endYear: 2021,
        },
      ],
      awards: [
        {
          id: '1',
          title: 'NSF CAREER Award',
          organization: 'National Science Foundation',
          year: 2024,
          amount: '$500,000',
          description: 'For contributions to computational biology and machine learning',
        },
      ],
      grants: [
        {
          id: '1',
          title: 'AI for Genomics Research',
          agency: 'NIH',
          role: 'PI',
          startYear: 2023,
          endYear: 2026,
          amount: '$1,200,000',
          status: 'Active',
        },
      ],
      template: 'research-focused',
      visibility: 'public',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01'),
      publishedAt: new Date('2024-01-15'),
    }
  }

  // Return null if profile not found
  return null
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  
  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  return {
    title: `${profile.displayName || `${profile.firstName} ${profile.lastName}`} - Academic Profile`,
    description: profile.bio || `Academic profile of ${profile.firstName} ${profile.lastName}`,
    openGraph: {
      title: `${profile.displayName || `${profile.firstName} ${profile.lastName}`}`,
      description: profile.bio,
      type: 'profile',
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)

  if (!profile) {
    notFound()
  }

  return <ProfileTemplate profile={profile} />
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 86400 // 24 hours