import { HotelCard } from '@/components/hotels/HotelCard/HotelCard';
import type { CSSProperties } from 'react';
import type { HotelsProps } from './Hotels.types';
import styles from './Hotels.module.css';

/**
 * "Where you'll stay each night": a card per stay in a capped grid of up to five, so a short
 * tour's one or two stays don't leave empty columns. Then what the room prices mean.
 */
export function Hotels({ copy, stays }: HotelsProps) {
  return (
    <section id="hotels" className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <ul className={styles.grid} style={{ '--stay-count': stays.length } as CSSProperties}>
        {stays.map((stay) => (
          <li key={stay.nights.from} className={styles.cell}>
            <HotelCard stay={stay} sharing={copy.sharing} />
          </li>
        ))}
      </ul>
      <p className={styles.note}>{copy.note}</p>
    </section>
  );
}
