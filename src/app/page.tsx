export default function Home() {
  return (
    <div className="bg-warm-beige min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-charcoal text-4xl font-bold tracking-tight sm:text-6xl">
              Where academic productivity flows
              <span className="text-sage-green block">
                seamlessly through modern web technology
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Create sophisticated academic websites with progressive
              complexity. Track your research productivity, manage your academic
              legacy, and network with scholars worldwide.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <a href="/auth/signin" className="btn-primary">
                Get Started - It&apos;s Free
              </a>
              <a
                href="#features"
                className="text-charcoal text-sm font-semibold leading-6"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Academic Stats Preview */}
          <div className="mt-16 grid grid-cols-4 gap-4 sm:grid-cols-4 lg:gap-8">
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
      <section id="features" className="bg-white px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-charcoal text-3xl font-bold sm:text-4xl">
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
                <span className="metric-badge activity-research">
                  5-minute setup
                </span>
              </div>
              <h3 className="text-charcoal mb-2 text-2xl font-bold">
                Academic CV Website
              </h3>
              <p className="mb-6 text-gray-600">
                Perfect for faculty and postdocs who want a quick professional
                presence.
              </p>
              <ul className="feature-list text-sm text-gray-600">
                <li>
                  <span className="checkmark">✓</span>
                  Professional academic profile
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Auto-updating publications from ORCID
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Clean, responsive design
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Custom domain support
                </li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="card" style={{ border: '2px solid #8FA68E' }}>
              <div className="mb-4">
                <span className="metric-badge activity-writing">
                  15-minute setup
                </span>
                <span className="text-sage-green ml-2 text-xs font-semibold">
                  POPULAR
                </span>
              </div>
              <h3 className="text-charcoal mb-2 text-2xl font-bold">
                Academic Dashboard
              </h3>
              <p className="mb-6 text-gray-600">
                Ideal for graduate students and early career researchers
                tracking progress.
              </p>
              <ul className="feature-list text-sm text-gray-600">
                <li>
                  <span className="checkmark">✓</span>
                  Everything in Tier 1
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Activity tracking & research heatmaps
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Goal setting & progress visualization
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Collaboration network
                </li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="card">
              <div className="mb-4">
                <span className="metric-badge activity-collaboration">
                  30-minute setup
                </span>
              </div>
              <h3 className="text-charcoal mb-2 text-2xl font-bold">
                Legacy Platform
              </h3>
              <p className="mb-6 text-gray-600">
                For senior faculty with complex networks and mentorship
                tracking.
              </p>
              <ul className="feature-list text-sm text-gray-600">
                <li>
                  <span className="checkmark">✓</span>
                  Everything in Tier 2
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Complete mentorship tracking
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Academic family trees
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Advanced analytics & legacy metrics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sage-green px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to showcase your academic journey?
          </h2>
          <p className="mt-4 text-lg text-white" style={{ opacity: 0.9 }}>
            Join thousands of academics who are already using ScholarFlow to
            build their digital presence.
          </p>
          <div className="mt-8">
            <a
              href="/auth/signin"
              className="text-sage-green inline-block rounded-lg bg-white px-8 py-3 font-semibold transition-colors hover:bg-gray-100"
            >
              Start Building Your Profile
            </a>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-charcoal px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm">
            © 2024 ScholarFlow. Built with ❤️ for the academic community.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a href="#" className="footer-link">
              About
            </a>
            <a href="#" className="footer-link">
              Privacy
            </a>
            <a href="#" className="footer-link">
              Terms
            </a>
            <a
              href="https://github.com/shandley/scholarflow"
              className="footer-link"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
