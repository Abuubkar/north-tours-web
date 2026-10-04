/** The marked links inside `container`, e.g. ["Tours (page)"]. */
export const markedLinks = (container: HTMLElement) =>
  [...container.querySelectorAll('a[aria-current]')].map((link) => `${link.textContent} (${link.getAttribute('aria-current')})`);

/** Story parameters for a component that reads the path (`usePathname`), as if on `pathname`. */
export const onPath = (pathname: string) => ({ nextjs: { appDirectory: true, navigation: { pathname } } });
