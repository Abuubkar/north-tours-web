import type { Settings } from '@/lib/content/settings';
import type { Departure, Tour } from '@/lib/content/tours';

export type TourCardProps = {
  tour: Pick<Tour, 'slug' | 'title' | 'route' | 'days' | 'nights' | 'prices' | 'rating' | 'image'>;
  /** The departure the card shows (lib/utils/departures `shownDeparture`); none when the tour has no dates left. */
  departure: Departure | undefined;
  /** In the first row of a list at the top of the page: its photo loads straight away (not lazily). */
  priority?: boolean;
  /** The WhatsApp number and the tour and waitlist message templates. */
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};
