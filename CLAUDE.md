# ScholarFlow - Academic Productivity & Networking Platform

## Project Overview
ScholarFlow is a modern academic productivity and networking platform that enables academics to create sophisticated personal websites with progressive complexity (5-30 minute setup). The platform combines personal productivity tracking, academic legacy management, and professional networking, built with a Surfer Diary-inspired UI design philosophy.

## Project Repository
- **GitHub**: https://github.com/shandley/scholarflow
- **Status**: Initial setup phase
- **License**: MIT (pending)

## Current Development Phase
**Sprint 3: Data Persistence & User Management ✅**
- **Status**: ✅ COMPLETED - Full database integration with Prisma and PostgreSQL
- **Vercel Deployment**: ✅ LIVE at https://scholarflow-g2t4.vercel.app
- **Features**: Complete user registration, profile persistence, file uploads, API routes
- **Database**: Prisma ORM with PostgreSQL, NextAuth adapter, full relational schema
- **Next Steps**: Deploy with Vercel Postgres and add profile editing UI

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Pure CSS with academic design system (Tailwind to be added later)
- **UI Components**: Custom components with planned Radix UI/shadcn integration
- **State Management**: Zustand for client state, TanStack Query for server state
- **Animations**: CSS animations + Framer Motion for complex interactions
- **Data Viz**: D3.js for academic visualizations
- **Build Tool**: Vercel deployment with ISR/SSG

### Backend (Serverless)
- **Platform**: Vercel Functions (serverless)
- **Database**: Vercel Postgres for relational data
- **Cache**: Vercel KV (Redis) for API response caching
- **Storage**: Vercel Blob for files (CVs, photos)
- **Auth**: NextAuth.js with ORCID, GitHub, Google providers

### External Integrations
- **ORCID API**: Publication data import
- **Google Scholar**: Citation metrics
- **CrossRef**: DOI resolution
- **GitHub**: Repository and profile data

## System Architecture

### Three-Tier Progressive Enhancement Model

#### Tier 1: Academic CV Website (5-minute setup)
- **Features**: Basic profile, auto-updating publications, contact info
- **Target Users**: Faculty, postdocs wanting quick professional presence
- **Technical**: Static site generation with ORCID integration

#### Tier 2: Academic Dashboard (15-minute setup)
- **Features**: Activity tracking, goal visualization, collaboration network
- **Target Users**: Graduate students, early career researchers
- **Technical**: Dynamic features with API routes and data persistence

#### Tier 3: Legacy Platform (30-minute setup)
- **Features**: Complete mentorship tracking, academic family trees, advanced analytics
- **Target Users**: Senior faculty with complex networks
- **Technical**: Full database integration with relationship management

## Core Features by Module

### Universal Modules (All Users)
- [ ] Personal academic profile with bio and photo
- [ ] Contact information and social links
- [ ] QR code generator for conference networking
- [ ] Basic goal tracking (customizable to role)
- [ ] Research activity heatmap
- [ ] Daily/weekly productivity streaks
- [ ] Time allocation visualization

### Faculty-Specific Modules
- [ ] Publication timeline with impact metrics
- [ ] Citation tracking and prediction
- [ ] Grant application timeline
- [ ] Student supervision dashboard
- [ ] Academic family tree visualization
- [ ] Legacy impact metrics

### Student-Specific Modules
- [ ] Degree milestone tracking
- [ ] Course completion and GPA tracking
- [ ] Research opportunity applications
- [ ] Advisor relationship tracking
- [ ] Lab rotation summaries

## Design System

### Color Palette
```css
--sage-green: #8FA68E     /* Primary brand color */
--warm-beige: #F5F2E8     /* Background warmth */
--soft-blue: #6B8CAE      /* Academic trust */
--charcoal: #2F3437       /* Primary text */
--light-gray: #F8F9FA     /* Card backgrounds */

/* Academic Metrics */
--citation-orange: #E67E22
--collaboration-blue: #3498DB
--grant-gold: #F39C12
--publication-green: #27AE60
--teaching-purple: #9B59B6
```

### Typography
- Headers: Inter or Source Sans Pro
- Body: System fonts (SF Pro, Segoe UI)
- Data/Numbers: JetBrains Mono
- Accent: Crimson Text

## Development Workflow

### Quick Start Commands
```bash
# Clone and setup
git clone https://github.com/your-org/scholarflow.git
cd scholarflow
npm install

# Development
npm run dev

# Deploy to Vercel
vercel --prod

# Run tests
npm test
```

