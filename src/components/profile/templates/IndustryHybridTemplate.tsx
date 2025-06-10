import type { AcademicProfile } from '@/types/profile';
import PublicationList from '../PublicationList';
import ContactInfo from '../ContactInfo';
import Link from 'next/link';

interface IndustryHybridTemplateProps {
  profile: AcademicProfile;
}

export default function IndustryHybridTemplate({
  profile,
}: IndustryHybridTemplateProps) {
  return (
    <div className="bg-charcoal min-h-screen text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <header className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold">
              {profile.displayName ||
                `${profile.firstName} ${profile.lastName}`}
            </h1>

            {profile.currentPosition && (
              <p className="mb-4 text-2xl text-gray-300">
                {profile.currentPosition}
                {profile.currentInstitution &&
                  ` at ${profile.currentInstitution}`}
              </p>
            )}

            {profile.currentDepartment && (
              <p className="mb-8 text-xl text-gray-400">
                {profile.currentDepartment}
              </p>
            )}

            {profile.bio && (
              <div className="mx-auto mb-12 max-w-4xl">
                <p className="text-xl leading-relaxed text-gray-200">
                  {profile.bio}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <ContactInfo profile={profile} theme="dark" layout="horizontal" />
            </div>
          </header>

          {/* Key Highlights */}
          <section className="mb-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-sage-green rounded-lg p-6 text-center">
                <div className="mb-2 text-3xl font-bold">
                  {profile.publications.length}
                </div>
                <div className="text-sm opacity-90">Publications</div>
              </div>
              <div className="bg-soft-blue rounded-lg p-6 text-center">
                <div className="mb-2 text-3xl font-bold">
                  {profile.publications.reduce(
                    (sum, pub) => sum + (pub.citationCount || 0),
                    0
                  )}
                </div>
                <div className="text-sm opacity-90">Total Citations</div>
              </div>
              <div className="rounded-lg bg-gray-700 p-6 text-center">
                <div className="mb-2 text-3xl font-bold">
                  {profile.grants.filter((g) => g.status === 'Active').length}
                </div>
                <div className="text-sm opacity-90">Active Projects</div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-12 lg:col-span-2">
              {/* Experience */}
              {profile.positions.length > 0 && (
                <section>
                  <h2 className="text-sage-green mb-8 text-3xl font-bold">
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {profile.positions.map((position) => (
                      <div
                        key={position.id}
                        className="rounded-lg bg-gray-800 p-6"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold">
                              {position.title}
                            </h3>
                            <p className="text-gray-300">
                              {position.institution}
                            </p>
                            {position.department && (
                              <p className="text-sm text-gray-400">
                                {position.department}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-400">
                            {position.endYear
                              ? `${position.startYear} - ${position.endYear}`
                              : `${position.startYear} - Present`}
                          </div>
                        </div>
                        {position.description && (
                          <p className="text-gray-300">
                            {position.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects & Publications */}
              {profile.publications.length > 0 && (
                <section>
                  <h2 className="text-sage-green mb-8 text-3xl font-bold">
                    Research & Publications
                  </h2>
                  <PublicationList
                    publications={profile.publications}
                    showAll={true}
                    theme="dark"
                    detailed={true}
                  />
                </section>
              )}

              {/* Grants & Funding */}
              {profile.grants.length > 0 && (
                <section>
                  <h2 className="text-sage-green mb-8 text-3xl font-bold">
                    Funding & Grants
                  </h2>
                  <div className="space-y-4">
                    {profile.grants.map((grant) => (
                      <div
                        key={grant.id}
                        className="rounded-lg bg-gray-800 p-6"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="text-xl font-bold">{grant.title}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              grant.status === 'Active'
                                ? 'bg-green-600 text-white'
                                : grant.status === 'Completed'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-yellow-600 text-white'
                            }`}
                          >
                            {grant.status}
                          </span>
                        </div>
                        <div className="mb-3 grid grid-cols-1 gap-4 text-sm text-gray-300 md:grid-cols-3">
                          <div>
                            <span className="font-medium text-white">
                              Agency:
                            </span>{' '}
                            {grant.agency}
                          </div>
                          <div>
                            <span className="font-medium text-white">
                              Role:
                            </span>{' '}
                            {grant.role}
                          </div>
                          <div>
                            <span className="font-medium text-white">
                              Period:
                            </span>{' '}
                            {grant.startYear}
                            {grant.endYear
                              ? ` - ${grant.endYear}`
                              : ' - Present'}
                          </div>
                        </div>
                        {grant.amount && (
                          <div className="mb-3 text-sm text-gray-300">
                            <span className="font-medium text-white">
                              Amount:
                            </span>{' '}
                            {grant.amount}
                          </div>
                        )}
                        {grant.description && (
                          <p className="text-gray-300">{grant.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:col-span-1">
              {/* Skills & Expertise */}
              <section className="rounded-lg bg-gray-800 p-6">
                <h3 className="text-sage-green mb-4 text-xl font-bold">
                  Skills & Expertise
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="mb-2 font-semibold text-white">
                      Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        Python
                      </span>
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        Machine Learning
                      </span>
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        R
                      </span>
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        Statistics
                      </span>
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        Bioinformatics
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-white">
                      Domain Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        Genomics
                      </span>
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        AI/ML
                      </span>
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        Data Science
                      </span>
                      <span className="rounded bg-gray-700 px-2 py-1 text-xs">
                        Biotechnology
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Education */}
              {profile.education.length > 0 && (
                <section className="rounded-lg bg-gray-800 p-6">
                  <h3 className="text-sage-green mb-4 text-xl font-bold">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id}>
                        <h4 className="font-semibold text-white">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-sm text-gray-300">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-gray-400">
                          {edu.endYear
                            ? `${edu.startYear} - ${edu.endYear}`
                            : `${edu.startYear} - Present`}
                        </p>
                        {edu.description && (
                          <p className="mt-2 text-sm text-gray-300">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards */}
              {profile.awards.length > 0 && (
                <section className="rounded-lg bg-gray-800 p-6">
                  <h3 className="text-sage-green mb-4 text-xl font-bold">
                    Awards & Recognition
                  </h3>
                  <div className="space-y-3">
                    {profile.awards.map((award) => (
                      <div key={award.id}>
                        <h4 className="text-sm font-semibold text-white">
                          {award.title}
                        </h4>
                        <p className="text-xs text-gray-300">
                          {award.organization}, {award.year}
                        </p>
                        {award.amount && (
                          <p className="text-xs text-gray-400">
                            {award.amount}
                          </p>
                        )}
                        {award.description && (
                          <p className="mt-1 text-xs text-gray-300">
                            {award.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Industry Experience */}
              <section className="rounded-lg bg-gray-800 p-6">
                <h3 className="text-sage-green mb-4 text-xl font-bold">
                  Industry Connections
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Consultant at TechBio Corp
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Advisory Board Member
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Patent Applications: 3
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Startup Experience
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t border-gray-700 pt-12 text-center text-sm text-gray-400">
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
