'use client';

import { useCallback, useId } from 'react';
import { RatingInline } from '@/components/ui/RatingInline/RatingInline';
import { Stepper } from '@/components/ui/Stepper/Stepper';
import { useBooking } from '@/hooks/useBooking';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { COMPACT_PANEL_QUERY, ROOM_TYPES } from '@/lib/utils/booking';
import { departurePrices, shownPrice } from '@/lib/utils/price';
import { fillTokens } from '@/lib/utils/tokens';
import { PriceBlock } from '../../tour/PriceBlock/PriceBlock';
import { BookingFooter } from '../BookingFooter/BookingFooter';
import { DepartureField } from '../DepartureField/DepartureField';
import { RoomOption } from '../RoomOption/RoomOption';
import type { BookingPanelProps } from './BookingPanel.types';
import styles from './BookingPanel.module.css';

/**
 * The booking panel: pick a departure, the travellers and the room sharing; the footer shows the
 * total and the advance and opens WhatsApp. The price reads "from" until a date is chosen, then
 * that date's twin price. In the aside the body scrolls inside its box so the footer stays in
 * view, and on short screens the dates become a select; in the sheet it's always the full list.
 */
export function BookingPanel({ variant, tour, copy, tokens, settings, paymentMethods }: BookingPanelProps) {
  const booking = useBooking();
  const { chosen, dateControlRef } = booking;
  const name = useId();
  const compact = useMediaQuery(COMPACT_PANEL_QUERY) && variant === 'aside';
  const setDateControl = useCallback((element: HTMLElement | null) => {
    dateControlRef.current = element;
  }, [dateControlRef]);
  const prices = chosen ? departurePrices(tour, chosen) : tour.prices;
  const price = shownPrice({ prices: tour.prices, departures: booking.departures }, chosen, booking.today);

  return (
    <div className={styles.panel}>
      <div className={styles.body}>
        <div className={styles.head}>
          <PriceBlock amount={price} size="panel" from={!chosen} note={copy.priceNote} />
          <RatingInline score={tour.rating.score} count={tour.rating.count} />
        </div>
        <div className={styles.dateField}>
          <DepartureField copy={copy} compact={compact} controlRef={variant === 'aside' ? setDateControl : undefined} />
        </div>
        <div className={styles.travellers}>
          <div>
            <p className={styles.fieldLabel}>{copy.travellersLabel}</p>
            <p className={styles.hint}>{fillTokens(copy.travellersHint, tokens)}</p>
          </div>
          <Stepper
            label={copy.travellersLabel}
            value={booking.travellers}
            min={1}
            max={booking.maxTravellers}
            onChange={booking.setTravellers}
            decreaseLabel={copy.fewerTravellers}
            increaseLabel={copy.moreTravellers}
          />
        </div>
        <fieldset className={styles.field}>
          <legend className={styles.legend}>{copy.roomLabel}</legend>
          <div className={styles.rooms}>
            {ROOM_TYPES.map((room) => (
              <RoomOption
                key={room}
                name={`${name}-room`}
                room={room}
                label={copy.rooms[room]}
                price={prices[room]}
                checked={room === booking.room}
                onChoose={booking.setRoom}
              />
            ))}
          </div>
        </fieldset>
        <div className={styles.trust}>
          <p>
            <span className={styles.licence}>{fillTokens(copy.trustLicence, tokens)}</span> · {fillTokens(copy.trustDeparts, tokens)}
          </p>
          <p>{paymentMethods}</p>
        </div>
      </div>
      <BookingFooter tour={tour} copy={copy} tokens={tokens} settings={settings} />
    </div>
  );
}
