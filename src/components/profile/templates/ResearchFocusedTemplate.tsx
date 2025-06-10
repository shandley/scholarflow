import type { AcademicProfile } from '@/types/profile'
import PublicationList from '../PublicationList'
import ContactInfo from '../ContactInfo'
import Link from 'next/link'

interface ResearchFocusedTemplateProps {
  profile: AcademicProfile
}

export default function ResearchFocusedTemplate({ profile }: ResearchFocusedTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="bg-sage-green text-white rounded-lg p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-4">
                  {profile.displayName || `${profile.firstName} ${profile.lastName}`}
                </h1>
                
                {profile.currentPosition && (
                  <p className="text-xl mb-2 opacity-90">
                    {profile.currentPosition}
                    {profile.currentInstitution && ` at ${profile.currentInstitution}`}
                  </p>
                )}
                
                {profile.currentDepartment && (
                  <p className="text-lg mb-4 opacity-80">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Publications */}
              {profile.publications.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-charcoal mb-6 border-b-2 border-sage-green pb-2">
                    Publications
                  </h2>
                  <PublicationList publications={profile.publications} showAll={true} detailed={true} />
                </section>
              )}

              {/* Grants */}
              {profile.grants.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-charcoal mb-6 border-b-2 border-sage-green pb-2">
                    Research Funding
                  </h2>
                  <div className="space-y-4">
                    {profile.grants.map((grant) => (
                      <div key={grant.id} className="card">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-charcoal text-lg">{grant.title}</h3>
                          <span className={`metric-badge ${
                            grant.status === 'Active' ? 'activity-research' : 
                            grant.status === 'Completed' ? 'activity-writing' : 'activity-collaboration'
                          }`}>
                            {grant.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Agency:</span> {grant.agency}
                          </div>
                          <div>
                            <span className="font-medium">Role:</span> {grant.role}
                          </div>
                          <div>
                            <span className="font-medium">Period:</span> {grant.startYear}
                            {grant.endYear ? ` - ${grant.endYear}` : ' - Present'}
                          </div>
                        </div>
                        {grant.amount && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Amount:</span> {grant.amount}
                          </div>
                        )}
                        {grant.description && (
                          <p className="text-gray-600 mt-3">{grant.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Research Metrics */}
              <section className="card">
                <h3 className="text-xl font-bold text-charcoal mb-4">Research Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publications:</span>
                    <span className="font-semibold">{profile.publications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Citations:</span>
                    <span className="font-semibold">
                      {profile.publications.reduce((sum, pub) => sum + (pub.citationCount || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Grants:</span>
                    <span className="font-semibold">
                      {profile.grants.filter(g => g.status === 'Active').length}
                    </span>
                  </div>
                </div>
              </section>

              {/* Education */}
              {profile.education.length > 0 && (
                <section className="card">
                  <h3 className="text-xl font-bold text-charcoal mb-4">Education</h3>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id}>
                        <h4 className="font-semibold text-charcoal">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-gray-600 text-sm">{edu.institution}</p>
                        <p className="text-gray-500 text-xs">
                          {edu.endYear ? `${edu.startYear} - ${edu.endYear}` : `${edu.startYear} - Present`}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards */}
              {profile.awards.length > 0 && (
                <section className="card">
                  <h3 className="text-xl font-bold text-charcoal mb-4">Awards & Honors</h3>
                  <div className="space-y-3">
                    {profile.awards.map((award) => (
                      <div key={award.id}>
                        <h4 className="font-semibold text-charcoal text-sm">{award.title}</h4>
                        <p className="text-gray-600 text-xs">{award.organization}, {award.year}</p>
                        {award.description && (
                          <p className="text-gray-500 text-xs mt-1">{award.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

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