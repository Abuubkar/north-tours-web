import { Button } from '@/components/ui/Button/Button';
import { dateRange, tripLength } from '@/lib/utils/dates';
import { seatStatus } from '@/lib/utils/departures';
import { departurePrices } from '@/lib/utils/price';
import { fillTokens } from '@/lib/utils/tokens';
import { PriceBlock } from '../../tour/PriceBlock/PriceBlock';
import { SeatsStatus } from '../../tour/SeatsStatus/SeatsStatus';
import type { DepartureRowProps } from './DepartureRow.types';
import styles from './DepartureRow.module.css';

/**
 * One departure: its dates, seats and twin price, then "Select date" (pressed, reading
 * "Selected", once chosen) or, sold out, "Join waitlist". Each action names its date.
 */
export function DepartureRow({ departure, tour, copy, selected, onSelect, waitlistHref }: DepartureRowProps) {
  const dates = dateRange(departure.start, departure.end);
  const soldOut = seatStatus(departure) === 'soldout';
  const label = soldOut ? copy.waitlistLabel : selected ? copy.selectedLabel : copy.selectLabel;

  return (
    <li className={`${styles.row} ${soldOut ? styles.soldOut : ''}`}>
      <div className={styles.when}>
        <span className={styles.dates}>{dates}</span>
        <span className={styles.meta}>{fillTokens(copy.rowMeta, { tripLength: tripLength(tour.days, tour.nights) })}</span>
      </div>
      <div className={styles.seats}>
        <SeatsStatus departure={departure} />
      </div>
      <div className={styles.price}>
        <PriceBlock amount={departurePrices(tour, departure).twin} size="fact" from={false} note={copy.priceNote} />
      </div>
      {/* Each action is named by its visible words, then its date for screen readers. */}
      {soldOut ? (
        <Button href={waitlistHref} variant="quiet" size={48} aria-label={`${label}, ${dates}`}>
          {label}
        </Button>
      ) : (
        <Button variant="secondary" size={48} aria-pressed={selected} aria-label={`${label}, ${dates}`} onClick={onSelect}>
          {label}
        </Button>
      )}
    </li>
  );
}
