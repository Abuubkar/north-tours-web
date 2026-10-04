import { useState } from 'react';

/**
 * The place lit on the places map and its list (PRD #63): one place shared by both. Hover or
 * focus lights a place while it lasts (`point`, null when it leaves); a click picks it (`pick`),
 * so it stays lit on touch, and picking it again clears it. What's pointed at shows over the pick.
 */
export function usePlaceHighlight() {
  const [picked, setPicked] = useState<string | null>(null);
  const [pointed, setPointed] = useState<string | null>(null);

  /** Picks the place, or clears it if it was picked; true when it's now picked. */
  function pick(id: string): boolean {
    const next = picked === id ? null : id;
    setPicked(next);
    return next !== null;
  }

  return { lit: pointed ?? picked, picked, point: setPointed, pick };
}
