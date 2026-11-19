# Scroll Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir revelados al scroll (fade + subida, titulares con wipe por línea, cascadas cortas) a la página existente sin alterar composición, color ni contenido.

**Architecture:** Un gate inline en `<head>` marca `<html data-motion="on">` solo si hay `IntersectionObserver` y el usuario no pidió movimiento reducido. Todo el CSS de estados iniciales cuelga de ese atributo, así que sin JS la página es idéntica a hoy. Un único módulo (`src/scripts/motion.ts`) asigna retardos de cascada, observa los elementos y los revela una sola vez.

**Tech Stack:** Astro 7 (estático, sin islas), CSS nativo (transiciones + `clip-path`), TypeScript, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-19-scroll-motion-design.md`

## Global Constraints

- No añadir dependencias. `package.json` no cambia.
- Tokens y valores del Design System §10: reveal 450–700 ms (`--motion-reveal: 550ms` ya existe), desplazamiento 12–24 px (`--motion-reveal-distance: 1rem`), stagger 40–80 ms (60 ms por defecto, 40 ms para los logos), hero ≤ 900 ms.
- Solo se anima `opacity`, `transform` y `clip-path`. Nunca `height`, `width`, `top`, `margin` → CLS 0.
- Ningún estado inicial de opacidad o recorte puede existir fuera de `html[data-motion='on']`.
- Con `prefers-reduced-motion: reduce` no se pone `data-motion` y no hay animación alguna.
- No se toca contenido, copy, orden de DOM, colores, tipografía ni grid.
- Nombres: atributos `data-reveal`, `data-reveal-wipe`, `data-reveal-lines`, `data-reveal-group`, `data-stagger`; clase final `is-revealed`.

## Review Focus

Estos son los modos de fallo que el spec implica y que ningún test de tarea cubre por sí solo. Cada uno tiene su test en la tarea que le corresponde.

1. JS bloqueado, fallido o bundle 404 → la página debe verse completa, no en blanco (Task 1).
2. `prefers-reduced-motion: reduce` → cero estados ocultos y todo visible al cargar (Task 1, Task 6).
3. Foco por teclado en un bloque aún no revelado → se revela al instante y el outline se ve (Task 1).
4. Descendentes en los titulares ("profesional", "académica", "Tecnológico") → sin recorte tras el wipe (Task 2).
5. Grupo con más hijos que el tope (13 certificados) → la espera máxima queda acotada (Task 1, Task 5).

---

### Task 1: Gate de movimiento y motor de reveal

**Files:**

- Create: `src/scripts/motion.ts`
- Create: `tests/unit/motion.test.ts`
- Create: `tests/e2e/motion.spec.ts`
- Modify: `src/styles/tokens.css` (añadir 2 tokens al bloque `:root`)
- Modify: `src/styles/global.css` (`@layer components`)
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**

- Consumes: tokens existentes `--motion-reveal`, `--ease-standard`.
- Produces:
  - `export function revealDelay(index: number, staggerMs?: number): number`
  - `export const REVEAL_STAGGER_MS = 60`, `export const REVEAL_MAX_STEPS = 6`
  - `export function initMotion(): void`
  - Atributos: `data-reveal`, `data-reveal-wipe`, `data-reveal-lines`, `data-reveal-group`, `data-stagger`; clase `is-revealed`; atributos raíz `data-motion="on"` y `data-motion-ready`.

- [ ] **Step 1: Escribir el test unitario que falla**

```ts
// tests/unit/motion.test.ts
import { describe, expect, it } from 'vitest';
import { REVEAL_MAX_STEPS, REVEAL_STAGGER_MS, revealDelay } from '../../src/scripts/motion.ts';

