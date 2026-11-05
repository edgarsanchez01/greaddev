# Fase 2 — Base técnica

Esta fase inicializa Astro estático y sus herramientas. La página temporal no representa el mockup.
Header, Hero, Sombra, proyectos y demás secciones siguen pendientes de autorización.

## Entorno reproducible

- Node de referencia: `26.8.1`, registrado en `.node-version`.
- pnpm: `12.16.1`, registrado en `packageManager`.
- Dependencias directas con versiones exactas y árbol fijado en `pnpm-lock.yaml`.
- `pnpm-workspace.yaml` conserva la excepción de antigüedad para el parche estable revisado
  `vite@8.3.6` y exige revisión explícita de cualquier excepción futura.
- TypeScript `6.0.3`: compatible con Astro Check y typescript-eslint; la versión 7 todavía queda fuera de sus peer dependencies.
- No se necesita servidor Node en producción: el resultado es `dist/`.

Si pnpm no está instalado y Corepack no está disponible, se puede ejecutar la versión fijada mediante
`npx --yes pnpm@12.16.1 <comando>`, sin instalar un gestor global. En esta sesión el bootstrap aislado
se ubica en `/tmp/opencode/greaddev-tooling`; esa ruta no forma parte de la configuración del proyecto.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm exec playwright install chromium --only-shell
pnpm test:e2e
pnpm build
```

Playwright descarga solo su navegador de prueba y lo guarda en caché de usuario. Puede utilizarse
`PLAYWRIGHT_BROWSERS_PATH` para elegir una caché temporal. No ejecutar `install-deps` ni instalar
paquetes del sistema automáticamente; si faltan bibliotecas nativas, registrar el bloqueo.
Las pruebas E2E construyen el sitio y arrancan un preview independiente en `127.0.0.1:4321`.
Playwright usa `tests/preview-server.mjs` para mantener el servidor en el mismo proceso y cerrarlo
con SIGTERM/SIGINT. En este entorno el lanzador CLI deja un proceso separado, incluso sin pnpm
anidado. El auxiliar utiliza la API programática de preview de Astro, experimental pero fijada a la
versión instalada y comprobada por las pruebas E2E; no añade un servidor de producción.

## Tokens y fuentes

Los colores canónicos se conservan en `src/styles/tokens.css`. Tailwind v4 los consume mediante
`@theme inline`; no se utiliza la integración antigua `@astrojs/tailwind` ni un segundo sistema de colores.
Las utilidades se detectan solo en carpetas de UI, no en datos editoriales.

Archivo Black, Inter, JetBrains Mono y Jersey 10 se distribuyen localmente mediante Fontsource.
Los cuatro paquetes declaran licencia **OFL-1.1** y conservan su archivo `LICENSE`. Solo se importan
los estilos latinos y pesos usados o previstos, con `font-display: swap`; no hay peticiones a Google Fonts.
Las licencias completas y avisos de autoría se copiaron sin cambios a `public/fonts/*-LICENSE.txt`
para acompañar también a las fuentes distribuidas en `dist/`.

## Integridad y publicación

- Los archivos de Fase 1 no se reformatean; sí se comprueban mediante ESLint, TypeScript y Vitest.
- Los cuatro Markdown canónicos, el PDF original y `pet/Sombra/` permanecen intactos.
- El PDF original no se copia a `public/` y está excluido de un futuro seguimiento Git por defecto.
- `src/editorial/phase-1.ts` es un registro histórico de aquella autorización; no se modifica al avanzar fases.
- ESLint impide importar notas editoriales o fuentes originales desde módulos públicos.
- El servidor Vite bloquea por HTTP las notas editoriales, el PDF original y los recursos fuente de Sombra.
- La página temporal utiliza `noindex, nofollow`. No hay dominio, canonical, sitemap, OG, CV público
  ni página 404 personalizada en esta fase; corresponden a fases posteriores.
- No se añaden React, hidratación de frameworks, APIs, base de datos, CMS o autenticación.

## Cobertura inicial

Vitest verifica relaciones de contenido, fechas, métricas contextualizadas, campos opcionales,
tokens canónicos y licencias. Playwright comprueba HTML sin JS, Tailwind compilado, fuentes locales,
teclado/foco, reflow a 320/360/390/768/1440 px, movimiento reducido, accesibilidad automatizada y
ausencia de fuentes privadas en las rutas públicas. No equivale a una auditoría de la interfaz futura.
