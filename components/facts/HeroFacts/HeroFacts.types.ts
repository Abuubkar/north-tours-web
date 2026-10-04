import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';

export type HeroFactsProps = {
  tour: Pick<Tour, 'days' | 'nights' | 'rating' | 'priceFrom' | 'departures'>;
  /** The build's date (YYYY-MM-DD, Asia/Karachi), so the first render matches the built HTML. */
  builtOn: string;
  copy: TourCopy['facts'];
  /** WhatsApp with the general message, for when no departures are left. */
  whatsappHref: string;
};
