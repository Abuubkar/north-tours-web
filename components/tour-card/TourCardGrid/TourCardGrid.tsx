'use client';

import { useRef } from 'react';
import { useRiseOnView } from '@/hooks/useRiseOnView';
import { TourCard } from '../TourCard/TourCard';
import type { TourCardGridProps } from './TourCardGrid.types';
import styles from './TourCardGrid.module.css';

const columnsClass = { 3: styles.threeColumns, 4: styles.fourColumns };

/** Tour cards in a hairline grid; cards below the fold rise into place the first time they're seen (M4). */
export function TourCardGrid({ cards, maxColumns, settings }: TourCardGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  useRiseOnView(listRef);

  return (
    <ul ref={listRef} className={`${styles.grid} ${columnsClass[maxColumns]}`}>
      {cards.map(({ tour, departure }) => (
        <li key={tour.slug} className={styles.cell}>
          <TourCard tour={tour} departure={departure} settings={settings} />
        </li>
      ))}
    </ul>
  );
}
