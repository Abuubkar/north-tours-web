import type { Settings } from '@/lib/content/settings';

export type BookingCtaActionsProps = {
  tour: string;
  reserveLabel: string;
  askLabel: string;
  /** The WhatsApp number and the tour and general messages. */
  settings: Pick<Settings, 'contact' | 'whatsapp'>;
};
