import { expect, test } from '@playwright/test';

test('reveals below-fold content on scroll when motion is allowed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');

  const firstCertificate = page.locator('[data-certification]').first();
  await expect(firstCertificate).toHaveCSS('opacity', '0');

  await page.locator('#certificaciones').scrollIntoViewIfNeeded();
  await expect(firstCertificate).toHaveCSS('opacity', '1');
});

test('keeps everything visible when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on');
  await expect(page.locator('[data-certification]').first()).toHaveCSS('opacity', '1');
});

test('reveals a pending block when keyboard focus lands inside it', async ({ page }) => {
  await page.goto('/');
  const row = page.locator('[data-experience]').first();
  await page.locator('a.related-project').first().focus();
  await expect(row).toHaveCSS('opacity', '1');
});
