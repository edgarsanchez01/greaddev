# AGENTS.md --- GreadDev

This file defines the implementation contract for coding agents such as
OpenCode, Codex, Claude Code, or similar tools.

## Mission

Build **GreadDev**, the personal portfolio of Edgar Sánchez Flores.

The product is a minimalist dark Obscura × Glyphy developer portfolio with selective
8-bit/retro-computing accents. It must showcase real engineering work
and remain professional, fast, responsive, accessible, and maintainable.

Before coding, read in this order:

1.  `PRD.md`
2.  `Design-System.md`
3.  `Architecture.md`
4.  this file

When documents conflict: - PRD controls product scope/content. - Design
System controls visual behavior. - Architecture controls technical
structure. - AGENTS controls implementation workflow.

## Non-negotiable facts

Brand: `GreadDev`

Person: `Edgar Sánchez Flores`

Public role: `Full-Stack Developer / Backend-focused Software Engineer`

Public links: - GitHub: `https://github.com/edgarsanchez01` - LinkedIn:
`https://www.linkedin.com/in/edgar-sanchez01` - Email:
`edgar.sanchez8999@gmail.com`

Never expose: - RFC - CURP - NSS - marital status - private address -
other administrative identifiers - phone number unless explicitly
re-approved

## Product priorities

In order:

1.  Real content
2.  Clear professional positioning
3.  Projects
4.  Accessibility
5.  Performance
6.  Responsive behavior
7.  Visual personality
8.  Decorative animation

Never reverse this priority order.

## Visual contract

### Reference priority is mandatory

Treat the references with these approximate weights:

-   **Obscura: 50% --- dominant**
-   **Glyphy: 35% --- co-primary**
-   **Flying Papers: 10% --- motion/composition only**
-   **Thomas Hedger: 5% --- editorial/project restraint only**

Do NOT average the four references.

The first visual read should be: **"minimalist dark Obscura × Glyphy for a software developer, not an arcade site."**

The page must feel: - dark - subtly 8-bit influenced -
typographically monumental - graphic/specimen-like - technical - playful
but professional - flat and outline-driven

Use heavily: - Jersey 10 for selected large/short display text - giant
modern grotesque wordmarks - JetBrains Mono metadata - pixel eyebrows,
indices and a very small number of decorative motifs - full-width graphic bands - specimen-like
project/technology panels - hard borders - restrained hard/offset
shadows - near-black and graphite surfaces - pastel blue as the
primary signal - occasional amber/moss/ember dark bands

It must not become: - generic terminal portfolio - cyberpunk template -
Matrix clone - Twitch overlay - generic SaaS dashboard - white editorial
portfolio

Do not dilute the design into generic black rectangles, but do not overdecorate: preserve generous whitespace, hierarchy and one visual focal point per section.

Flying Papers may influence motion and type overlap, but not the main
palette or cartoon identity.

Thomas Hedger may influence project-first composition, but not the main
visual language.

## Content contract

Use only verified information from the project content files.

Do not invent: - metrics - employers - dates - clients - repositories -
live URLs - project screenshots - certifications - user counts -
performance numbers

Known project/experience content may include: - NFQ Advisory
financial-risk migration - Consultoría SISTEMAS-EC POS/e-commerce work -
Belomora e-commerce - Carlos Vassan mobile-device comparison platform

The CV states a 20% search-time improvement for the mobile comparison
work; preserve the claim's context and do not generalize it into
unrelated metrics.

Treat professional/client work as potentially confidential. Do not
fabricate internal screenshots or code.

## Implementation workflow

### Phase 0 --- Inspect

Before modifying files: - inspect repository structure - inspect package
manager - inspect existing framework/version - inspect lint/test/build
scripts - inspect existing design tokens/components - inspect git status

Do not overwrite useful existing work.

### Phase 1 --- Plan

Write a short implementation plan in the agent response.

Identify: - files to create/change - components - content model -
responsive strategy - motion strategy - validation commands

Do not ask questions when a safe documented default exists.

### Phase 2 --- Foundation

Implement: - app shell - fonts - metadata - design tokens - global
styles - content files - header/footer - responsive container/layout
primitives

### Phase 3 --- Main content

Implement in this order: 1. Hero 2. Selected Work 3. Experience 4. Stack
5. About/Education 6. Certifications 7. Contact 8. Footer

### Phase 4 --- Enhancement

After static layout works: - hover states - section reveals - pixel
details - project media behavior - mobile menu transitions -
reduced-motion handling

Do not start with animation.

### Phase 5 --- Validate

Run repository-native equivalents of:

``` bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Fix failures caused by your changes.

Then manually reason through: - 360px mobile - 768px tablet - 1440px
desktop - keyboard-only navigation - reduced motion - missing project
image fallback - long project title - external links - CV link

## Coding rules

-   TypeScript strict.
-   No `any` unless unavoidable and justified.
-   Prefer Astro components that render static HTML; use client-side islands only for real interaction.
-   Do not use Next.js `"use client"`; hydrate React islands only when necessary with Astro `client:*` directives.
-   Keep components small and semantic.
-   Extract repeated content into typed data.
-   Do not duplicate project/experience data in JSX.
-   Use semantic HTML.
-   Use native buttons/anchors.
-   Avoid dependency additions unless they materially reduce complexity.
-   Do not add a state library for the MVP.
-   Do not add a CMS/database for the MVP.
-   Do not add Astro endpoints/server routes without a real requirement.
-   Avoid premature abstractions.

## Styling rules

-   Use tokens from `Design-System.md`.
-   Do not scatter raw hex values through JSX.
-   Avoid arbitrary Tailwind values when a token exists.
-   Keep focus styles visible.
-   Preserve minimum readable font sizes.
-   Do not hide required information behind hover.
-   Mobile is not a scaled-down desktop; adapt compositions.

## Motion rules

All motion must: - support `prefers-reduced-motion` - avoid blocking
interaction - avoid layout shifts - use transform/opacity when
possible - stop being decorative if it hurts readability

No forced splash screen. No fake loading sequence. No scroll hijacking.

## Image/media rules

Prefer real project assets.

If an asset is unavailable: - use a designed placeholder that clearly
reads as an abstract/project graphic - do not fabricate a realistic
screenshot and present it as the real application

All informative images need useful alt text.

## GitHub integration

Do not assume a repository corresponds to a CV project merely because
its name seems similar.

If repository data is required: - verify exact repository - map it
explicitly in content - keep a fallback - never block initial rendering
on GitHub API

Do not expose GitHub tokens client-side.

## SEO requirements

Implement: - title - description - Open Graph - favicon - sitemap -
robots - semantic headings - canonical URL once production domain exists

Do not keyword-stuff.

## Accessibility checklist

Before declaring completion: - one H1 - logical headings - skip link -
keyboard nav - visible focus - menu usable without pointer - icon links
labeled - decorative visuals hidden from screen readers - contrast
acceptable - reduced motion honored - no color-only meaning

## Definition of done for an agent

Do not say "done" until: - requested scope is implemented - no
placeholder lorem ipsum remains - no invented claims remain - sensitive
CV fields are absent - lint passes - typecheck passes - tests pass where
configured - production build passes - external links are correct -
responsive layout has been checked - reduced-motion path exists

If a validation command cannot run, report exactly why.

## Agent response format

At completion report:

``` text
Implemented
- ...

Key decisions
- ...

Validation
- lint: PASS/FAIL
- typecheck: PASS/FAIL
- tests: PASS/FAIL/NOT CONFIGURED
- build: PASS/FAIL

Remaining
- ...
```

Be precise. Never claim a check passed unless it was actually executed
successfully.

## First implementation prompt

When asked to build the project from these specifications, execute:

> Build the GreadDev portfolio described by PRD.md, Design-System.md,
> Architecture.md and AGENTS.md. Start by inspecting the repository.
> Implement the MVP with real CV-derived content, minimalist dark Obscura × Glyphy +
> subtle 8-bit styling, responsive behavior, accessibility, and
> reduced-motion support. Do not expose sensitive CV identifiers and do
> not invent project links or metrics. Validate lint, typecheck, tests,
> and production build before reporting completion.


## Astro and minimalist visual implementation override (2026-11)

- The framework is **Astro**, not Next.js. Follow `Architecture.md` for file layout, rendering, SEO and deployment.
- The approved mockup direction is **less gaming-heavy** than the first concept. Keep the typography and layout direction; remove large pixel-art computer, arcade aliens, game HUDs and excessive decorations.
- Preserve the visual hierarchy of Obscura (~50%) and Glyphy (~35%) as **design influences**, not quotas of decoration.
- Astro `.astro` components are default; React is optional for truly interactive islands.
- Do not install React, Motion, a backend, CMS or database without a demonstrated need.
- Work order: validate minimalist Hero and beginning of Selected Work mockup first; implement only after visual approval.


## Sombra mascot and blue palette — mandatory update (v1.2)

1. Before coding, inspect `pet/` and report the actual files/formats. **Never assume** a PNG, GIF, spritesheet, SVG, or available animation frames.
2. Sombra is the **existing black pixel-art kitten**; preserve the provided design exactly. Do not generate a replacement or use an unrelated cat asset.
3. Put one appropriately sized Sombra in the Hero; additional appearances are optional and rare. Keep the page minimal and professional, not gaming-heavy.
4. If motion is supported by real assets, make it subtle, optional, and reduced-motion-safe. Static fallback is required.
5. Use the updated **pastel blue** design tokens, not the old lime-green palette.
6. Do not alter the source assets in `pet/` without approval. Prefer an Astro component with no client hydration.
7. The mascot is not a chatbot, virtual pet simulator, or game mechanic unless the owner later explicitly requests it.
8. When existing earlier text conflicts with this section, **this v1.2 section takes precedence** for mascot and palette.


## Contrato obligatorio Sombra V2 (v1.3)

1. El nombre correcto es **Sombra** (no Sobra). Revisar y corregir referencias antiguas.
2. Antes de implementar, leer `pet/Sombra/README.md`, `pet/Sombra/pet.json`, `pet/Sombra/pet_request.json` e inspeccionar `pet/Sombra/final/spritesheet-extended.png`.
3. Preservar `pet/Sombra/references/canonical-base.png` como identidad visual; no generar otra mascota, recolorear, añadir ojos/pupilas ni alterar la silueta.
4. El atlas aprobado tiene 8 columnas × 11 filas, celdas de 192 × 208 px; 1536 × 2288 px. Estados y recuentos en `Architecture.md` y `Design-System.md`.
5. Implementar primero PLAN y solicitar aprobación antes de BUILD. Planear `src/components/Sombra.astro` sin dependencias React; usar `idle` en Hero y `waving` opcional en interacción.
6. Mantener `pet/Sombra/` intacto; solo copiar assets finales a la ubicación pública si es necesario. No usar fuentes rechazadas de `decoded/` o `qa/`.
7. Asegurar imagen estática sin JS, `prefers-reduced-motion`, accesibilidad, responsive y ausencia de CLS. No animaciones invasivas ni mascota flotante.
8. Documentar y resolver cualquier discrepancia entre atlas, manifiestos y PNG antes de codificar coordenadas.
