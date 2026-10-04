import type { PlacePinProps } from './PlacePin.types';
import styles from './PlacePin.module.css';

/**
 * A numbered pin on the places map: a 44px button named by its place, with a 26px circle.
 * Lit, it turns gold with a halo and shows the place's name on a chip, placed clear of the other
 * pins (hooks/usePinLabel). Clicking picks the place (aria-pressed); clicking again clears it.
 */
export function PlacePin({ id, name, number, position, lit, pressed, onPoint, onPick }: PlacePinProps) {
  return (
    <button
      type="button"
      className={lit ? styles.litPin : styles.pin}
      style={position}
      aria-label={name}
      aria-pressed={pressed}
      data-pin={id}
      onMouseEnter={() => onPoint(id, 'hover')}
      onMouseLeave={() => onPoint(null, 'hover')}
      onFocus={() => onPoint(id, 'focus')}
      onBlur={() => onPoint(null, 'focus')}
      onClick={() => onPick(id)}
    >
      <span className={styles.halo} aria-hidden="true" />
      <span className={styles.circle} aria-hidden="true" data-pin-circle="">
        {number}
      </span>
      {lit && (
        <span className={styles.label} aria-hidden="true" data-pin-label="">
          {name}
        </span>
      )}
    </button>
  );
}
