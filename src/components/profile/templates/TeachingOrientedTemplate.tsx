import type { AcademicProfile } from '@/types/profile'
import PublicationList from '../PublicationList'
import ContactInfo from '../ContactInfo'
import Link from 'next/link'

interface TeachingOrientedTemplateProps {
  profile: AcademicProfile
}

export default function TeachingOrientedTemplate({ profile }: TeachingOrientedTemplateProps) {
  return (
    <div className="min-h-screen bg-light-gray">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">
              {profile.displayName || `${profile.firstName} ${profile.lastName}`}
            </h1>
            
            {profile.currentPosition && (
              <p className="text-xl text-gray-600 mb-2">
                {profile.currentPosition}
                {profile.currentInstitution && ` at ${profile.currentInstitution}`}
              </p>
            )}
            
            {profile.currentDepartment && (
              <p className="text-lg text-gray-500 mb-6">
                {profile.currentDepartment}
              </p>
            )}

            {profile.bio && (
              <div className="max-w-3xl mx-auto mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            <ContactInfo profile={profile} />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Teaching Philosophy */}
              <section className="card">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Teaching Philosophy</h2>
                <p className="text-gray-700 leading-relaxed">
                  I believe in creating an inclusive and engaging learning environment where students can 
                  explore ideas, ask questions, and develop critical thinking skills. My approach emphasizes 
                  hands-on learning, real-world applications, and collaborative problem-solving.
                </p>
              </section>

              {/* Courses */}
              <section className="card">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Courses</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-warm-beige rounded-lg">
                    <h3 className="font-semibold text-charcoal">Introduction to Computer Science</h3>
                    <p className="text-sm text-gray-600">Fall 2024 • Undergraduate</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Fundamental concepts of programming, algorithms, and problem-solving.
                    </p>
                  </div>
                  <div className="p-4 bg-warm-beige rounded-lg">
                    <h3 className="font-semibold text-charcoal">Data Structures and Algorithms</h3>
                    <p className="text-sm text-gray-600">Spring 2024 • Undergraduate</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Advanced programming concepts including data structures, algorithms, and complexity analysis.
                    </p>
                  </div>
                  <div className="p-4 bg-warm-beige rounded-lg">
                    <h3 className="font-semibold text-charcoal">Machine Learning for Bioinformatics</h3>
                    <p className="text-sm text-gray-600">Fall 2023 • Graduate</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Application of machine learning techniques to biological data and research problems.
                    </p>
                  </div>
                </div>
              </section>

              {/* Student Resources */}
              <section className="card">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Student Resources</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-700">Office Hours: Tuesdays & Thursdays, 2-4 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-700">Email Response Time: Within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-700">Course Materials: Available on LMS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-700">Study Groups: Wednesdays, 6-8 PM</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Education */}
              {profile.education.length > 0 && (
                <section className="card">
                  <h2 className="text-2xl font-bold text-charcoal mb-4">Education</h2>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-sage-green pl-4">
                        <h3 className="font-semibold text-charcoal">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          {edu.endYear ? `${edu.startYear} - ${edu.endYear}` : `${edu.startYear} - Present`}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Research Interests */}
              <section className="card">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Research Interests</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="metric-badge activity-research">Machine Learning</span>
                  <span className="metric-badge activity-writing">Bioinformatics</span>
                  <span className="metric-badge activity-collaboration">Education Technology</span>
                  <span className="metric-badge activity-research">Data Science</span>
                  <span className="metric-badge activity-writing">Genomics</span>
                </div>
              </section>

              {/* Recent Publications */}
              {profile.publications.length > 0 && (
                <section className="card">
                  <h2 className="text-2xl font-bold text-charcoal mb-4">Recent Publications</h2>
                  <PublicationList 
                    publications={profile.publications.slice(0, 3)} 
                    showAll={false} 
                    compact={true}
                  />
                  {profile.publications.length > 3 && (
                    <div className="mt-4 text-center">
                      <a href="#all-publications" className="text-sage-green hover:underline font-medium">
                        View all {profile.publications.length} publications →
                      </a>
                    </div>
                  )}
                </section>
              )}

              {/* Awards */}
              {profile.awards.length > 0 && (
                <section className="card">
                  <h2 className="text-2xl font-bold text-charcoal mb-4">Awards & Recognition</h2>
                  <div className="space-y-3">
                    {profile.awards.map((award) => (
                      <div key={award.id} className="border-l-4 border-sage-green pl-4">
                        <h3 className="font-semibold text-charcoal">{award.title}</h3>
                        <p className="text-gray-600 text-sm">{award.organization}, {award.year}</p>
                        {award.description && (
                          <p className="text-gray-700 text-sm mt-1">{award.description}</p>
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
              <h2 className="text-3xl font-bold text-charcoal mb-6">All Publications</h2>
              <PublicationList publications={profile.publications} showAll={true} />
            </section>
          )}

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm pt-12 mt-12 border-t border-gray-200">
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
  )
}