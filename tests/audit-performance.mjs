/* global window, PerformanceObserver, performance */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { URL, fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { log } from 'node:console';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { preview } from 'astro';
import { chromium } from '@playwright/test';

// Local laboratory audit, not Lighthouse, field Core Web Vitals or a physical phone.
const root = new URL('../', import.meta.url);
const out = new URL('docs/review/phase-7/', root);
await mkdir(out, { recursive: true });
const builtAssets = [];
for (const name of await readdir(new URL('dist/_astro/', root))) {
  if (!/\.(css|js)$/.test(name)) continue;
  const data = await readFile(new URL(`dist/_astro/${name}`, root));
  builtAssets.push({ name, bytes: data.length, gzipBytes: gzipSync(data).length });
}
const html = await readFile(new URL('dist/index.html', root), 'utf8');
const inlineModules = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter((match) => /type="module"/.test(match[1]) && !/\bsrc=/.test(match[1]))
  .map((match) => ({ bytes: Buffer.byteLength(match[2]), gzipBytes: gzipSync(match[2]).length }));
const server = await preview({
  root: fileURLToPath(root),
  server: { host: '127.0.0.1', port: 4325 },
  logLevel: 'silent',
});
const browser = await chromium.launch();
const runs = [];
try {
  for (const name of ['desktop', 'mobile-cold-1', 'mobile-cold-2', 'mobile-cold-3']) {
    const mobile = name !== 'desktop';
    const context = await browser.newContext({
      viewport: { width: mobile ? 390 : 1440, height: mobile ? 844 : 900 },
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Performance.enable');
    if (mobile) {
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150,
        downloadThroughput: 200_000,
        uploadThroughput: 93_750,
        connectionType: 'cellular4g',
      });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      const state = { lcp: [], shifts: [], longTasks: [], events: [] };
      Object.defineProperty(window, 'qaVitals', { value: state });
      for (const type of ['largest-contentful-paint', 'layout-shift', 'longtask', 'event']) {
        if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (type === 'largest-contentful-paint')
              state.lcp.push({
                at: entry.startTime,
                size: entry.size,
                element: entry.element?.tagName,
                className: entry.element?.className,
                url: entry.url,
              });
            if (type === 'layout-shift')
              state.shifts.push({
                at: entry.startTime,
                value: entry.value,
                recentInput: entry.hadRecentInput,
                sources: entry.sources?.map((source) => source.node?.nodeName),
              });
            if (type === 'longtask')
              state.longTasks.push({ at: entry.startTime, duration: entry.duration });
            if (type === 'event' && entry.interactionId)
              state.events.push({
                name: entry.name,
                at: entry.startTime,
                duration: entry.duration,
                interactionId: entry.interactionId,
              });
          }
        }).observe(
          type === 'event'
            ? { type, buffered: true, durationThreshold: 16 }
            : { type, buffered: true },
        );
      }
    });
    await page.goto(`http://127.0.0.1:${server.port}/`);
    await page.locator('[data-sombra][data-playback="playing"]').waitFor();
    await page.waitForTimeout(1500);
    const loaded = await page.evaluate(() => ({
      vitals: window.qaVitals,
      resources: performance.getEntriesByType('resource').map((entry) => ({
        path: new URL(entry.name).pathname,
        initiator: entry.initiatorType,
        startMs: entry.startTime,
        durationMs: entry.duration,
        encodedBytes: entry.encodedBodySize,
        decodedBytes: entry.decodedBodySize,
        transferBytes: entry.transferSize,
      })),
      navigation: performance.getEntriesByType('navigation').map((entry) => ({
        ttfbMs: entry.responseStart,
        domContentLoadedMs: entry.domContentLoadedEventEnd,
        loadMs: entry.loadEventEnd,
        encodedBytes: entry.encodedBodySize,
      })),
      fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      supportedEntryTypes: PerformanceObserver.supportedEntryTypes,
    }));
    if (mobile) {
      const menu = page.locator('[data-mobile-navigation] summary');
      for (let index = 0; index < 3; index++) {
        await menu.tap();
        await page.waitForTimeout(160);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(160);
      }
    }
    const disclosure = page.locator('.experience-more summary').first();
    await disclosure.click();
    await page.waitForTimeout(160);
    await disclosure.click();
    await page.waitForTimeout(250);
    const finalVitals = await page.evaluate(() => window.qaVitals);
    assert.deepEqual(
      errors,
      [],
      'Product or instrumentation error invalidates the performance run',
    );
    let cls = 0,
      session = 0,
      start = 0,
      last = -Infinity;
    for (const shift of loaded.vitals.shifts.filter((entry) => !entry.recentInput)) {
      if (shift.at - last < 1000 && shift.at - start < 5000) session += shift.value;
      else {
        start = shift.at;
        session = shift.value;
      }
      last = shift.at;
      cls = Math.max(cls, session);
    }
    const interactions = [...new Set(finalVitals.events.map((entry) => entry.interactionId))];
    const latencies = interactions.map((id) =>
      Math.max(
        ...finalVitals.events
          .filter((entry) => entry.interactionId === id)
          .map((entry) => entry.duration),
      ),
    );
    runs.push({
      name,
      viewport: mobile ? [390, 844] : [1440, 900],
      devicePixelRatio: 1,
      throttling: mobile
        ? {
            cpuSlowdown: 4,
            latencyMs: 150,
            downloadBytesPerSecond: 200000,
            uploadBytesPerSecond: 93750,
          }
        : null,
      lcpMs: loaded.vitals.lcp.at(-1)?.at,
      cls,
      fcpMs: loaded.fcpMs,
      observedInteractions: interactions.length,
      maxObservedInteractionMs: latencies.length ? Math.max(...latencies) : null,
      maxObservedLongTaskMs: loaded.vitals.longTasks.length
        ? Math.max(...loaded.vitals.longTasks.map((entry) => entry.duration))
        : null,
      loaded,
      finalVitals,
      cdpMetrics: await cdp.send('Performance.getMetrics'),
      errors,
    });
    await context.close();
  }
  const mobile = runs.filter((run) => run.throttling);
  const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const report = {
    browser: browser.version(),
    method:
      'Sequential cold-browser-cache Chromium runs against local compressed Astro production preview. CDP throttling; no concurrent browser audit.',
    limitations: [
      'Not Lighthouse; no Lighthouse score',
      'Not a physical device or production network/CDN',
      'Event Timing durations are quantized and only entries >=16ms are observed',
      'Scripted post-load interactions are not field INP or a substitute for CrUX/RUM',
    ],
    builtAssets,
    inlineModules,
    mobileMedian: {
      lcpMs: median(mobile.map((run) => run.lcpMs)),
      cls: median(mobile.map((run) => run.cls)),
      fcpMs: median(mobile.map((run) => run.fcpMs)),
      maxObservedInteractionMs: median(mobile.map((run) => run.maxObservedInteractionMs)),
    },
    runs,
  };
  await writeFile(new URL('performance.json', out), JSON.stringify(report, null, 2) + '\n');
  log(
    JSON.stringify(
      {
        browser: report.browser,
        mobileMedian: report.mobileMedian,
        runs: runs.map(({ name, lcpMs, cls, maxObservedInteractionMs, observedInteractions }) => ({
          name,
          lcpMs,
          cls,
          maxObservedInteractionMs,
          observedInteractions,
        })),
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  await server.stop();
}
