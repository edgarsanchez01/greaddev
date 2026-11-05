// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { env, cwd } from 'node:process';
import { writeFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { resolveSiteUrl, seoFiles } from './src/lib/seo.ts';

const site = resolveSiteUrl(
  env['SITE_URL'] ?? loadEnv(env['NODE_ENV'] ?? 'production', cwd(), 'SITE_URL')['SITE_URL'],
);

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  integrations: [
    {
      name: 'greaddev-static-seo',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const files = seoFiles(site);
          await writeFile(new URL('robots.txt', dir), files.robots);
          if (files.sitemap) await writeFile(new URL('sitemap.xml', dir), files.sitemap);
        },
      },
    },
  ],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        // Preserve Vite's default secret exclusions and keep source material off HTTP.
        deny: [
          '.env',
          '.env.*',
          '*.{crt,pem}',
          '**/.git/**',
          '**/Edgar Sanchez Flores.pdf',
          '**/src/editorial/**',
          '**/pet/Sombra/**',
        ],
      },
    },
  },
});
