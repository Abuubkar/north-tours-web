import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HelpCategory } from '@/lib/utils/helpAnswers';
import { matchingAnswers, searchTerms } from '@/lib/utils/helpSearch';

/** How long after the last key the result line settles, so a screen reader hears the count once. */
const SETTLE_MS = 400;

const NONE: ReadonlySet<string> = new Set();

/**
 * Help's search (PRD #86), in the browser: the query, the answers that match it and those of
 * them the visitor has closed. While it has terms every match is open, until the visitor closes
 * one. `settledQuery` follows the query 400ms after typing stops, for the polite result line.
 * Nothing goes in the URL.
 */
export function useHelpSearch(categories: readonly HelpCategory[]) {
  const [query, setTypedQuery] = useState('');
  const [settledQuery, setSettledQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSettledQuery(query), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  /** A new query; an empty one forgets the settled one too, so the next search never announces an old count. */
  const setQuery = useCallback((next: string) => {
    setTypedQuery(next);
    if (next === '') setSettledQuery('');
  }, []);

  const terms = useMemo(() => searchTerms(query), [query]);
  const termsKey = terms.join(' ');
  const matching = useMemo(() => matchingAnswers(categories, terms), [categories, terms]);

  // Matches the visitor closed during this search; a new search opens every match again.
  const [closed, setClosed] = useState<{ key: string; ids: ReadonlySet<string> }>({ key: '', ids: NONE });
  const closedMatches = closed.key === termsKey ? closed.ids : NONE;

  /** A match opened or closed while searching. */
  const toggledMatch = useCallback(
    (id: string, open: boolean) => {
      setClosed((current) => {
        const ids = current.key === termsKey ? current.ids : NONE;
        // The search opening its matches fires a toggle for each: nothing changes, so no re-render.
        if (ids.has(id) !== open) return current;
        const next = new Set(ids);
        if (open) next.delete(id);
        else next.add(id);
        return { key: termsKey, ids: next };
      });
    },
    [termsKey],
  );

  /** "Clear search" and Escape: back to every answer, focus in the field. */
  const clear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery]);

  /** How many answers match the settled query, for the result line. */
  const settledTerms = useMemo(() => searchTerms(settledQuery), [settledQuery]);
  const settledCount = useMemo(() => matchingAnswers(categories, settledTerms).size, [categories, settledTerms]);

  return {
    query,
    setQuery,
    /** The query as it was when typing last stopped (none once cleared), and how many answers it matches. */
    settledQuery,
    settledSearching: settledTerms.length > 0,
    settledCount,
    terms,
    searching: terms.length > 0,
    matching,
    closedMatches,
    toggledMatch,
    clear,
    inputRef,
  };
}
