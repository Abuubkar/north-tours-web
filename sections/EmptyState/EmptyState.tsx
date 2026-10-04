import type { EmptyStateProps } from './EmptyState.types';
import styles from './EmptyState.module.css';

/**
 * When nothing matches (Tours' filters, Help's search): the fixed headline as an <h2>, a lead,
 * and a way back and a way on, between hairlines in place of the results.
 */
export function EmptyState({ headline, lead, actions }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <h2 className={styles.headline}>{headline}</h2>
      <p className={styles.lead}>{lead}</p>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
