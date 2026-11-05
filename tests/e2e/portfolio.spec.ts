import { expect, test } from '@playwright/test';
import { profile } from '../../src/data/profile.ts';
import { projects } from '../../src/data/projects.ts';
import { formatPeriod, getProjectPresentation } from '../../src/lib/presentation.ts';
import type { ProjectId } from '../../src/types/content.ts';

test('renders the approved Hero, public links and primary technology band', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-name')).toHaveText(profile.name);
  await expect(page.locator('.hero-summary')).toHaveText(profile.summary);
  await expect(page.getByRole('link', { name: 'GitHub de Edgar Sánchez Flores' })).toHaveAttribute(
    'href',
    profile.githubUrl,
  );
  await expect(
    page.getByRole('link', { name: 'LinkedIn de Edgar Sánchez Flores' }),
  ).toHaveAttribute('href', profile.linkedinUrl);
  await expect(page.locator('.primary-stack li')).toHaveText([
    'Java',
    'Spring Boot',
    'Angular',
    'TypeScript',
    'Docker',
    'Kubernetes',
  ]);
  for (const href of await page
    .locator('a[href^="#"]')
    .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')))) {
    expect(href).not.toBe('#');
    expect(await page.locator(href ?? '#invalid').count()).toBe(1);
  }
  await expect(page.getByRole('link', { name: /^CV/ })).toHaveCount(0);
  await expect(page.locator('#experiencia, #stack, #sobre-mi, #contacto, footer')).toHaveCount(5);
});

test('renders all four cards from their correct experience without fake actions', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  for (const id of Object.keys(projects) as ProjectId[]) {
    const { project, experience, contribution } = getProjectPresentation(id);
    const card = page.locator(`[data-project="${id}"]`);
    await expect(card.getByRole('heading', { level: 3 })).toHaveText(project.title);
    await expect(card.locator('.project-summary')).toHaveText(project.summary);
    await expect(card.locator('.project-context')).toContainText(experience.organization);
    await expect(card.locator('.project-context')).toContainText(formatPeriod(experience.period));
    await expect(card.locator('.project-contribution')).toContainText(contribution.text);
    await expect(card.locator('a')).toHaveCount(0);
  }
});

test('Sombra retains its single canonical static fallback and reserved proportions without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const mascot = page.locator('.sombra-fallback');
  await expect(mascot).toHaveCount(1);
  await expect(mascot).toHaveAttribute('src', '/pet/sombra/idle-00.png');
  await expect(mascot).toHaveAttribute('width', '192');
  await expect(mascot).toHaveAttribute('height', '208');
  await expect(mascot).toHaveCSS('animation-name', 'none');
  const dimensions = await mascot.evaluate((element) => {
    const image = element as HTMLImageElement;
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      rendered: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
    };
  });
  expect(dimensions.width).toBe(192);
  expect(dimensions.height).toBe(208);
  expect(dimensions.rendered).toBeCloseTo(192 / 208, 2);
  await expect(mascot).toBeVisible();
  await expect(page.locator('.sombra-atlas')).toHaveCSS('opacity', '0');
  await expect(page.locator('.sombra-controls')).toHaveCount(0);
  await expect(mascot).toHaveAttribute('alt', '');
  await expect(page.locator('.sombra-visual')).toHaveAttribute('aria-hidden', 'true');
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.endsWith('spritesheet-extended.png')),
    ),
  ).toBe(false);
  await expect(page.locator('script[type="module"]')).toHaveCount(2);
  await expect(page.locator('script[src]:not([src^="/_astro/"])')).toHaveCount(0);
  await expect(page.locator('script:not([type="module"])')).toHaveCount(0);
  await context.close();
});

for (const width of [
  320, 360, 390, 639, 640, 767, 768, 769, 879, 880, 881, 1023, 1024, 1025, 1440,
]) {
  test(`keeps navigation, wordmark and cards within their bounds at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => {
      const wordmark = document.querySelector('h1');
      const copy = document.querySelector('.hero-copy');
      if (!wordmark || !copy) throw new Error('Missing Hero');
      const range = document.createRange();
      range.selectNodeContents(wordmark);
      return {
        page: document.documentElement.scrollWidth > innerWidth,
        wordmark: range.getBoundingClientRect().right > copy.getBoundingClientRect().right + 1,
      };
    });
    expect(overflow).toEqual({ page: false, wordmark: false });
    const cards = page.getByRole('article');
    for (const card of await cards.all()) {
      expect(await card.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
        true,
      );
    }
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    if (width >= 768) expect(first?.y).toBe(second?.y);
    else expect(second?.y).toBeGreaterThan(first?.y ?? 0);
    if (width < 1024) await page.locator('[data-mobile-navigation] summary').click();
    await expect(
      page.getByRole('navigation', { name: 'Navegación principal', exact: true }),
    ).toBeVisible();
  });
}