describe('reveal stagger', () => {
  it('starts immediately and steps by the default stagger', () => {
    expect(revealDelay(0)).toBe(0);
    expect(revealDelay(1)).toBe(REVEAL_STAGGER_MS);
    expect(revealDelay(3)).toBe(180);
  });

  it('accepts a custom stagger', () => {
    expect(revealDelay(2, 40)).toBe(80);
  });

  it('caps the accumulated wait and never goes negative', () => {
    expect(revealDelay(99)).toBe(REVEAL_MAX_STEPS * REVEAL_STAGGER_MS);
    expect(revealDelay(-2)).toBe(0);
  });
});
```

- [ ] **Step 2: Ejecutar el test y verlo fallar**

Run: `pnpm vitest run tests/unit/motion.test.ts`
Expected: FAIL — no se encuentra `src/scripts/motion.ts`.

- [ ] **Step 3: Añadir los tokens**

En `src/styles/tokens.css`, dentro de `:root`, junto a `--motion-reveal`:

```css
--motion-reveal-distance: 1rem;
--motion-reveal-stagger: 60ms;
```

- [ ] **Step 4: Implementar `src/scripts/motion.ts`**

```ts
export const REVEAL_STAGGER_MS = 60;
export const REVEAL_MAX_STEPS = 6;

export function revealDelay(index: number, staggerMs: number = REVEAL_STAGGER_MS): number {
  const step = Math.min(Math.max(index, 0), REVEAL_MAX_STEPS);
  return step * staggerMs;
}

const TARGETS = '[data-reveal], [data-reveal-wipe], [data-reveal-lines]';

export function initMotion(): void {
  const root = document.documentElement;
  // The head gate already decided. Bail out when motion is disallowed.
  if (!root.hasAttribute('data-motion')) return;

  for (const group of document.querySelectorAll<HTMLElement>('[data-reveal-group]')) {
    const stagger = Number(group.dataset['stagger']) || REVEAL_STAGGER_MS;
    let index = 0;
    for (const child of group.children) {
      if (!(child instanceof HTMLElement) || !child.matches(TARGETS)) continue;
      child.style.setProperty('--reveal-delay', `${revealDelay(index, stagger)}ms`);
      index += 1;
    }
  }

  const reveal = (element: Element) => element.classList.add('is-revealed');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );

  document.querySelectorAll<HTMLElement>(TARGETS).forEach((element) => observer.observe(element));

  // Keyboard focus must never land on a still-hidden block.
  document.addEventListener('focusin', (event) => {
    const target = event.target instanceof Element ? event.target.closest(TARGETS) : null;
    if (target) reveal(target);
  });

  // If the user turns reduced motion on mid-session, everything becomes visible at once.
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    if (!event.matches) return;
    observer.disconnect();
    root.removeAttribute('data-motion');
  });

  root.setAttribute('data-motion-ready', '');
}
```

- [ ] **Step 5: Añadir el CSS de estados iniciales**

En `src/styles/global.css`, dentro de `@layer components`, después de `.skip-link:focus`:

```css
/* Motion states exist only when the head gate allowed motion (no JS => no hidden content). */
html[data-motion='on'] [data-reveal] {
  opacity: 0;
  transform: translate3d(0, var(--motion-reveal-distance), 0);
  transition:
    opacity var(--motion-reveal) var(--ease-standard),
    transform var(--motion-reveal) var(--ease-standard);
  transition-delay: var(--reveal-delay, 0ms);
}

html[data-motion='on'] [data-reveal-wipe] {
  clip-path: inset(0 0 100% 0);
  transition: clip-path var(--motion-reveal) var(--ease-standard);
  transition-delay: var(--reveal-delay, 0ms);
}

html[data-motion='on'] [data-reveal-lines] .line {
  display: block;
  clip-path: inset(0 0 100% 0);
  transition: clip-path var(--motion-reveal) var(--ease-standard);
  transition-delay: var(--reveal-delay, 0ms);
}

html[data-motion='on'] [data-reveal-lines] .line:nth-child(2) {
  transition-delay: calc(var(--reveal-delay, 0ms) + 80ms);
}

