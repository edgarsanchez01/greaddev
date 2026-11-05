# Fase 3 — Header, Hero, Sombra y proyectos

## Alcance

Se implementan únicamente Header, Hero, Sombra estático, banda principal y cuatro proyectos.
No hay Experiencia, inventario completo, Sobre mí, Certificaciones, Contacto ni Footer definitivo.
Tampoco se implementan animaciones, saludos, carruseles o seguimiento del cursor.

## Referencia y decisiones

La referencia es el mockup adjunto en la conversación, sin exigir un archivo local. Se conserva su
orden, wordmark dominante, rol azul, composición texto/mascota, banda horizontal y proyectos 2 × 2.
Las adaptaciones aprobadas prevalecen sobre la escena ilustrada: solo Sombra original, sin escritorio,
portátil, ventana, taza o planta. Se usan los tokens y fuentes locales de Fase 2, sin dependencias nuevas.

- Header con dos anclas existentes y enlaces públicos canónicos. En móvil se reorganizan en dos filas,
  visibles sin JavaScript; no hay menú modal que gestionar ni destinos futuros inactivos.
- No hay acción CV porque no existe un PDF público aprobado. El segundo CTA del Hero es correo.
- Las tarjetas no aparentan ser enlaces cuando faltan repositorios o casos de estudio. No se añaden
  flechas externas, capturas de producto ni botones ficticios.
- Las fechas, roles y contribuciones se resuelven por las relaciones de Fase 1. El helper de presentación
  selecciona un aporte existente por proyecto y conserva la precisión de las fechas.
- Los iconos SVG son gráficos de interfaz; los símbolos tecnológicos no pretenden ser logotipos oficiales.

## Sombra

Se verificaron dimensiones, hash del atlas aprobado y coincidencia píxel a píxel de `final-frames/idle/00.png`
con su primera celda. La copia `public/pet/sombra/idle-00.png` es idéntica al PNG final, pesa 16.085 bytes
y mide 192 × 208 px. No se altera `pet/Sombra/`, ni se descarga el atlas completo para una imagen estática.
La proporción se reserva en HTML y CSS; el componente funciona sin JS y no aplica animaciones.

## Revisión visual

Primera pasada: capturas reales en Chromium a 1440, 1280, 768, 390, 360 y 320 px, además de regiones
independientes de Header, Hero, Sombra, banda y proyectos. Se compararon visualmente con el mockup.
Se identificó separación excesiva de Sombra en tablet y columnas de texto estrechas junto a los iconos.
El lote de corrección conserva el Hero en dos columnas desde 768 px y permite que el cuerpo de las tarjetas
ocupe todo su ancho en pantallas pequeñas, sin reducir fuentes ni eliminar contenido.

La altura total no replica la imagen: el resumen completo, roles, periodos y aportes verificables requieren
más espacio. El gatito canónico tampoco coincide con la ilustración del mockup, de forma intencionada.
La aprobación visual final corresponde al propietario; estas capturas no la sustituyen.

Segunda pasada: se abrieron y revisaron las capturas finales de los seis tamaños. Sin scroll horizontal;
wordmark, CTA, mascota y textos completos dentro de sus límites. En 1440 px el Hero mide aproximadamente
471 px y Proyectos comienza en y≈606 px; en 768 px la mascota ya comparte la composición con el texto.
No es una reproducción píxel a píxel: conserva la jerarquía y geometría aprobadas con contenido real.

| Región    | Comparación con el mockup                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Header    | Marca izquierda, navegación numerada central y enlaces sociales derecha; solo destinos existentes.      |
| Hero      | Wordmark monumental, nombre, rol azul y CTA; resumen completo y altura natural.                         |
| Sombra    | Posición derecha y rótulo; recurso canónico estático en vez de la escena ilustrada.                     |
| Banda     | Seis tecnologías después del Hero; horizontal en escritorio, reflow en tablet/móvil.                    |
| Proyectos | Cuadrícula 2 × 2, bordes biselados y escalones pixelados; tarjetas más altas por rol, periodo y aporte. |

Capturas reales de producción para aprobación:

- [Escritorio 1440 px](review/phase-3/desktop.png)
- [Portátil 1280 px](review/phase-3/laptop.png)
- [Tablet 768 px](review/phase-3/tablet.png)
- [Móvil 390 px](review/phase-3/mobile.png)
- [Móvil 360 px](review/phase-3/mobile-360.png)
- [Móvil 320 px](review/phase-3/small-mobile.png)

Los PNG `header`, `hero`, `mascot`, `stack` y `projects` permiten inspeccionar regiones por separado.
`review/phase-3/capture-metadata.json` registra tamaños, navegador y hash del HTML capturado.

## Pruebas

Se mantienen las pruebas anteriores, actualizando únicamente las expectativas de la página temporal
para el contenido ahora implementado. Se añaden pruebas de relaciones de presentación, precisión
de fechas, integridad del PNG, contenido de tarjetas, anclas válidas y límites cerca de breakpoints.
La infraestructura y el registro editorial privado permanecen separados de la salida pública.

## Fase 3.1 — Pulido visual y responsive

- Problemas: espacio móvil excesivo alrededor del PNG transparente, CTA en dos filas a 360 px,
  metadatos y etiquetas pequeños, y poca diferenciación entre resumen y contribución.
- Cambios exclusivamente en CSS de `Hero`, `Sombra`, `SelectedWork`, `ProjectCard` y `TechTag`:
  rótulo junto al sprite, recuperación del margen transparente superior, CTA y ritmo vertical más
  compactos; metadatos/etiquetas a 14 px en pantallas estrechas, empresa destacada y separador de aportes.
  Sombra conserva la imagen completa a 192 × 208 px en móvil. No cambia contenido, iconos ni dependencias.
- Comparación visual de las cuatro capturas nuevas contra las anteriores: escritorio 1440 px idéntico
  píxel a píxel; tablet conserva composición y cuadrícula. Hero de 700→640 px a 390 px y 805,5→745,5 px
  a 320 px. A 360 px, comprobado en navegador, pasa de 783,3→663,3 px y los CTA quedan en una fila.
  Sin scroll horizontal, recortes del wordmark ni desbordamientos en tarjetas; contribuciones y todas
  las tecnologías permanecen visibles. Se mantienen teclado, foco y funcionamiento sin JS.
- Validación: lint PASS; format:check PASS; typecheck PASS; unitarias PASS (14); build PASS;
  E2E PASS (29, Chromium). El comando inicial `pnpm test:e2e` agotó el tiempo porque Vite detectó
  el servidor dev IPv6 existente en 4321. La suite intacta se reejecutó con un lanzador temporal externo:
  preview en 4324 y proxy IPv4 en el origen esperado 4321, sin alterar tests/configuración del proyecto
  ni detener el dev. Se cerraron preview y proxy al terminar.
- Capturas nuevas, sin sobrescribir las anteriores:
  [1440 px](review/phase-3.1/desktop.png), [768 px](review/phase-3.1/tablet.png),
  [390 px](review/phase-3.1/mobile.png), [320 px](review/phase-3.1/small-mobile.png).
  `review/phase-3.1/capture-metadata.json` incluye medidas de los cinco anchos y hash del HTML final.
- Pendiente: aprobación visual del propietario. No se inicia Fase 4 ni se añaden animaciones.
