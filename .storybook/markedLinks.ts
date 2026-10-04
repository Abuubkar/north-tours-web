/** The marked links inside `container`, e.g. ["Tours (page)"]. */
export const markedLinks = (container: HTMLElement) =>
  [...container.querySelectorAll('a[aria-current]')].map((link) => `${link.textContent} (${link.getAttribute('aria-current')})`);

/** Scrolls the page from the top to the bottom in steps, checking `check` at each step. */
export async function scrollThrough(check: () => Promise<void>, steps = 5) {
  const bottom = document.documentElement.scrollHeight - window.innerHeight;
  for (let i = 0; i <= steps; i++) {
    window.scrollTo({ top: (bottom * i) / steps, behavior: 'instant' });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await check();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}
