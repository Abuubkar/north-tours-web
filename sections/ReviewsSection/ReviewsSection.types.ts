import type { Review } from '@/lib/content/reviews';

export type ReviewsSectionProps = {
  copy: { headline: string };
  /** The reviews to show, each with its tour's title. */
  reviews: { review: Review; tourTitle: string }[];
  /** The overall rating (lib/utils/rating `ratingSummary`); null hides it. */
  summary: { score: number; count: number } | null;
};
