'use client';

import { useTourFilters } from '@/hooks/useTourFilters';
import { sortedByText, tripsCount } from '@/lib/utils/resultsText';
import { EmptyResults } from '../EmptyResults/EmptyResults';
import { ResultsGrid } from '../ResultsGrid/ResultsGrid';
import { ResultsHeader } from '../ResultsHeader/ResultsHeader';
import type { TourResultsProps } from './TourResults.types';
import styles from './TourResults.module.css';

/**
 * The trips in the current view as cards, or, when none match, the empty state. After each change
 * the new count is announced. While a linked view is being applied the results stay hidden (their
 * space kept), so the full list built into the page never flashes first.
 */
export function TourResults({ copy, settings }: TourResultsProps) {
  const { filters, results, changes, clearAll, headingRef } = useTourFilters();
  const count = tripsCount(results.length, copy.results.count);
  // Every change is announced, even when the count stays the same (a no-break space makes the text differ).
  const announcement = changes === 0 ? '' : `${results.length === 0 ? copy.empty.headline : count}${changes % 2 ? ' ' : ''}`;

  function clearAndFocus() {
    clearAll();
    headingRef.current?.focus();
  }

  return (
    <section className={styles.results}>
      <ResultsHeader count={count} sortedBy={sortedByText(copy.results.sortedBy, copy.sorts[filters.sort])} headingRef={headingRef} />
      {results.length > 0 ? (
        <ResultsGrid results={results} settings={settings} />
      ) : (
        <EmptyResults copy={copy.empty} onClear={clearAndFocus} />
      )}
      <p role="status" className={styles.status}>
        {announcement}
      </p>
    </section>
  );
}
