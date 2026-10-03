'use client';

import { useSyncExternalStore } from 'react';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { NO_UPCOMING_DATES, soonestDepartures, todayInKarachi } from '@/lib/utils/departures';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { TourCard } from '../TourCard/TourCard';
import type { UpcomingDeparturesProps } from './UpcomingDepartures.types';
import styles from './UpcomingDepartures.module.css';

/** Today's date isn't watched: a page left open past midnight keeps the day it was opened. */
const noUpdates = () => () => {};

/**
 * The soonest departures as tour cards, one per tour. It renders as built, then checks again
 * against today's date in the browser, so a page built days ago never shows a trip that has
 * already left; the next tour fills in. With nothing left it offers WhatsApp instead.
 */
export function UpcomingDepartures({ tours, builtOn, limit, settings }: UpcomingDeparturesProps) {
  // The build's date while hydrating, so the first render matches the built HTML; the browser's after.
  const today = useSyncExternalStore(
    noUpdates,
    () => todayInKarachi(new Date()),
    () => builtOn,
  );

  const cards = soonestDepartures(tours, today, limit);

  if (cards.length === 0) {
    return (
      <p className={styles.empty}>
        <TextLink href={whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage)}>
          {NO_UPCOMING_DATES}
        </TextLink>
      </p>
    );
  }

  return (
    <ul className={styles.grid}>
      {cards.map(({ tour, departure }) => (
        <li key={tour.slug} className={styles.cell}>
          <TourCard tour={tour} departure={departure} settings={settings} />
        </li>
      ))}
    </ul>
  );
}
