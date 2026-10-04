'use client';

import { useRef } from 'react';
import { TourCard } from '@/components/tour-card/TourCard/TourCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRiseOnView } from '@/hooks/useRiseOnView';
import { CARD_GRID_PHOTO_SIZES, NARROW_RESULTS_QUERY } from '@/lib/utils/tourFilters';
import type { CardListProps, ResultsGridProps } from './ResultsGrid.types';
import styles from './ResultsGrid.module.css';

/** The widest layout's first row (three columns): their photos load straight away, the rest lazily. */
const FIRST_ROW = 3;

/** Below 1100px the banner follows two cards (one row of two on tablets; as designed on phones). */
const NARROW_FIRST_ROW = 2;


/**
 * One run of cards. Cards below the fold rise once the view is ready (M4); a change of filter or
 * sort cancels any rise still waiting, so changing the view never moves a card.
 */
function CardList({ results, from, ready, changes, className, settings }: CardListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  useRiseOnView(listRef, ready, changes);

  return (
    <ul ref={listRef} className={className}>
      {results.map(({ tour, departure }, index) => (
        <li key={tour.slug} className={styles.cell}>
          <TourCard
            tour={tour}
            departure={departure}
            priority={from + index < FIRST_ROW}
            photoSizes={CARD_GRID_PHOTO_SIZES}
            settings={settings}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * The results as tour cards in one, two or three columns (below 820px, below 1100px, from
 * 1100px), with the banner after the first row: after three cards from 1100px, after two below
 * (the built page places it for the widest layout; on smaller screens it moves below the first
 * screen). Cards sit apart with gaps and no lines, so a short last row simply ends.
 */
export function ResultsGrid({ results, banner, ready, changes, settings }: ResultsGridProps) {
  const split = useMediaQuery(NARROW_RESULTS_QUERY) ? NARROW_FIRST_ROW : FIRST_ROW;
  const rest = results.slice(split);
  const list = { ready, changes, settings };

  return (
    <>
      <CardList {...list} results={results.slice(0, split)} from={0} className={styles.grid} />
      {banner}
      {rest.length > 0 && <CardList {...list} results={rest} from={split} className={styles.grid} />}
    </>
  );
}
