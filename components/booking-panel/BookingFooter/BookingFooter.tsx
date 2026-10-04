'use client';

import { Button } from '@/components/ui/Button/Button';
import { useBooking } from '@/hooks/useBooking';
import { advanceAmount, askMessage, bookingTotal, reserveMessage, totalBreakdown } from '@/lib/utils/booking';
import { dateRange } from '@/lib/utils/dates';
import { seatStatus, shownDeparture } from '@/lib/utils/departures';
import { departurePrices, formatPkr } from '@/lib/utils/price';
import { fillTokens } from '@/lib/utils/tokens';
import { departureMessage, whatsappLink } from '@/lib/utils/whatsapp';
import type { BookingFooterProps } from './BookingFooter.types';
import styles from './BookingFooter.module.css';

/**
 * The panel's footer, always in view: the total and the advance with "Reserve", which opens
 * WhatsApp with everything filled in. Before a date it's disabled (still focusable); a sold-out
 * date offers the waitlist instead. Then "Ask on WhatsApp" and the cancellation rule.
 */
export function BookingFooter({ tour, copy, tokens, settings }: BookingFooterProps) {
  const { today, departures, chosen, travellers, room } = useBooking();
  const link = (message: string) => whatsappLink(settings.contact.whatsapp, message);
  const percent = settings.booking.advancePercent;
  const reserveLabel = fillTokens(copy.reserveLabel, tokens);
  const ask = link(askMessage(settings.whatsapp, tour.title, chosen ?? shownDeparture(departures, today)));

  /** What the choice comes to (announced as it changes), and the action it leads to. */
  function choice() {
    if (!chosen) {
      return {
        summary: (
          <p className={styles.totalRow}>
            <span className={styles.breakdown}>{copy.totalLabel}</span>
            <span className={styles.muted}>{copy.chooseDate}</span>
          </p>
        ),
        action: (
          <Button size={48} aria-disabled="true">
            {reserveLabel}
          </Button>
        ),
      };
    }
    if (seatStatus(chosen) === 'soldout') {
      const waitlist = departureMessage(settings.whatsapp.waitlistMessage, tour.title, chosen.start);
      return {
        summary: <p className={styles.note}>{fillTokens(copy.soldOut, { date: dateRange(chosen.start, chosen.end) })}</p>,
        action: (
          <Button href={link(waitlist)} variant="quiet" size={48}>
            {copy.waitlistLabel}
          </Button>
        ),
      };
    }
    const prices = departurePrices(tour, chosen);
    const total = bookingTotal(prices, room, travellers);
    const reservation = { tour: tour.title, departure: chosen, travellers, roomName: copy.rooms[room], total, advancePercent: percent };
    return {
      summary: (
        <>
          <p className={styles.totalRow}>
            <span className={styles.breakdown}>{totalBreakdown(travellers, prices[room])}</span>
            <span className={styles.total}>{formatPkr(total)}</span>
          </p>
          <p className={styles.advance}>{fillTokens(copy.advance, { ...tokens, advance: formatPkr(advanceAmount(total, percent)) })}</p>
        </>
      ),
      action: (
        <Button href={link(reserveMessage(settings.whatsapp.reserveMessage, reservation))} size={48} arrow>
          {reserveLabel}
        </Button>
      ),
    };
  }

  const { summary, action } = choice();

  return (
    <div className={styles.footer}>
      <div className={styles.summary} aria-live="polite">
        {summary}
      </div>
      {action}
      <Button href={ask} variant="secondary" size={48} icon="whatsapp">
        {copy.askLabel}
      </Button>
      <p className={styles.cancel}>{fillTokens(copy.cancelNote, tokens)}</p>
    </div>
  );
}
