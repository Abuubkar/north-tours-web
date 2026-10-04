import type { TourCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';

export type BookingPanelProps = {
  tour: Pick<Tour, 'title' | 'rating' | 'prices'>;
  copy: TourCopy['booking'];
  /** Values for the copy's {tokens}: the settings tokens and the DTS licence. */
  tokens: Record<string, string>;
  /** The WhatsApp number and messages, the advance and the payment methods. */
  settings: Pick<Settings, 'contact' | 'whatsapp' | 'booking' | 'payments'>;
};
