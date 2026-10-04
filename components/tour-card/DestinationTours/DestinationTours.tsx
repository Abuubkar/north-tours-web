'use client';

import { useRef } from 'react';
import { useRiseOnView } from '@/hooks/useRiseOnView';
import { useToday } from '@/hooks/useToday';
import { tourCards } from '@/lib/utils/destination';
import { SeeAllToursCell } from '../SeeAllToursCell/SeeAllToursCell';
import { TourCard } from '../TourCard/TourCard';
import type { DestinationToursProps } from './DestinationTours.types';
import styles from './DestinationTours.module.css';

/** Each photo's width in one, two or three columns (below 820px, below 1100px, from 1100px). */
const PHOTO_SIZES = '(width >= 1100px) 33vw, (width >= 820px) 50vw, 100vw';

/**
 * Every tour that visits a destination as a card, in the Tours page's order, then a cell that
 * opens Tours filtered to it. Cards show the date the shared rule picks (lib/utils/destination
 * `tourCards`), checked again in the browser so a page built days ago never shows a trip that
 * has left. Per-card hairlines, so a short last row ends cleanly; cards below the fold rise (M4).
 */
export function DestinationTours({ tours, builtOn, seeAll, settings }: DestinationToursProps) {
  const listRef = useRef<HTMLUListElement>(null);
  useRiseOnView(listRef);
  const cards = tourCards(tours, useToday(builtOn));

  return (
    <ul ref={listRef} className={styles.grid}>
      {cards.map(({ tour, departure }) => (
        <li key={tour.slug} className={styles.cell}>
          <TourCard tour={tour} departure={departure} photoSizes={PHOTO_SIZES} settings={settings} />
        </li>
      ))}
      <li className={styles.cell}>
        <SeeAllToursCell {...seeAll} />
      </li>
    </ul>
  );
}
