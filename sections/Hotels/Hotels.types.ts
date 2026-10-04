import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';

export type HotelsProps = {
  copy: TourCopy['hotels'];
  stays: Tour['stays'];
};
