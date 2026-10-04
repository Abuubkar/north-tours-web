import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { Tag } from '@/components/ui/Tag/Tag';
import type { PlaceRowProps } from './PlaceRow.types';
import styles from './PlaceRow.module.css';

/** The thumbnail is 96px wide at any screen size. */
const PHOTO_SIZES = '96px';

/**
 * One place to see, as a full-width button: its photo, its number (the one on its pin), its
 * name, one line and its kind. The button is named by the place and described by the line and
 * kind.
 */
export function PlaceRow({ place, number, kind }: PlaceRowProps) {
  const id = `place-${place.id}`;
  return (
    <button type="button" className={styles.row} aria-labelledby={`${id}-name`} aria-describedby={`${id}-text ${id}-kind`}>
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
