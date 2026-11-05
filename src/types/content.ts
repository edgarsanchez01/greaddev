/** Public content only. Never import or serialize the original CV into this model. */
export type HttpsUrl = `https://${string}`;
export type LocalAssetPath = `/${string}`;

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Preserve the precision of the source; a year is not January 1. */
export type ContentDate =
  | { readonly precision: 'year'; readonly year: number }
  | { readonly precision: 'month'; readonly year: number; readonly month: Month };

export interface Period {
  readonly start: ContentDate;
  /** An omitted end is unknown, not an assertion of current employment. */
  readonly end?: ContentDate;
}

/** Editorial references contain no extracts, administrative fields or private values. */
export type SourceReference =
  | { readonly source: 'cv'; readonly page: 1 | 2; readonly section: string }
  | { readonly source: 'prd'; readonly section: string };

export type ExperienceId = 'nfq-advisory' | 'sistemas-ec' | 'belomora' | 'carlos-vassan';
export type ProjectId =
  | 'belomora-ecommerce'
  | 'financial-risk-migration'
  | 'mobile-device-comparison'
  | 'pos-ecommerce';

// Type-only relationship: skills.ts owns the keys; there is no runtime import cycle.
export type TechnologyId = keyof typeof import('../data/skills.ts').skills;

export type SkillCategory =
  | 'languages'
  | 'backend'
  | 'frontend'
  | 'data'
  | 'api-security'
  | 'devops'
  | 'quality'
  | 'tools'
  | 'formats'
  | 'practices'
  | 'environment'
  | 'integrations';

export interface Skill {
  readonly name: string;
  readonly category: SkillCategory;
  readonly context?: string;
  /** Evidence is declaration or documented use, never a proficiency rating. */
  readonly sources: readonly SourceReference[];
}

export interface TechnologyUse {
  readonly id: TechnologyId;
  /** Versions belong to an experience, not to the global skill definition. */
  readonly version?: string;
  readonly context?: string;
}

export interface Contribution {
  /** Stable within its parent experience. */
  readonly id: string;
  readonly text: string;
}

export interface Experience {
  readonly organization: string;
  readonly role: string;
  readonly period: Period;
  readonly summary: string;
  readonly contributions: readonly Contribution[];
  readonly technologies: readonly TechnologyUse[];
  readonly sources: readonly SourceReference[];
}

export interface Project {
  readonly title: string;
  readonly summary: string;
  /** Role and period are read from this experience, never copied into a project. */
  readonly experienceId: ExperienceId;
  readonly featured: boolean;
  /** A selection of that experience's technology keys, not an independent stack. */
  readonly technologyIds: readonly TechnologyId[];
  /** References to existing contributions in the linked experience. */
  readonly contributionIds: readonly string[];
  readonly repositoryUrl?: HttpsUrl;
  readonly liveUrl?: HttpsUrl;
  readonly caseStudyPath?: LocalAssetPath;
  readonly image?: { readonly src: LocalAssetPath; readonly alt: string };
}

export interface Profile {
  readonly brand: string;
  readonly name: string;
  readonly role: string;
  readonly summary: string;
  readonly about: string;
  readonly collaboration: string;
  readonly email: string;
  readonly githubUrl: HttpsUrl;
  readonly linkedinUrl: HttpsUrl;
  /** Set only after the sanitized PDF has been reviewed and published in Phase 6. */
  readonly cvUrl?: LocalAssetPath;
  /** Omitted until the owner explicitly confirms a public availability statement. */
  readonly availability?: string;
  readonly languages: readonly {
    readonly name: string;
    readonly level: string;
    readonly context?: string;
    readonly sources: readonly SourceReference[];
  }[];
  readonly sources: readonly SourceReference[];
}

export interface Education {
  readonly id: string;
  readonly institution: string;
  /** The CV supplies a shared institutional period, not dates per qualification. */
  readonly period?: Period;
  readonly qualifications: readonly {
    readonly id: string;
    readonly title: string;
    readonly period?: Period;
  }[];
  readonly sources: readonly SourceReference[];
}

export interface Certification {
  readonly id: string;
  readonly title: string;
  /** All current entries are CV declarations, not independently verified credentials. */
  readonly evidenceStatus: 'declared-in-cv';
  readonly issuedAt?: ContentDate;
  readonly issuer?: string;
  readonly credentialId?: string;
  readonly credentialUrl?: HttpsUrl;
  readonly sources: readonly SourceReference[];
}
