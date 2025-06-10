export default function Home() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#F5F2E8'}}>
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl" style={{color: '#2F3437'}}>
              Where academic productivity flows
              <span className="block" style={{color: '#8FA68E'}}>seamlessly through modern web technology</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Create sophisticated academic websites with progressive complexity. 
              Track your research productivity, manage your academic legacy, 
              and network with scholars worldwide.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button className="px-8 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90" style={{backgroundColor: '#8FA68E'}}>
                Get Started - It&apos;s Free
              </button>
              <a href="#features" className="text-sm font-semibold leading-6 hover:opacity-80" style={{color: '#2F3437'}}>
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Academic Stats Preview */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            <div className="stat-card">
              <div className="stat-value">5 min</div>
              <div className="stat-label">Setup Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">100%</div>
              <div className="stat-label">ORCID Integration</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3 Tiers</div>
              <div className="stat-label">Progressive Enhancement</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Free</div>
              <div className="stat-label">To Start</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Tiers Section */}
      <section id="features" className="bg-white py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">
              Choose Your Academic Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Progressive complexity that grows with your needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Tier 1 */}
            <div className="card">
              <div className="mb-4">
                <span className="metric-badge activity-research">5-minute setup</span>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-2">Academic CV Website</h3>
              <p className="text-gray-600 mb-6">
                Perfect for faculty and postdocs who want a quick professional presence.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Professional academic profile
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Auto-updating publications from ORCID
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Clean, responsive design
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Custom domain support
                </li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="card border-2 border-sage-green">
              <div className="mb-4">
                <span className="metric-badge activity-writing">15-minute setup</span>
                <span className="ml-2 text-xs font-semibold text-sage-green">POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-2">Academic Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Ideal for graduate students and early career researchers tracking progress.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Everything in Tier 1
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Activity tracking & research heatmaps
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Goal setting & progress visualization
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Collaboration network
                </li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="card">
              <div className="mb-4">
                <span className="metric-badge activity-collaboration">30-minute setup</span>
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-2">Legacy Platform</h3>
              <p className="text-gray-600 mb-6">
                For senior faculty with complex networks and mentorship tracking.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Everything in Tier 2
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Complete mentorship tracking
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Academic family trees
                </li>
                <li className="flex items-start">
                  <span className="text-sage-green mr-2">✓</span>
                  Advanced analytics & legacy metrics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sage-green py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to showcase your academic journey?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Join thousands of academics who are already using ScholarFlow to build their digital presence.
          </p>
          <div className="mt-8">
            <button className="bg-white text-sage-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Building Your Profile
            </button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-charcoal text-white py-8 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm">
            © 2024 ScholarFlow. Built with ❤️ for the academic community.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-sage-green">About</a>
            <a href="#" className="hover:text-sage-green">Privacy</a>
            <a href="#" className="hover:text-sage-green">Terms</a>
            <a href="https://github.com/shandley/scholarflow" className="hover:text-sage-green">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}