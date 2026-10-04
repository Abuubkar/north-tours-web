'use client';

import { useRef } from 'react';
import { useRiseOnView } from '@/hooks/useRiseOnView';
import { HighlightCard } from '../HighlightCard/HighlightCard';
import type { HighlightGridProps } from './HighlightGrid.types';
import styles from './HighlightGrid.module.css';

/** The highlights in a hairline grid of up to three columns; cards below the fold rise into view once (M4). */
export function HighlightGrid({ highlights }: HighlightGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  useRiseOnView(listRef);

  return (
    <ul ref={listRef} className={styles.grid}>
      {highlights.map((highlight) => (
        <li key={highlight.title} className={styles.cell}>
          <HighlightCard highlight={highlight} />
        </li>
      ))}
    </ul>
  );
}
