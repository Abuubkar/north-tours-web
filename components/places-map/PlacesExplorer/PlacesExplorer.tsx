'use client';

import { useRef } from 'react';
import { usePlaceHighlight } from '@/hooks/usePlaceHighlight';
import { PlaceList } from '../PlaceList/PlaceList';
import { PlacesMap } from '../PlacesMap/PlacesMap';
import type { PlacesExplorerProps } from './PlacesExplorer.types';
import styles from './PlacesExplorer.module.css';

/** From this width the map sits beside the list and stays in view while it scrolls. */
const SIDE_BY_SIDE = '(width >= 820px)';

/**
 * The map and the list of places, linked: one place lit across both. Below 820px the map sits
 * above the list, and picking a row brings the map into view (smoothly, unless the visitor
 * prefers reduced motion): a one-off scroll they asked for. The page's only client code besides
 * the tour cards.
 */
export function PlacesExplorer({ places, labels, copy }: PlacesExplorerProps) {
  const { lit, picked, point, pick } = usePlaceHighlight();
  const mapRef = useRef<HTMLDivElement>(null);

  function pickRow(id: string) {
    if (!pick(id) || window.matchMedia(SIDE_BY_SIDE).matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  const handlers = { lit, picked, onPoint: point };
  return (
    <div className={styles.explorer}>
      <div className={styles.map}>
        <PlacesMap places={places} labels={labels} caption={copy.mapCaption} mapRef={mapRef} onPick={pick} {...handlers} />
      </div>
      <div className={styles.list}>
        <PlaceList places={places} kinds={copy.kinds} onPick={pickRow} {...handlers} />
      </div>
    </div>
  );
}
