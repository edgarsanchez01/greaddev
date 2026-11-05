export function initMobileNavigation(menu: HTMLDetailsElement) {
  const summary = menu.querySelector<HTMLElement>('summary');
  const wide = window.matchMedia('(min-width: 64rem)');
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    event.preventDefault();
    menu.open = false;
    summary?.focus();
  });
  menu.addEventListener('click', (event) => {
    const anchor =
      event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a') : null;
    if (!anchor) return;
    menu.open = false;
    if (anchor.hash && anchor.origin === location.origin && anchor.pathname === location.pathname) {
      // Keep the browser's anchor/history behavior, then move keyboard focus out of the closed menu.
      requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
        if (!target) return;
        if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      });
    }
  });
  wide.addEventListener('change', () => {
    if (!wide.matches) return;
    if (menu.contains(document.activeElement)) {
      menu
        .closest('header')
        ?.querySelector<HTMLAnchorElement>('.brand')
        ?.focus({ preventScroll: true });
    }
    menu.open = false;
  });
}
