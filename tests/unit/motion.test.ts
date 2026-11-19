import { describe, expect, it } from 'vitest';
import { REVEAL_MAX_STEPS, REVEAL_STAGGER_MS, revealDelay } from '../../src/scripts/motion.ts';

describe('reveal stagger', () => {
  it('starts immediately and steps by the default stagger', () => {
    expect(revealDelay(0)).toBe(0);
    expect(revealDelay(1)).toBe(REVEAL_STAGGER_MS);
    expect(revealDelay(3)).toBe(180);
  });

  it('accepts a custom stagger', () => {
    expect(revealDelay(2, 40)).toBe(80);
  });

  it('caps the accumulated wait and never goes negative', () => {
    expect(revealDelay(99)).toBe(REVEAL_MAX_STEPS * REVEAL_STAGGER_MS);
    expect(revealDelay(-2)).toBe(0);
  });
});
