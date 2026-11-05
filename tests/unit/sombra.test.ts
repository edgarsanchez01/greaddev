import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  getSombraFrame,
  jumpOffset,
  sombraAnimations,
  sombraAtlas,
  sombraCycle,
  sombraJumpBounds,
  SombraSequence,
  type SombraAnimation,
} from '../../src/lib/sombra.ts';

describe('canonical Sombra automatic sequence', () => {
  it('uses only the three authorized strips and their actual populated cells', () => {
    const manifest = JSON.parse(readFileSync('pet/Sombra/pet_request.json', 'utf8')) as {
      atlas: {
        width: number;
        height: number;
        columns: number;
        rows: number;
        cell_width: number;
        cell_height: number;
      };
      rows: { state: string; row: number; frames: number }[];
    };
    expect(Object.keys(sombraAnimations)).toEqual(['idle', 'waving', 'jumping']);
    expect([
      sombraAtlas.width,
      sombraAtlas.height,
      sombraAtlas.cellWidth,
      sombraAtlas.cellHeight,
    ]).toEqual([
      manifest.atlas.width,
      manifest.atlas.height,
      manifest.atlas.cell_width,
      manifest.atlas.cell_height,
    ]);
    expect(manifest.rows.reduce((sum, row) => sum + row.frames, 0)).toBe(73);
    for (const animation of Object.keys(sombraAnimations) as SombraAnimation[]) {
      const source = manifest.rows.find((row) => row.state === animation);
      expect(sombraAnimations[animation].row).toBe(source?.row);
      expect(sombraAnimations[animation].durations).toHaveLength(source?.frames ?? 0);
      for (let index = 0; index < sombraAnimations[animation].durations.length; index++) {
        const frame = getSombraFrame({ animation, index });
        expect([frame.x, frame.y]).toEqual([index * 192, (source?.row ?? 0) * 208]);
        expect(frame.duration).toBeGreaterThan(0);
      }
    }
  });

  it('rejects unused cells and fractional or invalid indices', () => {
    for (const animation of Object.keys(sombraAnimations) as SombraAnimation[]) {
      for (const index of [-1, sombraAnimations[animation].durations.length, 7, 0.5, Number.NaN]) {
        expect(() => getSombraFrame({ animation, index })).toThrow(RangeError);
      }
    }
  });

  it('publishes the unaltered approved PNG, not a new rendering', () => {
    const original = readFileSync('pet/Sombra/final/spritesheet-extended.png');
    const published = readFileSync(`public${sombraAtlas.src}`);
    const digest = (file: Buffer) => createHash('sha256').update(file).digest('hex');
    expect(digest(published)).toBe(digest(original));
    expect(digest(published)).toBe(
      '10b3ec2902567de226f17c81c367ed634596931f12afea811d31ae1eb77ca33e',
    );
    expect([published.readUInt32BE(16), published.readUInt32BE(20)]).toEqual([1536, 2288]);
  });

  it('starts with waving and completes every frame of three consecutive cycles', () => {
    const sequence = new SombraSequence();
    expect(sequence.frame).toEqual({ animation: 'waving', index: 0 });
    for (let cycle = 0; cycle < 3; cycle++) {
      let total = 0;
      for (const stage of sombraCycle) {
        let duration = 0;
        expect(sequence.stage.name).toBe(stage.name);
        for (let index = 0; index < sombraAnimations[stage.animation].durations.length; index++) {
          expect(sequence.frame).toEqual({ animation: stage.animation, index });
          expect(sequence.completedCycles).toBe(cycle);
          duration += sequence.duration;
          sequence.advance();
        }
        if (stage.animation === 'idle') expect(duration).toBe(stage.rest);
        total += duration;
      }
      expect(total).toBe(13_040);
      expect(sequence.completedCycles).toBe(cycle + 1);
      expect(sequence.frame).toEqual({ animation: 'waving', index: 0 });
    }
  });

  it('keeps all idle poses and the full blink within each five- or six-and-a-half-second rest', () => {
    const sequence = new SombraSequence();
    const rests: number[][] = [];
    for (let stage = 0; stage < 4; stage++) {
      const timings: number[] = [];
      const animation = sequence.frame.animation;
      do {
        timings.push(sequence.duration);
        sequence.advance();
      } while (sequence.frame.animation === animation);
      if (animation === 'idle') rests.push(timings);
    }
    expect(rests).toEqual([
      [4320, 160, 120, 100, 120, 180],
      [5820, 160, 120, 100, 120, 180],
    ]);
  });

  it('has no hidden transitions or timer dependency when frames are only read', () => {
    const sequence = new SombraSequence();
    sequence.advance();
    const frame = sequence.frame;
    for (let i = 0; i < 100; i++) {
      expect(sequence.frame).toEqual(frame);
      expect(sequence.duration).toBe(180);
    }
    expect(sequence.completedCycles).toBe(0);
    sequence.advance();
    expect(sequence.frame).toEqual({ animation: 'waving', index: 2 });
  });

  it('fits authentic jump pixels inside the fixed cell and always lands at its base', () => {
    for (const clearance of [0, 44, 66, 1000]) {
      for (const [index, bounds] of sombraJumpBounds.entries()) {
        const y = jumpOffset(index, clearance);
        expect(bounds.top + y).toBeGreaterThanOrEqual(0);
        expect(bounds.bottom + y).toBeLessThanOrEqual(208);
      }
      expect(jumpOffset(0, clearance)).toBe(0);
      expect(jumpOffset(4, clearance)).toBe(0);
    }
    expect(jumpOffset(2, 44)).toBe(38);
    expect(() => jumpOffset(5, 44)).toThrow(RangeError);
  });
});
