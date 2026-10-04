import { useCallback, useEffect, useRef, useState } from 'react';
import { guideAnchor } from '@/lib/routes';
import { guideForHash, steppedIndex } from '@/lib/utils/guideProfile';

/**
 * Writes the profile shown into the address bar, or clears it (path and search kept), with
 * `replaceState`: no history entries, so Back leaves the page, and a reload after closing shows
 * the plain page.
 */
function writeHash(slug: string | null) {
  const { pathname, search } = window.location;
  const hash = slug === null ? '' : `#${guideAnchor(slug)}`;
  window.history.replaceState(window.history.state, '', `${pathname}${search}${hash}`);
}

/**
 * Which guide's profile is shown on About (PRD #78), by their place in `slugs` (the grid's
 * order), or null while none is. Previous and next step through the team, wrapping at both ends;
 * `stepped` says the visitor has moved on from the guide they opened, so the new one is announced.
 *
 * The address follows the profile (`/about#guide-karim-baig`): a guide's anchor opens their
 * profile on arrival, after hydration (the browser has already scrolled to the card, which
 * carries the id), and on a later `hashchange`. A profile a card opened returns focus to that
 * card when it closes (the dialog does that); one a link opened has no card behind it, so focus
 * goes to the card of the guide shown last.
 */
export function useGuideProfile(slugs: readonly string[]) {
  const [shown, setShown] = useState<number | null>(null);
  const [stepped, setStepped] = useState(false);
  const fromLink = useRef(false);

  const show = useCallback(
    (index: number, byLink: boolean) => {
      fromLink.current = byLink;
      setShown(index);
      setStepped(false);
      writeHash(slugs[index]);
    },
    [slugs],
  );

  useEffect(() => {
    function showLinked() {
      const slug = guideForHash(window.location.hash, slugs);
      if (slug !== null) show(slugs.indexOf(slug), true);
    }
    showLinked();
    window.addEventListener('hashchange', showLinked);
    return () => window.removeEventListener('hashchange', showLinked);
  }, [slugs, show]);

  const open = useCallback((index: number) => show(index, false), [show]);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (shown === null) return;
      const next = steppedIndex(shown, direction, slugs.length);
      setShown(next);
      setStepped(true);
      writeHash(slugs[next]);
    },
    [shown, slugs],
  );

  const close = useCallback(() => {
    setShown(null);
    setStepped(false);
    writeHash(null);
    // After the dialog has put focus back where it was: for a link, there's no card there.
    if (fromLink.current && shown !== null) document.getElementById(guideAnchor(slugs[shown]))?.focus();
  }, [shown, slugs]);

  return { shown, stepped, open, step, close };
}
