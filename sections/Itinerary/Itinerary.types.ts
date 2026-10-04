import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';

export type ItineraryProps = {
  copy: TourCopy['itinerary'];
  tour: Pick<Tour, 'stops' | 'itinerary'>;
};
