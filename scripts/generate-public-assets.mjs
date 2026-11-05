/* global document */
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { URL, fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { log } from 'node:console';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { format } from 'prettier';
import { profile } from '../src/data/profile.ts';
import { siteIdentity } from '../src/data/site.ts';
import { publicCvHtml, escapeHtml } from '../src/lib/public-cv.ts';

// Offline, local-font generation only. Never reads the original/private PDF.
const root = new URL('../', import.meta.url);
const file = (path) => new URL(path, root);
const local = (path) => fileURLToPath(file(path));
const tokens = await readFile(file('src/styles/tokens.css'), 'utf8');
const color = (name) => {
  const value = tokens.match(new RegExp(`--${name}:\\s*(#[a-f0-9]+);`, 'i'))?.[1];
  assert(value, `Missing color token ${name}`);
  return value;
};
async function font(packageName, weight, family) {
  const bytes = await readFile(
    file(
      `node_modules/@fontsource/${packageName}/files/${packageName}-latin-${weight}-normal.woff2`,
    ),
  );
  return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2');}`;
}
const fonts = (await font('inter', 400, 'Inter')) + (await font('inter', 600, 'Inter'));
const displayFont = await font('archivo-black', 400, 'Archivo Black');
const monoFont = await font('jetbrains-mono', 400, 'JetBrains Mono');
for (const path of ['public/cv/', 'public/og/', 'docs/review/phase-6/'])
  await mkdir(file(path), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    reducedMotion: 'reduce',
  });
  // Guard against accidental external fonts, tracking, source PDFs or other requests.
  await page.route('**/*', (route) => route.abort());
  await page.setContent(publicCvHtml(fonts));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: local(`public${siteIdentity.cv.path}`),
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>GreadDev</title><rect width="32" height="32" rx="4" fill="${color('bg-0')}"/><path fill="${color('signal')}" d="M8 6h16v4H12v12h8v-4h-4v-4h8v12H8z"/></svg>`;
  await writeFile(file('public/favicon.svg'), await format(svg, { parser: 'html' }));
  for (const [name, size] of [
    ['favicon-32.png', 32],
    ['apple-touch-icon.png', 180],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}svg{display:block;width:100%;height:100%}</style>${svg}`,
    );
    await page.screenshot({ path: local(`public/${name}`) });
  }

  await page.setViewportSize({
    width: siteIdentity.social.width,
    height: siteIdentity.social.height,
  });
  await page.setContent(`<!doctype html><html lang="es"><meta charset="UTF-8"><style>
    ${fonts}${displayFont}${monoFont}
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:${color('bg-0')};color:${color('text-1')};font-family:Inter,sans-serif;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;border-bottom:12px solid ${color('signal')}}
    p,h1{margin:0} .name{font-size:26px;color:${color('text-2')}}
    h1{font:132px/.98 "Archivo Black",sans-serif;letter-spacing:-4px;white-space:nowrap}h1 span{color:${color('signal')}}
    .description{font-size:40px;line-height:1.25;max-width:1000px;margin-top:24px}
    .stack{font:20px "JetBrains Mono",monospace;color:${color('signal')}}
    </style><p class="name">${escapeHtml(profile.name)}</p>
    <div><h1>${profile.brand}<span>_</span></h1><p class="description">${escapeHtml(siteIdentity.social.headline)}</p></div>
    <p class="stack">Java / Spring Boot / APIs REST</p></html>`);
  await page.evaluate(() => document.fonts.ready);
  assert(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth === 1200 &&
        document.documentElement.scrollHeight === 630,
    ),
    'Social composition overflow',
  );
  await page.screenshot({ path: local(`public${siteIdentity.social.path}`) });

  const artifacts = [];
  for (const path of [
    siteIdentity.cv.path,
    siteIdentity.social.path,
    '/favicon.svg',
    '/favicon-32.png',
    '/apple-touch-icon.png',
  ]) {
    const data = await readFile(file(`public${path}`));
    artifacts.push({
      path,
      bytes: (await stat(file(`public${path}`))).size,
      sha256: createHash('sha256').update(data).digest('hex'),
    });
  }
  await writeFile(
    file('docs/review/phase-6/assets.json'),
    JSON.stringify(
      {
        generator: 'node scripts/generate-public-assets.mjs',
        browser: browser.version(),
        externalRequestsAllowed: false,
        cvSource:
          'Positive allowlist from the reviewed professional data; original PDF and metadata are never copied',
        social: { width: 1200, height: 630, format: 'PNG' },
        artifacts,
      },
      null,
      2,
    ) + '\n',
  );
  log(JSON.stringify(artifacts, null, 2));
} finally {
  await browser.close();
}
