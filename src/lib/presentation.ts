import { experiences } from '../data/experience.ts';
import { projects } from '../data/projects.ts';
import type {
  ContentDate,
  Experience,
  Period,
  Project,
  ProjectId,
  TechnologyId,
} from '../types/content.ts';

/** Presentation selections only; professional text stays in the approved data modules. */
export const primaryStackIds = [
  'java',
  'spring-boot',
  'angular',
  'typescript',
  'docker',
  'kubernetes',
] as const satisfies readonly TechnologyId[];

const projectPresentation = {
  'belomora-ecommerce': { icon: 'bag', contributionId: 'payment-integration' },
  'financial-risk-migration': { icon: 'database', contributionId: 'legacy-procedure-analysis' },
  'mobile-device-comparison': { icon: 'phone', contributionId: 'search-optimization' },
  'pos-ecommerce': { icon: 'store', contributionId: 'container-deployment' },
} as const satisfies Record<ProjectId, { icon: string; contributionId: string }>;

export function getProjectPresentation(id: ProjectId) {
  const project: Project = projects[id];
  const experience: Experience = experiences[project.experienceId];
  const presentation = projectPresentation[id];
  const contribution = experience.contributions.find(
    (entry) =>
      entry.id === presentation.contributionId && project.contributionIds.includes(entry.id),
  );
  if (!contribution) throw new Error(`Missing approved contribution for project ${id}`);
  return { project, experience, contribution, icon: presentation.icon };
}

export function formatContentDate(date: ContentDate): string {
  if (date.precision === 'year') return String(date.year);
  const month = new Intl.DateTimeFormat('es-MX', { month: 'short', timeZone: 'UTC' })
    .format(new Date(Date.UTC(date.year, date.month - 1, 1)))
    .replace('.', '');
  return `${month} ${date.year}`;
}

export function formatPeriod(period: Period): string {
  const start = formatContentDate(period.start);
  return period.end
    ? `${start} — ${formatContentDate(period.end)}`
    : `${start} · fin no especificado`;
}
