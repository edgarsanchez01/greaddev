# GreadDev --- Design System

**System name:** GreadDev / Dark Cartridge\
**Version:** 1.1 — minimal retro\
**Theme:** Dark-first\
**Aesthetic:** Dark Obscura × Glyphy developer portfolio --- minimal 8-bit accents + monumental specimen typography

## 1. Design principles

### Obscura carries the strongest visual weight

GreadDev should visibly feel 8-bit/arcade. Pixel typography, hard
graphic accents and outlined controls create the identity. Use them selectively;
large pixel illustrations and dense arcade ornamentation are not part of the approved direction.
Readability still determines where pixel typography may be used.

### Glyphy supplies scale and graphic structure

Use oversized wordmarks, specimen-sheet hierarchy, horizontal bands,
technical labels, and a modern grotesque/mono counterpoint to the pixel
language. GreadDev should feel designed like a graphic artifact, not
assembled from standard portfolio cards.

### Dark reinterpretation, not dark genericism

Do not reduce the references to "black background + blue terminal
text." Preserve the distinctive visual grammar of Obscura and Glyphy
while translating their light palettes to dark surfaces.

### Strong personality, professional information

The interface should feel refined, distinctive and lightly playful. Experience, project
outcomes, technologies, links, and contact actions must remain
immediately understandable.

### Flat graphic depth

Prefer borders, inset/offset pixel shadows, hard-edged layers, color
bands, texture, and overlap. Avoid glassmorphism and soft SaaS
elevation.

## 2. Visual reference hierarchy

### PRIMARY --- Obscura (\~50%)

Use heavily: - Jersey 10 / pixel display language - arcade-like labels
and interactions - one or two small pixel motifs at most per viewport - clear
accent-color discipline - chunky display hierarchy - outlined/inset
states - playful component framing

Translate: - light cloud canvas → near-black / graphite canvas - orange
accent → GreadDev pastel blue - pale floating surfaces → dark graphite
panels - decorative sprites → subtle cursor/pixel geometry, used sparingly

### PRIMARY --- Glyphy (\~35%)

Use heavily: - monumental wordmark - neo-grotesque + pixel + mono
typographic contrast - full-width graphic bands - specimen-card logic -
tight display leading - flat outlines - graphic section transitions -
small pixel eyebrow labels

Translate: - buttercream → warm near-black - sunset bands → controlled
dark tonal bands with pastel-blue/lavender punctuation - Carbon cards →
deeper black panels

### SECONDARY --- Flying Papers (\~10%)

Borrow only: - confident oversized motion - type/graphic overlap -
poster-scale transitions

Do not borrow: - cartoon-first identity - multi-color confetti palette -
mascot as main brand

### SECONDARY --- Thomas Hedger (\~5%)

Borrow only: - project-first editorial restraint - edge-to-edge media
moments - minimal explanatory chrome

Do not borrow: - white-canvas identity - zero-animation doctrine - pure
museum-grid structure

### Visual test

If a reviewer says "this mainly feels like Obscura/Glyphy, but darker
and developer-focused," the direction is correct.

If a reviewer says "this looks like a generic terminal portfolio," the
direction has failed.

## 3. Color tokens

``` css
:root {
  --bg-0: #08090b;
  --bg-1: #0d0f12;
  --surface-1: #111419;
  --surface-2: #171b21;

  --text-1: #f2f1ea;
  --text-2: #b4b8c0;
  --text-3: #747b86;

  --line-1: #292f37;
  --line-2: #3a424d;

  --signal: #8bd0ff;
  --signal-strong: #b3e1ff;
  --signal-dim: #315979;

  --band-graphite: #161a1f;
  --band-moss: #182c40;
  --band-ember: #26354b;
  --amber: #a8baff;
  --danger: #ff625f;

  --selection-bg: #8bd0ff;
  --selection-text: #08090b;
}
```

Rules: - `--signal` is the brand accent. - Use pastel blue as an accent, not as a full-page background. - `--amber` is optional and sparse. - Avoid
neon cyberpunk gradients. - No rainbow gamer palette. - Project
imagery may introduce its own colors.

## 4. Typography

Recommended open/free font strategy:

### Display

**Space Grotesk** or **Archivo Black/Expanded-compatible fallback**.

Use for: - GREADDEV wordmark - giant hero text - large project titles

### Pixel display accent

**Jersey 10**.

Use for selected large short display words, section indices and small decorative labels **only when legible**. Pair with a modern grotesque for the primary wordmark and project titles. Never use pixel typography for body paragraphs or dense navigation.

### Mono

**JetBrains Mono**.

Use for: - metadata - technology tags - dates - command palette -
code-like labels - buttons where appropriate

### Body

**Inter** or **Manrope**.

Use for: - descriptions - case-study prose - navigation when mono
becomes too dense

## 5. Type scale

``` css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: clamp(1.05rem, 1vw + .8rem, 1.25rem);
--text-h3: clamp(1.5rem, 2vw, 2.25rem);
--text-h2: clamp(2.25rem, 5vw, 5rem);
--text-display: clamp(4rem, 13vw, 12rem);
```

