import type { AcademicProfile } from '@/types/profile'
import PublicationList from '../PublicationList'
import ContactInfo from '../ContactInfo'
import Link from 'next/link'

interface MinimalTemplateProps {
  profile: AcademicProfile
}

export default function MinimalTemplate({ profile }: MinimalTemplateProps) {
  return (
    <div className="min-h-screen bg-warm-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
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
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
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
              <h2 className="text-2xl font-bold text-charcoal mb-6">Publications</h2>
              <PublicationList publications={profile.publications} showAll={true} />
            </section>
          )}

          {/* Education */}
          {profile.education.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-charcoal">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        {edu.description && (
                          <p className="text-sm text-gray-500 mt-2">{edu.description}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {edu.endYear ? `${edu.startYear} - ${edu.endYear}` : `${edu.startYear} - Present`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
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