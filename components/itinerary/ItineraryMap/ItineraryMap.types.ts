import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';
import type { drawItinerary } from '@/lib/utils/itinerary';

export type ItineraryMapProps = {
  /** The tour drawn in the side map's frame (lib/utils/itinerary `drawItinerary`). */
  drawing: ReturnType<typeof drawItinerary>;
  days: Pick<Tour['itinerary'][number], 'title' | 'stops'>[];
  /** The day being read, 0-based; -1 before the first. */
  active: number;
  copy: TourCopy['itinerary']['map'];
};
