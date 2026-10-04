import type { PlannerProgressProps } from './PlannerProgress.types';
import styles from './PlannerProgress.module.css';

/**
 * Where the visitor is: an <h2> naming the step, announced politely when it changes and focused
 * after a step change, over three 2px segments (decorative: the heading says it).
 */
export function PlannerProgress({ text, total, filled, ref }: PlannerProgressProps) {
  return (
    <div className={styles.progress}>
      <h2 ref={ref} tabIndex={-1} aria-live="polite" className={styles.heading}>
        {text}
      </h2>
      <div className={styles.segments} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`${styles.segment} ${i < filled ? styles.lit : ''}`} />
        ))}
      </div>
    </div>
  );
}
