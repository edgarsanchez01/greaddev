# Diseño — Motion al scroll (GreadDev)

Fecha: 2026-11-19
Estado: aprobado por el dueño el 2026-11-19
Alcance: pequeño (capa de movimiento sobre la página existente)

## Intención

La página se siente plana al recorrerla: no hay ninguna animación de entrada y todo el
contenido aparece de golpe. El objetivo es añadir movimiento editorial que haga la lectura
más viva, **sin tocar composición, color, tipografía, contenido ni estructura**.

Segunda intención declarada por el dueño: que no parezca "plantilla estática", sino una
página cuidada. La referencia mental es el feel de Framer Motion, no un carrusel de efectos.

## Objetivos

- Reveals de entrada legibles: opacidad 0→1 + desplazamiento vertical de 16px.
- Tratamiento propio (máscara) para los títulos grandes: wordmark del Hero y titulares de
  sección numerados.
- Cascadas cortas en colecciones: proyectos, experiencia, stack, certificados, contacto.
- Hero con entrada escalonada ≤ 900 ms (límite del Design System).
- Respeto total a `prefers-reduced-motion: reduce`.
- Cero desplazamiento de layout (CLS 0): solo `opacity`, `transform` y `clip-path`.

## No objetivos

- No cambiar ningún valor visual en reposo (mismo layout, mismos colores).
- No parallax, no scroll hijacking, no marquees, no sticky/compact header, no scroll-spy.
- No animar contenido a demanda (acordeones ya existentes se quedan como están).
- No nuevas dependencias.

## Anti-objetivos (harían fallar el trabajo)

- Que el contenido quede invisible si el JS falla, se bloquea o el usuario navega sin JS.
- Que haya flash de contenido (FOUC) al cargar.
- Que el movimiento retrase la lectura o robe foco a los proyectos.

## Restricciones

- Astro estático sin islas React; el proyecto no tiene ninguna librería de animación.
- `AGENTS.md`: evitar dependencias que no reduzcan complejidad de forma material.
- `Design-System.md` §10: reveal 450–700 ms, y 12–24 px, stagger 40–80 ms, easing único
  (`--ease-standard` ya definido), hero ≤ 900 ms, y con movimiento reducido se eliminan los
  reveals conservando los cambios de estado inmediatos.
- Los e2e auditan la página con `reducedMotion: 'reduce'`; ese camino debe quedar impecable.

## Enfoques considerados

1. **IntersectionObserver propio + transiciones CSS (elegido).** ~1.5 KB, sin dependencias,
   control exacto del stagger y del fallback. Encaja con un sitio estático de una sola página.
2. **Motion One (`motion`).** Curvas spring y API declarativa, pero añade 10–18 KB y una
   dependencia para un efecto que CSS ya resuelve; además complica el fallback sin JS.
3. **`animation-timeline: view()` solo CSS.** 0 JS y muy performante, pero el soporte entre
   navegadores no es uniforme: requiere un fallback que acaba siendo el enfoque 1, así que
   suma complejidad sin quitar la implementación.

Se eligió el enfoque 1 porque el Design System ya especifica la animación exacta y el
proyecto prioriza peso y robustez sobre expresividad de física.

## Diseño

### Contrato de mejora progresiva

- Un `<script is:inline>` mínimo en `<head>` (antes del primer paint) pone
  `data-motion="on"` en `<html>` **solo si** existe `IntersectionObserver` y el usuario no
  pidió movimiento reducido. Evita el flash: los estados iniciales se aplican desde el
  primer frame.
- Todo el CSS de reveal cuelga de `html[data-motion='on']`. Sin JS, sin soporte o con
  movimiento reducido, la página se ve exactamente como hoy (sin estados ocultos).
- `src/scripts/reveal.ts` observa los elementos una sola vez, revela y deja de observar.
- Si el usuario activa "reducir movimiento" en caliente, el listener de `matchMedia` quita
  `data-motion` y todo queda visible de inmediato.

### Atributos declarativos

- `data-reveal` — el elemento entra con fade + 16px de subida.
- `data-reveal-group` — contenedor cuyos hijos directos con `data-reveal` reciben un retardo
  escalonado (60 ms, tope de 6 pasos para no acumular esperas).
- `data-reveal-mask` — variante de titular: `clip-path` de abajo arriba + subida corta.
- El retardo por elemento se escribe como `--reveal-delay` inline desde el script, nunca
  hardcodeado en cada componente.

### Qué se anima

| Zona                              | Tratamiento                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| Hero                              | Cascada de entrada: eyebrow, wordmark (máscara), nombre, rol, resumen, acciones, Sombra |
| SectionHeading (`[0X]` + titular) | Índice primero; cada línea del H2 sube detrás de una máscara                            |
| PrimaryStack                      | Logos en cascada de 40 ms                                                               |
| SelectedWork                      | Intro + contador, luego tarjetas de proyecto escalonadas 80 ms                          |
| Experience                        | Cada fila entra; columna identidad y detalle con 50 ms entre sí                         |
| Stack                             | Cada categoría entra escalonada 50 ms                                                   |
| About                             | Bloque de identidad, copia y `dl` escalonados                                           |
| Education                         | Entradas escalonadas                                                                    |
| Certifications                    | Filas escalonadas con tope de 6 pasos                                                   |
| Contact                           | Titular, copia y botón; enlaces de contacto escalonados                                 |
| Footer                            | Fade simple                                                                             |

### Ajuste de `SectionHeading`

Para poder enmascarar por línea, el `<br>` pasa a dos bloques (`span.line`, separados por un
espacio literal para conservar el nombre accesible). El wipe se hace con `clip-path` por
línea, con un desfase de 80 ms entre ellas. Es visualmente idéntico, no altera el salto de
línea existente y los lectores de pantalla siguen leyendo el titular continuo. Al terminar
la animación el `clip-path` queda en `inset(0 0 0 0)`, así que no se recortan descendentes
como la "p" de "profesional".

### Movimiento reducido

- El gate del script deja la página sin estados ocultos.
- El bloque global existente de `prefers-reduced-motion` se mantiene como segunda red.
- No se añade ninguna animación infinita; nada depende del scroll continuo.

### Accesibilidad

- Nada se oculta a tecnologías de asistencia: solo `opacity`/`transform`/`clip-path`.
- `focusin` revela de inmediato el elemento enfocado, para que el tabulador nunca llegue a
  algo transparente.
- Sin `aria-hidden` nuevos ni cambios de orden de lectura.

### Verificación

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.
- Unit: helper puro de cálculo de retardos (tope de stagger).
- E2E nuevo: con movimiento permitido el `<html>` lleva `data-motion="on"` y un bloque
  bajo el fold pasa de opacidad 0 a 1 al hacer scroll; con `reducedMotion: 'reduce'` no hay
  `data-motion` y todo es visible desde el inicio.
- Revisión manual: 360 / 768 / 1440, teclado, sin JS (DevTools), movimiento reducido.

## Decisiones tomadas por el agente

- Una sola pasada de reveal (no se revierte al subir) para evitar parpadeo al hacer scroll
  inverso.
- Stagger con tope: colecciones largas no acumulan más de ~360 ms de espera.
- El Hero usa el mismo mecanismo que el resto (el observer dispara al estar en viewport),
  lo que evita un segundo sistema de animación.

## Queda a criterio del implementador

- Nombres finales de los helpers y estructura interna de `reveal.ts`.
- Umbral exacto del observer (`rootMargin`), dentro del rango razonable para que el reveal
  ocurra cuando el bloque ya asoma.
