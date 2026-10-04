import type { drawItinerary } from '@/lib/utils/itinerary';

export type DayMiniMapProps = {
  /** The tour drawn in the mini map's frame (lib/utils/itinerary `drawItinerary`). */
  drawing: ReturnType<typeof drawItinerary>;
  /** The day, 0-based. */
  day: number;
  /** The day's stops, in order: the first is labelled as where it starts, the last where it ends. */
  stops: string[];
};
