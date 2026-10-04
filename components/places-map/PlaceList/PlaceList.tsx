import { PlaceRow } from '../PlaceRow/PlaceRow';
import type { PlaceListProps } from './PlaceList.types';
import styles from './PlaceList.module.css';

/** The places to see as an ordered list, numbered as their pins on the map are. */
export function PlaceList({ places, kinds }: PlaceListProps) {
  return (
    <ol className={styles.list}>
      {places.map((place, i) => (
        <li key={place.id}>
          <PlaceRow place={place} number={i + 1} kind={kinds[place.kind]} />
        </li>
      ))}
    </ol>
  );
}
