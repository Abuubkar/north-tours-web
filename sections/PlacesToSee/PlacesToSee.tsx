import { PlacesExplorer } from '@/components/places-map/PlacesExplorer/PlacesExplorer';
import type { PlacesToSeeProps } from './PlacesToSee.types';
import styles from './PlacesToSee.module.css';

/**
 * "What to see in Hunza" (#places): a map of the destination's places beside their list, each
 * with a photo, a line and its kind, linked so a place lights on both.
 */
export function PlacesToSee({ headline, places, labels, copy }: PlacesToSeeProps) {
  return (
    <section id="places" className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      <div className={styles.places}>
        <PlacesExplorer places={places} labels={labels} copy={copy} />
      </div>
    </section>
  );
}
