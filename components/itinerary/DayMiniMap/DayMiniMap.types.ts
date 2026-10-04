import type { ItineraryDrawing } from '@/lib/utils/itinerary';

export type DayMiniMapProps = {
  /** The tour drawn in the mini map's frame (lib/utils/itinerary `drawItinerary`). */
  drawing: ItineraryDrawing;
  /** The day, 0-based. */
  day: number;
  /** The day's stops, in order: the first is labelled as where it starts, the last where it ends. */
  stops: string[];
};
