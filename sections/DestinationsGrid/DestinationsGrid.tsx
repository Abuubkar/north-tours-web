import { DestinationCard } from '@/components/destination-card/DestinationCard/DestinationCard';
import type { DestinationsGridProps } from './DestinationsGrid.types';
import styles from './DestinationsGrid.module.css';

/** "Where we go, and when to go there": a card per destination, each linking to its page. */
export function DestinationsGrid({ copy, destinations }: DestinationsGridProps) {
  return (
    <section id="destinations" className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <ul className={styles.grid}>
        {destinations.map((destination) => (
          <li key={destination.slug} className={styles.cell}>
            <DestinationCard destination={destination} seasonLabel={copy.seasonLabel} />
          </li>
        ))}
      </ul>
    </section>
  );
}
