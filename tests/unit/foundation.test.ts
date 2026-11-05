import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('design-system foundation', () => {
  it('preserves every documented canonical color token', () => {
    const document = readFileSync(new URL('../../Design-System.md', import.meta.url), 'utf8');
    const tokens = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
    const documented = [...document.matchAll(/(--[\w-]+):\s*(#[\da-f]{6})\s*;/gi)];
    expect(documented.length).toBeGreaterThan(15);
    for (const [, name, value] of documented) {
      expect(tokens).toContain(`${name}: ${value};`);
    }
  });

  it('provides licensed, locally served fonts', () => {
    for (const name of ['archivo-black', 'inter', 'jetbrains-mono', 'jersey-10']) {
      const license = readFileSync(`node_modules/@fontsource/${name}/LICENSE`, 'utf8');
      expect(license).toMatch(/SIL OPEN FONT LICENSE/i);
      expect(readFileSync(`public/fonts/${name}-LICENSE.txt`, 'utf8')).toBe(license);
    }
    const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');
    expect(css).not.toMatch(/https?:\/\//);
  });
});
