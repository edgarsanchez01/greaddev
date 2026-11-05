import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects.ts';
import {
  formatContentDate,
  formatPeriod,
  getProjectPresentation,
  primaryStackIds,
} from '../../src/lib/presentation.ts';
import type { ProjectId } from '../../src/types/content.ts';

describe('phase 3 presentation', () => {
  it('selects only the six approved primary technologies', () => {
    expect(primaryStackIds).toEqual([
      'java',
      'spring-boot',
      'angular',
      'typescript',
      'docker',
      'kubernetes',
    ]);
  });

  it('resolves card copy from existing projects and contributions', () => {
    for (const id of Object.keys(projects) as ProjectId[]) {
      const view = getProjectPresentation(id);
      expect(view.project).toBe(projects[id]);
      expect(view.experience.contributions).toContain(view.contribution);
      expect(view.project.contributionIds).toContain(view.contribution.id);
    }
    expect(getProjectPresentation('mobile-device-comparison').contribution.text).toMatch(/20 %/);
    expect(getProjectPresentation('financial-risk-migration').contribution.text).toMatch(
      /aproximadamente 38/,
    );
  });

  it('formats only the precision provided, without assuming current employment', () => {
    expect(formatContentDate({ precision: 'year', year: 2025 })).toBe('2025');
    expect(formatContentDate({ precision: 'month', year: 2024, month: 6 })).toBe('jun 2024');
    expect(
      formatPeriod({
        start: { precision: 'year', year: 2021 },
        end: { precision: 'year', year: 2025 },
      }),
    ).toBe('2021 — 2025');
    expect(formatPeriod({ start: { precision: 'year', year: 2021 } })).toBe(
      '2021 · fin no especificado',
    );
  });

  it('copies the canonical final idle frame byte-for-byte', () => {
    const source = readFileSync('pet/Sombra/final-frames/idle/00.png');
    const web = readFileSync('public/pet/sombra/idle-00.png');
    expect(createHash('sha256').update(web).digest('hex')).toBe(
      createHash('sha256').update(source).digest('hex'),
    );
    expect(web.readUInt32BE(16)).toBe(192);
    expect(web.readUInt32BE(20)).toBe(208);
    expect(web.byteLength).toBeLessThan(25_000);
  });
});
