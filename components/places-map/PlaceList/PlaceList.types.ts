import type { Place } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type PlaceListProps = {
  places: Pick<Place, 'id' | 'name' | 'kind' | 'text' | 'image'>[];
  /** Each kind's tag. */
  kinds: DestinationCopy['places']['kinds'];
};
