'use client';

import { usePlaceHighlight } from '@/hooks/usePlaceHighlight';
import { PlaceList } from '../PlaceList/PlaceList';
import { PlacesMap } from '../PlacesMap/PlacesMap';
import type { PlacesExplorerProps } from './PlacesExplorer.types';
import styles from './PlacesExplorer.module.css';

/**
 * The map and the list of places, linked: one place lit across both (hooks/usePlaceHighlight).
 * Below 820px the map sits above the list, and picking a row brings it into view. The page's
 * only client code besides the tour cards.
 */
export function PlacesExplorer({ places, labels, copy }: PlacesExplorerProps) {
  const { lit, picked, point, pick, pickRow, mapRef } = usePlaceHighlight();
  const state = { lit, picked, onPoint: point };

  return (
    <div className={styles.explorer}>
      <div className={styles.map}>
        <PlacesMap places={places} labels={labels} caption={copy.mapCaption} mapRef={mapRef} onPick={pick} {...state} />
      </div>
      <div className={styles.list}>
        <PlaceList places={places} kinds={copy.kinds} onPick={pickRow} {...state} />
      </div>
    </div>
  );
}
