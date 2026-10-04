import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';

export type IncludedProps = {
  copy: TourCopy['included'];
  included: Tour['included'];
  notIncluded: Tour['notIncluded'];
};
