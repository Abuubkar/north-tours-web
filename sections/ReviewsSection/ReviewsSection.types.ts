import type { Review } from '@/lib/content/reviews';
import type { RatingSummary } from '@/lib/utils/rating';

/** A review with its tour's title, for a review card. */
export type ReviewWithTour = { review: Review; tourTitle: string };

export type ReviewsSectionProps = {
  copy: { headline: string };
  /** long: the Homepage's long headline. standard: Tour Detail's (docs/components.md §5 item 34). */
  headlineSize?: 'long' | 'standard';
  reviews: ReviewWithTour[];
  /** The overall rating (lib/utils/rating `ratingSummary`); null hides it. */
  summary: RatingSummary | null;
};
