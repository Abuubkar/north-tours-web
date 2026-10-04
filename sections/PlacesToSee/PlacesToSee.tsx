import { PlaceList } from '@/components/places-map/PlaceList/PlaceList';
import type { PlacesToSeeProps } from './PlacesToSee.types';
import styles from './PlacesToSee.module.css';

/** "What to see in Hunza" (#places): the destination's places, each with a photo, a line and its kind. */
export function PlacesToSee({ headline, places, kinds }: PlacesToSeeProps) {
  return (
    <section id="places" className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      <div className={styles.places}>
        <PlaceList places={places} kinds={kinds} />
      </div>
    </section>
  );
}
