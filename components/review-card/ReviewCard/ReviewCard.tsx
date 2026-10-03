import { StarRating } from '@/components/ui/StarRating/StarRating';
import { monthYear } from '@/lib/utils/dates';
import type { ReviewCardProps } from './ReviewCard.types';
import styles from './ReviewCard.module.css';

/** A traveller's review: the stars, their words, then who they are and which trip, when. */
export function ReviewCard({ review, tourTitle }: ReviewCardProps) {
  return (
    <figure className={styles.card}>
      <StarRating rating={review.rating} />
      <blockquote className={styles.quote}>
        <p>“{review.quote}”</p>
      </blockquote>
      <figcaption className={styles.caption}>
        <span className={styles.name}>
          {review.name}, {review.place}
        </span>
        <span className={styles.trip}>
          {tourTitle} · {monthYear(review.month)}
        </span>
      </figcaption>
    </figure>
  );
}
