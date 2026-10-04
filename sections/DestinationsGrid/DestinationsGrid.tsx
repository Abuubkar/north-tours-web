import { DestinationCard } from '@/components/destination-card/DestinationCard/DestinationCard';
import type { DestinationsGridProps } from './DestinationsGrid.types';
import styles from './DestinationsGrid.module.css';

const gridClass = { home: styles.grid, other: styles.otherGrid };

/**
 * A card per destination, each linking to its page: "Where we go, and when to go there" on the
 * Homepage, or "Other valleys we travel to" at the end of a destination page.
 */
export function DestinationsGrid({ variant = 'home', copy, destinations }: DestinationsGridProps) {
  return (
    <section id={variant === 'home' ? 'destinations' : undefined} className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <ul className={gridClass[variant]}>
        {destinations.map(({ tours, ...destination }) => (
          <li key={destination.slug} className={styles.cell}>
            <DestinationCard destination={destination} variant={variant} seasonLabel={copy.seasonLabel} tours={tours} />
          </li>
        ))}
      </ul>
    </section>
  );
}
