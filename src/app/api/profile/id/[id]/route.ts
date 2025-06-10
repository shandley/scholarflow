import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        socialLinks: true,
        publications: {
          orderBy: { year: 'desc' },
          take: 20,
        },
        education: {
          orderBy: { startYear: 'desc' },
        },
        positions: {
          orderBy: { startYear: 'desc' },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user and verify they own this profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user?.profile || user.profile.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        currentPosition: data.position,
        currentDepartment: data.department,
        currentInstitution: data.institution,
        website: data.website,
        profilePhoto: data.profilePhoto,
      },
      include: {
        socialLinks: true,
        publications: {
          orderBy: { year: 'desc' },
          take: 20,
        },
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user and verify they own this profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user?.profile || user.profile.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete profile (this will cascade delete related records)
    await prisma.profile.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}
