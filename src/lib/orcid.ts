/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Publication, OrcidResponse } from '@/types/profile';

export class OrcidApiClient {
  private baseUrl = 'https://pub.orcid.org/v3.0';

  constructor(private accessToken?: string) {}

  /**
   * Fetch all works (publications) from ORCID
   */
  async fetchWorks(orcidId: string): Promise<Publication[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${orcidId}/works`, {
        headers: {
          Accept: 'application/json',
          ...(this.accessToken && {
            Authorization: `Bearer ${this.accessToken}`,
          }),
        },
      });

      if (!response.ok) {
        throw new Error(`ORCID API error: ${response.status}`);
      }

      const data: OrcidResponse = await response.json();

      if (!data.works?.group) {
        return [];
      }

      // Fetch detailed information for each work
      const publications: Publication[] = [];

      for (const group of data.works.group) {
        for (const workSummary of group['work-summary']) {
          try {
            const detailedWork = await this.fetchWorkDetails(
              orcidId,
              workSummary['put-code']
            );
            if (detailedWork) {
              publications.push(detailedWork);
            }
          } catch (error) {
            console.warn(
              `Failed to fetch work details for ${workSummary['put-code']}:`,
              error
            );
          }
        }
      }

      return publications.sort((a, b) => b.year - a.year);
    } catch (error) {
      console.error('Error fetching ORCID works:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed information for a specific work
   */
  private async fetchWorkDetails(
    orcidId: string,
    putCode: number
  ): Promise<Publication | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${orcidId}/work/${putCode}`,
        {
          headers: {
            Accept: 'application/json',
            ...(this.accessToken && {
              Authorization: `Bearer ${this.accessToken}`,
            }),
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const work = await response.json();
      return this.transformWork(work);
    } catch (error) {
      console.error(`Error fetching work details for ${putCode}:`, error);
      return null;
    }
  }

  /**
   * Transform ORCID work data to our Publication format
   */
  private transformWork(work: Record<string, unknown>): Publication {
    const workData = work as any;
    const title = workData.title?.title?.value || 'Untitled';
    const journal = workData['journal-title']?.value;
    const publicationDate = workData['publication-date'];
    const year = publicationDate?.year?.value
      ? parseInt(publicationDate.year.value)
      : new Date().getFullYear();

    // Extract DOI and URLs
    let doi: string | undefined;
    let url: string | undefined;

    if (workData['external-ids']?.['external-id']) {
      for (const extId of workData['external-ids']['external-id']) {
        if (extId['external-id-type'] === 'doi') {
          doi = extId['external-id-value'];
          url = extId['external-id-url']?.value || `https://doi.org/${doi}`;
          break;
        }
      }
    }

    // Determine publication type
    const type = this.mapOrcidTypeToPublicationType(workData.type);

    // Extract contributors/authors
    const authors: string[] = [];
    if (workData.contributors?.contributor) {
      for (const contributor of workData.contributors.contributor) {
        if (contributor['credit-name']?.value) {
          authors.push(contributor['credit-name'].value);
        }
      }
    }

    return {
      id: `orcid-${workData['put-code']}`,
      title,
      authors,
      journal,
      year,
      doi,
      url,
      type,
      orcidWorkId: workData['put-code'].toString(),
    };
  }

  /**
   * Map ORCID work types to our publication types
   */
  private mapOrcidTypeToPublicationType(
    orcidType: string
  ): Publication['type'] {
    const typeMapping: Record<string, Publication['type']> = {
      'journal-article': 'journal-article',
      book: 'book',
      'book-chapter': 'book-chapter',
      'conference-paper': 'conference-paper',
      'working-paper': 'preprint',
      preprint: 'preprint',
      report: 'other',
      manual: 'other',
      'online-resource': 'other',
    };

    return typeMapping[orcidType] || 'other';
  }

  /**
   * Fetch basic profile information from ORCID
   */
  async fetchProfile(orcidId: string): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`${this.baseUrl}/${orcidId}/person`, {
        headers: {
          Accept: 'application/json',
          ...(this.accessToken && {
            Authorization: `Bearer ${this.accessToken}`,
          }),
        },
      });

      if (!response.ok) {
        throw new Error(`ORCID API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching ORCID profile:', error);
      throw error;
    }
  }

  /**
   * Fetch education information from ORCID
   */
  async fetchEducation(orcidId: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${orcidId}/educations`, {
        headers: {
          Accept: 'application/json',
          ...(this.accessToken && {
            Authorization: `Bearer ${this.accessToken}`,
          }),
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data['education-summary'] || [];
    } catch (error) {
      console.error('Error fetching ORCID education:', error);
      return [];
    }
  }

  /**
   * Fetch employment information from ORCID
   */
  async fetchEmployment(orcidId: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${orcidId}/employments`, {
        headers: {
          Accept: 'application/json',
          ...(this.accessToken && {
            Authorization: `Bearer ${this.accessToken}`,
          }),
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data['employment-summary'] || [];
    } catch (error) {
      console.error('Error fetching ORCID employment:', error);
      return [];
    }
  }
}

/**
 * Utility function to create an ORCID client
 */
export function createOrcidClient(accessToken?: string): OrcidApiClient {
  return new OrcidApiClient(accessToken);
}

/**
 * Validate ORCID ID format
 */
export function isValidOrcidId(orcidId: string): boolean {
  // ORCID ID format: 0000-0000-0000-0000
  const orcidPattern = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
  return orcidPattern.test(orcidId);
}

/**
 * Format ORCID ID with proper hyphens
 */
export function formatOrcidId(orcidId: string): string {
  // Remove any existing hyphens and format properly
  const cleaned = orcidId.replace(/-/g, '');
  if (cleaned.length === 16) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}`;
  }
  return orcidId;
}