html[data-motion='on'] [data-reveal].is-revealed,
html[data-motion='on'] [data-reveal-wipe].is-revealed {
  opacity: 1;
  transform: none;
}

html[data-motion='on'] [data-reveal-wipe].is-revealed,
html[data-motion='on'] [data-reveal-lines].is-revealed .line {
  clip-path: inset(0 0 0 0);
}
```

- [ ] **Step 6: Añadir el gate y el arranque en `BaseLayout.astro`**

En `<head>`, al final, con JavaScript plano (Astro no procesa `is:inline`):

```astro
<script is:inline>
  (() => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.dataset.motion = 'on';
    // If the module never runs (bundle blocked), never leave the page hidden.
    setTimeout(() => {
      if (!root.hasAttribute('data-motion-ready')) delete root.dataset.motion;
    }, 3000);
  })();
</script>
```

Antes de `</body>`:

```astro
<script>
  import { initMotion } from '../scripts/motion.ts';
  initMotion();
</script>
```

- [ ] **Step 7: Añadir el e2e que prueba el gate y el fallback**

```ts
// tests/e2e/motion.spec.ts
import { expect, test } from '@playwright/test';

test('reveals below-fold content on scroll when motion is allowed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');

  const firstCertificate = page.locator('[data-certification]').first();
  await expect(firstCertificate).toHaveCSS('opacity', '0');

  await page.locator('#certificaciones').scrollIntoViewIfNeeded();
  await expect(firstCertificate).toHaveCSS('opacity', '1');
});

test('keeps everything visible when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on');
  await expect(page.locator('[data-certification]').first()).toHaveCSS('opacity', '1');
});

test('reveals a pending block when keyboard focus lands inside it', async ({ page }) => {
  await page.goto('/');
  const row = page.locator('[data-experience]').first();
  await page.locator('a.related-project').first().focus();
  await expect(row).toHaveCSS('opacity', '1');
});
```

Nota: los tests 1 y 3 dependen de atributos que añaden las tareas 4 y 5 (`[data-certification]`); hasta entonces fallarán por selector vacío. Es esperado y queda verde al terminar la tarea 5.

- [ ] **Step 8: Ejecutar los tests y verlos pasar**

Run: `pnpm vitest run tests/unit/motion.test.ts`
Expected: PASS (3 tests).

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/scripts/motion.ts src/styles/tokens.css src/styles/global.css src/layouts/BaseLayout.astro tests/unit/motion.test.ts tests/e2e/motion.spec.ts
git commit -m "feat: add progressive scroll-motion engine"
```

---

### Task 2: Titulares de sección con wipe por línea

**Files:**

- Modify: `src/components/ui/SectionHeading.astro`
- Modify: `src/components/ui/ProjectCard.astro` (solo `data-reveal` en el `<article>`)
- Modify: `src/styles/global.css` (bloque `@media (prefers-reduced-motion: reduce)` — añadir `clip-path: none`)

**Interfaces:**

- Consumes: `data-reveal-group`, `data-reveal`, `data-reveal-lines`, clase `is-revealed` (Task 1).
- Produces: el titular de sección expone `.line` en cada línea; nada más cambia.

- [ ] **Step 1: Reemplazar el `<br>` por líneas enmascarables**

En `SectionHeading.astro`, sustituir el `<h2>` por (el espacio entre líneas es literal y mantiene el nombre accesible):

```astro
<h2 id={id} data-reveal-lines>
  <span class="line">
    <span class="line-inner">{firstLine}</span>
  </span>{' '}
  <span class="line">
    <span class="line-inner">{secondLine}</span>
  </span>
</h2>
```

y envolver el bloque con la cascada del índice:

```astro
<div class="section-heading" data-reveal-group>
  <span class="section-index" aria-hidden="true" data-reveal>
    [{index}]
  </span>
  ...
```

Añadir al `<style>` del componente:

```css
.line {
  display: block;
}
```

- [ ] **Step 2: Verificar que el titular se lee como antes**

