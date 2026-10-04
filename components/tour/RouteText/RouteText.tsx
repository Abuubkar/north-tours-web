import { routeLine, spokenRoute } from '@/lib/utils/route';
import type { RouteTextProps } from './RouteText.types';
import styles from './RouteText.module.css';

/**
 * A tour's route inside a line of text: "Lahore → Hunza → Skardu" on screen, "Lahore to Hunza to
 * Skardu" to a screen reader, which would otherwise read each arrow out.
 */
export function RouteText({ stops }: RouteTextProps) {
  return (
    <>
      <span aria-hidden="true">{routeLine(stops)}</span>
      <span className={styles.spoken}>{spokenRoute(stops)}</span>
    </>
  );
}
