import type { PlannerProgressProps } from './PlannerProgress.types';
import styles from './PlannerProgress.module.css';

const SEGMENTS = [1, 2, 3];

/**
 * Where the visitor is: an <h2> naming the step, announced politely when it changes and focused
 * after a step change, over three 2px segments (decorative: the heading says it).
 */
export function PlannerProgress({ text, filled, ref }: PlannerProgressProps) {
  return (
    <div className={styles.progress}>
      <h2 ref={ref} tabIndex={-1} aria-live="polite" className={styles.heading}>
        {text}
      </h2>
      <div className={styles.segments} aria-hidden="true">
        {SEGMENTS.map((segment) => (
          <span key={segment} className={`${styles.segment} ${segment <= filled ? styles.lit : ''}`} />
        ))}
      </div>
    </div>
  );
}
