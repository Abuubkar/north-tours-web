import type { Place } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';
import type { PlaceHandlers } from '../PlacePin/PlacePin.types';

export type PlaceListProps = PlaceHandlers & {
  places: Pick<Place, 'id' | 'name' | 'kind' | 'text' | 'image'>[];
  /** Each kind's tag. */
  kinds: DestinationCopy['places']['kinds'];
  /** The place lit (hovered, focused or picked), and the one picked. */
  lit: string | null;
  picked: string | null;
};
