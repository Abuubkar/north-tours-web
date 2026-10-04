'use client';

import { Button } from '@/components/ui/Button/Button';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { useBooking } from '@/hooks/useBooking';
import { askMessage } from '@/lib/utils/booking';
import { dateRange } from '@/lib/utils/dates';
import { seatStatus } from '@/lib/utils/departures';
import { shownPrice } from '@/lib/utils/price';
import { fillTokens } from '@/lib/utils/tokens';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { PriceBlock } from '../../tour/PriceBlock/PriceBlock';
import type { BookingStickyBarProps } from './BookingStickyBar.types';
import styles from './BookingStickyBar.module.css';

/**
 * Below 1100px, booking stays one tap away: the price (the "from" price, or the chosen date's),
 * "Reserve", which opens the booking sheet, and WhatsApp. It sticks to the bottom of the screen
 * and sits at the end of the page, so it never covers the footer.
 */
export function BookingStickyBar({ tour, copy, priceNote, settings }: BookingStickyBarProps) {
  const { today, departures, chosen, askDeparture, openSheet } = useBooking();
  const price = shownPrice({ prices: tour.prices, departures }, chosen, today);
  const note = chosen
    ? fillTokens(seatStatus(chosen) === 'soldout' ? copy.soldOutNote : copy.dateNote, { date: dateRange(chosen.start, chosen.end) })
    : priceNote;
  const ask = askMessage(settings.whatsapp, tour.title, askDeparture);

  return (
    <div className={styles.bar} data-surface="dark">
      <PriceBlock amount={price} size="fact" from={!chosen} note={note} />
      <div className={styles.actions}>
        <Button size={48} onClick={openSheet}>
          {copy.reserveLabel}
        </Button>
        <IconButton
          href={whatsappLink(settings.contact.whatsapp, ask)}
          icon="whatsapp"
          size={48}
          label={fillTokens(copy.askLabel, { tour: tour.title })}
        />
      </div>
    </div>
  );
}
