import { getSombraFrame, jumpOffset, SombraSequence, sombraAtlas } from '../lib/sombra.ts';

const controllers = new WeakMap<HTMLElement, () => void>();

export function initSombra(root: HTMLElement) {
  const existing = controllers.get(root);
  if (existing) return existing;
  const visual = root.querySelector<HTMLElement>('.sombra-visual');
  const sprite = root.querySelector<HTMLElement>('.sombra-atlas');
  const hero = root.closest<HTMLElement>('.hero');
  if (!visual || !sprite || !hero) return;

  const abort = new AbortController();
  const signal = abort.signal;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sequence = new SombraSequence();
  let timer: number | undefined;
  let dueAt = 0;
  let remaining = sequence.duration;
  let active = false;
  let ready = false;
  let requested = false;
  let unavailable = false;
  let visible = false;
  let heroVisible = false;
  let pageHidden = false;
  let disposed = false;
  let scale = 1;
  let clearance = 0;
  let image: HTMLImageElement | undefined;

  function freeze() {
    if (timer === undefined) return;
    remaining = Math.max(0, dueAt - performance.now());
    clearTimeout(timer);
    timer = undefined;
  }

  function paint() {
    if (disposed || !sprite) return;
    const frame = sequence.frame;
    const source = getSombraFrame(frame);
    const jumpY = frame.animation === 'jumping' ? jumpOffset(frame.index, clearance) : 0;
    sprite.style.backgroundPosition = source.backgroundPosition;
    // Absolute, non-accumulating Y only; floor keeps opaque pixels inside the cell.
    sprite.style.transform = `translateY(${Math.floor(jumpY * scale)}px)`;
    root.toggleAttribute('data-animating', ready && !reduced.matches);
    root.dataset.animation = frame.animation;
    root.dataset.frame = String(frame.index);
    root.dataset.stage = sequence.stage.name;
    root.dataset.cycles = String(sequence.completedCycles);
    root.dataset.playback = reduced.matches
      ? 'reduced'
      : unavailable
        ? 'unavailable'
        : active
          ? 'playing'
          : 'suspended';
    // Render evidence only; no input events, live region or animation triggers.
    root.dispatchEvent(
      new CustomEvent('sombra:frame', {
        bubbles: true,
        detail: {
          animation: frame.animation,
          index: frame.index,
          stage: sequence.stage.name,
          cycle: sequence.completedCycles,
          x: source.x,
          y: source.y,
          offset: 0,
          jumpY,
          duration: sequence.duration,
          playback: root.dataset.playback,
          at: performance.now(),
        },
      }),
    );
  }

  function arm() {
    if (disposed || !active || timer !== undefined) return;
    dueAt = performance.now() + remaining;
    timer = window.setTimeout(() => {
      timer = undefined;
      sequence.advance();
      remaining = sequence.duration;
      paint();
      arm();
    }, remaining);
  }

  function measure() {
    if (disposed || !visual || !hero) return;
    const box = visual.getBoundingClientRect();
    scale = box.width / sombraAtlas.cellWidth;
    clearance = 0;
    // Keep the restored card and CTA in place. Fit only the jump's transparent
    // headroom to their measured bounds, without altering the resting composition.
    for (const obstacle of [
      root.querySelector('figcaption'),
      hero.querySelector('.hero-actions'),
    ]) {
      const rect = obstacle?.getBoundingClientRect();
      if (!rect || rect.right <= box.left + 32 * scale || rect.left >= box.left + 159 * scale)
        continue;
      clearance = Math.max(clearance, Math.ceil((rect.bottom + 8 - box.top) / scale));
    }
    paint();
  }

  function syncEnvironment() {
    if (disposed || !sprite) return;
    const shouldPlay =
      ready && visible && heroVisible && !reduced.matches && !document.hidden && !pageHidden;
    if (active && !shouldPlay) freeze();
    active = shouldPlay;
    paint();
    arm();
    if (
      !requested &&
      visible &&
      heroVisible &&
      !reduced.matches &&
      !document.hidden &&
      !pageHidden
    ) {
      requested = true;
      image = new Image();
      image.src = sombraAtlas.src;
      void image
        .decode()
        .then(() => {
          if (disposed || !image) return;
          if (
            image.naturalWidth !== sombraAtlas.width ||
            image.naturalHeight !== sombraAtlas.height
          )
            throw new Error('Unexpected Sombra atlas dimensions');
          sprite.style.backgroundImage = `url("${sombraAtlas.src}")`;
          ready = true;
          measure();
          syncEnvironment();
        })
        .catch(() => {
          if (!disposed) {
            unavailable = true;
            paint();
          }
        });
    }
  }

  reduced.addEventListener('change', syncEnvironment, { signal });
  document.addEventListener('visibilitychange', syncEnvironment, { signal });
  window.addEventListener(
    'pagehide',
    (event) => {
      if (!event.persisted) {
        dispose();
        return;
      }
      pageHidden = true;
      syncEnvironment();
    },
    { signal },
  );
  window.addEventListener(
    'pageshow',
    () => {
      pageHidden = false;
      syncEnvironment();
    },
    { signal },
  );
  document.addEventListener('astro:before-swap', () => dispose(), { signal, once: true });

  const observer =
    'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.target === hero) heroVisible = entry.isIntersecting;
            if (entry.target === visual) visible = entry.isIntersecting;
          }
          syncEnvironment();
        })
      : undefined;
  observer?.observe(hero);
  observer?.observe(visual);
  const resize = 'ResizeObserver' in window ? new ResizeObserver(measure) : undefined;
  resize?.observe(visual);
  if (!resize) window.addEventListener('resize', measure, { signal, passive: true });
  if (!observer) unavailable = true;
  // Font completion may change the card/CTA bounds without resizing the atlas box.
  void document.fonts.ready.then(() => {
    if (!disposed) measure();
  });

  function dispose() {
    if (disposed) return;
    freeze();
    active = false;
    disposed = true;
    abort.abort();
    observer?.disconnect();
    resize?.disconnect();
    image?.removeAttribute('src');
    image = undefined;
    controllers.delete(root);
    root.dataset.playback = 'disposed';
    root.removeAttribute('data-animating');
  }
  controllers.set(root, dispose);
  measure();
  syncEnvironment();
  return dispose;
}
