import { dateRange } from '@/lib/utils/dates';
import { seatsLeftText, seatStatus } from '@/lib/utils/departures';
import type { DepartureOptionProps } from './DepartureOption.types';
import styles from './DepartureOption.module.css';

/**
 * One departure as a radio in the panel's date group: its dates and seats, read together as its
 * name ("12–20 May, 3 of 16 seats left"). Arrow keys move between dates, as in any radio group.
 */
export function DepartureOption({ name, departure, checked, onChoose, ref }: DepartureOptionProps) {
  const status = seatStatus(departure);
  return (
    <label className={`${styles.option} ${status === 'soldout' ? styles.full : ''}`}>
      <input
        ref={ref}
        type="radio"
        name={name}
        value={departure.start}
        checked={checked}
        onChange={() => onChoose(departure.start)}
        className={styles.radio}
      />
      <span className={styles.dates}>{dateRange(departure.start, departure.end)}</span>
      <span className={`${styles.seats} ${styles[status]}`}>{seatsLeftText(departure)}</span>
    </label>
  );
}
