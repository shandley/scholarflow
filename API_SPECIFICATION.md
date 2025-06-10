# ScholarFlow API Specification

## Overview

RESTful API built with Next.js API Routes, deployed as Vercel Functions. All endpoints follow REST conventions and return JSON responses.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://scholarflow.com/api`

## Authentication

JWT-based authentication using NextAuth.js with refresh tokens.

### Auth Endpoints

#### POST /api/auth/signin

Sign in with various providers

```typescript
// Request
{
  provider: "credentials" | "orcid" | "github" | "google",
  credentials?: {
    email: string,
    password: string
  }
}

// Response
{
  user: {
    id: string,
    email: string,
    name: string,
    image?: string,
    role: "user" | "admin" | "institution_admin"
  },
  accessToken: string,
  refreshToken: string,
  expiresIn: number
}
```

#### POST /api/auth/signout

Sign out current user

```typescript
// Response
{
  success: true,
  message: "Signed out successfully"
}
```

#### GET /api/auth/session

Get current session

```typescript
// Response
{
  user: {
    id: string,
    email: string,
    name: string,
    image?: string,
    role: string
  },
  expires: string
}
```

## Profile Endpoints

#### GET /api/profiles

List all public profiles with pagination

```typescript
// Query Parameters
{
  page?: number,        // Default: 1
  limit?: number,       // Default: 20, Max: 100
  search?: string,      // Full-text search
  institution?: string,
  department?: string,
  sort?: "recent" | "alphabetical" | "citations"
}

// Response
{
  profiles: Profile[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

#### GET /api/profiles/[username]

Get public profile by username

```typescript
// Response
{
  id: string,
  username: string,
  fullName: string,
  displayName?: string,
  position?: string,
  institution?: string,
  department?: string,
  bio?: string,
  orcid?: string,
  socialLinks: SocialLink[],
  publications: Publication[], // Limited to recent 10
  stats: {
    publicationCount: number,
    citationCount: number,
    hIndex: number,
    collaboratorCount: number
  },
  lastUpdated: string
}
```

#### POST /api/profiles

Create new profile (requires auth)

```typescript
// Request
{
  username: string,           // Unique, alphanumeric + hyphens
  fullName: string,
  displayName?: string,
  position?: string,
  institution?: string,
  department?: string,
  bio?: string,
  orcid?: string,
  googleScholarId?: string,
  template?: "minimal" | "research" | "teaching" | "industry"
}

// Response
{
  profile: Profile,
  setupUrl: string  // URL for next steps
}
```

#### PUT /api/profiles/[id]

Update profile (requires auth, owner only)

```typescript
// Request (partial update supported)
{
  fullName?: string,
  displayName?: string,
  position?: string,
  institution?: string,
  department?: string,
  bio?: string,
  visibility?: "public" | "authenticated" | "private",
  theme?: {
    primaryColor?: string,
    font?: string,
    layout?: string
  }
}

// Response
{
  profile: Profile,
  updated: string[]  // List of updated fields
}
```

#### DELETE /api/profiles/[id]

Delete profile (requires auth, owner only)

```typescript
// Response
{
  success: true,
  message: "Profile deleted successfully",
  dataExportUrl: string  // Temporary URL for data download
}
```

## Publication Endpoints

#### GET /api/publications

Get publications for a profile

```typescript
// Query Parameters
{
  profileId: string,    // Required
  page?: number,
  limit?: number,
  year?: number,
  type?: "article" | "book" | "conference" | "preprint",
  search?: string
}

// Response
{
  publications: Publication[],
  pagination: Pagination,
  stats: {
    totalCitations: number,
    averageCitationsPerPaper: number,
    hIndex: number,
    i10Index: number
  }
}
```

#### POST /api/publications/sync

Sync publications from external source (requires auth)

```typescript
// Request
{
  profileId: string,
  source: "orcid" | "crossref" | "pubmed",
  sourceId?: string  // ORCID ID, etc.
}

