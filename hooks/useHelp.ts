import { createContext, use, useCallback, useMemo } from 'react';
import type { HelpCategory } from '@/lib/utils/helpAnswers';
import { useAnswerHash } from './useAnswerHash';
import { useHelpSearch } from './useHelpSearch';

/**
 * The Help page's answers in the browser (PRD #86): the search and its matches, and which answers
 * are open. While searching, every match is open until the visitor closes it; otherwise one
 * answer at a time, the one the address names (useAnswerHash). Clearing the search leaves that
 * one open.
 */
export function useHelpState(categories: readonly HelpCategory[]) {
  const search = useHelpSearch(categories);
  const ids = useMemo(() => categories.flatMap(({ questions }) => questions.map((q) => q.id)), [categories]);
  const { openId, toggled: toggledAnswer, linkTo } = useAnswerHash(ids);
  const { searching, matching, closedMatches, toggledMatch } = search;

  const openIds = useMemo<ReadonlySet<string>>(() => {
    if (searching) return new Set([...matching].filter((id) => !closedMatches.has(id)));
    return new Set(openId === null ? [] : [openId]);
  }, [searching, matching, closedMatches, openId]);

  /** An answer opened or closed: a match while searching, otherwise the address follows it. */
  const toggled = useCallback(
    (id: string, open: boolean) => (searching ? toggledMatch(id, open) : toggledAnswer(id, open)),
    [searching, toggledMatch, toggledAnswer],
  );

  return { categories, ...search, openIds, toggled, linkTo };
}

export type HelpState = ReturnType<typeof useHelpState>;

export const HelpContext = createContext<HelpState | null>(null);

/** The Help page's state from the nearest `HelpProvider`. */
export function useHelp(): HelpState {
  const state = use(HelpContext);
  if (!state) throw new Error('useHelp needs a HelpProvider above it');
  return state;
}
