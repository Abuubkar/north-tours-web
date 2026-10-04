/**
 * Puts a query in the page's URL for a story, as a shared link would (the Tours page reads its
 * view from it), and puts the URL back afterwards. Use as a story's `beforeEach`.
 */
export const atQuery = (search: string) => () => {
  const { href } = window.location;
  const { state } = window.history;
  window.history.replaceState(state, '', `${window.location.pathname}${search}`);
  return () => window.history.replaceState(state, '', href);
};

/**
 * Puts a hash in the page's URL for a story, as a link to `/about#guide-ali-raza` would, and
 * puts the URL back afterwards. Use as a story's `beforeEach`; '' starts from no hash.
 */
export const atHash = (hash: string) => () => {
  const { href, pathname, search } = window.location;
  const { state } = window.history;
  window.history.replaceState(state, '', `${pathname}${search}${hash}`);
  return () => window.history.replaceState(state, '', href);
};

/**
 * Lets a story follow in-page links (`href="#…"`). A link navigation ends the Vitest browser
 * session, so each click on one is replayed as the same fragment navigation through
 * `location.hash`, after the click's handlers have run, as the browser would. Use as a story's
 * `beforeEach`; it stops listening afterwards.
 */
export const followHashLinks = () => {
  const follow = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    setTimeout(() => {
      location.hash = link.getAttribute('href')!;
    });
  };
  window.addEventListener('click', follow, true);
  return () => window.removeEventListener('click', follow, true);
};
