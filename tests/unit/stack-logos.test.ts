import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { primaryStackIds } from '../../src/lib/presentation.ts';

const root = new URL('../../', import.meta.url);
const manifest = JSON.parse(
  readFileSync(new URL('docs/assets/stack/logos.json', root), 'utf8'),
) as {
  assets: {
    id: string;
    path: string;
    url: string;
    sourceFile: string;
    sourceBytes: number;
    sha256: string;
    sourceSha256: string;
    bytes: number;
  }[];
};

describe('locally stored original-color technology logos', () => {
  it('covers exactly the six primary technologies, including the official Spring Boot symbol', () => {
    expect(manifest.assets.map(({ id }) => id).sort()).toEqual([...primaryStackIds].sort());
    const boot = manifest.assets.find(({ id }) => id === 'spring-boot');
    expect(boot?.url).toBe('https://spring.io/img/projects/spring-boot.svg');
    for (const asset of manifest.assets) {
      expect(asset.path).toBe(`/icons/stack/${asset.id}.png`);
      const svg = readFileSync(new URL(`docs/assets/stack/${asset.sourceFile}`, root));
      expect(svg.length).toBe(asset.sourceBytes);
      expect(createHash('sha256').update(svg).digest('hex')).toBe(asset.sourceSha256);
    }
  });

  it('uses small, three-times-resolution RGBA PNGs with recorded integrity', () => {
    let total = 0;
    for (const asset of manifest.assets) {
      const png = readFileSync(new URL(`public${asset.path}`, root));
      expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([81, 81]);
      expect(png[25]).toBe(6); // Truecolor with an alpha channel; browser tests check actual transparency.
      expect(png.length).toBe(asset.bytes);
      expect(png.length).toBeLessThan(10_000);
      expect(createHash('sha256').update(png).digest('hex')).toBe(asset.sha256);
      total += png.length;
    }
    expect(total).toBeLessThan(40_000);
  });
});
