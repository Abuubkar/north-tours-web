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
