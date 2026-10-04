import { useCallback, useEffect, useRef, useState } from 'react';
import { helpAnswerHash } from '@/lib/routes';
import { answerForHash } from '@/lib/utils/helpAnswers';
import { replaceHash } from './replaceHash';

/**
 * Which Help answer is open, by id, and the address that follows it (PRD #86): `/help#refunds`
 * opens that answer on arrival, after hydration (the browser has already scrolled to it, as it
 * carries the id), and on a later `hashchange`; an unknown hash is ignored. Opening an answer
 * writes its link; closing the one the address names clears it.
 */
export function useAnswerHash(ids: readonly string[]) {
  const [openId, setOpenId] = useState<string | null>(null);
  const arrived = useRef(false);

  useEffect(() => {
    function openLinked() {
      const id = answerForHash(window.location.hash, ids);
      if (id !== null) setOpenId(id);
    }
    // On arrival once only: later, the hash only ever names the answer already open.
    if (!arrived.current) openLinked();
    arrived.current = true;
    window.addEventListener('hashchange', openLinked);
    return () => window.removeEventListener('hashchange', openLinked);
  }, [ids]);

  /** An answer opened or closed, by the visitor or by the one-open group closing it. */
  const toggled = useCallback((id: string, open: boolean) => {
    if (open) {
      setOpenId(id);
      replaceHash(helpAnswerHash(id));
      return;
    }
    setOpenId((current) => (current === id ? null : current));
    if (window.location.hash === helpAnswerHash(id)) replaceHash('');
  }, []);

  /** "Link to this answer": the answer stays open and the address shows its link, with no history entry. */
  const linkTo = useCallback((id: string) => {
    setOpenId(id);
    replaceHash(helpAnswerHash(id));
  }, []);

  return { openId, toggled, linkTo };
}
