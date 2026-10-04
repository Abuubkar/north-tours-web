import { StarRating } from '@/components/ui/StarRating/StarRating';
import { monthYear } from '@/lib/utils/dates';
import type { ReviewCardProps } from './ReviewCard.types';
import styles from './ReviewCard.module.css';

const looks = {
  default: { card: styles.card, quote: styles.quote, caption: styles.caption, name: styles.name, trip: styles.trip, stars: 15 },
  compact: {
    card: styles.compactCard,
    quote: styles.compactQuote,
    caption: styles.compactCaption,
    name: styles.compactName,
    trip: styles.compactTrip,
    stars: 13,
  },
} as const;

/**
 * A traveller's review: the stars, their words, then who they are and which trip, when. The
 * compact card (Tours) sets each smaller part on the nearest type role and spacing token.
 */
export function ReviewCard({ review, tourTitle, variant = 'default' }: ReviewCardProps) {
  const look = looks[variant];
  return (
    <figure className={look.card}>
      <StarRating rating={review.rating} size={look.stars} />
      <blockquote className={look.quote}>
        <p>“{review.quote}”</p>
      </blockquote>
      <figcaption className={look.caption}>
        <span className={look.name}>
          {review.name}, {review.place}
        </span>
        <span className={look.trip}>
          {tourTitle} · {monthYear(review.month)}
        </span>
      </figcaption>
    </figure>
  );
}
