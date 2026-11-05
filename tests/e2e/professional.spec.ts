import { expect, test } from '@playwright/test';
import { certifications } from '../../src/data/certifications.ts';
import { education } from '../../src/data/education.ts';
import { profile } from '../../src/data/profile.ts';
import { skills } from '../../src/data/skills.ts';
import { formatContentDate, formatPeriod, primaryStackIds } from '../../src/lib/presentation.ts';
import { getExperienceEntries } from '../../src/lib/professional.ts';
import type { Certification } from '../../src/types/content.ts';

test('renders all experience contributions once across the timeline and related project', async ({
  page,
}) => {
  await page.goto('/');
  const entries = getExperienceEntries();
  await expect(page.locator('[data-experience] h3')).toHaveText(
    entries.map(({ experience }) => experience.organization),
  );
  for (const entry of entries) {
    const row = page.locator(`[data-experience="${entry.id}"]`);
    await expect(row.locator('.experience-role')).toHaveText(entry.experience.role);
    await expect(row.locator('.experience-period')).toHaveText(
      formatPeriod(entry.experience.period),
    );
    await expect(row.locator('.experience-contributions > li')).toHaveText(
      entry.contributions.map((contribution) => contribution.text),
    );
    const visible = row.locator('.experience-detail > .experience-contributions > li');
    await expect(visible).toHaveCount(Math.min(4, entry.contributions.length));
    for (const contribution of await visible.all()) await expect(contribution).toBeVisible();
    await expect(row.locator('.experience-technologies > li')).toHaveCount(
      entry.project.technologyIds.length,
    );
    const rendered = await page
      .locator(
        `[data-project="${entry.projectId}"] .project-contribution, [data-experience="${entry.id}"] [data-contribution]`,
      )
      .allTextContents();
    for (const contribution of entry.experience.contributions) {
      expect(rendered.filter((text) => text.includes(contribution.text))).toHaveLength(1);
    }
    await expect(row.locator('.related-project')).toHaveAttribute(
      'href',
      `#title-${entry.projectId}`,
    );
  }
});

test('renders the whole catalog with visual emphasis and factual integration context', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#stack [data-skill]')).toHaveCount(Object.keys(skills).length);
  await expect(page.locator('#stack .primary-skill')).toHaveCount(primaryStackIds.length);
  await expect(page.locator('#stack .primary-label')).toHaveCount(0);
  await expect(page.locator('#stack')).not.toContainText(/principal|nivel de dominio/i);
  for (const [id, skill] of Object.entries(skills)) {
    const entry = page.locator(`#stack-${skill.category} [data-skill="${id}"]`);
    await expect(entry.locator('.tech-tag')).toHaveText(skill.name);
  }
  await expect(page.locator('[data-skill="murex"]')).toContainText('Origen de archivos CSV.');
  await expect(page.locator('#stack progress, #stack [role="progressbar"]')).toHaveCount(0);
});

test('shows the real profile, shared academic period and all thirteen declared certificates', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#sobre-mi')).toContainText(profile.about);
  await expect(page.locator('#sobre-mi')).toContainText(profile.collaboration);
  await expect(page.locator('#sobre-mi')).toContainText('Intermedio · Técnico');
  await expect(page.locator('.education-period')).toHaveText(formatPeriod(education[0].period));
  await expect(page.locator('[data-qualification] h4')).toHaveText(
    education[0].qualifications.map((qualification) => qualification.title),
  );
  await expect(page.locator('[data-qualification] p')).toHaveCount(0);
  await expect(page.locator('[data-certification]')).toHaveCount(13);
  const entries: readonly Certification[] = certifications;
  for (const entry of entries) {
    const item = page.locator(`[data-certification="${entry.id}"]`);
    await expect(item.locator('h3')).toHaveText(entry.title);
    if (entry.issuedAt) {
      await expect(item.locator('.certificate-year')).toHaveText(formatContentDate(entry.issuedAt));
    } else {
      await expect(item.locator('.certificate-year')).toHaveCount(0);
    }
    await expect(item.locator('a')).toHaveCount(0);
    await expect(item.locator('.certificate-meta')).toHaveCount(0);
  }
  await expect(page.locator('#certificaciones')).not.toContainText(
    /\bCV\b|verificad|sin año registrado/i,
  );
});