// Response
{
  synced: number,
  new: number,
  updated: number,
  errors: string[],
  publications: Publication[]
}
```

#### PUT /api/publications/[id]

Update publication details (requires auth, owner only)

```typescript
// Request
{
  title?: string,
  abstract?: string,
  authors?: Author[],
  journalName?: string,
  publicationDate?: string,
  openAccess?: boolean
}

// Response
{
  publication: Publication,
  updated: string[]
}
```

## Activity Tracking Endpoints (Tier 2)

#### GET /api/activities

Get activities for a profile

```typescript
// Query Parameters
{
  profileId: string,
  startDate: string,    // ISO date
  endDate: string,      // ISO date
  type?: string,
  groupBy?: "day" | "week" | "month"
}

// Response
{
  activities: Activity[],
  summary: {
    totalHours: number,
    totalSessions: number,
    averageSessionLength: number,
    mostProductiveTime: string,
    activityBreakdown: {
      [type: string]: number  // Hours per type
    }
  },
  heatmap: {
    [date: string]: {
      intensity: number,      // 0-10
      hours: number,
      activities: number
    }
  }
}
```

#### POST /api/activities

Log new activity (requires auth)

```typescript
// Request
{
  activityType: "writing" | "research" | "teaching" | "meeting" | "conference",
  title: string,
  description?: string,
  startTime: string,      // ISO datetime
  endTime?: string,       // ISO datetime
  duration?: number,      // Minutes (if endTime not provided)
  projectId?: string,
  publicationId?: string,
  productivityScore?: number  // 1-10
}

// Response
{
  activity: Activity,
  streak: {
    current: number,
    longest: number,
    daysActive: number
  }
}
```

## Goal Management Endpoints (Tier 2)

#### GET /api/goals

Get goals for a profile

```typescript
// Query Parameters
{
  profileId: string,
  status?: "active" | "completed" | "paused",
  category?: string,
  year?: number
}

// Response
{
  goals: Goal[],
  summary: {
    active: number,
    completed: number,
    completionRate: number,
    onTrack: number
  }
}
```

#### POST /api/goals

Create new goal (requires auth)

```typescript
// Request
{
  title: string,
  description?: string,
  category: "publication" | "grant" | "teaching" | "career" | "other",
  targetValue: number,
  targetUnit: string,       // "papers", "dollars", "hours", etc.
  targetDate: string,       // ISO date
  milestones?: Milestone[]
}

// Response
{
  goal: Goal,
  suggestions: string[]     // AI-powered suggestions
}
```

#### PUT /api/goals/[id]/progress

Update goal progress (requires auth)

```typescript
// Request
{
  currentValue: number,
  note?: string
}

// Response
{
  goal: Goal,
  progress: {
    percentage: number,
    onTrack: boolean,
    projectedCompletion: string,
    daysRemaining: number
  }
}
```

## Network & Relationships Endpoints (Tier 3)

#### GET /api/network/connections

Get academic connections

```typescript
// Query Parameters
{
  profileId: string,
  type?: "advisor" | "mentee" | "collaborator" | "committee",
  status?: "pending" | "confirmed",
  includeMetrics?: boolean
}

// Response
{
  connections: Connection[],
  stats: {
    totalConnections: number,
    byType: { [type: string]: number },
    institutions: string[],
    countries: string[]
  },
  graph?: {              // If includeMetrics=true
    nodes: Node[],
    edges: Edge[]
  }
}
```

#### POST /api/network/connections

Create connection request (requires auth)

```typescript
// Request
{
  fromProfileId: string,
  toProfileId: string,
  relationshipType: string,
  roleDetail?: string,
  startDate?: string,
  endDate?: string,
  message?: string
}

// Response
{
  connection: Connection,
  notificationSent: boolean
}
```

#### PUT /api/network/connections/[id]/confirm

Confirm connection request (requires auth)

```typescript
// Response
{
  connection: Connection,
  mutual: boolean  // If both sides now confirmed
}
```

## Analytics Endpoints

#### GET /api/analytics/profile

Get profile analytics (requires auth, owner only)

```typescript
// Query Parameters
{
  profileId: string,
  period: "week" | "month" | "year" | "all",
  metrics?: string[]  // Specific metrics to include
}

