import { Accordion } from '@/components/ui/Accordion/Accordion';
import { TripSummaryRows } from '../TripSummaryRows/TripSummaryRows';
import type { PlannerSummaryBarProps } from './PlannerSummaryBar.types';
import styles from './PlannerSummaryBar.module.css';

/**
 * Below 1100px, under the header: the trip in one line, opening (a `<details>` caret row) to the
 * nine rows, with the progress under it. Light frosted, like the progress bar from 1100px.
 */
export function PlannerSummaryBar({ label, copy, children, ref, className }: PlannerSummaryBarProps) {
  return (
    <div ref={ref} className={[styles.bar, className].filter(Boolean).join(' ')}>
      <div className={styles.summary}>
        <Accordion
          size="compact"
          marker="caret"
          items={[{ id: 'trip', summary: label, content: <div className={styles.rows}><TripSummaryRows copy={copy} /></div> }]}
        />
      </div>
      {children && <div className={styles.progress}>{children}</div>}
    </div>
  );
}
