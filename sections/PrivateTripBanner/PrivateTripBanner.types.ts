import type { ToursCopy } from '@/lib/content/pages';

export type PrivateTripBannerProps = {
  /** The headline, lead, button labels and photo. */
  copy: ToursCopy['banner'];
  /** "Plan a private trip": the Trip Planner, with the destination chosen on a destination page. */
  planHref: string;
  /** "Ask on WhatsApp": the general message, or one about the destination. */
  whatsappHref: string;
  /** results (Tours): inside the results, a hairline below. section (Destination): its own section, a hairline above. */
  variant?: 'results' | 'section';
};
