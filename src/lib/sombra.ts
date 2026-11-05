/** Verified against the canonical PNG and pet_request.json; indices are zero-based. */
export const sombraAtlas = {
  width: 1536,
  height: 2288,
  columns: 8,
  rows: 11,
  cellWidth: 192,
  cellHeight: 208,
  src: '/pet/sombra/spritesheet-extended.png',
} as const;

/** UI timings, not asset metadata. Only these three authentic strips are active. */
export const sombraAnimations = {
  idle: { row: 0, durations: [2400, 160, 120, 100, 120, 180] },
  waving: { row: 3, durations: [180, 180, 180, 180] },
  jumping: { row: 4, durations: [160, 140, 200, 140, 180] },
} as const;

export type SombraAnimation = keyof typeof sombraAnimations;
export interface SombraFrame {
  animation: SombraAnimation;
  index: number;
}

export function getSombraFrame({ animation, index }: SombraFrame) {
  const strip = sombraAnimations[animation];
  if (!Number.isInteger(index) || index < 0 || index >= strip.durations.length) {
    throw new RangeError('Sombra frame outside the approved animation');
  }
  return {
    x: index * sombraAtlas.cellWidth,
    y: strip.row * sombraAtlas.cellHeight,
    backgroundPosition: `${(index * 100) / (sombraAtlas.columns - 1)}% ${(strip.row * 100) / (sombraAtlas.rows - 1)}%`,
    duration: strip.durations[index] ?? 0,
  };
}

export const sombraCycle = [
  { name: 'greeting', animation: 'waving' },
  { name: 'rest-before-jump', animation: 'idle', rest: 5000 },
  { name: 'jump', animation: 'jumping' },
  { name: 'rest-before-wave', animation: 'idle', rest: 6500 },
] as const;

/** A single deterministic sequence. The browser owns suspension and its only timer. */
export class SombraSequence {
  private stageIndex = 0;
  private index = 0;
  completedCycles = 0;

  get stage() {
    return sombraCycle[this.stageIndex]!;
  }
  get frame(): SombraFrame {
    return { animation: this.stage.animation, index: this.index };
  }
  get duration() {
    const stage = this.stage;
    // One complete natural blink at the end of each rest; no competing idle loop.
    if (stage.animation === 'idle' && this.index === 0) {
      const blink = sombraAnimations.idle.durations.slice(1).reduce((sum, ms) => sum + ms, 0);
      return stage.rest - blink;
    }
    return getSombraFrame(this.frame).duration;
  }
  advance() {
    if (this.index + 1 < sombraAnimations[this.stage.animation].durations.length) {
      this.index++;
      return;
    }
    this.index = 0;
    this.stageIndex++;
    if (this.stageIndex === sombraCycle.length) {
      this.stageIndex = 0;
      this.completedCycles++;
    }
  }
}

/** Actual alpha bounds of the five canonical jump cells; no recentering per frame. */
export const sombraJumpBounds = [
  { top: 75, bottom: 202 },
  { top: 51, bottom: 190 },
  { top: 6, bottom: 148 },
  { top: 47, bottom: 190 },
  { top: 75, bottom: 202 },
] as const;

/** Local vertical clearance only. Never move the box, shift X, resize or crop Sombra. */
export function jumpOffset(index: number, clearance: number) {
  getSombraFrame({ animation: 'jumping', index });
  const bounds = sombraJumpBounds[index]!;
  // The approved idle strip reaches y=66. Do not push a jump below that silhouette.
  const top = Math.max(0, Math.min(66, clearance));
  return Math.min(sombraAtlas.cellHeight - bounds.bottom, Math.max(0, top - bounds.top));
}
