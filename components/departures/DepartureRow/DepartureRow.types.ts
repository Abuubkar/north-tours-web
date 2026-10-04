import type { TourCopy } from '@/lib/content/pages';
import type { Departure, Tour } from '@/lib/content/tours';

export type DepartureRowProps = {
  departure: Departure;
  tour: Pick<Tour, 'days' | 'nights' | 'prices'>;
  copy: TourCopy['dates'];
  /** This date is the one chosen in the booking panel. */
  selected: boolean;
  /** Choose this date. */
  onSelect: () => void;
  /** WhatsApp with the waitlist message for this date, for a sold-out row. */
  waitlistHref: string;
};