### Git Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `release/*`: Release preparation

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Next.js 14 project setup with TypeScript
- [ ] Vercel deployment pipeline configuration
- [ ] Basic routing structure
- [ ] Tailwind CSS + component library setup
- [ ] NextAuth.js authentication scaffold
- [ ] Basic landing page

### Phase 2: Tier 1 MVP (Weeks 3-4)
- [ ] Profile data model and schemas
- [ ] ORCID OAuth integration
- [ ] Publication import functionality
- [ ] Static profile page generation
- [ ] Responsive template designs (3-4 options)
- [ ] Custom domain setup flow

### Phase 3: Data & Persistence (Weeks 5-6)
- [ ] Vercel Postgres setup and schemas
- [ ] User account management
- [ ] Profile CRUD operations
- [ ] Publication caching with Vercel KV
- [ ] File upload for photos/CVs
- [ ] Data export functionality

### Phase 4: Tier 2 Features (Weeks 7-8)
- [ ] Activity tracking modules
- [ ] Goal setting and visualization
- [ ] Research heatmap calendar
- [ ] Basic analytics dashboard
- [ ] Google Scholar integration
- [ ] Mobile PWA features

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Academic network relationships
- [ ] Mentorship tracking
- [ ] Collaboration visualization
- [ ] Advanced search and filtering
- [ ] QR code networking features
- [ ] Email notifications

### Phase 6: Tier 3 & Polish (Weeks 11-12)
- [ ] Academic family tree visualization
- [ ] Legacy metrics and dashboards
- [ ] Institution integration features
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation and tutorials

## Current Tasks & Priorities

### Immediate Next Steps
1. Initialize Next.js 14 project with TypeScript
2. Set up Vercel deployment and preview environments
3. Configure ESLint, Prettier, and pre-commit hooks
4. Create basic component library with Tailwind
5. Implement landing page with tier selection

### Technical Decisions Needed
- Component library choice (Radix UI vs Ark UI vs custom)
- Form handling library (React Hook Form vs Formik)
- Testing strategy (Jest + React Testing Library vs Vitest)
- Documentation tool (Storybook vs Docusaurus)
- Analytics platform (Vercel Analytics vs Plausible)

## Success Metrics

### Technical Metrics
- Page load time: <3 seconds
- Lighthouse score: >90
- Bundle size: <200KB initial
- API response time: <500ms
- Test coverage: >80%

### User Metrics
- Setup completion rate: >80%
- Daily active users: Track growth
- Feature adoption: Monitor module usage
- User retention: 30-day retention >60%
- NPS score: >8

## API Design

### Core Endpoints
```typescript
// Profile Management
GET    /api/profile/:username
POST   /api/profile
PUT    /api/profile/:id
DELETE /api/profile/:id

// Publications
GET    /api/publications/:orcid
POST   /api/publications/sync
GET    /api/publications/citations/:doi

// Networking
GET    /api/network/:userId
POST   /api/network/connect
PUT    /api/network/relationship/:id
DELETE /api/network/relationship/:id

// Analytics
GET    /api/analytics/activity/:userId
GET    /api/analytics/goals/:userId
POST   /api/analytics/track
```

## Security Considerations

### Authentication & Authorization
- JWT tokens with refresh rotation
- Role-based access control (owner, viewer, public)
- OAuth providers: ORCID, GitHub, Google
- Email verification for custom domains

### Data Privacy
- GDPR compliance for EU academics
- Granular privacy controls
- Data export functionality
- Right to deletion
- Encrypted sensitive data

## Deployment Strategy

### Environments
- **Development**: Local Next.js dev server
- **Preview**: Vercel preview deployments (PRs)
- **Staging**: staging.scholarflow.com
- **Production**: scholarflow.com

### Monitoring
- Vercel Analytics for performance
- Sentry for error tracking
- Custom analytics for academic metrics
- Uptime monitoring with alerts

## Revenue Model

### Pricing Tiers
1. **Free**: Tier 1 features, 1 custom domain
2. **Pro ($15/month)**: All features, unlimited domains, priority support
3. **Team ($50/month)**: 5 users, shared analytics, collaboration
4. **Enterprise**: Custom pricing, SSO, SLA

### Revenue Targets
- Month 3: 100 free users
- Month 6: 50 paying users ($750 MRR)
- Month 12: 500 paying users ($7,500 MRR)

## Team & Responsibilities

### Current Team
- **Project Lead**: Overall vision and coordination
- **Frontend Dev**: Next.js implementation
- **Backend Dev**: API and integrations
- **UI/UX Designer**: Design system and templates
- **DevOps**: Vercel deployment and monitoring