// Response
{
  views: {
    total: number,
    unique: number,
    trend: number[],      // Daily values
    sources: { [source: string]: number }
  },
  engagement: {
    publicationClicks: number,
    profileShares: number,
    qrScans: number,
    contactRequests: number
  },
  growth: {
    citations: { current: number, change: number },
    connections: { current: number, change: number },
    publications: { current: number, change: number }
  },
  rankings: {
    departmentRank?: number,
    institutionRank?: number,
    fieldRank?: number
  }
}
```

#### POST /api/analytics/events

Track analytics event

```typescript
// Request
{
  eventType: string,
  eventCategory?: string,
  eventValue?: any,
  profileId?: string
}

// Response
{
  success: true,
  eventId: string
}
```

## File Management Endpoints

#### POST /api/files/upload

Upload file (requires auth)

```typescript
// Request (multipart/form-data)
{
  file: File,
  type: "cv" | "photo" | "presentation" | "data",
  isPublic?: boolean,
  associatedId?: string  // Publication or Project ID
}

// Response
{
  file: {
    id: string,
    url: string,
    filename: string,
    size: number,
    type: string
  }
}
```

#### GET /api/files/[id]

Download file

```typescript
// Headers
{
  "Authorization": "Bearer [token]"  // If file is private
}

// Response
Binary file data with appropriate Content-Type
```

#### DELETE /api/files/[id]

Delete file (requires auth, owner only)

```typescript
// Response
{
  success: true,
  message: "File deleted successfully"
}
```

## Search Endpoints

#### GET /api/search

Global search across profiles and publications

```typescript
// Query Parameters
{
  q: string,              // Search query
  type?: "all" | "profiles" | "publications" | "projects",
  filters?: {
    institution?: string[],
    year?: number[],
    field?: string[]
  },
  limit?: number
}

// Response
{
  results: {
    profiles: SearchResult[],
    publications: SearchResult[],
    projects: SearchResult[]
  },
  facets: {
    institutions: Facet[],
    years: Facet[],
    fields: Facet[],
    types: Facet[]
  },
  total: number,
  took: number  // Milliseconds
}
```

## Export Endpoints

#### GET /api/export/cv

Export CV in various formats (requires auth)

```typescript
// Query Parameters
{
  profileId: string,
  format: "pdf" | "latex" | "docx" | "json",
  template?: string,
  sections?: string[]  // Which sections to include
}

// Response
Binary file or JSON data depending on format
```

#### GET /api/export/data

Export all user data (GDPR compliance)

```typescript
// Query Parameters
{
  profileId: string,
  format: "json" | "csv"
}

// Response
{
  exportUrl: string,      // Temporary signed URL
  expiresAt: string,
  size: number
}
```

## Error Responses

All errors follow consistent format:

```typescript
{
  error: {
    code: string,         // e.g., "UNAUTHORIZED", "NOT_FOUND"
    message: string,      // Human-readable message
    details?: any,        // Additional error details
    timestamp: string
  }
}
```

### Common Error Codes

- `400 BAD_REQUEST`: Invalid request parameters
- `401 UNAUTHORIZED`: Authentication required
- `403 FORBIDDEN`: Insufficient permissions
- `404 NOT_FOUND`: Resource not found
- `409 CONFLICT`: Resource already exists
- `429 TOO_MANY_REQUESTS`: Rate limit exceeded
- `500 INTERNAL_ERROR`: Server error

## Rate Limiting

### Limits by Tier

- **Anonymous**: 100 requests/hour
- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: Unlimited

### Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## Versioning

API version included in URL path:

- Current: `/api/v1/`
- Legacy support: 6 months after new version

## Webhooks (Pro/Enterprise)

Configure webhooks for events:

- `profile.updated`
- `publication.added`
- `goal.completed`
- `connection.confirmed`
- `citation.milestone`

This API specification provides a comprehensive foundation for ScholarFlow's functionality across all three tiers of service.