Hero wordmark: - weight 700--800 - line-height 0.78--0.9 - slight
negative tracking - may bleed toward viewport edges on desktop

Body: - max readable line length 65--75 characters - line-height
1.55--1.7

## 6. Spacing

Base unit: `4px`.

Primary scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160`.

Section vertical spacing: - mobile: 72--96 px - desktop: 112--160 px

## 7. Shape language

-   micro controls: 4 px radius
-   buttons: 6 px
-   project media: 0--8 px
-   panels: 8 px maximum
-   pills only for small tags/status
-   never use 20--32 px SaaS-style rounded cards everywhere

Borders: `1px solid var(--line-1)` default.

Strong editorial dividers: `1px solid var(--line-2)`.

## 8. Texture

Allowed: - very subtle 1 px grid - 1--2% noise/grain - scanline motif
only in tiny/localized areas - pixel checker pattern as section
punctuation

Avoid: - fake CRT distortion across body text - chromatic aberration on
paragraphs - constant VHS effects

## 9. Components

### Signature GreadDev band

A full-width graphic band inspired by Glyphy's category strips but
translated to dark mode.

Use for major transitions such as: `SELECTED_WORK`, `EXPERIENCE`,
`STACK`, or a featured project.

Characteristics: - full viewport width when justified - hard border top/bottom -
oversized title - pixel eyebrow/index - dark graphite/moss/ember fill -
signal accent used as punctuation, not as the whole background -
optional slow horizontal metadata marquee

### Pixel specimen panel

A recurring Obscura × Glyphy component.

Structure: - 1px hard border - 6--12px corner radius - small pixel
eyebrow - large grotesque/project word - mono metadata strip - optional
offset hard shadow of 3--5px, never blurred

This may be used for featured technologies, project metadata, and
selected interactive moments.

### Navigation

Dark transparent/opaque header that becomes slightly denser after
scroll.

Desktop: `GREADDEV_` / nav anchors / social + CV.

Active section may use: `[01] WORK`

Hover: text becomes `--signal`, optional 1--2 px translation.

### Hero

Full viewport or \~90svh.

Layer order: 1. dark canvas 2. subtle grid/noise 3. giant GREADDEV
wordmark 4. identity copy 5. CTA cluster 6. at most one subtle pixel/cursor
decorative element; no dominant pixel-art computer

Do not place five floating tech logos around the hero.

### Primary action

Rectangular, not pill.

Default: - signal background - dark text - mono label - 6 px radius

Hover: - invert to dark surface - signal border/text - 2 px translate

### Secondary action

Transparent, line border, text-1.

### Section label

Example: `[01] SELECTED_WORK`

Jersey 10 or JetBrains Mono. Signal color. Uppercase.

### Project tile

Editorial, media-first.

Desktop variants: - full-width feature - 2-column split - asymmetric 7/5
composition

Content: index, title, role/year, summary, stack, action.

Hover: media scales max 1.02--1.04; metadata shifts slightly; no giant
glow.

### Experience row

Full-width horizontal row with divider.

Desktop: year \| company/role \| summary \| stack.

Mobile: stack vertically.

No generic floating card timeline.

### Technology tag

Mono 12--14 px. Transparent. 1 px line. 4 px radius. No logo required.

### Terminal snippet

Optional and very sparse. It must never dominate the page.

Example:

``` text
$ whoami
edgar_sanchez
$ focus
backend + full_stack
```

It must never become the primary navigation model.

### Contact block

Poster-like final section. Large statement + three direct actions. May
use an animated underscore/cursor.

## 10. Motion system

### Timing

-   micro: 120--180 ms
-   standard: 220--320 ms
-   section reveal: 450--700 ms
-   hero composition: max 900 ms total, non-blocking

### Easing

Use CSS-native easing or a consistent custom cubic-bezier.

### Scroll reveals

-   opacity 0 → 1
-   y 12--24 px → 0
-   stagger 40--80 ms max

### Project hover

-   media scale ≤ 1.04
-   translate ≤ 8 px

### Pixel motion

Use stepped animation only on decorative 8-bit objects.

### Reduced motion

When `prefers-reduced-motion: reduce`: - remove parallax - remove
marquee - remove stepped sprites - remove animated section reveals -
retain immediate state changes

## 11. Responsive behavior

### Mobile \< 640

-   hero wordmark wraps intentionally
-   single-column projects
-   compact nav
-   no hover-dependent information
-   large tap targets

### Tablet 640--1024

-   two-column content where useful
-   retain asymmetric editorial composition carefully

### Desktop \> 1024

-   use edge-to-edge/project-wide compositions
-   max content reading width around 1200--1440 px where appropriate
-   hero display may exceed content container

## 12. Iconography

Use one consistent outline icon set, e.g. Lucide.

Allowed social marks: GitHub, LinkedIn.

Do not use emoji as production UI icons.

## 13. Imagery

Best project visual hierarchy: 1. real project screenshot 2.
architecture/data-flow diagram 3. code/interface detail 4. custom
abstract/pixel illustration if no screenshot exists

Never invent a screenshot that looks like a real production product
without labeling it as conceptual.

## 14. Accessibility states

Focus: `2px solid var(--signal)` with offset.

Links: must not rely exclusively on color; use underline/arrow/border
where context requires.

Error: danger color + text/icon.

Success: signal can serve as success only when context is clear; do not
encode meaning only by hue.

## 15. Do / Don't

### Do

-   use giant typography strategically
-   let project content dominate
-   keep pixel language concentrated
-   use mono labels for technical texture
-   make dark surfaces genuinely dark
-   keep motion crisp and intentional
-   use real engineering details

### Don't

-   turn the page into a fake operating system
-   add unnecessary draggable windows
-   use Matrix rain
-   cover everything in neon glow
-   use pixel fonts for paragraphs
-   add glassmorphism
-   use dozens of animated particles
-   hide navigation behind gimmicks
-   sacrifice accessibility for a custom cursor

## 16. Design acceptance test

A screenshot without animations should still look intentional and
complete.

A recruiter should be able to skim the page with all decorative effects
disabled.

The interface should feel: **dark / editorial / technical /
retro-computing / confident**

It should not feel: **cyberpunk template / Twitch overlay / gaming clan
/ generic SaaS / fake terminal demo**


## 17. Minimalism guardrails (approved)

- **Professional first:** real projects, engineering outcomes, name and contact must visually dominate.
- **Pixel art is seasoning:** no large pixel-art computer, Space Invaders icon, generic gaming mascots, stacked arcade HUDs or excessive icons.
- **One visual focal point per section:** typography OR imagery OR graphic band; not all three competing.
- **Whitespace is intentional:** avoid filling gaps with decorations.
- **Keep Obscura × Glyphy DNA:** monumental lettering, disciplined accent, outlined UI, pixel micro-details and strong flat composition.
- **Visual acceptance:** a static screenshot should read as a refined designer/developer portfolio with subtle retro character, not a videogame website.


## Sombra — official mascot and approved color direction (v1.2)

**Identity:** Sombra is Edgar's existing black male-presenting pixel-art kitten, supplied as assets in the repository's `pet/` directory. It is a personal brand companion, not a game character or a generic cat illustration. Do not rename it or redraw/reinterpret its appearance without approval. The actual assets are not included in these documents; inspect `pet/` before choosing image format, dimensions, frames, or animation technique.

**Placement:** Feature Sombra once in the Hero as a modest, visually balanced companion to the text. Optionally use one tiny recurring Sombra detail in the footer or an empty state, but do not repeat it on every project card. No large game scene, gaming HUD, alien sprites or overloaded arcade decorations.

**Interaction:** A static Sombra is acceptable. If existing frames permit, consider a subtle blink, tail movement, or sleeping loop; never fabricate frames or promise animations unsupported by the supplied files. Honor `prefers-reduced-motion`; animation must not delay content or distract from projects.

**Color direction:** Replace lime/neon green with a **soft pastel blue** (`--signal: #8bd0ff`) on near-black/blue-black surfaces. Secondary blue/lavender tones may be used sparingly. Maintain readable contrast and keep the strong Obscura × Glyphy typography and restrained pixel motifs.

