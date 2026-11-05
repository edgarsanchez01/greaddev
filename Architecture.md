# GreadDev — Architecture

**Version:** 1.1 — Astro static-first  
**Status:** Proposed technical baseline; visual mockup approval precedes implementation.

## 1. Stack

- **Framework:** Astro (current stable release at implementation time), static output by default.
- **Language:** TypeScript (strict).
- **Styling:** Tailwind CSS v4 through the supported Astro/Vite integration, plus CSS custom properties and scoped CSS for bespoke visual work.
- **Animation:** CSS first; Astro View Transitions / ClientRouter only if navigation genuinely needs it; optional lightweight JS. Do not add Motion by default.
- **Interactive components:** native HTML + minimal vanilla TypeScript first; React islands via `@astrojs/react` only if a component demonstrably benefits.
- **Content:** local typed data (`src/data`) and optional Astro content collections / MDX for detailed case studies.
- **Icons:** inline SVG / Lucide-compatible icons where necessary; official social marks.
- **Package manager:** pnpm.
- **Quality:** Astro check / TypeScript, ESLint, Prettier.
- **Tests:** Vitest for data/helpers where valuable; Playwright for critical navigation/responsive smoke tests.
- **Deployment:** static output to Cloudflare Pages, Netlify, Vercel or any static host. No runtime Node server needed for MVP.

## 2. Architecture decisions

1. **Static HTML by default.** Astro renders sections to HTML at build time.
2. **No framework hydration by default.** Never add React solely for layout, hover or reveal effects.
3. **No backend, database, authentication, CMS or runtime API for MVP.**
4. **Content and presentation are separate.** All professional claims are grounded in the sanitized CV or explicitly verified public work.
5. **Visual design:** minimalist dark Obscura × Glyphy; large typography and whitespace, few pixel accents; no gaming-heavy illustrations.
6. **Progressive enhancement:** primary content works without client JavaScript.
7. **Accessibility and performance are requirements**, not later enhancements.

## 3. Suggested project structure

```text
greaddev/
├── public/
│   ├── cv/                 # sanitized public CV only
│   ├── projects/           # verified assets or labeled conceptual artwork
│   ├── icons/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── projects/
│   │       └── [slug].astro  # optional, when case studies exist
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── SelectedWork.astro
│   │   │   ├── Experience.astro
│   │   │   ├── Stack.astro
│   │   │   ├── About.astro
│   │   │   └── Contact.astro
│   │   └── ui/
│   │       ├── SectionHeading.astro
│   │       └── ProjectCard.astro
│   ├── data/
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   └── skills.ts
│   ├── styles/
│   │   ├── global.css
│   │   └── tokens.css
│   └── lib/
│       └── seo.ts
├── astro.config.mjs
├── tsconfig.json
├── PRD.md
├── Design-System.md
├── Architecture.md
└── AGENTS.md
```

This is a suggested layout; adapt to the installed Astro version and existing repository.

## 4. Content model

```ts
export type Profile = {
  name: string;
  brand: string;
  role: string;
  summary: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  cvUrl?: string; // only after publishing a sanitized CV
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  highlights: string[];
  featured: boolean;
  repositoryUrl?: string; // only if verified
  liveUrl?: string;       // only if verified
  image?: { src: string; alt: string };
  confidential?: boolean;
};
```

Professional/client projects are potentially confidential. Do not publish private screenshots, source code or unverified claims. Never copy the raw uploaded CV into `public/` because it contains sensitive identifiers.

## 5. Rendering and interaction

- `/` is generated as static HTML by `src/pages/index.astro`.
- All content sections default to `.astro` components.
- Mobile navigation can use accessible native HTML and a small inline script, if needed.
- Hover, pixel cursor and section transitions use CSS, honoring `prefers-reduced-motion`.
- Add `@astrojs/react` only after identifying a specific complex interaction; hydrate only that island using `client:visible`, `client:idle` or `client:load` as appropriate.
- Project detail pages are optional. Use Astro dynamic static paths (`getStaticPaths`) or content collections when ready.

## 6. Design architecture

Use tokens from `Design-System.md` in `src/styles/tokens.css`, with scoped component styles for bespoke composition. Tailwind handles layout utilities where useful. Avoid scattering hex codes or arbitrary CSS in markup. One focal point per section, generous whitespace, few decorative sprites, no large arcade-themed hero artwork.

## 7. SEO and static files

