import type { Settings } from '@/lib/content/settings';
import type { Departure, Tour } from '@/lib/content/tours';

export type TourCardProps = {
  tour: Pick<Tour, 'slug' | 'title' | 'route' | 'days' | 'nights' | 'priceFrom' | 'rating' | 'image'>;
  /** The departure the card shows (lib/utils/departures `shownDeparture`). */
  departure: Departure;
  /** The WhatsApp number and the tour and waitlist message templates. */
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};