**Acceptance:** Sombra should feel recognizable and charming, while the page still reads as a professional backend-focused developer portfolio.


## Contrato visual de Sombra V2 (v1.3)

- Nombre oficial **Sombra**. Diseño canónico: cuerpo negro sólido, orejas angulares, cola curva unida, dos ojos blancos verticales rectangulares sin pupilas/pestañas/rubor, borde naranja plano solo en el contorno izquierdo de pantalla. No recolorear al azul pastel: el azul pertenece a la interfaz, no al personaje.
- Asset aprobado: `pet/Sombra/final/spritesheet-extended.png` (PNG transparente). Atlas de 8 columnas × 11 filas, **1536 × 2288 px**, celdas **192 × 208 px**.
- Estados (fila base 0): `idle` fila 0, 6 cuadros; `running-right` fila 1, 8; `running-left` fila 2, 8; `waving` fila 3, 4; `jumping` fila 4, 5; `failed` fila 5, 8; `waiting` fila 6, 6; `running` fila 7, 6; `review` fila 8, 6; `look-row-9` fila 9, 8; `look-row-10` fila 10, 8. Los últimos dos estados cubren 16 direcciones de mirada.
- Hero: tamaño moderado, con espacio reservado de antemano y escalado proporcional; evitar interpolación borrosa (`image-rendering: pixelated` si mejora el resultado). No reproducir simultáneamente múltiples estados.
- Movimiento: `idle` discreto, `waving` solo tras interacción; movimiento reducido implica primer cuadro estático. No crear animaciones nuevas sin aprobación.
- Verificar contraste y legibilidad de los detalles naranjas y blancos sobre fondo oscuro; no añadir resplandores o marcos arcade excesivos.
