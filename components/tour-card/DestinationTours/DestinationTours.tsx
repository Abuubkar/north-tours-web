'use client';

import { useRef } from 'react';
import { useRiseOnView } from '@/hooks/useRiseOnView';
import { useToday } from '@/hooks/useToday';
import { tourCards } from '@/lib/utils/destination';
import { CARD_GRID_PHOTO_SIZES } from '@/lib/utils/tourFilters';
import { SeeAllToursCell } from '../SeeAllToursCell/SeeAllToursCell';
import { TourCard } from '../TourCard/TourCard';
import type { DestinationToursProps } from './DestinationTours.types';
import styles from './DestinationTours.module.css';

/**
 * Every tour that visits a destination as a card, in the Tours page's order, then a cell that
 * opens Tours filtered to it. Cards show the date the shared rule picks (lib/utils/destination
 * `tourCards`), checked again in the browser so a page built days ago never shows a trip that
 * has left. Gaps between the cards and no lines, so a short last row ends cleanly; cards below
 * the fold rise (M4), the see-all cell doesn't.
 */
export function DestinationTours({ tours, builtOn, seeAll, settings }: DestinationToursProps) {
  const listRef = useRef<HTMLUListElement>(null);
  useRiseOnView(listRef);
  const cards = tourCards(tours, useToday(builtOn));

  return (
    <ul ref={listRef} className={styles.grid}>
      {cards.map(({ tour, departure }) => (
        <li key={tour.slug} className={styles.cell}>
          <TourCard tour={tour} departure={departure} photoSizes={CARD_GRID_PHOTO_SIZES} settings={settings} />
        </li>
      ))}
      <li className={styles.seeAll}>
        <SeeAllToursCell {...seeAll} />
      </li>
    </ul>
  );
}
