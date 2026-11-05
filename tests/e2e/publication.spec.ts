import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { siteIdentity } from '../../src/data/site.ts';

test('serves unique Spanish metadata with a safe unconfigured-domain fallback', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(siteIdentity.title);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  for (const selector of [
    'title',
    'meta[name="description"]',
    'meta[name="robots"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[name="twitter:card"]',
    'meta[name="theme-color"]',
  ])
    await expect(page.locator(selector)).toHaveCount(1);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    siteIdentity.description,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    siteIdentity.title,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'es_MX');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
  const canonical = page.locator('link[rel="canonical"]');
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  if (await canonical.count()) {
    const origin = await canonical.getAttribute('href');
    expect(origin).toMatch(/^https?:\/\//);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', origin!);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      new URL(siteIdentity.social.path, origin!).href,
    );
    expect(await robots.text()).toContain('Sitemap:');
    expect((await request.get('/sitemap.xml')).status()).toBe(200);
  } else {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(
      page.locator('meta[property="og:url"],meta[property="og:image"],meta[name="twitter:image"]'),
    ).toHaveCount(0);
    expect(await robots.text()).toBe('User-agent: *\nDisallow: /\n');
    expect((await request.get('/sitemap.xml')).status()).toBe(404);
  }
});

test('downloads the new public PDF from one accessible footer link', async ({ page, request }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: siteIdentity.cv.label, exact: true });
  await expect(link).toHaveCount(1);
  await expect(
    page.getByRole('contentinfo').getByRole('link', { name: siteIdentity.cv.label }),
  ).toHaveCount(1);
  await expect(link).toHaveAttribute('href', siteIdentity.cv.path);
  await expect(link).toHaveAttribute('download', siteIdentity.cv.filename);
  const response = await request.get(siteIdentity.cv.path);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const bytes = await response.body();
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  const downloadEvent = page.waitForEvent('download');
  await link.click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe(siteIdentity.cv.filename);
  const downloaded = readFileSync((await download.path())!);
  expect(createHash('sha256').update(downloaded).digest('hex')).toBe(
    createHash('sha256').update(bytes).digest('hex'),
  );
  expect((await request.get('/Edgar%20Sanchez%20Flores.pdf')).status()).toBe(404);
});

test('serves local social and browser assets with the declared dimensions and formats', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
    'href',
    '/favicon.svg',
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    '/apple-touch-icon.png',
  );
  for (const [path, width, height] of [
    [siteIdentity.social.path, 1200, 630],
    ['/favicon-32.png', 32, 32],
    ['/apple-touch-icon.png', 180, 180],
  ] as const) {
    const response = await request.get(path),
      body = await response.body();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    expect(body.subarray(1, 4).toString()).toBe('PNG');
    expect([body.readUInt32BE(16), body.readUInt32BE(20)]).toEqual([width, height]);
    expect(body.length).toBeLessThan(250_000);
  }
  const svg = await request.get('/favicon.svg');
  expect(svg.status()).toBe(200);
  expect(await svg.text()).toContain('#8bd0ff');
  expect(await svg.text()).not.toMatch(/<script|<image|https?:\/\/(?!www\.w3\.org)/);
});

for (const width of [1440, 390, 320]) {
  test(`returns a functional static 404 without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('/esta-pagina-no-existe');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle('Página no encontrada — GreadDev');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página no existe.');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('[data-sombra],script')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const home = page.getByRole('link', { name: 'Volver al inicio', exact: true });
    await home.focus();
    await expect(home).toHaveCSS('outline-width', '2px');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await home.press('Enter');
    await expect(page).toHaveURL(/\/$/);
  });
}
