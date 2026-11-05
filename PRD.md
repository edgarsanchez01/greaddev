# GreadDev --- Product Requirements Document (PRD)

**Product:** GreadDev\
**Type:** Developer portfolio / web CV\
**Owner:** Edgar Sánchez Flores\
**Version:** 1.3 — Astro + minimalismo retro + Sombra\
**Primary language:** Spanish\
**Secondary language:** English-ready\
**Status:** Ready for implementation

## 1. Product vision

GreadDev is a personal developer portfolio that presents Edgar Sánchez
Flores as a backend-oriented Full-Stack Software Engineer. The
experience should feel like a polished dark developer environment with
minimalist 8-bit visual accents, bold Obscura/Glyphy typography, and purposeful
motion.

The site must feel like a professional software-engineering portfolio, NOT a gaming/arcade landing page. Use generous negative space and a few intentional 8-bit accents. Typography and actual work lead; retro illustration is optional and never dominant.

### Design synthesis and reference hierarchy

The visual direction is intentionally **not an equal blend**.

#### Primary references --- 85% of the visual identity

1.  **Obscura --- dominant reference (\~50%)**
    -   strongest source of typographic and graphic identity
    -   8-bit / arcade vocabulary
    -   pixel typography as a recognizable brand voice
    -   playful but structured components
    -   strong accent discipline
    -   sparse decorative pixel motifs; no visual clutter
    -   readable modern sans paired with pixel display type
2.  **Glyphy --- co-primary reference (\~35%)**
    -   monumental wordmark and oversized typography
    -   specimen-sheet / graphic-design composition
    -   pixel micro-labels paired with modern grotesque display type
    -   horizontal band logic
    -   flat cards and strong outlines
    -   mono metadata and dense typographic details

#### Secondary references --- 15% total

3.  **Flying Papers (\~10%)**
    -   use only for motion confidence, oversized composition, and
        occasional overlapping elements
    -   do not inherit its colorful cartoon palette or mascot-heavy
        identity
4.  **Thomas Hedger (\~5%)**
    -   use only for work-first editorial restraint and project
        presentation
    -   do not inherit its white museum-catalog visual identity

The result must immediately read as **a minimalist dark GreadDev interpretation of
Obscura × Glyphy**. Flying Papers and Thomas Hedger are supporting
references, never equal visual sources.

## 2. Product goals

-   Explain who Edgar is and what he builds in under 10 seconds.
-   Make projects and engineering decisions the strongest content.
-   Make GitHub, LinkedIn, email, and CV easy to reach.
-   Demonstrate frontend craft without distracting from backend
    expertise.
-   Perform well on desktop and mobile.
-   Be accessible and usable with reduced motion.
-   Be easy to maintain from structured local content.
-   Be deployable as a static/SSR portfolio with minimal operational
    cost.

## 3. Target audience

### Primary

Technical recruiters, engineering managers, tech leads, and software
companies evaluating backend or Full-Stack Java profiles.

### Secondary

Developers, collaborators, freelance clients, and people arriving from
GitHub or LinkedIn.

## 4. Positioning

Suggested public positioning:

> Backend-focused Full-Stack Developer building secure APIs, scalable
> services and production-ready web experiences.

Supporting themes: - Java / Spring ecosystem - API and backend
architecture - Authentication and authorization - SQL and data
modeling - Docker / Kubernetes - React / TypeScript - Legacy
modernization and migrations

## 5. Public identity

**Brand:** GreadDev\
**Person:** Edgar Sánchez Flores\
**Role:** Full-Stack Developer / Backend-focused Software Engineer\
**GitHub:** https://github.com/edgarsanchez01\
**LinkedIn:** https://www.linkedin.com/in/edgar-sanchez01\
**Email:** edgar.sanchez8999@gmail.com

### Privacy requirement

Do not publish RFC, CURP, NSS, marital status, home address, or other
administrative identifiers from the source CV. Do not display a phone
number unless the owner explicitly opts in later.

## 6. Information architecture

Primary navigation:

-   Home
-   Work
-   Experience
-   Stack
-   About
-   Contact
-   CV

Recommended route model:

-   `/` --- single-page portfolio experience
-   `/projects/[slug]` --- optional detailed project case studies
-   `/cv` or `/Edgar-Sanchez-CV.pdf` --- public sanitized CV
-   `/404` --- themed error screen

The MVP may remain a single page with anchored sections. Project detail
routes are Phase 2 if project material is not yet sufficient.

## 7. Page structure

### 7.1 Global navigation

Sticky minimal header.

Left: `GREADDEV_`

Center/desktop: `WORK / EXPERIENCE / STACK / ABOUT`

Right: GitHub icon, LinkedIn icon, `CV ↓`

Mobile: brand + menu trigger. Menu opens a full-screen dark
terminal/editorial panel.

### 7.2 Hero --- "graphic identity"

The first viewport must immediately identify the owner.

