'use client';

import { Button } from '@/components/ui/Button/Button';
import { useTourFilters } from '@/hooks/useTourFilters';
import { routes } from '@/lib/routes';
import { sortedByText, tripsCount } from '@/lib/utils/resultsText';
import { EmptyState } from '@/sections/EmptyState/EmptyState';
import { ActiveFilterChips } from '../ActiveFilterChips/ActiveFilterChips';
import { ResultsGrid } from '../ResultsGrid/ResultsGrid';
import { ResultsHeader } from '../ResultsHeader/ResultsHeader';
import type { TourResultsProps } from './TourResults.types';
import styles from './TourResults.module.css';

/**
 * The trips in the current view as cards, or, when none match, the empty state; below 820px the
 * picked filters show above them as chips. After each change
 * the new count is announced. While a linked view is being applied the results stay hidden (their
 * space kept), so the full list built into the page never flashes first.
 */
export function TourResults({ copy, labels, settings, banner }: TourResultsProps) {
  const { filters, results, ready, changes, clearAll, headingRef, focusResults } = useTourFilters();
  const count = tripsCount(results.length, copy.results.count);
  // Every change is announced, even when the count stays the same (a no-break space makes the text differ).
  const announcement = changes === 0 ? '' : `${results.length === 0 ? copy.empty.headline : count}${changes % 2 ? ' ' : ''}`;

  function clearAndFocus() {
    clearAll();
    focusResults();
  }

  return (
    <section className={styles.results}>
      <ResultsHeader count={count} sortedBy={sortedByText(copy.results.sortedBy, copy.sorts[filters.sort])} headingRef={headingRef} />
      <div className={styles.chips}>
        <ActiveFilterChips labels={labels} clearLabel={copy.filters.clearAll} />
      </div>
      {results.length > 0 ? (
        <ResultsGrid results={results} banner={banner} ready={ready} changes={changes} settings={settings} />
      ) : (
        <EmptyState
          headline={copy.empty.headline}
          lead={copy.empty.lead}
          actions={
            <>
              {/* "Clear all filters" keeps the sort; "Plan a private trip" goes to the planner. */}
              <Button onClick={clearAndFocus}>{copy.empty.clearLabel}</Button>
              <Button href={routes.plan} variant="secondary">
                {copy.empty.planLabel}
              </Button>
            </>
          }
        />
      )}
      <p role="status" className={styles.status}>
        {announcement}
      </p>
    </section>
  );
}
