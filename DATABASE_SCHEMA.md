# ScholarFlow Database Schema

## Overview
This document defines the database schema for ScholarFlow using PostgreSQL with Prisma ORM. The schema supports all three tiers of functionality while maintaining data integrity and performance.

## Core Tables

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user', -- user, admin, institution_admin
  status VARCHAR(50) DEFAULT 'active' -- active, suspended, deleted
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly version
  
  -- Basic Information
  full_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  pronouns VARCHAR(50),
  position VARCHAR(255),
  department VARCHAR(255),
  institution VARCHAR(255),
  location VARCHAR(255),
  bio TEXT,
  
  -- Academic Identifiers
  orcid VARCHAR(19) UNIQUE,
  google_scholar_id VARCHAR(50),
  researcher_id VARCHAR(50),
  scopus_id VARCHAR(50),
  
  -- Profile Settings
  visibility VARCHAR(50) DEFAULT 'public', -- public, authenticated, private
  template VARCHAR(50) DEFAULT 'minimal',
  theme JSONB DEFAULT '{}',
  custom_domain VARCHAR(255) UNIQUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_sync TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  
  -- Search
  search_vector tsvector
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profiles_orcid ON profiles(orcid);
CREATE INDEX idx_profiles_search ON profiles USING GIN(search_vector);
```

### Publications Table
```sql
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Publication Details
  title TEXT NOT NULL,
  abstract TEXT,
  authors JSONB NOT NULL, -- Array of author objects
  publication_date DATE,
  publication_year INTEGER,
  
  -- Identifiers
  doi VARCHAR(255) UNIQUE,
  pmid VARCHAR(50),
  arxiv_id VARCHAR(50),
  isbn VARCHAR(20),
  
  -- Journal/Venue Information
  journal_name VARCHAR(255),
  volume VARCHAR(50),
  issue VARCHAR(50),
  pages VARCHAR(50),
  publisher VARCHAR(255),
  conference_name VARCHAR(255),
  
  -- Metrics
  citation_count INTEGER DEFAULT 0,
  altmetric_score DECIMAL(10,2),
  impact_factor DECIMAL(10,3),
  
  -- Type and Status
  publication_type VARCHAR(50), -- article, book, chapter, conference, preprint
  peer_reviewed BOOLEAN DEFAULT true,
  open_access BOOLEAN DEFAULT false,
  
  -- Source and Sync
  source VARCHAR(50), -- orcid, manual, crossref, pubmed
  source_id VARCHAR(255),
  last_sync TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Full-text search
  search_vector tsvector
);

CREATE INDEX idx_publications_profile_id ON publications(profile_id);
CREATE INDEX idx_publications_doi ON publications(doi);
CREATE INDEX idx_publications_year ON publications(publication_year);
CREATE INDEX idx_publications_search ON publications USING GIN(search_vector);
```

### Academic Relationships Table
```sql
CREATE TABLE academic_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Relationship Details
  relationship_type VARCHAR(50) NOT NULL, -- advisor, mentee, collaborator, committee_member
  role_detail VARCHAR(255), -- "PhD Advisor", "Postdoc Mentor", etc.
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT true,
  
  -- Verification
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, rejected
  confirmed_at TIMESTAMP,
  confirmed_by UUID REFERENCES users(id),
  
  -- Context
  institution VARCHAR(255),
  department VARCHAR(255),
  project_name VARCHAR(255),
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_relationship UNIQUE(from_profile_id, to_profile_id, relationship_type)
);

CREATE INDEX idx_relationships_from ON academic_relationships(from_profile_id);
CREATE INDEX idx_relationships_to ON academic_relationships(to_profile_id);
CREATE INDEX idx_relationships_type ON academic_relationships(relationship_type);
CREATE INDEX idx_relationships_status ON academic_relationships(status);
```

### Activities Table (Tier 2)
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_type VARCHAR(50) NOT NULL, -- writing, research, teaching, meeting, conference
  activity_subtype VARCHAR(50), -- manuscript, grant, lecture, lab_work
  title VARCHAR(255),
  description TEXT,
  
  -- Time Tracking
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  
  -- Context
  project_id UUID REFERENCES projects(id),
  publication_id UUID REFERENCES publications(id),
  location VARCHAR(255),
  
  -- Metrics
  productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 10),
  word_count INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_profile_id ON activities(profile_id);
CREATE INDEX idx_activities_date ON activities(start_time);
CREATE INDEX idx_activities_type ON activities(activity_type);
```

