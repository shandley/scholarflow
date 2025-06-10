import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/profile/[username] - Get public profile by username
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const profile = await prisma.profile.findUnique({
      where: { 
        username,
        visibility: {
          in: ['PUBLIC', 'UNLISTED']
        }
      },
      include: {
        publications: {
          orderBy: { year: 'desc' }
        },
        education: {
          orderBy: { startYear: 'desc' }
        },
        positions: {
          orderBy: { startYear: 'desc' }
        },
        awards: {
          orderBy: { year: 'desc' }
        },
        grants: {
          orderBy: { startYear: 'desc' }
        },
        socialLinks: true,
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Transform enums to match frontend expectations
    const transformedProfile = {
      ...profile,
      template: profile.template.toLowerCase().replace('_', '-'),
      visibility: profile.visibility.toLowerCase(),
      publications: profile.publications.map(pub => ({
        ...pub,
        type: pub.type.toLowerCase().replace('_', '-')
      })),
      grants: profile.grants.map(grant => ({
        ...grant,
        role: grant.role.replace('_', '-'),
        status: grant.status.charAt(0) + grant.status.slice(1).toLowerCase()
      }))
    }

    return NextResponse.json({ profile: transformedProfile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}