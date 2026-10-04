import type { ToursCopy } from '@/lib/content/pages';

export type PrivateTripBannerProps = {
  copy: ToursCopy['banner'];
  /** "Ask on WhatsApp", with the general message. */
  whatsappHref: string;
};
