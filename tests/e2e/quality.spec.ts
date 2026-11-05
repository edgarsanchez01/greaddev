import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const width of [1440, 768, 390, 320]) {
  test(`final QA keeps readable content and accessible expanded states at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.work-count')).toHaveText('04 proyectos');
    await expect(page.locator('.work-count')).not.toHaveAttribute('aria-label');

    const inspectLayout = () =>
      page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
        const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) =>
          Number(el.tagName.slice(1)),
        );
        const invalidAnchors = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
          .filter((anchor) => !document.getElementById(decodeURIComponent(anchor.hash.slice(1))))
          .map((anchor) => anchor.hash);
        const overflowText: string[] = [];
        const range = document.createRange();
        const tree = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = tree.nextNode())) {
          if (!node.textContent?.trim() || node.parentElement?.closest('script,style')) continue;
          range.selectNodeContents(node);
          if (
            [...range.getClientRects()].some(
              (rect) => rect.width && (rect.left < -1 || rect.right > innerWidth + 1),
            )
          )
            overflowText.push(node.textContent.trim());
        }
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
          skippedHeadings: headings.filter((level, i) => i > 0 && level > headings[i - 1]! + 1),
          invalidAnchors,
          overflowText,
        };
      });
    const assertLayout = async () =>
      expect(await inspectLayout()).toEqual({
        overflow: false,
        duplicateIds: [],
        skippedHeadings: [],
        invalidAnchors: [],
        overflowText: [],
      });
    const states: {
      name: string;
      violations: number;
      incomplete: { id: string; nodes: number }[];
    }[] = [];
    const audit = async (name: string) => {
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations).toEqual([]);
      // Color/transparent-SVG manual review is documented separately; unsupported ARIA is not ignored.
      expect(result.incomplete.filter((item) => item.id === 'aria-prohibited-attr')).toEqual([]);
      states.push({
        name,
        violations: result.violations.length,
        incomplete: result.incomplete.map((item) => ({ id: item.id, nodes: item.nodes.length })),
      });
    };
    await assertLayout();
    await audit('closed');
    if (width < 1024) {
      const menu = page.locator('[data-mobile-navigation]');
      await menu.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(menu).toHaveJSProperty('open', true);
      await assertLayout();
      await audit('menu-open');
      await page.keyboard.press('Escape');
      await expect(menu).toHaveJSProperty('open', false);
      await expect(menu.locator('summary')).toBeFocused();
    }
    const details = page.locator('.experience-more');
    for (let index = 0; index < (await details.count()); index++) {
      const item = details.nth(index);
      await item.locator('summary').focus();
      await page.keyboard.press('Space');
      await expect(item).toHaveJSProperty('open', true);
    }
    await assertLayout();
    await audit('contributions-open');
    expect(errors).toEqual([]);
    await info.attach('responsive-and-accessibility-states', {
      body: JSON.stringify(states, null, 2),
      contentType: 'application/json',
    });
  });
}
