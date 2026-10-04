/**
 * Puts `hash` in the address bar ("#refunds"), or clears it with '' (path and search kept), with
 * `replaceState`: no history entry, so Back leaves the page, and a reload after clearing shows
 * the plain page. Shared by the hooks whose state the address follows (About's profiles, Help's answers).
 */
export function replaceHash(hash: string): void {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, '', `${pathname}${search}${hash}`);
}
