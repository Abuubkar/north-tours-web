import type { ResultsHeaderProps } from './ResultsHeader.types';
import styles from './ResultsHeader.module.css';

/**
 * The results' heading, "8 trips" (an <h2>, so the cards' <h3>s sit under it), and how they're
 * sorted. Below 820px the mobile filter bar shows the count, so the heading is only read out.
 */
export function ResultsHeader({ count, sortedBy, headingRef }: ResultsHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 ref={headingRef} tabIndex={-1} className={styles.count}>
        {count}
      </h2>
      <p className={styles.sortedBy}>{sortedBy}</p>
    </div>
  );
}
