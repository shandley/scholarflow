# ScholarFlow Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- PostgreSQL 14+ (or Docker)
- Vercel CLI (optional but recommended)
- VS Code or preferred editor

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/scholarflow/scholarflow.git
cd scholarflow
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/scholarflow"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers
ORCID_CLIENT_ID="your-orcid-client-id"
ORCID_CLIENT_SECRET="your-orcid-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# External APIs
GOOGLE_SCHOLAR_API_KEY="your-api-key"
CROSSREF_API_KEY="your-api-key"

# Vercel (Production)
VERCEL_URL="https://your-app.vercel.app"
```

4. **Set up the database**

```bash
# Using Docker
docker-compose up -d postgres

# Or use local PostgreSQL
createdb scholarflow

# Run migrations
npx prisma migrate dev
```

5. **Seed the database (optional)**

```bash
npm run db:seed
```

6. **Start the development server**

```bash
npm run dev
```

Visit http://localhost:3000 to see the app running.

## Project Structure

```
scholarflow/
├── app/                    # Next.js 14 app directory
│   ├── (auth)/            # Auth-related pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   ├── profile/           # Public profile pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── common/           # Shared components
│   ├── dashboard/        # Dashboard-specific
│   ├── profile/          # Profile-specific
│   └── ui/               # UI primitives
├── lib/                   # Utilities and libraries
│   ├── auth/             # Authentication helpers
│   ├── db/               # Database client
│   ├── api/              # API clients
│   └── utils/            # General utilities
├── prisma/               # Database schema
│   ├── schema.prisma     # Prisma schema
│   └── migrations/       # Migration files
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript types
```

## Development Workflow

### Code Style

We use ESLint and Prettier for consistent code style:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

### Git Workflow

1. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Write code
- Add tests
- Update documentation

3. **Commit with conventional commits**

```bash
git add .
git commit -m "feat: add profile export functionality"
```

Commit types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

4. **Push and create PR**

```bash
git push origin feature/your-feature-name
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

#### Writing Tests

**Component Test Example**:

```typescript
// components/profile/ProfileCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProfileCard } from './ProfileCard'

describe('ProfileCard', () => {
  it('renders profile information', () => {
    const profile = {
      fullName: 'Dr. Jane Smith',
      position: 'Assistant Professor',
      institution: 'MIT'
    }

    render(<ProfileCard profile={profile} />)

    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Assistant Professor')).toBeInTheDocument()
    expect(screen.getByText('MIT')).toBeInTheDocument()
  })
})
```

**API Route Test Example**:

```typescript
// app/api/profiles/route.test.ts
import { createMocks } from 'node-mocks-http';
import handler from './route';

describe('/api/profiles', () => {
  it('returns profiles list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { page: '1', limit: '10' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.profiles).toBeDefined();
    expect(json.pagination).toBeDefined();
  });
});
```

## Key Development Areas

### 1. Authentication (NextAuth.js)

```typescript
// lib/auth/config.ts
import NextAuth from 'next-auth';
import ORCIDProvider from 'next-auth/providers/orcid';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    ORCIDProvider({
      clientId: process.env.ORCID_CLIENT_ID,
      clientSecret: process.env.ORCID_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add custom fields to session
      return session;
    },
  },
};
```

### 2. Database Operations (Prisma)

```typescript
// lib/db/profiles.ts
import { prisma } from '@/lib/db';

export async function getProfile(username: string) {
  return prisma.profile.findUnique({
    where: { username },
    include: {
      publications: {
        take: 10,
        orderBy: { publicationYear: 'desc' },
      },
      socialLinks: true,
    },
  });
}

export async function updateProfile(id: string, data: ProfileUpdate) {
  return prisma.profile.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}
```

### 3. API Integration

```typescript
// lib/api/orcid.ts
export class ORCIDClient {
  private baseURL = 'https://pub.orcid.org/v3.0';

  async getPublications(orcid: string) {
    const response = await fetch(`${this.baseURL}/${orcid}/works`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ORCID data');
    }

    return response.json();
  }
}
```

