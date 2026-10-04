import type { TourCopy } from '@/lib/content/pages';
import type { Settings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';

export type BookingPanelProps = {
  /** aside: beside the page from 1100px, compact on short screens. sheet: in the booking sheet, always the full list. */
  variant: 'aside' | 'sheet';
  tour: Pick<Tour, 'title' | 'rating' | 'prices'>;
  copy: TourCopy['booking'];
  /** Values for the copy's {tokens}: the settings tokens and the DTS licence. */
  tokens: Record<string, string>;
  /** The WhatsApp number and messages, and the advance. */
  settings: Pick<Settings, 'contact' | 'whatsapp' | 'booking'>;
  /** As shown in the trust line, e.g. "Cash · Bank transfer". */
  paymentMethods: string;
};
