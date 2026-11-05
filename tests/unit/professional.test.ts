import { describe, expect, it } from 'vitest';
import { experiences } from '../../src/data/experience.ts';
import { skills, skillCategories } from '../../src/data/skills.ts';
import { getProjectPresentation, primaryStackIds } from '../../src/lib/presentation.ts';
import { getExperienceEntries, getSkillGroups } from '../../src/lib/professional.ts';

describe('phase 4 professional presentation', () => {
  it('preserves reverse chronological experience order and all contributions across the page', () => {
    const entries = getExperienceEntries();
    expect(entries.map(({ id }) => id)).toEqual([
      'nfq-advisory',
      'sistemas-ec',
      'belomora',
      'carlos-vassan',
    ]);
    for (const entry of entries) {
      expect(entry.experience).toBe(experiences[entry.id]);
      expect(entry.project.experienceId).toBe(entry.id);
      const card = getProjectPresentation(entry.projectId);
      expect(entry.contributions).not.toContain(card.contribution);
      expect(new Set([...entry.contributions, card.contribution])).toEqual(
        new Set(entry.experience.contributions),
      );
      for (const id of entry.project.technologyIds) {
        expect(entry.experience.technologies.some((use) => use.id === id)).toBe(true);
      }
    }
  });

  it('includes every skill once in its documented category without inventing proficiency', () => {
    const groups = getSkillGroups();
    expect(groups.map((group) => group.id)).toEqual(Object.keys(skillCategories));
    const entries = groups.flatMap((group) => group.entries);
    expect(entries).toHaveLength(Object.keys(skills).length);
    expect(new Set(entries.map((entry) => entry.id))).toEqual(new Set(Object.keys(skills)));
    expect(new Set(entries.filter((entry) => entry.primary).map((entry) => entry.id))).toEqual(
      new Set(primaryStackIds),
    );
    for (const group of groups) {
      for (const entry of group.entries) {
        expect(entry.skill).toBe(skills[entry.id]);
        expect(entry.skill.category).toBe(group.id);
        expect(entry).not.toHaveProperty('proficiency');
      }
    }
  });
});
