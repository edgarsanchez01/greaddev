import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { getSombraFrame, sombraJumpBounds, type SombraAnimation } from '../../src/lib/sombra.ts';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface RenderedFrame {
  animation: SombraAnimation;
  index: number;
  stage: string;
  cycle: number;
  offset: number;
  jumpY: number;
  x: number;
  y: number;
  playback: string;
  at: number;
  duration: number;
}
const baseline = JSON.parse(
  readFileSync(new URL('../../docs/review/phase-5/capture-metadata.json', import.meta.url), 'utf8'),
) as {
  captures: { width: number; viewportHeight: number; hero: Rect; sprite: Rect; caption: Rect }[];
};
const stages = [
  { name: 'greeting', animation: 'waving', durations: [180, 180, 180, 180] },
  { name: 'rest-before-jump', animation: 'idle', durations: [4320, 160, 120, 100, 120, 180] },
  { name: 'jump', animation: 'jumping', durations: [160, 140, 200, 140, 180] },
  { name: 'rest-before-wave', animation: 'idle', durations: [5820, 160, 120, 100, 120, 180] },
] as const;

async function start(page: Page, width = 1440, height = 900) {
  await page.setViewportSize({ width, height });
  const time = new Date('2026-11-05T12:00:00Z');
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
  await page.addInitScript(() => {
    const frames: unknown[] = [];
    Object.defineProperty(window, 'sombraEvidence', { value: frames });
    document.addEventListener('sombra:frame', (event) =>
      frames.push((event as CustomEvent<unknown>).detail),
    );
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-sombra]')).toHaveAttribute('data-playback', 'playing');
}
const frames = (page: Page) =>
  page.evaluate(() => (window as unknown as { sombraEvidence: RenderedFrame[] }).sombraEvidence);

for (const width of [1440, 768, 390, 320]) {
  test(`automatically completes three full cycles in the approved composition at ${width}px`, async ({
    page,
  }, info) => {
    const approved = baseline.captures.find((c) => c.width === width)!;
    await start(page, width, approved.viewportHeight);
    const root = page.locator('[data-sombra]');
    expect(await page.locator('.hero').boundingBox()).toEqual(approved.hero);
    expect(await page.locator('.sombra-visual').boundingBox()).toEqual(approved.sprite);
    expect(await root.locator('figcaption').boundingBox()).toEqual(approved.caption);
    await expect(
      root.locator('button,[tabindex],[aria-live],[role="status"],[data-interact],[data-motion]'),
    ).toHaveCount(0);
    await expect(root).not.toHaveAttribute('tabindex');
    await expect(root.locator('.sombra-controls,.sombra-hint,.sombra-status')).toHaveCount(0);
    await expect(root.locator('figcaption')).toHaveText(/Sombra.*Mi compañero\s*de código/s);
    await expect(root.locator('.sombra-visual')).toHaveAttribute('aria-hidden', 'true');
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const stage of stages) {
        await expect(root).toHaveAttribute('data-stage', stage.name);
        for (const [index, duration] of stage.durations.entries()) {
          await expect(root).toHaveAttribute('data-animation', stage.animation);
          await expect(root).toHaveAttribute('data-frame', String(index));
          await expect(root).toHaveAttribute('data-cycles', String(cycle));
          const source = getSombraFrame({ animation: stage.animation, index });
          const rendered = await root.locator('.sombra-atlas').evaluate((el) => {
            const style = getComputedStyle(el),
              matrix = new DOMMatrix(style.transform);
            return { position: style.backgroundPosition, x: matrix.m41, y: matrix.m42 };
          });
          const actual = rendered.position.split(' ').map(Number.parseFloat);
          const expected = source.backgroundPosition.split(' ').map(Number.parseFloat);
          expect(actual[0]).toBeCloseTo(expected[0]!, 3);
          expect(actual[1]).toBeCloseTo(expected[1]!, 3);
          expect(rendered.x).toBe(0);
          if (stage.animation !== 'jumping') expect(rendered.y).toBe(0);
          else {
            const scale = approved.sprite.width / 192;
            expect(sombraJumpBounds[index]!.bottom * scale + rendered.y).toBeLessThanOrEqual(
              approved.sprite.height + 0.01,
            );
          }
          await page.clock.runFor(duration);
        }
      }
      await expect(root).toHaveAttribute('data-cycles', String(cycle + 1));
      await expect(root).toHaveAttribute('data-animation', 'waving');
    }
    expect(await page.locator('.hero').boundingBox()).toEqual(approved.hero);
    expect(await page.locator('.sombra-visual').boundingBox()).toEqual(approved.sprite);
    expect(await root.locator('figcaption').boundingBox()).toEqual(approved.caption);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      await page.locator('.hero-actions a').evaluateAll((anchors) =>
        anchors.every((a) => {
          const r = a.getBoundingClientRect();
          return a.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        }),
      ),
    ).toBe(true);
    const history = await frames(page);
    expect(new Set(history.map((f) => f.animation))).toEqual(
      new Set(['waving', 'idle', 'jumping']),
    );
    expect(history.every((f) => f.offset === 0)).toBe(true);
    await info.attach('three-automatic-rendered-cycles', {
      body: JSON.stringify(history, null, 2),
      contentType: 'application/json',
    });
  });
}

