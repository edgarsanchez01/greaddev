import { describe, expect, it } from 'vitest';
import { certifications } from '../../src/data/certifications.ts';
import { education } from '../../src/data/education.ts';
import { experiences } from '../../src/data/experience.ts';
import { profile } from '../../src/data/profile.ts';
import { projects } from '../../src/data/projects.ts';
import { skillCategories, skills } from '../../src/data/skills.ts';
import { getSkillGroups } from '../../src/lib/professional.ts';
import type {
  Certification,
  Experience,
  ExperienceId,
  Project,
  Skill,
  TechnologyId,
} from '../../src/types/content.ts';

const experienceById: Readonly<Record<ExperienceId, Experience>> = experiences;
const skillById: Readonly<Record<TechnologyId, Skill>> = skills;
const projectList: readonly Project[] = Object.values(projects);

describe('approved content relationships', () => {
  it('adds owner-declared Linux beside Windows without attributing it to the CV or an employer', () => {
    const environment = getSkillGroups().find((group) => group.id === 'environment');
    expect(environment?.label).toBe('Entorno');
    expect(environment?.entries.map(({ id }) => id)).toEqual(['windows', 'linux']);
    expect(skills.linux.sources).toEqual([
      { source: 'owner', section: 'BUILD — Ajustes finales del Stack / Entornos' },
    ]);
    for (const experience of Object.values(experiences)) {
      expect(experience.technologies.map(({ id }) => id)).not.toContain('linux');
    }
  });
  it('preserves the four featured projects and their approved order', () => {
    expect(Object.keys(projects)).toEqual([
      'belomora-ecommerce',
      'financial-risk-migration',
      'mobile-device-comparison',
      'pos-ecommerce',
    ]);
    expect(projectList.map((project) => project.experienceId)).toEqual([
      'belomora',
      'nfq-advisory',
      'carlos-vassan',
      'sistemas-ec',
    ]);
    expect(projectList.every((project) => project.featured)).toBe(true);
  });

  it('resolves every project contribution and technology within its own experience', () => {
    for (const project of projectList) {
      const experience = experienceById[project.experienceId];
      const contributions = experience.contributions.map(({ id }) => id);
      const technologies = experience.technologies.map(({ id }) => id);
      expect(new Set(project.contributionIds).size).toBe(project.contributionIds.length);
      expect(new Set(project.technologyIds).size).toBe(project.technologyIds.length);
      expect(new Set(project.contributionIds)).toEqual(new Set(contributions));
      for (const id of project.technologyIds) expect(technologies).toContain(id);
    }
  });

  it('requires an existing catalog key and experience-specific evidence for every use', () => {
    for (const experience of Object.values(experienceById)) {
      const ids = experience.technologies.map(({ id }) => id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const { id } of experience.technologies) {
        const skill = skillById[id];
        expect(skill).toBeDefined();
        expect(skillCategories).toHaveProperty(skill.category);
        expect(
          skill.sources.some((source) =>
            experience.sources.some(
              (evidence) => JSON.stringify(evidence) === JSON.stringify(source),
            ),
          ),
        ).toBe(true);
      }
    }
  });

  it('preserves CV periods and their month-level precision', () => {
    const expected = {
      'nfq-advisory': [2026, 1, 2026, 7],
      'sistemas-ec': [2025, 1, 2025, 12],
      belomora: [2024, 6, 2025, 1],
      'carlos-vassan': [2024, 1, 2024, 6],
    };
    for (const [id, experience] of Object.entries(experienceById)) {
      const [startYear, startMonth, endYear, endMonth] = expected[id as ExperienceId];
      expect(experience.period).toEqual({
        start: { precision: 'month', year: startYear, month: startMonth },
        end: { precision: 'month', year: endYear, month: endMonth },
      });
    }
  });

  it('does not mix technologies or broaden CV metrics', () => {
    const carlos = experiences['carlos-vassan'].technologies.map(({ id }) => id);
    const belomora = experiences.belomora.technologies.map(({ id }) => id);
    expect(carlos).not.toEqual(expect.arrayContaining(['react']));
    expect(carlos).not.toEqual(expect.arrayContaining(['spring-data-jpa']));
    expect(belomora).not.toEqual(expect.arrayContaining(['angular']));
    expect(belomora).not.toEqual(expect.arrayContaining(['oracle']));
    for (const [id, experience] of Object.entries(experienceById)) {
      const text = JSON.stringify(experience);
      expect(/20\s*%/.test(text)).toBe(id === 'carlos-vassan');
      expect(/aproximadamente 38/.test(text)).toBe(id === 'nfq-advisory');
    }
    expect(JSON.stringify(experiences['nfq-advisory'])).not.toMatch(
      /(?:migración|transición)\s+(?:completada|finalizada)/i,
    );
  });

  it('retains all responsibilities and only the canonical public contact links', () => {
    expect(Object.values(experiences).map((entry) => entry.contributions.length)).toEqual([
      5, 9, 8, 4,
    ]);
    expect(profile.name).toBe('Edgar Sánchez Flores');
    expect(profile.email).toBe('edgar.sanchez8999@gmail.com');
    expect(profile.githubUrl).toBe('https://github.com/edgarsanchez01');
    expect(profile.linkedinUrl).toBe('https://www.linkedin.com/in/edgar-sanchez01');
    expect(profile.cvUrl).toBeUndefined();
    expect(profile.availability).toBeUndefined();
    for (const project of projectList) {
      expect(project.repositoryUrl).toBeUndefined();
      expect(project.liveUrl).toBeUndefined();
      expect(project.image).toBeUndefined();
      expect(project.caseStudyPath).toBeUndefined();
    }
  });

  it('does not invent qualification dates or certificate credentials', () => {
    expect(education).toHaveLength(1);
    expect(education[0].period).toEqual({
      start: { precision: 'year', year: 2021 },
      end: { precision: 'year', year: 2025 },
    });
    expect(education[0].qualifications).toHaveLength(2);
    expect(education[0].qualifications.every((entry) => !('period' in entry))).toBe(true);
    expect(certifications).toHaveLength(13);
    expect(new Set(certifications.map(({ id }) => id)).size).toBe(13);
    const entries: readonly Certification[] = certifications;
    expect(entries.map((entry) => entry.issuedAt?.year)).toEqual([
      2025,
      2025,
      2025,
      2024,
      2024,
      2024,
      2024,
      2024,
      2024,
      2024,
      2024,
      2022,
      undefined,
    ]);
    for (const entry of entries) {
      expect(entry.evidenceStatus).toBe('declared-in-cv');
      expect(entry.issuer).toBeUndefined();
      expect(entry.credentialId).toBeUndefined();
      expect(entry.credentialUrl).toBeUndefined();
    }
  });

  it('contains no administrative fields or accidental editorial/source payloads', () => {
    const publicContent = JSON.stringify({
      profile,
      projects,
      experiences,
      skills,
      education,
      certifications,
    });
    expect(publicContent).not.toMatch(/"(?:rfc|curp|nss|phone|address|maritalStatus)"\s*:/i);
    expect(publicContent).not.toMatch(/DentalClinic|\/workspace\/scratch|professionalSource/);
  });
});
