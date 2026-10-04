import { fillTokens } from '@/lib/utils/tokens';
import type { RouteLineProps } from './RouteLine.types';
import styles from './RouteLine.module.css';

/**
 * The road from Lahore as one ordered list of stops. From 820px a horizontal line: dots joined
 * by legs, names above, drive times below, the destination in gold. Below 820px a vertical list
 * with "↓ 4–5 hrs" under each name and "Arrive" on the last. The switch is CSS only; each leg is
 * read out in full ("4–5 hrs by road to Islamabad").
 */
export function RouteLine({ stops, copy }: RouteLineProps) {
  return (
    <ol className={styles.line}>
      {stops.map((stop, i) => {
        const next = stops[i + 1];
        return (
          <li key={stop.name} className={next ? styles.stop : styles.arrival}>
            <span className={styles.marker} aria-hidden="true" />
            <span className={styles.name}>{stop.name}</span>
            {next && stop.drive ? (
              <span className={styles.leg}>
                <span aria-hidden="true">
                  <span className={styles.down}>↓ </span>
                  {stop.drive}
                </span>
                <span className={styles.spoken}>{fillTokens(copy.leg, { time: stop.drive, stop: next.name })}</span>
              </span>
            ) : (
              <span className={styles.arrive}>{copy.arrive}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
