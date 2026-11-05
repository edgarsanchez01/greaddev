import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
      'pet/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['src/**/*.{ts,astro}'],
    ignores: ['src/editorial/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/editorial/**', '**/pet/Sombra/**', '**/*.pdf'],
              message: 'Editorial notes and original source assets must not enter public modules.',
            },
          ],
        },
      ],
    },
  },
];
