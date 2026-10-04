import type { CSSProperties } from 'react';

/** How a place is pointed at: the mouse over it, or keyboard focus on it. */
export type Pointer = 'hover' | 'focus';

/** What a place does when it's pointed at (null when that ends) or clicked. */
export type PlaceHandlers = {
  onPoint: (id: string | null, by: Pointer) => void;
  onPick: (id: string) => void;
};

export type PlacePinProps = PlaceHandlers & {
  id: string;
  /** The place's name: the pin's accessible name, and the label shown while it's lit. */
  name: string;
  /** Its number in the list. */
  number: number;
  /** Where it sits on the map, as `--x` and `--y` percentages (lib/utils/projection `overlayPosition`). */
  position: CSSProperties;
  /** Lit (hovered, focused or picked): gold, with its name. */
  lit: boolean;
  /** Picked by a click or tap: stays lit (aria-pressed). */
  pressed: boolean;
};