test('pointer, clicks, touch, Enter and Space cannot change the automatic sequence', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await start(page, 390, 844);
  const root = page.locator('[data-sombra]');
  const b = await page.locator('.sombra-visual').boundingBox();
  if (!b) throw new Error('Missing Sombra region');
  await page.clock.runFor(720);
  await expect(root).toHaveAttribute('data-stage', 'rest-before-jump');
  const count = (await frames(page)).length;
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await page.evaluate(() => scrollTo(0, 0));
  await expect(root).toHaveAttribute('data-stage', 'rest-before-jump');
  await expect(root).toHaveAttribute('data-frame', '0');
  await expect(root).toHaveAttribute('data-cycles', '0');
  expect(
    (await frames(page)).slice(count).every((f) => f.animation === 'idle' && f.index === 0),
  ).toBe(true);
  await page.clock.runFor(5000);
  await expect(root).toHaveAttribute('data-animation', 'jumping');
  await expect(root).toHaveAttribute('data-frame', '0');
  await context.close();
});

test('visibility suspension preserves the exact pose and remaining frame time without duplicate cycles', async ({
  page,
}) => {
  await start(page);
  const root = page.locator('[data-sombra]');
  await page.clock.runFor(250);
  await expect(root).toHaveAttribute('data-frame', '1');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(root).toHaveAttribute('data-playback', 'suspended');
  await page.clock.runFor(120_000);
  await expect(root).toHaveAttribute('data-frame', '1');
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    for (let i = 0; i < 10; i++) document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(root).toHaveAttribute('data-playback', 'playing');
  await page.clock.runFor(109);
  await expect(root).toHaveAttribute('data-frame', '1');
  await page.clock.runFor(1);
  await expect(root).toHaveAttribute('data-frame', '2');
  await page.locator('#stack').scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute('data-playback', 'suspended');
  await page.clock.runFor(100_000);
  await expect(root).toHaveAttribute('data-frame', '2');
  await page.evaluate(() => scrollTo(0, 0));
  await expect(root).toHaveAttribute('data-playback', 'playing');
  await page.clock.runFor(180);
  await expect(root).toHaveAttribute('data-frame', '3');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(root).toHaveAttribute('data-playback', 'reduced');
  await expect(root.locator('.sombra-fallback')).toHaveCSS('opacity', '1');
  await page.clock.runFor(50_000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(180);
  await expect(root).toHaveAttribute('data-stage', 'rest-before-jump');
});

test('disposal clears its single timer, observers and listeners', async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    const pending = new Set<number>();
    const browserTimers: Pick<Window, 'setTimeout' | 'clearTimeout'> = window;
    const schedule = browserTimers.setTimeout.bind(window),
      cancel = browserTimers.clearTimeout.bind(window);
    browserTimers.setTimeout = (handler: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (typeof handler !== 'function') return schedule(handler, delay, ...args);
      const id = schedule(() => {
        pending.delete(id);
        handler(...args);
      }, delay);
      pending.add(id);
      return id;
    };
    browserTimers.clearTimeout = (id?: number) => {
      if (id !== undefined) pending.delete(id);
      cancel(id);
    };
    Object.defineProperty(window, 'sombraTimerCount', { get: () => pending.size });
  });
  await page.goto('/');
  const root = page.locator('[data-sombra]');
  await expect(root).toHaveAttribute('data-playback', 'playing');
  expect(
    await page.evaluate(() => (window as unknown as { sombraTimerCount: number }).sombraTimerCount),
  ).toBe(1);
  await page.evaluate(() => document.dispatchEvent(new Event('astro:before-swap')));
  await expect(root).toHaveAttribute('data-playback', 'disposed');
  expect(
    await page.evaluate(() => (window as unknown as { sombraTimerCount: number }).sombraTimerCount),
  ).toBe(0);
  await page.clock.runFor(120_000);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(root).toHaveAttribute('data-playback', 'disposed');
  await expect(root.locator('.sombra-fallback')).toHaveCSS('opacity', '1');
});
