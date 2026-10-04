import type { Destination, Place } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type PlacesExplorerProps = {
  places: Place[];
  /** Names on the map for context. */
  labels: NonNullable<Destination['mapLabels']>;
  copy: Pick<DestinationCopy['places'], 'kinds' | 'mapCaption'>;
};
