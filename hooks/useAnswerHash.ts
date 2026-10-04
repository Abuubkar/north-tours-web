import { useCallback, useEffect, useState } from 'react';
import { answerForHash } from '@/lib/utils/helpAnswers';

/**
 * Writes the open answer into the address bar, or clears it (path and search kept), with
 * `replaceState`: no history entries, so Back leaves the page, and a reload after closing shows
 * the plain page.
 */
function writeHash(id: string | null) {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, '', `${pathname}${search}${id === null ? '' : `#${id}`}`);
}

/**
 * Which Help answer is open, by id, and the address that follows it (PRD #86): `/help#refunds`
 * opens that answer on arrival, after hydration (the browser has already scrolled to it, as it
 * carries the id), and on a later `hashchange`; an unknown hash is ignored. Opening an answer
 * writes its link; closing the one the address names clears it.
 */
export function useAnswerHash(ids: readonly string[]) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    function openLinked() {
      const id = answerForHash(window.location.hash, ids);
      if (id !== null) setOpenId(id);
    }
    openLinked();
    window.addEventListener('hashchange', openLinked);
    return () => window.removeEventListener('hashchange', openLinked);
  }, [ids]);

  /** An answer opened or closed, by the visitor or by the one-open group closing it. */
  const toggled = useCallback((id: string, open: boolean) => {
    if (open) {
      setOpenId(id);
      writeHash(id);
      return;
    }
    setOpenId((current) => (current === id ? null : current));
    if (window.location.hash === `#${id}`) writeHash(null);
  }, []);

  /** "Link to this answer": the answer stays open and the address shows its link, with no history entry. */
  const linkTo = useCallback((id: string) => {
    setOpenId(id);
    writeHash(id);
  }, []);

  return { openId, toggled, linkTo };
}
