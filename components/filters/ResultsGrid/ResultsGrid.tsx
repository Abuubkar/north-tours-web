import { TourCard } from '@/components/tour-card/TourCard/TourCard';
import type { ResultsGridProps } from './ResultsGrid.types';
import styles from './ResultsGrid.module.css';

/** The widest layout's first row (three columns): their photos load straight away, the rest lazily. */
const FIRST_ROW = 3;

/**
 * The results as tour cards in one, two or three columns (below 820px, below 1100px, from
 * 1100px). Each card draws its own hairlines, so a short last row simply ends (docs/components.md
 * §5 item 27).
 */
export function ResultsGrid({ results, settings }: ResultsGridProps) {
  return (
    <ul className={styles.grid}>
      {results.map(({ tour, departure }, index) => (
        <li key={tour.slug} className={styles.cell}>
          <TourCard tour={tour} departure={departure} priority={index < FIRST_ROW} settings={settings} />
        </li>
      ))}
    </ul>
  );
}
