import type { Review } from '@/lib/content/reviews';
import type { RatingSummary } from '@/lib/utils/rating';

/** A review with its tour's title, for a review card. */
export type ReviewWithTour = { review: Review; tourTitle: string };

type Full = {
  variant?: 'full';
  /** long: the Homepage's long headline. standard: Tour Detail's (docs/components.md §5 item 34). */
  headlineSize?: 'long' | 'standard';
};

/** Tours: the headline is only read out (the design has none), then the summary and compact cards. */
type Compact = { variant: 'compact'; headlineSize?: never };

export type ReviewsSectionProps = (Full | Compact) & {
  copy: { headline: string };
  reviews: ReviewWithTour[];
  /** The overall rating (lib/utils/rating `ratingSummary`); null hides it. */
  summary: RatingSummary | null;
};
