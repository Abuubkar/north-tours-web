import { seatsLeftText, seatStatus } from '@/lib/utils/departures';
import type { SeatsStatusProps } from './SeatsStatus.types';
import styles from './SeatsStatus.module.css';

/** A dot and the seats line: "11 of 20 seats left"; gold when urgent; "Sold out · waitlist open". */
export function SeatsStatus({ departure }: SeatsStatusProps) {
  return (
    <p className={`${styles.seats} ${styles[seatStatus(departure)]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {seatsLeftText(departure)}
    </p>
  );
}
