import type { AcademicProfile } from '@/types/profile';
import PublicationList from '../PublicationList';
import ContactInfo from '../ContactInfo';
import Link from 'next/link';

interface ResearchFocusedTemplateProps {
  profile: AcademicProfile;
}

export default function ResearchFocusedTemplate({
  profile,
}: ResearchFocusedTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="bg-sage-green mb-12 rounded-lg p-8 text-white">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h1 className="mb-4 text-4xl font-bold">
                  {profile.displayName ||
                    `${profile.firstName} ${profile.lastName}`}
                </h1>

                {profile.currentPosition && (
                  <p className="mb-2 text-xl opacity-90">
                    {profile.currentPosition}
                    {profile.currentInstitution &&
                      ` at ${profile.currentInstitution}`}
                  </p>
                )}

                {profile.currentDepartment && (
                  <p className="mb-4 text-lg opacity-80">
                    {profile.currentDepartment}
                  </p>
                )}

                {profile.bio && (
                  <p className="text-lg leading-relaxed opacity-90">
                    {profile.bio}
                  </p>
                )}
              </div>

              <div className="lg:col-span-1">
                <ContactInfo profile={profile} theme="dark" />
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-12 lg:col-span-2">
              {/* Publications */}
              {profile.publications.length > 0 && (
                <section>
                  <h2 className="text-charcoal border-sage-green mb-6 border-b-2 pb-2 text-3xl font-bold">
                    Publications
                  </h2>
                  <PublicationList
                    publications={profile.publications}
                    showAll={true}
                    detailed={true}
                  />
                </section>
              )}

              {/* Grants */}
              {profile.grants.length > 0 && (
                <section>
                  <h2 className="text-charcoal border-sage-green mb-6 border-b-2 pb-2 text-3xl font-bold">
                    Research Funding
                  </h2>
                  <div className="space-y-4">
                    {profile.grants.map((grant) => (
                      <div key={grant.id} className="card">
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="text-charcoal text-lg font-bold">
                            {grant.title}
                          </h3>
                          <span
                            className={`metric-badge ${
                              grant.status === 'Active'
                                ? 'activity-research'
                                : grant.status === 'Completed'
                                  ? 'activity-writing'
                                  : 'activity-collaboration'
                            }`}
                          >
                            {grant.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                          <div>
                            <span className="font-medium">Agency:</span>{' '}
                            {grant.agency}
                          </div>
                          <div>
                            <span className="font-medium">Role:</span>{' '}
                            {grant.role}
                          </div>
                          <div>
                            <span className="font-medium">Period:</span>{' '}
                            {grant.startYear}
                            {grant.endYear
                              ? ` - ${grant.endYear}`
                              : ' - Present'}
                          </div>
                        </div>
                        {grant.amount && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Amount:</span>{' '}
                            {grant.amount}
                          </div>
                        )}
                        {grant.description && (
                          <p className="mt-3 text-gray-600">
                            {grant.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:col-span-1">
              {/* Research Metrics */}
              <section className="card">
                <h3 className="text-charcoal mb-4 text-xl font-bold">
                  Research Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publications:</span>
                    <span className="font-semibold">
                      {profile.publications.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Citations:</span>
                    <span className="font-semibold">
                      {profile.publications.reduce(
                        (sum, pub) => sum + (pub.citationCount || 0),
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Grants:</span>
                    <span className="font-semibold">
                      {
                        profile.grants.filter((g) => g.status === 'Active')
                          .length
                      }
                    </span>
                  </div>
                </div>
              </section>

              {/* Education */}
              {profile.education.length > 0 && (
                <section className="card">
                  <h3 className="text-charcoal mb-4 text-xl font-bold">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id}>
                        <h4 className="text-charcoal font-semibold">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-gray-500">
                          {edu.endYear
                            ? `${edu.startYear} - ${edu.endYear}`
                            : `${edu.startYear} - Present`}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards */}
              {profile.awards.length > 0 && (
                <section className="card">
                  <h3 className="text-charcoal mb-4 text-xl font-bold">
                    Awards & Honors
                  </h3>
                  <div className="space-y-3">
                    {profile.awards.map((award) => (
                      <div key={award.id}>
                        <h4 className="text-charcoal text-sm font-semibold">
                          {award.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {award.organization}, {award.year}
                        </p>
                        {award.description && (
                          <p className="mt-1 text-xs text-gray-500">
                            {award.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t border-gray-200 pt-12 text-center text-sm text-gray-500">
            <p>
              Profile powered by{' '}
              <Link href="/" className="text-sage-green hover:underline">
                ScholarFlow
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