test('contact and footer expose the approved actions and public CV, without a backend form', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#contacto .action')).toHaveAttribute(
    'href',
    `mailto:${profile.email}`,
  );
  await expect(page.locator('#contacto .contact-links a')).toHaveCount(3);
  expect(
    await page
      .locator('#contacto .contact-links a')
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href'))),
  ).toEqual([`mailto:${profile.email}`, profile.githubUrl, profile.linkedinUrl]);
  await expect(page.getByRole('contentinfo')).toContainText(profile.brand);
  await expect(page.getByRole('contentinfo')).toContainText(profile.name);
  await expect(page.getByRole('contentinfo')).toContainText(`© ${new Date().getFullYear()}`);
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('footer a[download]')).toHaveCount(1);
  await expect(page.locator('script[type="module"]')).toHaveCount(2);
  await expect(page.locator('script[src]:not([src^="/_astro/"])')).toHaveCount(0);
  await expect(page.locator('script:not([type="module"])')).toHaveCount(0);
  const html = await page.content();
  expect(html).not.toMatch(
    /professionalSource|pending-owner-confirmation|credentialId|maritalStatus|DentalClinic|(?:RFC|CURP|NSS)\s*:/,
  );
});

for (const width of [320, 390, 1440]) {
  test(`expands and collapses remaining contributions using the keyboard without JavaScript at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    await page.goto('/');
    for (const entry of getExperienceEntries()) {
      const row = page.locator(`[data-experience="${entry.id}"]`);
      const details = row.locator('details');
      if (entry.contributions.length <= 4) {
        await expect(details).toHaveCount(0);
        continue;
      }
      await expect(details).toHaveJSProperty('open', false);
      const extra = details.locator('[data-contribution]');
      await expect(extra).toHaveText(
        entry.contributions.slice(4).map((contribution) => contribution.text),
      );
      await expect(extra.first()).not.toBeVisible();
      const summary = details.locator('summary');
      await summary.focus();
      await expect(summary).toBeFocused();
      await expect(summary).toHaveCSS('outline-style', 'solid');
      await expect(summary).toHaveCSS('outline-width', '2px');
      await page.keyboard.press('Enter');
      await expect(details).toHaveJSProperty('open', true);
      for (const contribution of await extra.all()) await expect(contribution).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(summary).toHaveText('Ocultar contribuciones adicionales', {
        useInnerText: true,
      });
      await page.keyboard.press('Space');
      await expect(details).toHaveJSProperty('open', false);
      await expect(extra.first()).not.toBeVisible();
    }
    await expect(page.locator('script[type="module"]')).toHaveCount(2);
    await expect(page.locator('script[src]:not([src^="/_astro/"])')).toHaveCount(0);
    await expect(page.locator('script:not([type="module"])')).toHaveCount(0);
    await context.close();
  });

  test(`keeps all new sections readable and navigable without JavaScript at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    await page.goto('/');
    if (width < 1024) await page.locator('[data-mobile-navigation] summary').click();
    const navigation = page.getByRole('navigation', { name: 'Navegación principal', exact: true });
    await expect(navigation.locator('.navigation > li > a')).toHaveCount(6);
    for (const [label, id] of [
      ['Experiencia', 'experiencia'],
      ['Stack', 'stack'],
      ['Sobre mí', 'sobre-mi'],
      ['Contacto', 'contacto'],
    ] as const) {
      await navigation.getByRole('link', { name: label, exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      const section = page.locator(`#${id}`);
      await expect(section.getByRole('heading', { level: 2 })).toBeInViewport();
      const position = await section.boundingBox();
      const header = await page.locator('header').boundingBox();
      if (width === 1440) expect(position?.y).toBeGreaterThanOrEqual((header?.height ?? 0) - 1);
    }
    await page.getByRole('link', { name: 'Volver al inicio', exact: true }).click();
    await expect(page).toHaveURL(/#inicio$/);
    const overflows = await page
      .locator('main section, footer')
      .evaluateAll((elements) =>
        elements
          .filter((element) => element.scrollWidth > element.clientWidth + 1)
          .map((element) => element.id || element.tagName),
      );
    expect(overflows).toEqual([]);
    await context.close();
  });
}
