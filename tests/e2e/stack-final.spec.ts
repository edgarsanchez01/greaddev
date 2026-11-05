import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { primaryStackIds } from '../../src/lib/presentation.ts';
import { skills } from '../../src/data/skills.ts';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
const baseline = JSON.parse(
  readFileSync(new URL('../fixtures/primary-stack-layout.json', import.meta.url), 'utf8'),
) as {
  width: number;
  band: Rect;
  items: { box: Rect; icon: Rect; label: Rect; text: string }[];
}[];

for (const expected of baseline) {
  test(`preserves the approved band geometry with local PNGs and Linux at ${expected.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: expected.width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const band = page.locator('.primary-stack');
    await expect(band.locator('svg')).toHaveCount(0);
    await expect(band.getByRole('img')).toHaveCount(6);
    for (const id of primaryStackIds) {
      const image = band.getByRole('img', { name: `Logotipo de ${skills[id].name}`, exact: true });
      await expect(image).toHaveAttribute('src', `/icons/stack/${id}.png`);
      await expect(image).toHaveAttribute('width', '27');
      await expect(image).toHaveAttribute('height', '27');
      const pixels = await image.evaluate(async (element) => {
        const img = element as HTMLImageElement;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas unavailable');
        context.drawImage(img, 0, 0);
        const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0,
          colored = 0;
        for (let i = 0; i < rgba.length; i += 4) {
          if (rgba[i + 3] === 0) transparent++;
          else if (
            Math.max(rgba[i]!, rgba[i + 1]!, rgba[i + 2]!) -
              Math.min(rgba[i]!, rgba[i + 1]!, rgba[i + 2]!) >
            30
          )
            colored++;
        }
        return { width: img.naturalWidth, height: img.naturalHeight, transparent, colored };
      });
      expect([pixels.width, pixels.height]).toEqual([81, 81]);
      expect(pixels.transparent).toBeGreaterThan(100);
      expect(pixels.colored).toBeGreaterThan(100);
      // One accessible identification per item, rather than repeating its adjacent visible label.
      await expect(image.locator('..').locator('span')).toHaveAttribute('aria-hidden', 'true');
    }
    const actual = await band.evaluate((section) => {
      const rect = (element: Element) => {
        const r = element.getBoundingClientRect();
        return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height };
      };
      return {
        band: rect(section),
        items: [...section.querySelectorAll('li')].map((li) => ({
          box: rect(li),
          icon: rect(li.firstElementChild!),
          label: rect(li.lastElementChild!),
          text: li.lastElementChild!.textContent,
        })),
      };
    });
    expect(actual).toEqual({ band: expected.band, items: expected.items });
    await expect(page.locator('#stack-environment .tech-tag')).toHaveText(['Windows', 'Linux']);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
}

test('keeps the band allocation and readable labels without JS even when logo downloads fail', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.route('**/icons/stack/*.png', (route) => route.abort());
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.primary-stack li')).toHaveText(
    primaryStackIds.map((id) => skills[id].name),
  );
  for (const image of await page.locator('.primary-stack img').all()) {
    const box = await image.boundingBox();
    expect(box?.width).toBe(27);
    expect(box?.height).toBe(27);
  }
  await expect(page.locator('#stack-environment .tech-tag')).toHaveText(['Windows', 'Linux']);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await context.close();
});
