import type { RefObject } from 'react';
import type { Destination, Place } from '@/lib/content/destinations';
import type { PlaceHandlers } from '../PlacePin/PlacePin.types';

export type PlacesMapProps = PlaceHandlers & {
  /** The places, numbered in this order as in the list. */
  places: Pick<Place, 'id' | 'name' | 'lat' | 'lon'>[];
  /** Names for context, e.g. "Karimabad"; one beyond the map shows at its edge. */
  labels: NonNullable<Destination['mapLabels']>;
  /** Under the map, e.g. "Schematic · positions approximate". */
  caption: string;
  /** The place lit (hovered, focused or picked), and the one picked. */
  lit: string | null;
  picked: string | null;
  /** The map, for bringing it into view when a place is picked on a phone. */
  mapRef?: RefObject<HTMLDivElement | null>;
};
