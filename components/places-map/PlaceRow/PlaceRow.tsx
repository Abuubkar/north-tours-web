import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { Tag } from '@/components/ui/Tag/Tag';
import type { PlaceRowProps } from './PlaceRow.types';
import styles from './PlaceRow.module.css';

/** The thumbnail is 96px wide at any screen size. */
const PHOTO_SIZES = '96px';

/**
 * One place to see, as a full-width button: its photo, its number (the one on its pin), its
 * name, one line and its kind. The button is named by the place and described by the line and
 * kind. Hover or focus lights it and its pin; a click picks it (aria-pressed), so it stays lit.
 */
export function PlaceRow({ place, number, kind, lit, pressed, onPoint, onPick }: PlaceRowProps) {
  const id = `place-${place.id}`;
  return (
    <button
      type="button"
      className={lit ? styles.litRow : styles.row}
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-text ${id}-kind`}
      aria-pressed={pressed}
      onMouseEnter={() => onPoint(place.id, 'hover')}
      onMouseLeave={() => onPoint(null, 'hover')}
      onFocus={() => onPoint(place.id, 'focus')}
      onBlur={() => onPoint(null, 'focus')}
      onClick={() => onPick(place.id)}
    >
      <MediaFrame image={place.image} ratio="4:3" sizes={PHOTO_SIZES} className={styles.photo} />
      <span className={styles.body}>
        <span className={styles.title}>
          <span className={styles.number} aria-hidden="true">
            {number}
          </span>
          <span id={`${id}-name`} className={styles.name}>
            {place.name}
          </span>
        </span>
        <span id={`${id}-text`} className={styles.text}>
          {place.text}
        </span>
        <span id={`${id}-kind`}>
          <Tag variant="category">{kind}</Tag>
        </span>
      </span>
    </button>
  );
}
