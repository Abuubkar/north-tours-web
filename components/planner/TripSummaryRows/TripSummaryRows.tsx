'use client';

import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { usePlanner } from '@/hooks/usePlanner';
import { SUMMARY_ROWS } from '@/lib/utils/plannerSummary';
import type { TripSummaryRowsProps } from './TripSummaryRows.types';
import styles from './TripSummaryRows.module.css';

/** The trip's nine rows as answered so far; an empty row shows "—", read as "Not answered". */
export function TripSummaryRows({ copy }: TripSummaryRowsProps) {
  const { trip } = usePlanner();
  return (
    <dl className={styles.rows}>
      {SUMMARY_ROWS.map((row) => (
        <KeyValueRow key={row} layout="column" label={copy.rows[row]}>
          {trip[row] ?? (
            <>
              <span aria-hidden="true" className={styles.empty}>
                —
              </span>
              <span className={styles.hidden}>{copy.notAnswered}</span>
            </>
          )}
        </KeyValueRow>
      ))}
    </dl>
  );
}
