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
  const [query, setQuery] = useState('');
  const [settledQuery, setSettledQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSettledQuery(query), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [query]);

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
        const ids = new Set(current.key === termsKey ? current.ids : NONE);
        if (open) ids.delete(id);
        else ids.add(id);
        return { key: termsKey, ids };
      });
    },
    [termsKey],
  );

  /** "Clear search" and Escape: back to every answer, focus in the field. */
  const clear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  return {
    query,
    setQuery,
    /** The query as it was when typing last stopped (none once cleared). */
    settledQuery: query === '' ? '' : settledQuery,
    terms,
    searching: terms.length > 0,
    matching,
    closedMatches,
    toggledMatch,
    clear,
    inputRef,
  };
}
