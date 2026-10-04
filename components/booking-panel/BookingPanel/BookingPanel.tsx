'use client';

import { useId } from 'react';
import { RatingInline } from '@/components/ui/RatingInline/RatingInline';
import { Stepper } from '@/components/ui/Stepper/Stepper';
import { useBooking } from '@/hooks/useBooking';
import { ROOM_TYPES } from '@/lib/utils/booking';
import { NO_UPCOMING_DATES } from '@/lib/utils/departures';
import { paymentMethodsLabel } from '@/lib/utils/payments';
import { departurePrices, fromPrice } from '@/lib/utils/price';
import { fillTokens } from '@/lib/utils/tokens';
import { PriceBlock } from '../../tour/PriceBlock/PriceBlock';
import { BookingFooter } from '../BookingFooter/BookingFooter';
import { DepartureOption } from '../DepartureOption/DepartureOption';
import { RoomOption } from '../RoomOption/RoomOption';
import type { BookingPanelProps } from './BookingPanel.types';
import styles from './BookingPanel.module.css';

/**
 * The booking panel: pick a departure, the travellers and the room sharing; the footer shows the
 * total and the advance and opens WhatsApp. The price reads "from" until a date is chosen, then
 * that date's twin price. The body scrolls inside its box; the footer stays in view.
 */
export function BookingPanel({ tour, copy, tokens, settings }: BookingPanelProps) {
  const booking = useBooking();
  const { chosen } = booking;
  const name = useId();
  const prices = chosen ? departurePrices(tour, chosen) : tour.prices;
  const price = chosen ? prices.twin : fromPrice({ prices: tour.prices, departures: booking.departures }, booking.today);

  return (
    <div className={styles.panel}>
      <div className={styles.body}>
        <div className={styles.head}>
          <PriceBlock amount={price} size="panel" from={!chosen} note={copy.priceNote} />
          <RatingInline score={tour.rating.score} count={tour.rating.count} />
        </div>
        <fieldset className={styles.field}>
          <legend className={styles.legend}>{copy.dateLabel}</legend>
          <div className={styles.dates}>
            {booking.departures.map((departure) => (
              <DepartureOption
                key={departure.start}
                name={`${name}-date`}
                departure={departure}
                checked={departure === chosen}
                onChoose={booking.choose}
              />
            ))}
            {booking.departures.length === 0 && <p className={styles.hint}>{NO_UPCOMING_DATES}</p>}
          </div>
        </fieldset>
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
          <p>{paymentMethodsLabel(settings)}</p>
        </div>
      </div>
      <BookingFooter tour={tour} copy={copy} tokens={tokens} settings={settings} />
    </div>
  );
}
