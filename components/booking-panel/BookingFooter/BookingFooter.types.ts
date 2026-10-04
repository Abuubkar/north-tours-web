import type { TourCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';

export type BookingFooterProps = {
  tour: Pick<Tour, 'title' | 'prices'>;
  copy: TourCopy['booking'];
  /** Values for the copy's {tokens}: the settings tokens and the DTS licence. */
  tokens: Record<string, string>;
  /** The WhatsApp number and messages, and the advance. */
  settings: Pick<Settings, 'contact' | 'whatsapp' | 'booking'>;
};
