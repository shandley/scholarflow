import type { AcademicProfile } from '@/types/profile';
import PublicationList from '../PublicationList';
import ContactInfo from '../ContactInfo';
import Link from 'next/link';

interface TeachingOrientedTemplateProps {
  profile: AcademicProfile;
}

export default function TeachingOrientedTemplate({
  profile,
}: TeachingOrientedTemplateProps) {
  return (
    <div className="bg-light-gray min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-5xl">
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
              <div className="mx-auto mb-8 max-w-3xl">
                <p className="text-lg leading-relaxed text-gray-700">
                  {profile.bio}
                </p>
              </div>
            )}

            <ContactInfo profile={profile} />
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Teaching Philosophy */}
              <section className="card">
                <h2 className="text-charcoal mb-4 text-2xl font-bold">
                  Teaching Philosophy
                </h2>
                <p className="leading-relaxed text-gray-700">
                  I believe in creating an inclusive and engaging learning
                  environment where students can explore ideas, ask questions,
                  and develop critical thinking skills. My approach emphasizes
                  hands-on learning, real-world applications, and collaborative
                  problem-solving.
                </p>
              </section>

              {/* Courses */}
              <section className="card">
                <h2 className="text-charcoal mb-4 text-2xl font-bold">
                  Courses
                </h2>
                <div className="space-y-4">
                  <div className="bg-warm-beige rounded-lg p-4">
                    <h3 className="text-charcoal font-semibold">
                      Introduction to Computer Science
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fall 2024 • Undergraduate
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      Fundamental concepts of programming, algorithms, and
                      problem-solving.
                    </p>
                  </div>
                  <div className="bg-warm-beige rounded-lg p-4">
                    <h3 className="text-charcoal font-semibold">
                      Data Structures and Algorithms
                    </h3>
                    <p className="text-sm text-gray-600">
                      Spring 2024 • Undergraduate
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      Advanced programming concepts including data structures,
                      algorithms, and complexity analysis.
                    </p>
                  </div>
                  <div className="bg-warm-beige rounded-lg p-4">
                    <h3 className="text-charcoal font-semibold">
                      Machine Learning for Bioinformatics
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fall 2023 • Graduate
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      Application of machine learning techniques to biological
                      data and research problems.
                    </p>
                  </div>
                </div>
              </section>

              {/* Student Resources */}
              <section className="card">
                <h2 className="text-charcoal mb-4 text-2xl font-bold">
                  Student Resources
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-gray-700">
                      Office Hours: Tuesdays & Thursdays, 2-4 PM
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-gray-700">
                      Email Response Time: Within 24 hours
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-gray-700">
                      Course Materials: Available on LMS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sage-green h-3 w-3 rounded-full"></div>
                    <span className="text-gray-700">
                      Study Groups: Wednesdays, 6-8 PM
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Education */}
              {profile.education.length > 0 && (
                <section className="card">
                  <h2 className="text-charcoal mb-4 text-2xl font-bold">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="border-sage-green border-l-4 pl-4"
                      >
                        <h3 className="text-charcoal font-semibold">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          {edu.endYear
                            ? `${edu.startYear} - ${edu.endYear}`
                            : `${edu.startYear} - Present`}
                        </p>
                        {edu.description && (
                          <p className="mt-2 text-sm text-gray-700">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Research Interests */}
              <section className="card">
                <h2 className="text-charcoal mb-4 text-2xl font-bold">
                  Research Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="metric-badge activity-research">
                    Machine Learning
                  </span>
                  <span className="metric-badge activity-writing">
                    Bioinformatics
                  </span>
                  <span className="metric-badge activity-collaboration">
                    Education Technology
                  </span>
                  <span className="metric-badge activity-research">
                    Data Science
                  </span>
                  <span className="metric-badge activity-writing">
                    Genomics
                  </span>
                </div>
              </section>

              {/* Recent Publications */}
              {profile.publications.length > 0 && (
                <section className="card">
                  <h2 className="text-charcoal mb-4 text-2xl font-bold">
                    Recent Publications
                  </h2>
                  <PublicationList
                    publications={profile.publications.slice(0, 3)}
                    showAll={false}
                    compact={true}
                  />
                  {profile.publications.length > 3 && (
                    <div className="mt-4 text-center">
                      <a
                        href="#all-publications"
                        className="text-sage-green font-medium hover:underline"
                      >
                        View all {profile.publications.length} publications →
                      </a>
                    </div>
                  )}
                </section>
              )}

              {/* Awards */}
              {profile.awards.length > 0 && (
                <section className="card">
                  <h2 className="text-charcoal mb-4 text-2xl font-bold">
                    Awards & Recognition
                  </h2>
                  <div className="space-y-3">
                    {profile.awards.map((award) => (
                      <div
                        key={award.id}
                        className="border-sage-green border-l-4 pl-4"
                      >
                        <h3 className="text-charcoal font-semibold">
                          {award.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {award.organization}, {award.year}
                        </p>
                        {award.description && (
                          <p className="mt-1 text-sm text-gray-700">
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

          {/* All Publications */}
          {profile.publications.length > 3 && (
            <section id="all-publications" className="mt-12">
              <h2 className="text-charcoal mb-6 text-3xl font-bold">
                All Publications
              </h2>
              <PublicationList
                publications={profile.publications}
                showAll={true}
              />
            </section>
          )}

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
