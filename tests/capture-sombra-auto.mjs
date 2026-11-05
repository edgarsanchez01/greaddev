/* global window, document, getComputedStyle, DOMMatrix, innerWidth */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, URL } from 'node:url';
import { log } from 'node:console';
import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium, expect } from '@playwright/test';

// Production-browser evidence. No input events, clock mocks or shortened waits.
const out = fileURLToPath(new URL('../docs/review/phase-5.1-auto-alive/', import.meta.url));
const path = (name) => `${out}/${name}`;
const hash = async (file) =>
  createHash('sha256')
    .update(await readFile(file))
    .digest('hex');
await mkdir(out, { recursive: true });
const baseline = JSON.parse(
  await readFile(new URL('../docs/review/phase-5/capture-metadata.json', import.meta.url), 'utf8'),
);
const server = await preview({ server: { host: '127.0.0.1', port: 4325 }, logLevel: 'silent' });
const browser = await chromium.launch();
const captures = [];
const recordings = [];

async function captureStill(approved) {
  const { name, width, viewportHeight: height } = approved;
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width, height },
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${server.port}/`);
  await page.evaluate(() => document.fonts.ready);
  const measurements = await page.evaluate(() => {
    const box = (selector) => {
      const r = document.querySelector(selector).getBoundingClientRect();
      return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
    };
    return {
      hero: box('.hero'),
      sprite: box('.sombra-visual'),
      caption: box('.sombra figcaption'),
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      controls: document.querySelectorAll('.sombra button,.sombra [tabindex],.sombra [aria-live]')
        .length,
      ctaHitTests: [...document.querySelectorAll('.hero-actions a')].map((a) => {
        const r = a.getBoundingClientRect();
        return {
          text: a.textContent,
          clickable: a.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)),
        };
      }),
    };
  });
  assert.deepEqual(measurements.hero, approved.hero);
  assert.deepEqual(measurements.sprite, approved.sprite);
  assert.deepEqual(measurements.caption, approved.caption);
  assert.equal(measurements.horizontalOverflow, false);
  assert.equal(measurements.controls, 0);
  assert(measurements.ctaHitTests.every((a) => a.clickable));
  await page.screenshot({ path: path(`${name}-full.png`), fullPage: true });
  captures.push({
    name,
    width,
    height,
    ...measurements,
    source: 'Real Chromium; static no-JS fallback for exact approved-pose comparison',
  });
  await context.close();
}

async function record(name, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: { dir: path('raw-video'), size: { width, height } },
  });
  await context.addInitScript(() => {
    const frames = [];
    Object.defineProperty(window, 'sombraEvidence', { value: frames });
    document.addEventListener('sombra:frame', (event) => {
      const sprite = document.querySelector('.sombra-atlas');
      const style = getComputedStyle(sprite),
        matrix = new DOMMatrix(style.transform);
      frames.push({
        ...event.detail,
        backgroundPosition: style.backgroundPosition,
        translateX: matrix.m41,
        translateY: matrix.m42,
        wallTime: Date.now(),
      });
    });
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${server.port}/`);
  await page.evaluate(() => document.fonts.ready);
  const root = page.locator('[data-sombra]');
  await expect(root).toHaveAttribute('data-playback', 'playing');
  await expect(root).toHaveAttribute('data-cycles', '3', { timeout: 50_000 });
  const frames = await page.evaluate(() => window.sombraEvidence);
  const rendered = frames.filter((f) => f.playback === 'playing');
  const unique = rendered.filter(
    (f, i, list) =>
      i === 0 ||
      `${f.cycle}:${f.stage}:${f.index}` !==
        `${list[i - 1].cycle}:${list[i - 1].stage}:${list[i - 1].index}`,
  );
  const stages = [
    ['greeting', 4],
    ['rest-before-jump', 6],
    ['jump', 5],
    ['rest-before-wave', 6],
  ];
  for (let cycle = 0; cycle < 3; cycle++) {
    for (const [stage, count] of stages) {
      assert.deepEqual(
        unique.filter((f) => f.cycle === cycle && f.stage === stage).map((f) => f.index),
        Array.from({ length: count }, (_, i) => i),
      );
    }
  }
  assert(rendered.every((f) => f.offset === 0 && f.translateX === 0));
  assert(rendered.filter((f) => f.animation !== 'jumping').every((f) => f.translateY === 0));
  await writeFile(
    path(`${name}-frames.json`),
    JSON.stringify(
      {
        clock: 'Real browser time; no clock mocks, accelerated intervals or visitor input',
        completedCycles: 3,
        frames,
      },
      null,
      2,
    ) + '\n',
  );
  const video = page.video();
  await context.close();
  await video.saveAs(path(`${name}.webm`));
  await video.delete();
  recordings.push({
    name,
    width,
    height,
    completedCycles: 3,
    inputEvents: 0,
    frames: frames.length,
    clock: 'Real time',
    durationMs: frames.at(-1).at,
    sha256: await hash(path(`${name}.webm`)),
  });
}

try {
  for (const approved of baseline.captures) await captureStill(approved);
  await Promise.all([record('desktop-auto', 1440, 900), record('mobile-auto', 390, 844)]);
  await writeFile(
    path('capture-metadata.json'),
    JSON.stringify(
      {
        source: 'Actual Chromium production preview; previous evidence is not overwritten',
        browser: browser.version(),
        htmlSha256: await hash(new URL('../dist/index.html', import.meta.url)),
        atlasSha256: await hash(
          new URL('../public/pet/sombra/spritesheet-extended.png', import.meta.url),
        ),
        captures,
        recordings,
      },
      null,
      2,
    ) + '\n',
  );
  log(JSON.stringify({ captures, recordings }, null, 2));
} finally {
  await browser.close();
  await server.stop();
}
