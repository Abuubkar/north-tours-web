'use client';

import { useToday } from '@/hooks/useToday';
import { sortedByText, tripsCount } from '@/lib/utils/resultsText';
import { tourResults } from '@/lib/utils/tourFilters';
import { ResultsGrid } from '../ResultsGrid/ResultsGrid';
import { ResultsHeader } from '../ResultsHeader/ResultsHeader';
import type { TourResultsProps } from './TourResults.types';
import styles from './TourResults.module.css';

/**
 * Every trip as a card, bookable first, then sold out, then those with no dates left, soonest
 * first within each. It renders as built, then checks again against today's date in the
 * browser, so a page built days ago never shows a trip that has already left.
 */
export function TourResults({ tours, builtOn, copy, settings }: TourResultsProps) {
  const results = tourResults(tours, useToday(builtOn));

  return (
    <section className={styles.results}>
      <ResultsHeader
        count={tripsCount(results.length, copy.results.count)}
        sortedBy={sortedByText(copy.results.sortedBy, copy.sorts.soonest)}
      />
      <ResultsGrid results={results} settings={settings} />
    </section>
  );
}
