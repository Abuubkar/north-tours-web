import type { ReactNode } from 'react';
import type { TourCopy } from '@/lib/content/pages';
import type { Tour } from '@/lib/content/tours';
import type { StopState } from '@/lib/utils/itinerary';

export type ItineraryDayProps = {
  day: Tour['itinerary'][number];
  /** 1-based. */
  number: number;
  /** The day's node: current (being read), visited (read) or upcoming. */
  state: StopState;
  copy: Pick<TourCopy['itinerary'], 'dayLabel' | 'overnight' | 'meals' | 'drive'>;
  /** The day's mini map, shown below 1280px. */
  miniMap: ReactNode;
};