Content: - micro-label: `PLAYER_01 / SOFTWARE_ENGINEER` - giant
wordmark: `GREADDEV` - name: `Edgar Sánchez Flores` - role statement -
short professional summary - CTA: `VIEW_WORK` - secondary:
`DOWNLOAD_CV` - status line: `AVAILABLE_FOR_OPPORTUNITIES` only when
manually enabled

Visual behavior: - dark near-black canvas - subtle grid/noise texture -
pixel accent labels - large modern grotesque wordmark - at most one small
optional decorative pixel motif - no large retro-computer illustration - no fake loading delay

### 7.3 Selected Work

This is the most important section after the hero.

Featured project candidates:

#### Belomora

Full-Stack e-commerce platform with backend emphasis.

Topics: Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate,
PostgreSQL, JWT/RBAC, inventory, Mercado Pago, webhooks, React,
TypeScript, Vite, TanStack Query, Zustand, Docker.

Engineering highlights: - domain-oriented modular backend -
authentication/authorization - inventory movement and concurrency -
payment integration - frontend/API integration - debugging Spring
Security 401/403 flow

#### Financial Risk Migration

Professional experience/case study. Do not expose confidential
implementation details.

Topics: Java 8, Spring Framework, Maven, Sybase, CSV, Murex integration
context, feature flags, legacy modernization.

Engineering highlights: - Legacy / Murex / Parallel execution modes -
CSV validation and processing - analysis of approximately 38 stored
procedures - configuration externalization - gradual migration strategy

#### POS / E-commerce system

Topics: Spring Boot, Oracle, PL/SQL, Angular, Docker, Feign, Eureka,
Swagger, JWT, Kubernetes, SonarQube.

#### Mobile Device Comparison Platform

Topics: Node.js, JavaScript ES6, MySQL, REST APIs, SQL indexes and query
optimization.

Claim permitted from CV: search times improved by 20%.

Each project card should show: - index - project name - short outcome -
role - year - stack tags - `CASE_STUDY →` when detail exists -
`SOURCE →` only when a public repository exists

Do not invent repository/project links. Map them only after verifying
actual GitHub repositories.

### 7.4 Experience

Use an editorial vertical timeline, not conventional boxed resume cards.

Entries: - NFQ Advisory --- Backend Programmer --- Jan 2026--Jul 2026 -
Consultoría SISTEMAS-EC --- Backend Programmer --- Jan 2025--Dec 2025 -
Belomora --- Full-Stack Developer --- Jun 2024--Jan 2025 - Carlos Vassan
--- Backend Developer --- Jan 2024--Jun 2024

Each entry: - company/project - role - period - 2--4 concise impact
bullets - key technology strip

### 7.5 Stack

Present as a "developer inventory" / command palette rather than a logo
cloud.

Categories: - Languages: Java, TypeScript, JavaScript, PL/SQL - Backend:
Spring Boot, Spring Framework, Spring Security, JPA/Hibernate, Node.js -
Frontend: React, Angular, HTML, CSS, Tailwind CSS - Data: PostgreSQL,
Oracle, MySQL, MongoDB, H2, Sybase - Architecture/API: REST, JWT, RBAC,
Feign, Eureka, Swagger/OpenAPI, SOAP - DevOps: Docker, Docker Compose,
Kubernetes - Quality/Test: JUnit, Mockito, SonarQube, Postman -
Build/Tools: Maven, Git, GitHub, IntelliJ IDEA, Eclipse/STS, VS Code

Do not represent every skill as equally strong. Future content may add
proficiency/context labels.

### 7.6 About

Short human section: - Engineering in Software Development and
Management - Universidad Tecnológica de Tehuacán, 2021--2025 - TSU in
Multiplatform Software Development - Technical English: intermediate -
concise collaboration/communication statement

Avoid generic soft-skill paragraphs.

### 7.7 Certifications

Compact list with year. Do not make certificates visually more important
than projects or professional experience.

### 7.8 Contact / final screen

Large editorial CTA: `LET'S BUILD SOMETHING.`

Actions: - Email - GitHub - LinkedIn - Download CV

Footer: `GREADDEV / EDGAR SÁNCHEZ FLORES / © {currentYear}`

## 8. Functional requirements

### P0 --- MVP

-   Responsive desktop/tablet/mobile.
-   Semantic navigation.
-   Smooth anchor navigation without breaking browser history.
-   Public links to GitHub and LinkedIn.
-   `mailto:` contact.
-   Downloadable sanitized CV.
-   Project/experience/stack/about content.
-   SEO metadata.
-   Open Graph metadata.
-   sitemap and robots.
-   custom 404.
-   keyboard navigation.
-   visible focus states.
-   reduced-motion mode.
-   no JavaScript-required blank state for primary content.

### P1

-   Project detail routes.
-   GitHub repository mapping.
-   bilingual ES/EN content.
-   theme accent selector (not full theme builder).
-   optional availability status.
-   command palette (`Ctrl/Cmd + K`) for navigation.

### P2

-   lightweight analytics.
-   blog/notes.
-   dynamic GitHub activity only if it adds value and has graceful
    caching/fallback.

## 9. Motion requirements

