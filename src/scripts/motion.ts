export const REVEAL_STAGGER_MS = 60;
export const REVEAL_MAX_STEPS = 6;

export function revealDelay(index: number, staggerMs: number = REVEAL_STAGGER_MS): number {
  const step = Math.min(Math.max(index, 0), REVEAL_MAX_STEPS);
  return step * staggerMs;
}

const TARGETS = '[data-reveal], [data-reveal-wipe], [data-reveal-lines]';

declare global {
  interface Window {
    __greadMotionFallback?: ReturnType<typeof setTimeout>;
  }
}

export function initMotion(): void {
  const root = document.documentElement;
  // The head gate already decided. Bail out when motion is disallowed.
  if (!root.hasAttribute('data-motion')) return;

  // The engine is running, so the head gate no longer needs its safety net.
  if (window.__greadMotionFallback) {
    clearTimeout(window.__greadMotionFallback);
    delete window.__greadMotionFallback;
  }

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
