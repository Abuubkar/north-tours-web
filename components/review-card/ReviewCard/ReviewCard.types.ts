import type { Review } from '@/lib/content/reviews';

export type ReviewCardProps = {
  review: Pick<Review, 'name' | 'place' | 'month' | 'rating' | 'quote'>;
  /** The title of the tour they travelled on. */
  tourTitle: string;
  /** compact: Tours' smaller card (13px stars, smaller quote, caption and padding). */
  variant?: 'default' | 'compact';
};
