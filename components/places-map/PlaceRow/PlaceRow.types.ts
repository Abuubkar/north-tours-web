import type { Place } from '@/lib/content/destinations';

export type PlaceRowProps = {
  place: Pick<Place, 'id' | 'name' | 'text' | 'image'>;
  /** Its place in the list, from 1: the number on its pin. */
  number: number;
  /** Its kind's tag, e.g. "Heritage". */
  kind: string;
};
