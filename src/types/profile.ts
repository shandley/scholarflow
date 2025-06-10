// Academic Profile Types for ScholarFlow

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  displayName?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  citationCount?: number;
  type:
    | 'journal-article'
    | 'book'
    | 'book-chapter'
    | 'conference-paper'
    | 'preprint'
    | 'other';
  abstract?: string;
  keywords?: string[];
  orcidWorkId?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  current?: boolean;
  description?: string;
}

export interface Position {
  id: string;
  title: string;
  institution: string;
  department?: string;
  startYear: number;
  endYear?: number;
  current?: boolean;
  description?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
  description?: string;
  amount?: string;
}

export interface Grant {
  id: string;
  title: string;
  agency: string;
  role: 'PI' | 'Co-PI' | 'Co-I' | 'Other';
  startYear: number;
  endYear?: number;
  amount?: string;
  status: 'Active' | 'Completed' | 'Pending';
  description?: string;
}

export interface AcademicProfile {
  id: string;
  username: string;

  // Basic Information
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  bio: string;
  profilePhoto?: string;

  // Current Position
  currentPosition?: string;
  currentInstitution?: string;
  currentDepartment?: string;

  // ORCID Integration
  orcidId?: string;
  orcidAccessToken?: string;
  lastOrcidSync?: Date;

  // Contact & Links
  website?: string;
  socialLinks: SocialLink[];

  // Academic Data
  publications: Publication[];
  education: Education[];
  positions: Position[];
  awards: Award[];
  grants: Grant[];

  // Profile Settings
  template:
    | 'minimal'
    | 'research-focused'
    | 'teaching-oriented'
    | 'industry-hybrid';
  visibility: 'public' | 'unlisted' | 'private';
  customDomain?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ProfileTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  sections: string[];
  colorScheme: string;
  layout: 'single-column' | 'two-column' | 'sidebar';
}

export interface OrcidWork {
  'put-code': number;
  title: {
    title: {
      value: string;
    };
  };
  'journal-title'?: {
    value: string;
  };
  'publication-date'?: {
    year?: {
      value: string;
    };
    month?: {
      value: string;
    };
    day?: {
      value: string;
    };
  };
  'external-ids'?: {
    'external-id': Array<{
      'external-id-type': string;
      'external-id-value': string;
      'external-id-url'?: {
        value: string;
      };
    }>;
  };
  type: string;
  url?: {
    value: string;
  };
}

export interface OrcidResponse {
  'employment-summary'?: unknown[];
  'education-summary'?: unknown[];
  works?: {
    group: Array<{
      'work-summary': OrcidWork[];
    }>;
  };
}

// Form validation types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  currentPosition?: string;
  currentInstitution?: string;
  currentDepartment?: string;
  website?: string;
  template: string;
  visibility: string;
}

export interface ProfileError {
  field: string;
  message: string;
}

// API response types
export interface ProfileResponse {
  success: boolean;
  profile?: AcademicProfile;
  error?: string;
}

export interface PublicationResponse {
  success: boolean;
  publications?: Publication[];
  error?: string;
}

// Alias for profile data in forms
export type ProfileData = Partial<AcademicProfile> & {
  position?: string;
  institution?: string;
  department?: string;
  location?: string;
};
