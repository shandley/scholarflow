import type { AcademicProfile } from '@/types/profile';
import PublicationList from '../PublicationList';
import ContactInfo from '../ContactInfo';
import ProfileHeader from '../ProfileHeader';
import Link from 'next/link';

interface MinimalTemplateProps {
  profile: AcademicProfile;
}

export default function MinimalTemplate({ profile }: MinimalTemplateProps) {
  return (
    <div className="bg-warm-beige min-h-screen">
      <ProfileHeader profile={profile}>
        <div className="container mx-auto px-6 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <header className="mb-12 text-center">
              <h1 className="text-charcoal mb-4 text-4xl font-bold">
                {profile.displayName ||
                  `${profile.firstName} ${profile.lastName}`}
              </h1>

              {profile.currentPosition && (
                <p className="mb-2 text-xl text-gray-600">
                  {profile.currentPosition}
                  {profile.currentInstitution &&
                    ` at ${profile.currentInstitution}`}
                </p>
              )}

              {profile.currentDepartment && (
                <p className="mb-6 text-lg text-gray-500">
                  {profile.currentDepartment}
                </p>
              )}

              {profile.bio && (
                <div className="mx-auto max-w-3xl">
                  <p className="text-lg leading-relaxed text-gray-700">
                    {profile.bio}
                  </p>
                </div>
              )}
            </header>

            {/* Contact Information */}
            <section className="mb-12">
              <ContactInfo profile={profile} />
            </section>

            {/* Publications */}
            {profile.publications.length > 0 && (
              <section className="mb-12">
                <h2 className="text-charcoal mb-6 text-2xl font-bold">
                  Publications
                </h2>
                <PublicationList
                  publications={profile.publications}
                  showAll={true}
                />
              </section>
            )}

            {/* Education */}
            {profile.education.length > 0 && (
              <section className="mb-12">
                <h2 className="text-charcoal mb-6 text-2xl font-bold">
                  Education
                </h2>
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="card">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-charcoal font-semibold">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          {edu.description && (
                            <p className="mt-2 text-sm text-gray-500">
                              {edu.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {edu.endYear
                            ? `${edu.startYear} - ${edu.endYear}`
                            : `${edu.startYear} - Present`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
              <p>
                Profile powered by{' '}
                <Link href="/" className="text-sage-green hover:underline">
                  ScholarFlow
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </ProfileHeader>
    </div>
  );
}
