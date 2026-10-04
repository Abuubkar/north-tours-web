import { Button } from '@/components/ui/Button/Button';
import { ON_TRIP_ANCHOR } from '@/lib/routes';
import type { OnTripPanelProps } from './OnTripPanel.types';
import styles from './OnTripPanel.module.css';

const HEADING_ID = `${ON_TRIP_ANCHOR}-heading`;

/**
 * "On a trip right now?" (#on-trip): a light panel in the dark page with the travel support line,
 * and "Call travel support" only once the number is real; until then the number shows as written.
 * The heading takes focus from the phones' banner when there's no button.
 */
export function OnTripPanel({ copy, support }: OnTripPanelProps) {
  return (
    <section id={ON_TRIP_ANCHOR} aria-labelledby={HEADING_ID} data-surface="light" className={styles.panel}>
      <div className={styles.text}>
        <h2 id={HEADING_ID} tabIndex={-1} className={styles.heading}>
          {copy.heading}
        </h2>
        <p className={styles.line}>{copy.line}</p>
        <p className={styles.number}>{support.value}</p>
      </div>
      {support.href && (
        <Button href={support.href} size={56}>
          {copy.callLabel}
        </Button>
      )}
    </section>
  );
}
