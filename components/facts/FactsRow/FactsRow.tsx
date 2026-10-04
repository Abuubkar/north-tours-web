import type { FactsRowProps } from './FactsRow.types';
import styles from './FactsRow.module.css';

/**
 * The facts under a photo hero's title, e.g. Duration, Rating, from and Next departure: a
 * capped grid of up to four, over a faint rule, wrapping to two columns on phones.
 */
export function FactsRow({ children }: FactsRowProps) {
  return <dl className={styles.row}>{children}</dl>;
}
