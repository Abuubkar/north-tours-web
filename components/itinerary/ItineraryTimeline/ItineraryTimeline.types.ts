import type { ReactNode } from 'react';
import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';
import type { drawItinerary } from '@/lib/utils/itinerary';

export type ItineraryTimelineProps = {
  days: Tour['itinerary'];
  copy: TourCopy['itinerary'];
  /** The tour drawn in the side map's frame. */
  drawing: ReturnType<typeof drawItinerary>;
  /** Each day's mini map (server-rendered), in day order. */
  miniMaps: ReactNode[];
};
