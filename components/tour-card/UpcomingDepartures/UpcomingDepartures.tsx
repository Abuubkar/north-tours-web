'use client';

import { useToday } from '@/hooks/useToday';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { NO_UPCOMING_DATES, soonestDepartures } from '@/lib/utils/departures';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { TourCardGrid } from '../TourCardGrid/TourCardGrid';
import type { UpcomingDeparturesProps } from './UpcomingDepartures.types';
import styles from './UpcomingDepartures.module.css';

/**
 * The soonest departures as tour cards, one per tour. It renders as built, then checks again
 * against today's date in the browser, so a page built days ago never shows a trip that has
 * already left; the next tour fills in. With nothing left it offers WhatsApp instead.
 */
export function UpcomingDepartures({ tours, builtOn, limit, settings }: UpcomingDeparturesProps) {
  const cards = soonestDepartures(tours, useToday(builtOn), limit);

  if (cards.length === 0) {
    return (
      <p className={styles.empty}>
        <TextLink href={whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage)}>
          {NO_UPCOMING_DATES}
        </TextLink>
      </p>
    );
  }

  return <TourCardGrid cards={cards} maxColumns={4} settings={settings} />;
}
