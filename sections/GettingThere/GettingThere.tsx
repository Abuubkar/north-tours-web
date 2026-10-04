import { RouteLine } from '@/components/route-line/RouteLine/RouteLine';
import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import type { GettingThereProps } from './GettingThere.types';
import styles from './GettingThere.module.css';

/** "Getting there from Lahore by road": the road as a line of stops, then whether a road or a flight is the way in. */
export function GettingThere({ gettingThere, copy }: GettingThereProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <div className={styles.route}>
        <RouteLine stops={gettingThere.stops} copy={copy} />
      </div>
      <dl className={styles.notes}>
        <KeyValueRow label={copy.byRoad} layout="column">
          {gettingThere.byRoad}
        </KeyValueRow>
        <KeyValueRow label={copy.byAir} layout="column">
          {gettingThere.byAir}
        </KeyValueRow>
      </dl>
    </section>
  );
}
