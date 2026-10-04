import { formatReviewCount, formatScore, ratingLabel, reviewsText } from '@/lib/utils/rating';
import { Icon } from '../Icon/Icon';
import type { RatingInlineProps } from './RatingInline.types';
import styles from './RatingInline.module.css';

const sizes = {
  inline: { star: 15, rating: styles.rating, score: styles.score, count: styles.count, countText: formatReviewCount },
  fact: {
    star: 16,
    rating: `${styles.rating} ${styles.factRating}`,
    score: styles.factScore,
    count: styles.factCount,
    countText: reviewsText,
  },
};

/** "★ 4.9 (128)", or "★ 4.9 (128 reviews)" in the hero facts, read as one phrase: "4.9 out of 5, 128 reviews". */
export function RatingInline({ score, count, size = 'inline' }: RatingInlineProps) {
  const look = sizes[size];
  return (
    <span className={look.rating} role="img" aria-label={ratingLabel(score, count)}>
      <Icon name="star" size={look.star} className={styles.star} />
      <span className={look.score}>{formatScore(score)}</span>
      <span className={look.count}>({look.countText(count)})</span>
    </span>
  );
}