Run: `pnpm build && pnpm exec playwright test tests/e2e/quality.spec.ts`
Expected: PASS. Si el nombre accesible cambia (`Proyectosdestacados`), falta el `{' '}` entre líneas.

- [ ] **Step 3: Añadir la tarjeta de proyecto como objetivo de reveal**

En `ProjectCard.astro`, `<article class="project-card" ... data-reveal>`.

- [ ] **Step 4: Cubrir el caso de los descendentes**

Comprobar a ojo, con el servidor de desarrollo, que tras el wipe de "Experiencia profesional", "Formación académica" y "Stack tecnológico" no se recorta ninguna letra. Si se recorta, añadir al `<h2>` de `SectionHeading.astro`:

```css
h2 {
  padding-block-end: 0.08em;
  margin-block-end: -0.08em;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SectionHeading.astro src/components/ui/ProjectCard.astro src/styles/global.css
git commit -m "feat: mask section headings line by line"
```

---

### Task 3: Cascada de entrada del Hero

**Files:**

- Modify: `src/components/sections/Hero.astro`
- Modify: `src/components/Sombra.astro` (atributo en el `<figure>`)

**Interfaces:**

- Consumes: Task 1.
- Produces: nada nuevo.

- [ ] **Step 1: Marcar la cascada del Hero**

En `Hero.astro`:

- `<div class="hero-copy" data-reveal-group>`
- `data-reveal` en `.hero-eyebrow`, `.hero-name`, `.hero-role`, `.hero-summary` y `.hero-actions`.
- `data-reveal-wipe` en el `<h1 class="hero-wordmark ...">` (un solo elemento, sin wrapper: el selector del guion bajo no cambia).

En `Sombra.astro`, `<figure class="sombra" data-sombra data-reveal>` y en el `<style>` del componente:

```css
.sombra {
  --reveal-delay: 180ms;
}
```

- [ ] **Step 2: Verificar el orden y el límite de 900 ms**

Con `pnpm dev`, recargar en 1440 px: eyebrow → wordmark → nombre → rol → resumen → botones → Sombra. Último elemento con retardo 240 ms + 550 ms de transición = 790 ms, dentro del límite.

- [ ] **Step 3: Comprobar que el Hero no se anima dos veces al volver arriba**

Desplazarse hasta el final y volver: el Hero no debe re-animar (se revela una vez y se deja de observar).

- [ ] **Step 4: Ejecutar la suite**

Run: `pnpm lint && pnpm typecheck && pnpm vitest run && pnpm build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.astro src/components/Sombra.astro
git commit -m "feat: stagger hero entrance"
```

---

### Task 4: Proyectos y experiencia

**Files:**

- Modify: `src/components/sections/SelectedWork.astro`
- Modify: `src/components/sections/Experience.astro`

**Interfaces:**

- Consumes: Task 1, Task 2 (la tarjeta ya trae `data-reveal`).
- Produces: nada nuevo.

- [ ] **Step 1: Marcar la rejilla de proyectos**

En `SelectedWork.astro`: `<div class="project-grid" data-reveal-group>` y `data-reveal` en el `<p>` y en el `<span class="work-count">` del intro (sin grupo: entran con retardo 0).

- [ ] **Step 2: Marcar las filas de experiencia**

En `Experience.astro`: `<ol class="experience-list" data-reveal-group ...>` y `<li class="experience-row" data-reveal ...>`. Las contribuciones dentro de `<details>` no se marcan.

- [ ] **Step 3: Comprobar el abridor de `details`**

Con `pnpm dev`, abrir "Ver más contribuciones" en Experiencia: el contenido extra aparece inmediatamente, sin estar oculto por el reveal.

