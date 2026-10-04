import type { TourCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';

export type BookingStickyBarProps = {
  tour: Pick<Tour, 'title' | 'prices'>;
  copy: TourCopy['bar'];
  /** Under the price before a date is chosen, e.g. "per person · twin sharing". */
  priceNote: string;
  /** The WhatsApp number and the tour and general messages. */
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};
