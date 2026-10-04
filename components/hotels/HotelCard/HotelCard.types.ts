import type { Tour } from '@/lib/content/tours';

export type HotelCardProps = {
  stay: Tour['stays'][number];
  /** The line under the title, with {description} for the stay's own, e.g. "{description} · twin sharing". */
  descriptionTemplate: string;
};
