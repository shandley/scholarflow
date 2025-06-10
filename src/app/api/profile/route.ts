import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: {
          include: {
            publications: true,
            education: true,
            positions: true,
            awards: true,
            grants: true,
            socialLinks: true,
          },
        },
      },
    });

    if (!user?.profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile: user.profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Create new profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Generate username from name
    const baseUsername = `${data.firstName}-${data.lastName}`
      .toLowerCase()
      .replace(/\s+/g, '-');
    let username = baseUsername;
    let counter = 1;

    // Ensure unique username
    while (await prisma.profile.findUnique({ where: { username } })) {
      username = `${baseUsername}-${counter}`;
      counter++;
    }

    // Create profile with all related data
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        username,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        bio: data.bio,
        currentPosition: data.currentPosition,
        currentInstitution: data.currentInstitution,
        currentDepartment: data.currentDepartment,
        orcidId: data.orcidId,
        website: data.website,
        template: data.template || 'MINIMAL',
        visibility: data.visibility || 'PUBLIC',
        lastOrcidSync: data.orcidId ? new Date() : null,
        publishedAt: data.visibility === 'PUBLIC' ? new Date() : null,

        // Create related records
        publications: data.publications
          ? {
              create: data.publications.map(
                (pub: {
                  title: string;
                  authors?: string[];
                  journal?: string;
                  year?: number;
                  doi?: string;
                  url?: string;
                  citationCount?: number;
                  type?: string;
                  abstract?: string;
                  keywords?: string[];
                  orcidWorkId?: string;
                }) => ({
                  title: pub.title,
                  authors: pub.authors || [],
                  journal: pub.journal,
                  year: pub.year,
                  doi: pub.doi,
                  url: pub.url,
                  citationCount: pub.citationCount,
                  type: pub.type || 'JOURNAL_ARTICLE',
                  abstract: pub.abstract,
                  keywords: pub.keywords || [],
                  orcidWorkId: pub.orcidWorkId,
                })
              ),
            }
          : undefined,

        socialLinks: data.socialLinks
          ? {
              create: data.socialLinks.map(
                (link: {
                  platform: string;
                  url: string;
                  displayName?: string;
                }) => ({
                  platform: link.platform,
                  url: link.url,
                  displayName: link.displayName,
                })
              ),
            }
          : undefined,
      },
      include: {
        publications: true,
        socialLinks: true,
      },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Get the user and profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { id: user.profile.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        bio: data.bio,
        currentPosition: data.currentPosition,
        currentInstitution: data.currentInstitution,
        currentDepartment: data.currentDepartment,
        website: data.website,
        template: data.template,
        visibility: data.visibility,
        publishedAt: data.visibility === 'PUBLIC' ? new Date() : null,
      },
      include: {
        publications: true,
        education: true,
        positions: true,
        awards: true,
        grants: true,
        socialLinks: true,
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