### 4. React Components

```typescript
// components/profile/PublicationList.tsx
'use client'

import { useState } from 'react'
import { Publication } from '@/types'

interface PublicationListProps {
  publications: Publication[]
  editable?: boolean
}

export function PublicationList({
  publications,
  editable = false
}: PublicationListProps) {
  const [filter, setFilter] = useState<string>('')

  const filtered = publications.filter(pub =>
    pub.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search publications..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <div className="divide-y">
        {filtered.map((pub) => (
          <PublicationCard
            key={pub.id}
            publication={pub}
            editable={editable}
          />
        ))}
      </div>
    </div>
  )
}
```

### 5. Server Actions (Next.js 14)

```typescript
// app/actions/profile.ts
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { updateProfile } from '@/lib/db/profiles';

export async function updateProfileAction(
  profileId: string,
  data: ProfileUpdate
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const updated = await updateProfile(profileId, data);

  // Revalidate the profile page
  revalidatePath(`/profile/${updated.username}`);

  return updated;
}
```

## Performance Optimization

### 1. Image Optimization

```typescript
import Image from 'next/image'

<Image
  src={profile.photo}
  alt={profile.fullName}
  width={200}
  height={200}
  className="rounded-full"
  placeholder="blur"
  blurDataURL={profile.photoBlur}
/>
```

### 2. Data Fetching

```typescript
// Use React Suspense for better UX
import { Suspense } from 'react'

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  )
}
```

### 3. Caching Strategy

```typescript
// Implement stale-while-revalidate
export async function getPublications(orcid: string) {
  const cached = await redis.get(`publications:${orcid}`);

  if (cached) {
    // Return cached data immediately
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const fresh = await orcidClient.getPublications(orcid);

  // Cache for 24 hours
  await redis.set(`publications:${orcid}`, JSON.stringify(fresh), 'EX', 86400);

  return fresh;
}
```

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy to preview**

```bash
vercel
```

3. **Deploy to production**

```bash
vercel --prod
```

### Environment Variables

Set these in Vercel dashboard:

- All variables from `.env.local`
- `NODE_ENV=production`
- Database connection string
- API keys and secrets

### Database Migrations

```bash
# Generate migration
npx prisma migrate dev --name add_feature

# Deploy migration to production
npx prisma migrate deploy
```

## Monitoring & Debugging

### Logging

```typescript
import { logger } from '@/lib/logger';

logger.info('Profile created', {
  profileId: profile.id,
  username: profile.username,
});

logger.error('Failed to sync publications', {
  error: error.message,
  orcid: profile.orcid,
});
```

### Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Performance Monitoring

```typescript
// Use Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  analytics.track('web-vitals', {
    name: metric.name,
    value: metric.value,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Common Tasks

### Adding a New Module

1. Define the data model in `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev`
3. Add API routes in `app/api/`
4. Create React components in `components/`
5. Add to dashboard in `app/(dashboard)/`
6. Write tests
7. Update documentation

### Integrating a New OAuth Provider

1. Add provider config to `lib/auth/config.ts`
2. Set environment variables
3. Update sign-in page UI
4. Test the flow
5. Handle profile data mapping

### Adding a New Visualization

1. Choose library (D3.js, Recharts, etc.)
2. Create component in `components/visualizations/`
3. Implement responsive design
4. Add loading states
5. Optimize for performance
6. Make it accessible

## Troubleshooting

### Common Issues

**Database connection errors**

```bash
# Check PostgreSQL is running
docker-compose ps

# Test connection
npx prisma db pull
```

**Build errors**

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Type errors**

```bash
# Regenerate Prisma types
npx prisma generate

# Check TypeScript
npm run type-check
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Getting Help

- GitHub Issues: Report bugs and request features
- Discord: Join our community for discussions
- Documentation: Check our docs site
- Email: support@scholarflow.com

Happy coding! 🚀
