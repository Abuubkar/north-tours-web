import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';

export type TripOverviewProps = {
  overview: Tour['overview'];
  copy: TourCopy['overview'];
};
