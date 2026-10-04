'use client';

import type { MouseEvent } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { useBooking } from '@/hooks/useBooking';
import { askMessage } from '@/lib/utils/booking';
import { whatsappLink } from '@/lib/utils/whatsapp';
import type { BookingCtaActionsProps } from './BookingCtaActions.types';
import styles from './BookingCtaActions.module.css';

/** Where Reserve goes without JavaScript: the dates and prices. */
const DATES = '#dates';

/**
 * The final call to action's buttons. Reserve never opens WhatsApp itself: it takes the visitor
 * to the date choice, so a request always has a date. From 1100px it scrolls to Dates and prices
 * and puts focus on the aside's first date control; below that it opens the booking sheet.
 */
export function BookingCtaActions({ tour, reserveLabel, askLabel, settings }: BookingCtaActionsProps) {
  const { askDeparture, openSheetIfNarrow, dateControlRef } = useBooking();
  const ask = askMessage(settings.whatsapp, tour, askDeparture);

  function reserve(event: MouseEvent) {
    event.preventDefault();
    if (openSheetIfNarrow()) return;
    document.querySelector(DATES)?.scrollIntoView();
    dateControlRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className={styles.actions}>
      <Button href={DATES} size={56} arrow onClick={reserve} className={styles.action}>
        {reserveLabel}
      </Button>
      <Button
        href={whatsappLink(settings.contact.whatsapp, ask)}
        variant="secondary"
        size={56}
        icon="whatsapp"
        className={styles.action}
      >
        {askLabel}
      </Button>
    </div>
  );
}
