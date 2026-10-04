import { DestinationCard } from '@/components/destination-card/DestinationCard/DestinationCard';
import type { DestinationsGridProps } from './DestinationsGrid.types';
import styles from './DestinationsGrid.module.css';

/**
 * A card per destination, each linking to its page: "Where we go, and when to go there" on the
 * Homepage, every destination on the destinations page, or "Other valleys we travel to" at the
 * end of a destination page.
 */
export function DestinationsGrid(props: DestinationsGridProps) {
  const other = props.variant === 'other';
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{props.copy.headline}</h2>
      <ul className={other ? styles.otherGrid : styles.grid}>
        {props.variant === 'other'
          ? props.destinations.map(({ details, ...destination }) => (
              <li key={destination.slug} className={styles.cell}>
                <DestinationCard destination={destination} variant="other" details={details} />
              </li>
            ))
          : props.destinations.map((destination) => (
              <li key={destination.slug} className={styles.cell}>
                <DestinationCard destination={destination} seasonLabel={props.copy.seasonLabel} />
              </li>
            ))}
      </ul>
    </section>
  );
}
