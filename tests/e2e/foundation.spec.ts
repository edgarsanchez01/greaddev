import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('serves accessible static HTML without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveTitle(
    'GreadDev — Edgar Sánchez Flores | Full-Stack & Backend Developer',
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GREADDEV_');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.getByRole('link', { name: 'Escribir a Edgar Sánchez Flores' })).toHaveAttribute(
    'href',
    'mailto:edgar.sanchez8999@gmail.com',
  );
  await expect(page.locator('script[type="module"]')).toHaveCount(2);
  await expect(page.locator('script[src]:not([src^="/_astro/"])')).toHaveCount(0);
  await expect(page.locator('script:not([type="module"])')).toHaveCount(0);
  await context.close();
});

test('compiles Tailwind utilities, canonical tokens and local fonts', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(8, 9, 11)');
  await expect(page.getByText('PLAYER_01 / SOFTWARE_ENGINEER', { exact: true })).toHaveCSS(
    'color',
    'rgb(139, 208, 255)',
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /Archivo Black/);
  const fonts = await page.evaluate(() => ({
    body: document.fonts.check('16px Inter'),
    heading: document.fonts.check('16px "Archivo Black"'),
    resources: performance.getEntriesByType('resource').map((entry) => entry.name),
  }));
  expect(fonts.body).toBe(true);
  expect(fonts.heading).toBe(true);
  expect(fonts.resources.some((url) => /\.woff2?(?:$|\?)/.test(url))).toBe(true);
  expect(fonts.resources.every((url) => new URL(url).origin === 'http://127.0.0.1:4321')).toBe(
    true,
  );
});

test('supports keyboard skip navigation and visible focus', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS('outline-style', 'solid');
  await expect(skip).toHaveCSS('outline-width', '2px');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ver proyectos', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Escribir a Edgar Sánchez Flores' })).toBeFocused();
});

for (const width of [320, 360, 390, 768, 1440]) {
  test(`reflows without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  });
}

test('honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toHaveCSS('animation-duration', '1e-05s');
  await expect(heading).toHaveCSS('transition-duration', '1e-05s');
  await expect(heading).toHaveCSS('scroll-behavior', 'auto');
});

test('has no automated accessibility violations on the implemented page', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('does not publish original source material or editorial notes', async ({ request }) => {
  for (const path of [
    '/Edgar%20Sanchez%20Flores.pdf',
    '/src/editorial/phase-1.ts',
    '/pet/Sombra/pet.json',
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
  }
});