### Goals Table (Tier 2)
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Goal Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- publication, grant, teaching, career
  
  -- SMART Criteria
  specific_metric VARCHAR(255), -- "papers", "citations", "grants"
  measurable_target DECIMAL(10,2),
  measurable_unit VARCHAR(50), -- "count", "dollars", "hours"
  
  -- Timeline
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  completed_date DATE,
  
  -- Progress
  current_value DECIMAL(10,2) DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, completed, paused, cancelled
  
  -- Milestones
  milestones JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_profile_id ON goals(profile_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_category ON goals(category);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Project Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_type VARCHAR(50), -- research, teaching, service, outreach
  
  -- Funding
  funding_source VARCHAR(255),
  grant_number VARCHAR(100),
  total_budget DECIMAL(12,2),
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- planning, active, completed, cancelled
  
  -- Collaborations
  is_collaborative BOOLEAN DEFAULT false,
  lead_institution VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_profile_id ON projects(profile_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### Project Collaborators (Junction Table)
```sql
CREATE TABLE project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(100), -- PI, Co-PI, Collaborator, Student
  joined_date DATE,
  left_date DATE,
  CONSTRAINT unique_project_collaborator UNIQUE(project_id, profile_id)
);
```

### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- File Details
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  mime_type VARCHAR(100),
  size_bytes BIGINT,
  
  -- Storage
  storage_key VARCHAR(500) NOT NULL, -- Vercel Blob key
  storage_url TEXT,
  
  -- Classification
  file_type VARCHAR(50), -- cv, photo, presentation, poster, data
  is_public BOOLEAN DEFAULT false,
  
  -- Associations
  publication_id UUID REFERENCES publications(id),
  project_id UUID REFERENCES projects(id),
  
  -- Metadata
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP,
  access_count INTEGER DEFAULT 0
);

CREATE INDEX idx_files_profile_id ON files(profile_id);
CREATE INDEX idx_files_type ON files(file_type);
```

### Social Links Table
```sql
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  platform VARCHAR(50) NOT NULL, -- twitter, linkedin, github, personal_website
  url TEXT NOT NULL,
  username VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_profile_platform UNIQUE(profile_id, platform)
);

CREATE INDEX idx_social_links_profile_id ON social_links(profile_id);
```

### Analytics Events Table
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Event Details
  event_type VARCHAR(50) NOT NULL, -- profile_view, publication_click, qr_scan
  event_category VARCHAR(50),
  event_value JSONB DEFAULT '{}',
  
  -- Context
  session_id VARCHAR(255),
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country_code VARCHAR(2),
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_profile_id ON analytics_events(profile_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification Details
  type VARCHAR(50) NOT NULL, -- connection_request, goal_achieved, citation_milestone
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  -- Context
  related_profile_id UUID REFERENCES profiles(id),
  related_publication_id UUID REFERENCES publications(id),
  action_url TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

## Prisma Schema

```prisma
// schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLogin     DateTime?
  role          UserRole  @default(USER)
  status        UserStatus @default(ACTIVE)
  
  profile       Profile?
  notifications Notification[]
}

model Profile {
  id             String   @id @default(uuid())
  userId         String   @unique
  username       String   @unique
  slug           String   @unique
  
  // Basic Information
  fullName       String
  displayName    String?
  pronouns       String?
  position       String?
  department     String?
  institution    String?
  location       String?
  bio            String?
  
  // Academic Identifiers
  orcid          String?  @unique
  googleScholarId String?
  researcherId   String?
  scopusId       String?
  
  // Profile Settings
  visibility     ProfileVisibility @default(PUBLIC)
  template       String    @default("minimal")
  theme          Json      @default("{}")
  customDomain   String?   @unique
  
  // Metadata
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  lastSync       DateTime?
  viewCount      Int       @default(0)
  
  // Relations
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  publications   Publication[]
  activities     Activity[]
  goals          Goal[]
  projects       Project[]
  files          File[]
  socialLinks    SocialLink[]
  
  // Relationships (both directions)
  relationshipsFrom AcademicRelationship[] @relation("FromProfile")
  relationshipsTo   AcademicRelationship[] @relation("ToProfile")
  
  // Search
  @@index([username])
  @@index([slug])
  @@index([orcid])
}