- [ ] **Step 4: Ejecutar la suite**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm exec playwright test tests/e2e/professional.spec.ts tests/e2e/portfolio.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/SelectedWork.astro src/components/sections/Experience.astro
git commit -m "feat: reveal work cards and experience rows"
```

---

### Task 5: Resto de secciones, contacto y pie

**Files:**

- Modify: `src/components/sections/PrimaryStack.astro`
- Modify: `src/components/sections/Stack.astro`
- Modify: `src/components/sections/About.astro`
- Modify: `src/components/sections/Education.astro`
- Modify: `src/components/sections/Certifications.astro`
- Modify: `src/components/sections/Contact.astro`
- Modify: `src/components/layout/Footer.astro`

**Interfaces:**

- Consumes: Task 1.
- Produces: `[data-certification]` ya existe en el `<li>`; el e2e de la Task 1 depende de él.

- [ ] **Step 1: Marcar cada colección**

- `PrimaryStack.astro`: `<ul data-reveal-group data-stagger="40">` y `data-reveal` en cada `<li>`.
- `Stack.astro`: `<div class="stack-categories" data-reveal-group>` y `data-reveal` en cada `<section class="stack-category">`.
- `About.astro`: `<div class="about-layout" data-reveal-group>`, `data-reveal` en sus dos hijos directos.
- `Education.astro`: `data-reveal` en cada `<div class="education-entry">` (sin grupo: es una sola entrada).
- `Certifications.astro`: `<ol class="certification-list" data-reveal-group>` y `data-reveal` en cada `<li>`.
- `Contact.astro`: `<div class="contact-copy" data-reveal-group>` con `data-reveal` en el `<p>` y en el `<a class="action">`; `<ul class="contact-links" data-reveal-group>` con `data-reveal` en cada `<li>`.
- `Footer.astro`: `data-reveal` en `<div class="page-container footer-inner">`.

- [ ] **Step 2: Comprobar el tope de cascada con 13 certificados**

Con `pnpm dev`, al llegar a Certificaciones la última fila debe entrar en menos de ~1 s: retardo máximo 360 ms (6 pasos × 60 ms) + 550 ms de transición.

- [ ] **Step 3: Ejecutar el e2e de motion completo**

Run: `pnpm build && pnpm exec playwright test tests/e2e/motion.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections src/components/layout/Footer.astro
git commit -m "feat: cascade remaining section reveals"
```

---

### Task 6: Verificación final y documentación

**Files:**

- Modify: `docs/superpowers/specs/2026-11-19-scroll-motion-design.md` (nota de implementación al final)
- Modify: `docs/superpowers/plans/2026-11-19-scroll-motion.md` (marcar pasos)

**Interfaces:**

- Consumes: todo lo anterior.
- Produces: reporte de validación.

- [ ] **Step 1: Suite completa**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
Expected: PASS en los cuatro.

- [ ] **Step 2: E2E completo**

Run: `pnpm test:e2e`
Expected: PASS, incluidos `quality.spec.ts` (4 anchos con movimiento reducido) y `motion.spec.ts`.

- [ ] **Step 3: Revisión manual con la página construida**

En `pnpm preview`, comprobar a 360, 768 y 1440 px: sin desbordamiento horizontal, sin saltos de layout al revelar, cascadas visibles y sin parpadeo al hacer scroll inverso.

- [ ] **Step 4: Revisión sin JS**

En DevTools, desactivar JavaScript y recargar: todo el contenido es visible, ningún bloque a `opacity: 0`.

- [ ] **Step 5: Revisión de teclado**

Recorrer con Tab desde el inicio hasta el pie: el foco nunca queda en un elemento invisible y el outline se ve siempre.

- [ ] **Step 6: Añadir la nota de implementación al spec**

Al final del documento de diseño:

```markdown
## Nota de implementación (2026-11-19)

El titular del Hero usa wipe de bloque (`data-reveal-wipe`) en lugar de máscara por línea para no
envolver el wordmark y no tocar el selector del guion bajo. Los titulares de sección sí usan wipe
por línea (`data-reveal-lines`). Los reveals son de una sola pasada.
```

- [ ] **Step 7: Commit**

```bash
git add docs
git commit -m "docs: record scroll-motion implementation notes"
```
