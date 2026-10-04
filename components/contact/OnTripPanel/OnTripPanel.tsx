import { RouteMap } from '@/components/route-map/RouteMap/RouteMap';
import { Button } from '@/components/ui/Button/Button';
import { ON_TRIP_ANCHOR } from '@/lib/routes';
import type { OnTripPanelProps } from './OnTripPanel.types';
import styles from './OnTripPanel.module.css';

const HEADING_ID = `${ON_TRIP_ANCHOR}-heading`;

/**
 * "On a trip right now?" (#on-trip): a raised dark panel with the two people to call, your guide
 * and the travel support line, and the road north beside them as decoration (owner feedback).
 * "Call travel support" shows only once the number is real; until then the number shows as
 * written. The heading takes focus from the phones' banner when there's no button.
 */
export function OnTripPanel({ copy, support, map }: OnTripPanelProps) {
  return (
    <section id={ON_TRIP_ANCHOR} aria-labelledby={HEADING_ID} className={styles.panel}>
      <div className={styles.text}>
        <h2 id={HEADING_ID} tabIndex={-1} className={styles.heading}>
          {copy.heading}
        </h2>
        <p className={styles.line}>{copy.line}</p>
        <ul className={styles.rows}>
          <li className={styles.row}>
            <p className={styles.who}>
              {copy.guide.label}
              <span className={styles.note}>{copy.guide.note}</span>
            </p>
          </li>
          <li className={styles.row}>
            <p className={styles.who}>
              {copy.support}
              <span className={styles.number}>{support.value}</span>
            </p>
            {support.href && (
              <Button href={support.href} size={48}>
                {copy.callLabel}
              </Button>
            )}
          </li>
        </ul>
      </div>
      <div className={styles.map}>
        <RouteMap map={map} decorative />
      </div>
    </section>
  );
}