model Publication {
  id              String   @id @default(uuid())
  profileId       String
  
  title           String
  abstract        String?
  authors         Json     // Array of author objects
  publicationDate DateTime?
  publicationYear Int?
  
  // Identifiers
  doi             String?  @unique
  pmid            String?
  arxivId         String?
  isbn            String?
  
  // Journal/Venue
  journalName     String?
  volume          String?
  issue           String?
  pages           String?
  publisher       String?
  conferenceName  String?
  
  // Metrics
  citationCount   Int      @default(0)
  altmetricScore  Decimal? @db.Decimal(10, 2)
  impactFactor    Decimal? @db.Decimal(10, 3)
  
  // Type and Status
  publicationType PublicationType
  peerReviewed    Boolean  @default(true)
  openAccess      Boolean  @default(false)
  
  // Source and Sync
  source          String?
  sourceId        String?
  lastSync        DateTime?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  profile         Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  activities      Activity[]
  files           File[]
  
  @@index([profileId])
  @@index([doi])
  @@index([publicationYear])
}

model AcademicRelationship {
  id              String   @id @default(uuid())
  fromProfileId   String
  toProfileId     String
  
  relationshipType RelationshipType
  roleDetail      String?
  
  startDate       DateTime?
  endDate         DateTime?
  isCurrent       Boolean  @default(true)
  
  status          RelationshipStatus @default(PENDING)
  confirmedAt     DateTime?
  confirmedBy     String?
  
  institution     String?
  department      String?
  projectName     String?
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  fromProfile     Profile  @relation("FromProfile", fields: [fromProfileId], references: [id], onDelete: Cascade)
  toProfile       Profile  @relation("ToProfile", fields: [toProfileId], references: [id], onDelete: Cascade)
  
  @@unique([fromProfileId, toProfileId, relationshipType])
  @@index([fromProfileId])
  @@index([toProfileId])
  @@index([relationshipType])
  @@index([status])
}

// Enums
enum UserRole {
  USER
  ADMIN
  INSTITUTION_ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum ProfileVisibility {
  PUBLIC
  AUTHENTICATED
  PRIVATE
}

enum PublicationType {
  ARTICLE
  BOOK
  CHAPTER
  CONFERENCE
  PREPRINT
  THESIS
  PATENT
  OTHER
}

enum RelationshipType {
  ADVISOR
  MENTEE
  COLLABORATOR
  COMMITTEE_MEMBER
  CO_AUTHOR
}

enum RelationshipStatus {
  PENDING
  CONFIRMED
  REJECTED
}

// ... Additional models for Activity, Goal, Project, File, etc.
```

## Database Optimization

### Indexes Strategy
1. **Primary Keys**: UUID for all tables (distributed systems friendly)
2. **Foreign Keys**: Indexed for join performance
3. **Search Fields**: Full-text search indexes on titles, abstracts, bios
4. **Lookup Fields**: Username, email, ORCID for quick lookups
5. **Date Fields**: For time-based queries and analytics

### Performance Considerations
1. **Pagination**: Use cursor-based pagination for large datasets
2. **Caching**: Redis/Vercel KV for frequently accessed data
3. **Denormalization**: Consider for view counts, citation counts
4. **Partitioning**: For analytics_events table by date
5. **Connection Pooling**: Via Prisma for optimal performance

### Data Integrity
1. **Constraints**: Unique constraints on identifiers
2. **Cascading Deletes**: Maintain referential integrity
3. **Transactions**: For multi-table operations
4. **Validation**: Application-level + database constraints
5. **Audit Trail**: Updated timestamps on all tables

This schema provides a solid foundation for ScholarFlow's data needs while maintaining flexibility for future enhancements.