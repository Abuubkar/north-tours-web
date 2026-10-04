import { PlaceRow } from '../PlaceRow/PlaceRow';
import type { PlaceListProps } from './PlaceList.types';
import styles from './PlaceList.module.css';

/** The places to see as an ordered list, numbered as their pins on the map are; the lit place's row is raised. */
export function PlaceList({ places, kinds, lit, picked, onPoint, onPick }: PlaceListProps) {
  return (
    <ol className={styles.list}>
      {places.map((place, i) => (
        <li key={place.id}>
          <PlaceRow
            place={place}
            number={i + 1}
            kind={kinds[place.kind]}
            lit={lit === place.id}
            pressed={picked === place.id}
            onPoint={onPoint}
            onPick={onPick}
          />
        </li>
      ))}
    </ol>
  );
}
