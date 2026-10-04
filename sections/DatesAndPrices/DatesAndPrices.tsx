import { DepartureList } from '@/components/departures/DepartureList/DepartureList';
import { RoomSharingList } from '@/components/departures/RoomSharingList/RoomSharingList';
import type { DatesAndPricesProps } from './DatesAndPrices.types';
import styles from './DatesAndPrices.module.css';

/** "Upcoming departures and prices" (light, #dates): each date with its seats and price, then the room prices. */
export function DatesAndPrices({ tour, copy, settings, roomsNote }: DatesAndPricesProps) {
  const { rowMeta, priceNote, selectLabel, selectedLabel, waitlistLabel } = copy;
  return (
    <section id="dates" data-surface="light" className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <div className={styles.list}>
        <DepartureList
          tour={tour}
          copy={{ rowMeta, priceNote, selectLabel, selectedLabel, waitlistLabel }}
          settings={settings}
        />
      </div>
      <div className={styles.rooms}>
        <RoomSharingList copy={copy.rooms} note={roomsNote} prices={tour.prices} />
      </div>
    </section>
  );
}
