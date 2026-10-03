import { starsLabel } from '@/lib/utils/rating';
import { Icon } from '../Icon/Icon';
import type { StarRatingProps } from './StarRating.types';
import styles from './StarRating.module.css';

const STARS = [1, 2, 3, 4, 5] as const;

export function StarRating({ rating, size = 15 }: StarRatingProps) {
  return (
    <span className={styles.stars} role="img" aria-label={starsLabel(rating)}>
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
