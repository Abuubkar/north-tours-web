'use client';

import { TextLink } from '@/components/ui/TextLink/TextLink';
import { useBooking } from '@/hooks/useBooking';
import { NO_UPCOMING_DATES } from '@/lib/utils/departures';
import { departureMessage, whatsappLink } from '@/lib/utils/whatsapp';
import { DepartureRow } from '../DepartureRow/DepartureRow';
import type { DepartureListProps } from './DepartureList.types';
import styles from './DepartureList.module.css';

/**
 * Every upcoming departure, re-checked in the browser so a date that has left since the build
 * drops out. "Select date" chooses that date in the booking panel.
 */
export function DepartureList({ tour, copy, settings }: DepartureListProps) {
  const { departures, chosen, choose } = useBooking();
  const link = (message: string) => whatsappLink(settings.contact.whatsapp, message);

  if (departures.length === 0) {
    return (
      <p className={styles.empty}>
        <TextLink href={link(settings.whatsapp.generalMessage)}>{NO_UPCOMING_DATES}</TextLink>
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {departures.map((departure) => (
        <DepartureRow
          key={departure.start}
          departure={departure}
          tour={tour}
          copy={copy}
          selected={departure === chosen}
          onSelect={() => choose(departure.start)}
          waitlistHref={link(departureMessage(settings.whatsapp.waitlistMessage, tour.title, departure.start))}
        />
      ))}
    </ul>
  );
}
