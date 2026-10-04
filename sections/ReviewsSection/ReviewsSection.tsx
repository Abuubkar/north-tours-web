import { ReviewCard } from '@/components/review-card/ReviewCard/ReviewCard';
import { Icon } from '@/components/ui/Icon/Icon';
import { formatScore, summaryText } from '@/lib/utils/rating';
import type { ReviewsSectionProps } from './ReviewsSection.types';
import styles from './ReviewsSection.module.css';

const STAR_SIZE = 16;

/** The headline with the overall rating beside it, then the review cards. */
const headlineClass = { long: styles.headline, standard: styles.standardHeadline };

export function ReviewsSection({ copy, headlineSize = 'long', reviews, summary }: ReviewsSectionProps) {
  // A tour with no reviews yet has no section; its rating still shows in the hero.
  if (reviews.length === 0) return null;
  return (
    <section id="reviews" className={styles.section}>
      <div className={styles.header}>
        <h2 className={headlineClass[headlineSize]}>{copy.headline}</h2>
        {summary && (
          <p className={styles.summary}>
            <Icon name="star" size={STAR_SIZE} className={styles.star} />
            <span>
              <span className={styles.score}>{formatScore(summary.score)}</span> {summaryText(summary.count)}
            </span>
          </p>
        )}
      </div>
      <div className={styles.grid}>
        {reviews.map(({ review, tourTitle }) => (
          <ReviewCard key={review.slug} review={review} tourTitle={tourTitle} />
        ))}
      </div>
    </section>
  );
}
