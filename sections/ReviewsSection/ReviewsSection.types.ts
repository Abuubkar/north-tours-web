import type { Review } from '@/lib/content/reviews';
import type { RatingSummary } from '@/lib/utils/rating';

/** A review with its tour's title, for a review card. */
export type ReviewWithTour = { review: Review; tourTitle: string };

export type ReviewsSectionProps = {
  copy: { headline: string };
  reviews: ReviewWithTour[];
  /** The overall rating (lib/utils/rating `ratingSummary`); null hides it. */
  summary: RatingSummary | null;
};
