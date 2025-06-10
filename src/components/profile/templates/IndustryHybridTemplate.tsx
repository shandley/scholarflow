import type { AcademicProfile } from '@/types/profile'
import PublicationList from '../PublicationList'
import ContactInfo from '../ContactInfo'
import Link from 'next/link'

interface IndustryHybridTemplateProps {
  profile: AcademicProfile
}

export default function IndustryHybridTemplate({ profile }: IndustryHybridTemplateProps) {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              {profile.displayName || `${profile.firstName} ${profile.lastName}`}
            </h1>
            
            {profile.currentPosition && (
              <p className="text-2xl text-gray-300 mb-4">
                {profile.currentPosition}
                {profile.currentInstitution && ` at ${profile.currentInstitution}`}
              </p>
            )}
            
            {profile.currentDepartment && (
              <p className="text-xl text-gray-400 mb-8">
                {profile.currentDepartment}
              </p>
            )}

            {profile.bio && (
              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-xl text-gray-200 leading-relaxed">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-sage-green p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">{profile.publications.length}</div>
                <div className="text-sm opacity-90">Publications</div>
              </div>
              <div className="bg-soft-blue p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">
                  {profile.publications.reduce((sum, pub) => sum + (pub.citationCount || 0), 0)}
                </div>
                <div className="text-sm opacity-90">Total Citations</div>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">
                  {profile.grants.filter(g => g.status === 'Active').length}
                </div>
                <div className="text-sm opacity-90">Active Projects</div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Experience */}
              {profile.positions.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-sage-green">Experience</h2>
                  <div className="space-y-6">
                    {profile.positions.map((position) => (
                      <div key={position.id} className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{position.title}</h3>
                            <p className="text-gray-300">{position.institution}</p>
                            {position.department && (
                              <p className="text-gray-400 text-sm">{position.department}</p>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-400">
                            {position.endYear ? `${position.startYear} - ${position.endYear}` : `${position.startYear} - Present`}
                          </div>
                        </div>
                        {position.description && (
                          <p className="text-gray-300">{position.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects & Publications */}
              {profile.publications.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-sage-green">Research & Publications</h2>
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
                  <h2 className="text-3xl font-bold mb-8 text-sage-green">Funding & Grants</h2>
                  <div className="space-y-4">
                    {profile.grants.map((grant) => (
                      <div key={grant.id} className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold">{grant.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            grant.status === 'Active' ? 'bg-green-600 text-white' : 
                            grant.status === 'Completed' ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white'
                          }`}>
                            {grant.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300 mb-3">
                          <div>
                            <span className="font-medium text-white">Agency:</span> {grant.agency}
                          </div>
                          <div>
                            <span className="font-medium text-white">Role:</span> {grant.role}
                          </div>
                          <div>
                            <span className="font-medium text-white">Period:</span> {grant.startYear}
                            {grant.endYear ? ` - ${grant.endYear}` : ' - Present'}
                          </div>
                        </div>
                        {grant.amount && (
                          <div className="text-sm text-gray-300 mb-3">
                            <span className="font-medium text-white">Amount:</span> {grant.amount}
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
            <div className="lg:col-span-1 space-y-8">
              {/* Skills & Expertise */}
              <section className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-sage-green">Skills & Expertise</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">Python</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">Machine Learning</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">R</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">Statistics</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">Bioinformatics</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Domain Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">Genomics</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">AI/ML</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">Data Science</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">Biotechnology</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Education */}
              {profile.education.length > 0 && (
                <section className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-sage-green">Education</h3>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id}>
                        <h4 className="font-semibold text-white">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-gray-300 text-sm">{edu.institution}</p>
                        <p className="text-gray-400 text-xs">
                          {edu.endYear ? `${edu.startYear} - ${edu.endYear}` : `${edu.startYear} - Present`}
                        </p>
                        {edu.description && (
                          <p className="text-gray-300 text-sm mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards */}
              {profile.awards.length > 0 && (
                <section className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-sage-green">Awards & Recognition</h3>
                  <div className="space-y-3">
                    {profile.awards.map((award) => (
                      <div key={award.id}>
                        <h4 className="font-semibold text-white text-sm">{award.title}</h4>
                        <p className="text-gray-300 text-xs">{award.organization}, {award.year}</p>
                        {award.amount && (
                          <p className="text-gray-400 text-xs">{award.amount}</p>
                        )}
                        {award.description && (
                          <p className="text-gray-300 text-xs mt-1">{award.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Industry Experience */}
              <section className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-sage-green">Industry Connections</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-300 text-sm">Consultant at TechBio Corp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-300 text-sm">Advisory Board Member</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-300 text-sm">Patent Applications: 3</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-green rounded-full"></div>
                    <span className="text-gray-300 text-sm">Startup Experience</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-400 text-sm pt-12 mt-12 border-t border-gray-700">
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