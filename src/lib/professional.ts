import { experiences } from '../data/experience.ts';
import { projects } from '../data/projects.ts';
import { skillCategories, skills } from '../data/skills.ts';
import type {
  Experience,
  ExperienceId,
  ProjectId,
  Skill,
  SkillCategory,
  TechnologyId,
} from '../types/content.ts';
import { getProjectPresentation, primaryStackIds } from './presentation.ts';

/** Keep every contribution on the page, without repeating the one already in its project card. */
export function getExperienceEntries() {
  return (Object.keys(experiences) as ExperienceId[]).map((id) => {
    const experience: Experience = experiences[id];
    const projectId = (Object.keys(projects) as ProjectId[]).find(
      (key) => projects[key].experienceId === id,
    );
    if (!projectId) throw new Error(`Missing related project for experience ${id}`);
    const { project, contribution } = getProjectPresentation(projectId);
    return {
      id,
      experience,
      projectId,
      project,
      contributions: experience.contributions.filter((entry) => entry.id !== contribution.id),
    };
  });
}

/** Categories and emphasis are presentation, never a proficiency or verification score. */
export function getSkillGroups() {
  const entries = Object.entries(skills) as [TechnologyId, Skill][];
  const primary: ReadonlySet<TechnologyId> = new Set(primaryStackIds);
  return (Object.entries(skillCategories) as [SkillCategory, string][]).map(([id, label]) => ({
    id,
    label,
    entries: entries
      .filter(([, skill]) => skill.category === id)
      .map(([key, skill]) => ({ id: key, skill, primary: primary.has(key) })),
  }));
}
