import type { TourCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';

export type DepartureListProps = {
  tour: Pick<Tour, 'title' | 'days' | 'nights' | 'prices'>;
  /** The row wording; the section's headline and room copy stay on the server. */
  copy: Pick<TourCopy['dates'], 'rowMeta' | 'priceNote' | 'selectLabel' | 'selectedLabel' | 'waitlistLabel'>;
  /** The WhatsApp number, the waitlist message, and the general one for when no date is left. */
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};