- Set canonical URL only after the domain is known.
- Provide title, description, Open Graph/Twitter metadata, semantic headings and accessible navigation.
- Generate sitemap with the supported Astro sitemap integration once `site` is configured.
- Provide `robots.txt`, favicon and a verified OG image.
- Use Astro's asset pipeline / `<Image />` for optimized local raster imagery when appropriate.
- Host a **sanitized** downloadable CV under `public/cv/` only after reviewing it.

## 8. Accessibility and performance

- WCAG AA contrast target; skip link; one H1; keyboard navigation and visible focus.
- Mobile menu works without pointer, labels icons, and manages expanded state.
- No information hidden solely behind hover or animation.
- Respect reduced motion; avoid layout shift and autoplay video.
- Minimize client JS, optimize fonts and project imagery, and avoid heavy animation dependencies.
- Keep PRD Lighthouse/LCP/CLS targets.

## 9. Validation

Configure package scripts in the actual repository and run their equivalents:

```bash
pnpm astro check
pnpm lint
pnpm test
pnpm build
```

Run Playwright smoke tests once configured; do not claim checks passed if they were not run. Verify 360px, 768px and 1440px, external links, keyboard navigation, reduced motion and the public CV path.

## 10. Deployment

Use Astro static output (`output: 'static'` or the installed version's default). Publish `dist/` to a static hosting provider. No adapter is required for a purely static site; add one only if future server features need it. No environment variables are expected for MVP.

## 11. Workflow

1. Approve a **minimalist** desktop Hero + Selected Work mockup.
2. Check a mobile adaptation.
3. Initialize Astro and implement tokens/layout/content.
4. Add interaction and motion only after static content is correct.
5. Test, optimize and deploy.

Do not start coding before the visual direction is accepted.


## Mascot asset integration (v1.2)

- **Source of truth:** existing repository directory `pet/`. Inspect its actual contents before implementation; no filenames, formats, spritesheets or frame counts are assumed.
- **Astro integration:** create a lightweight `Sombra.astro` component if assets are static. Prefer native image/SVG and CSS; add minimal client JavaScript only if the existing assets and an approved interaction require it. Do not install React just for Sombra.
- **Asset strategy:** retain originals under `pet/`; place or copy only approved web-ready assets in `public/pet/` (or use imported assets under `src/assets/pet/` when supported). Do not silently modify originals.
- **Performance:** explicit dimensions to prevent layout shift, optimized asset size, no blocking Hero download, responsive sizing.
- **Accessibility:** descriptive alt for a meaningful Hero mascot, decorative instances hidden; respect `prefers-reduced-motion` and provide a still state.
- **Colors:** CSS tokens in `Design-System.md` now use pastel blue, not lime green. No additional runtime service or backend is needed.


## Integración técnica concreta de Sombra V2 (v1.3)

**Fuente de verdad:** `pet/Sombra/pet.json`, `pet/Sombra/pet_request.json`, `pet/Sombra/README.md` y `pet/Sombra/final/spritesheet-extended.png`. No depender de rutas externas o de los archivos `decoded/` para producción.

**Atlas:** 1536 × 2288 px, 8 columnas × 11 filas, 192 × 208 px por celda. Coordenadas de fotograma: `x = frameIndex * 192`, `y = rowIndex * 208` (índices base cero). El componente debe presentar **una sola celda**, no el atlas completo; por ejemplo, mediante `background-position` y escalado proporcional o un recorte equivalente, comprobando que no haya filtraciones de celdas adyacentes.

**Estados:** `idle` (fila 0, 6), `running-right` (1, 8), `running-left` (2, 8), `waving` (3, 4), `jumping` (4, 5), `failed` (5, 8), `waiting` (6, 6), `running` (7, 6), `review` (8, 6), `look-row-9` (9, 8), `look-row-10` (10, 8).

**Implementación MVP:** componente `src/components/Sombra.astro` con TypeScript mínimo para avanzar fotogramas. Astro estático, sin React ni librería de animaciones. Copiar un recurso web aprobado a `public/pet/sombra/spritesheet-extended.png` durante la implementación; no modificar el original. Reservar proporción 192:208 para evitar CLS. Añadir alternativa estática para JS deshabilitado y `prefers-reduced-motion`. El intervalo de animación se ajusta tras probar los fotogramas reales, no se inventa como dato de origen.

**Verificación:** inspeccionar el PNG final y confirmar transparencia, coordenadas, escalado, secuencia y rendimiento en móvil; si la exportación final difiere de la configuración, detenerse y documentar discrepancia antes de modificar assets.
