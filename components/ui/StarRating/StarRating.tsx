import { Icon } from '../Icon/Icon';
import styles from './StarRating.module.css';

type StarRatingProps = {
  /** Whole stars out of five, as given in the review. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Star size in px: 15 on review cards, 13 on compact cards. */
  size?: 15 | 13;
};

const STARS = [1, 2, 3, 4, 5] as const;

export function StarRating({ rating, size = 15 }: StarRatingProps) {
  return (
    <span className={styles.stars} role="img" aria-label={`${rating} out of 5 stars`}>
      {STARS.map((star) => (
        <Icon
          key={star}
          name="star"
          size={size}
          className={star <= rating ? styles.filled : styles.empty}
        />
      ))}
    </span>
  );
}
