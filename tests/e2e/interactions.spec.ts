import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test('bfcache suspension resumes the same automatic sequence without restarting it', async ({
  page,
}) => {
  const time = new Date('2026-11-05T12:00:00Z');
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
  await page.goto('/');
  const mascot = page.locator('[data-sombra]');
  await expect(mascot).toHaveAttribute('data-playback', 'playing');
  await page.clock.runFor(180);
  await expect(mascot).toHaveAttribute('data-frame', '1');
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })),
  );
  await expect(mascot).toHaveAttribute('data-playback', 'suspended');
  await page.clock.runFor(60_000);
  await expect(mascot).toHaveAttribute('data-frame', '1');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow')));
  await expect(mascot).toHaveAttribute('data-playback', 'playing');
  await page.clock.runFor(180);
  await expect(mascot).toHaveAttribute('data-animation', 'waving');
  await expect(mascot).toHaveAttribute('data-frame', '2');
  await expect(page.locator('.sombra-atlas')).toHaveCSS('image-rendering', 'pixelated');
});

test('initial reduced motion never requests the atlas and failed atlas loading preserves the still image', async ({
  browser,
}) => {
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await reduced.newPage();
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('[data-sombra]')).toHaveAttribute('data-playback', 'reduced');
  expect(requests.some((url) => url.endsWith('spritesheet-extended.png'))).toBe(false);
  await expect(page.locator('.sombra-fallback')).toHaveCSS('opacity', '1');
  await reduced.close();
  const failure = await browser.newContext();
  const failedPage = await failure.newPage();
  await failedPage.route('**/spritesheet-extended.png', (route) => route.abort());
  await failedPage.goto('/');
  await expect(failedPage.locator('[data-sombra]')).toHaveAttribute('data-playback', 'unavailable');
  await expect(failedPage.locator('.sombra-fallback')).toHaveCSS('opacity', '1');
  await expect(failedPage.locator('.sombra-controls')).toHaveCount(0);
  await failure.close();
});

for (const width of [768, 390, 320]) {
  test(`mobile menu opens, closes with Escape and navigates using the keyboard at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const menu = page.locator('[data-mobile-navigation]');
    const summary = menu.locator('summary');
    await expect(menu).toHaveJSProperty('open', false);
    await summary.focus();
    await expect(summary).toHaveCSS('outline-width', '2px');
    await page.keyboard.press('Enter');
    await expect(menu).toHaveJSProperty('open', true);
    await expect(
      page.getByRole('navigation', { name: 'Navegación principal', exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.keyboard.press('Escape');
    await expect(menu).toHaveJSProperty('open', false);
    await expect(summary).toBeFocused();
    await page.keyboard.press('Space');
    const work = menu.getByRole('link', { name: 'Proyectos', exact: true });
    await work.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveJSProperty('open', false);
    await expect(page).toHaveURL(/#proyectos$/);
    await expect(page.locator('#proyectos')).toBeFocused();
    await expect(page.locator('#proyectos h2')).toBeInViewport();
  });
}

test('the native mobile menu remains usable without JavaScript and exposes no duplicate visible navigation', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('/');
  const menu = page.locator('[data-mobile-navigation]');
  await menu.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveJSProperty('open', true);
  const navigation = page.getByRole('navigation', { name: 'Navegación principal', exact: true });
  await expect(navigation).toHaveCount(1);
  await expect(navigation.getByRole('link')).toHaveCount(8);
  await navigation.getByRole('link', { name: 'Contacto', exact: true }).click();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(page.locator('#contacto h2')).toBeInViewport();
  await context.close();
});

test('opened menu is accessible and resets on the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('[data-mobile-navigation]');
  await menu.locator('summary').click();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(menu).toHaveJSProperty('open', false);
  await expect(page.locator('.desktop-navigation')).toBeVisible();
  await expect(page.locator('.header-links')).toBeVisible();
});
