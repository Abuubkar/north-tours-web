import { useRef, useState } from 'react';
import type { Pointer } from '@/components/places-map/PlacePin/PlacePin.types';
import { SIDE_BY_SIDE_QUERY } from '@/lib/utils/placesMap';

/**
 * The place lit on the places map and its list (PRD #63): one place shared by both. Hover or
 * focus lights a place while it lasts (`point`, with null when it ends); a click picks it
 * (`pick`), so it stays lit on touch, and picking it again clears it. The mouse shows over
 * keyboard focus, and either over the pick, so moving the mouse away never unlights a focused
 * place. Picking a row (`pickRow`) below 820px, where the map sits above the list, also brings
 * the map into view (`mapRef`): smoothly, or at once with reduced motion. A one-off scroll the
 * visitor asked for.
 */
export function usePlaceHighlight() {
  const [picked, setPicked] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  function point(id: string | null, by: Pointer) {
    (by === 'hover' ? setHovered : setFocused)(id);
  }

  /** Picks the place, or clears it if it was picked; true when it's now picked. */
  function pick(id: string): boolean {
    const next = picked === id ? null : id;
    setPicked(next);
    return next !== null;
  }

  function pickRow(id: string) {
    if (!pick(id) || window.matchMedia(SIDE_BY_SIDE_QUERY).matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  return { lit: hovered ?? focused ?? picked, picked, point, pick, pickRow, mapRef };
}