### Communication
- Daily standups: 9 AM
- Weekly planning: Mondays
- Sprint cycle: 2 weeks
- Code reviews: Required for main

## Risk Management

### Technical Risks
- API rate limits from ORCID/Google Scholar
- Vercel function timeouts for large data
- Database scaling for network features
- SEO optimization for academic discovery

### Mitigation Strategies
- Implement robust caching layer
- Queue system for long operations
- Database query optimization
- Progressive enhancement approach

## Lessons Learned & Best Practices

### Deployment & Styling Strategy

#### **CSS Strategy: Pure CSS First, Tailwind Later**
**Decision**: Use pure CSS for initial development, add Tailwind CSS later for productivity
**Rationale**: 
- Eliminates build configuration issues during initial setup
- Provides complete control over custom academic components
- Faster deployment cycles without CSS framework dependencies
- Better for unique visualizations (academic family trees, research heatmaps)

**Implementation**:
```css
/* Current: Pure CSS with CSS custom properties */
:root {
  --sage-green: #8FA68E;
  --warm-beige: #F5F2E8;
  /* ... academic color system */
}

.research-card {
  background: var(--sage-green);
  transition: transform 0.3s ease;
}
```

**Future Migration Plan**:
```bash
# When ready for faster development (Phase 2+)
npm install -D tailwindcss@latest postcss autoprefixer
npx tailwindcss init -p

# Hybrid approach: Custom CSS + Tailwind utilities
<div className="research-card">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-bold">Research Progress</h3>
  </div>
</div>
```

#### **Vercel Deployment Lessons**

**Issue**: CSS framework version conflicts causing deployment failures
**Solution**: Simplified CSS approach eliminates build complexity
**Best Practice**: Start simple, add complexity incrementally

**Git Integration Issues**:
- Vercel sometimes gets stuck on old commits
- **Solution**: Disconnect and reconnect Git repository in Vercel settings
- **Prevention**: Use clear commit messages, force-push when needed

**Environment Variables**:
- Don't reference non-existent secrets in `vercel.json`
- Add environment variables after successful initial deployment
- Use `.env.example` as template for required variables

### Academic Design System Implementation

#### **Color Palette Strategy**
```css
/* Academic-focused color system */
:root {
  /* Primary brand colors */
  --sage-green: #8FA68E;      /* Primary actions, accents */
  --warm-beige: #F5F2E8;      /* Background warmth */
  --soft-blue: #6B8CAE;       /* Academic trust */
  --charcoal: #2F3437;        /* Primary text */
  
  /* Academic metric colors */
  --citation-orange: #E67E22;
  --collaboration-blue: #3498DB;
  --grant-gold: #F39C12;
  --publication-green: #27AE60;
  --teaching-purple: #9B59B6;
}
```

#### **Component Architecture**
- **Cards**: Foundation for all academic content display
- **Badges**: Status indicators for academic metrics
- **Grids**: Responsive layouts for data presentation
- **Typography**: Clear hierarchy for academic content

### Development Workflow Insights

#### **Progressive Enhancement Approach**
1. **Phase 1**: Pure CSS, core functionality
2. **Phase 2**: Add Tailwind for utility classes
3. **Phase 3**: Component library integration
4. **Phase 4**: Advanced animations and interactions

#### **Academic-Specific Considerations**
- **Data Visualization**: Custom CSS better for unique academic charts
- **Responsive Design**: Academic users access from various devices
- **Accessibility**: Important for academic inclusivity
- **Performance**: Fast loading for conference networking

## Definition of Done

### Feature Completion Checklist
- [ ] Code written and reviewed
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Responsive design verified
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Deployed to preview environment
- [ ] Cross-browser testing completed
- [ ] CSS styling verified across devices
- [ ] Product owner approval

## Resources & References

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Vercel Platform Docs](https://vercel.com/docs)
- [ORCID API](https://orcid.org/developers)
- [Google Scholar API](https://serpapi.com/google-scholar-api)

### Design Inspiration
- Surfer Diary (UI patterns)
- GitHub Profile (developer familiarity)
- LinkedIn (professional networking)
- Google Scholar (academic metrics)

## Notes & Decisions Log

### Key Decisions
- **2024-01-XX**: Chose Vercel over self-hosting for simplicity
- **2024-01-XX**: Selected Next.js 14 for SSG/ISR capabilities
- **2024-01-XX**: Decided on progressive enhancement approach
- **2024-01-XX**: Opted for serverless over traditional backend

### Open Questions
- How to handle institutional email requirements?
- Best approach for academic family tree visualization?
- Optimal caching strategy for publication data?
- How to verify academic relationships authentically?