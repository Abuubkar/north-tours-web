import type { Tour } from '@/lib/content/tours';

export type HotelCardProps = {
  stay: Tour['stays'][number];
  /** Added after the description, e.g. "twin sharing". */
  sharing: string;
};
