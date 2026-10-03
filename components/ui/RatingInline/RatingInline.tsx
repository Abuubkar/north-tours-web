import { formatReviewCount, formatScore, ratingLabel } from '@/lib/utils/rating';
import { Icon } from '../Icon/Icon';
import type { RatingInlineProps } from './RatingInline.types';
import styles from './RatingInline.module.css';

const STAR_SIZE = 15;

/** "★ 4.9 (128)", read as one phrase: "4.9 out of 5, 128 reviews". */
export function RatingInline({ score, count }: RatingInlineProps) {
  return (
    <span className={styles.rating} role="img" aria-label={ratingLabel(score, count)}>
      <Icon name="star" size={STAR_SIZE} className={styles.star} />
      <span className={styles.score}>{formatScore(score)}</span>
      <span className={styles.count}>({formatReviewCount(count)})</span>
    </span>
  );
}
