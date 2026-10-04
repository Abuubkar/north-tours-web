import type { Place } from '@/lib/content/destinations';
import type { PlaceHandlers } from '../PlacePin/PlacePin.types';

export type PlaceRowProps = PlaceHandlers & {
  place: Pick<Place, 'id' | 'name' | 'text' | 'image'>;
  /** Its place in the list, from 1: the number on its pin. */
  number: number;
  /** Its kind's tag, e.g. "Heritage". */
  kind: string;
  /** Lit (hovered, focused or picked, here or on its pin): the raised surface and a gold number. */
  lit: boolean;
  /** Picked by a click or tap: stays lit (aria-pressed). */
  pressed: boolean;
};