Motion is part of the identity but must never block reading.

Allowed: - hero text reveal - pixel cursor blink - section labels
sliding 4--12 px - project image/parallax depth under 20 px - marquee
used only for decorative metadata - hover image shift - page/section
transition wipes - very occasional small pixel fragments

Forbidden: - forced intro animation - long boot sequence - scroll
hijacking - constant large background motion - cursor replacement
required for basic use - excessive glitch effects - animations that make
text difficult to read

Respect `prefers-reduced-motion: reduce`.

## 10. Content requirements

All public claims must come from: 1. the sanitized CV, 2. verified
GitHub repositories, 3. content explicitly supplied by Edgar.

Never invent: - metrics - client names - repository URLs - production
user counts - revenue - certifications - dates - technologies

Professional projects may require anonymization.

## 11. SEO

Title:
`GreadDev — Edgar Sánchez Flores | Full-Stack & Backend Developer`

Description:
`Portfolio de Edgar Sánchez Flores, desarrollador Full-Stack con enfoque backend especializado en Java, Spring Boot, APIs REST, seguridad, bases de datos y aplicaciones web modernas.`

Suggested keywords are secondary to useful content. Use Person and
WebSite structured data where appropriate.

## 12. Accessibility acceptance criteria

-   WCAG AA color contrast for body/UI text.
-   Full keyboard navigation.
-   Skip-to-content link.
-   Logical heading hierarchy.
-   Decorative pixel art hidden from assistive technology.
-   Icon-only links have accessible names.
-   Focus indicator is always visible.
-   No information encoded only by color.
-   Reduced motion supported.
-   Touch targets approximately 44×44 px where practical.

## 13. Performance acceptance criteria

Target on a production deployment: - Lighthouse Performance ≥ 90 -
Accessibility ≥ 95 - Best Practices ≥ 95 - SEO ≥ 95 - LCP ≤ 2.5 s on a
representative mobile test - CLS ≤ 0.1 - avoid shipping animation
libraries for effects achievable with CSS

## 14. Success criteria

The product succeeds when a first-time visitor can quickly answer: 1.
Who is Edgar? 2. What kind of developer is he? 3. What has he built? 4.
Which technologies does he use? 5. How can I inspect his work or contact
him?

## 15. Definition of done

The MVP is done when: - all P0 requirements are implemented; - all
content is real and reviewed; - no sensitive CV identifiers are
public; - responsive layouts work at 360 px through large desktop; -
keyboard/reduced-motion checks pass; - external links work; - CV
download works; - production build has no errors; - lint/typecheck/tests
pass; - metadata and favicon are present; - the deployed site has no
obvious layout shift or animation jank.


## 16. Approved visual correction (2026-11)

The earlier concept mockup was considered visually promising but **too gaming-heavy**. The approved direction is **minimalist dark Obscura × Glyphy**. Keep strong typography, graphic rhythm, restrained pixel UI and generous whitespace. Avoid large pixel-art computers, aliens, game HUDs, arcade badges, dense icon strips, or multiple decorative sprites. The portfolio must look professional first, retro-influenced second. Use Astro for the MVP as specified in `Architecture.md`.


## Mascot and palette requirements (v1.2)

- **Sombra** is the existing black pixel-art kitten created for Edgar. Its original assets will be stored under `pet/` in the GreadDev repository; inspect them rather than inventing a new mascot.
- Place Sombra prominently but proportionately in the Hero, balancing the wordmark and developer introduction. Optional tiny secondary appearance only when it adds value.
- Preserve the approved **minimalist** Obscura × Glyphy direction; avoid gamer overload.
- Palette: dark blue-black/graphite with **pastel-blue accents**, replacing the former lime green. See `Design-System.md` for tokens.
- Sombra must have meaningful alternative text when informative; decorative duplicates should be hidden from assistive technology. Any animation must support reduced motion and a static fallback.
- The mascot is a visual identity element, not a requirement for a pet interaction/game or chatbot.


## Sombra V2 — comportamiento confirmado (v1.3)

- Nombre oficial: **Sombra**; mascota existente, no regenerar ni reinterpretar.
- Fuente original: `pet/Sombra/final/spritesheet-extended.png`; mantener intacta.
- Apariencia: gatito negro pixel art, ojos blancos rectangulares sólidos sin pupilas, borde naranja cálido únicamente en el lado izquierdo visible; respetar referencia `pet/Sombra/references/canonical-base.png`.
- Hero: estado `idle` (6 fotogramas) por defecto; `waving` (4) como saludo puntual al interactuar, sin distraer ni bloquear navegación.
- Posibles usos posteriores, no requeridos para MVP: `failed` en 404, `waiting` en esperas reales, `jumping` en una interacción justificada. No implementar mascota flotante ni seguimiento permanente del cursor.
- Con `prefers-reduced-motion: reduce`, mostrar un fotograma estático; no depender de animación para comunicar información.
- Criterio de aceptación: Sombra reconocible y proporcional, Hero responsive, animaciones discretas y sin saltos de layout.
