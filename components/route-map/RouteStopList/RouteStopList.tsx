import { formatElevation } from '@/lib/utils/elevation';
import type { RouteStopListProps } from './RouteStopList.types';
import styles from './RouteStopList.module.css';

/** The main route's stops in order: number, name (a gold dot for destinations), elevation and a note. */
export function RouteStopList({ list, stops }: RouteStopListProps) {
  const destinations = new Set(stops.filter((s) => s.kind === 'destination').map((s) => s.name));

  return (
    <div className={styles.stopList}>
      <p className={styles.heading}>{list.heading}</p>
      <ol className={styles.list}>
        {list.stops.map(({ stop, elevation, note }, i) => (
          <li key={stop} className={styles.row}>
            <span className={styles.number} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={styles.name}>
              {stop}
              {destinations.has(stop) && <span className={styles.dot} role="img" aria-label="destination" />}
            </span>
            <span className={styles.elevation}>{formatElevation(elevation)}</span>
            <span className={styles.note}>{note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
