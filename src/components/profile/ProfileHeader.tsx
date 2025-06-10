'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { AcademicProfile } from '@/types/profile';

interface ProfileHeaderProps {
  profile: AcademicProfile;
  children: React.ReactNode;
}

export default function ProfileHeader({
  profile,
  children,
}: ProfileHeaderProps) {
  const { data: session } = useSession();

  // Check if the current user owns this profile
  const isOwner =
    session?.user?.email &&
    (session.user.email === profile.email ||
      session.user.name === profile.displayName ||
      session.user.name === `${profile.firstName} ${profile.lastName}`);

  return (
    <div className="profile-header-wrapper">
      {isOwner && (
        <div className="profile-actions">
          <Link
            href={`/profile/${profile.username}/edit`}
            className="btn btn-secondary"
          >
            Edit Profile
          </Link>
        </div>
      )}
      {children}
    </div>
  );
}
