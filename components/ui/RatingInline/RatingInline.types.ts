export type RatingInlineProps = {
  /** Average score out of 5, e.g. 4.9. */
  score: number;
  /** Number of reviews. */
  count: number;
  /** inline: cards and panels, "★ 4.9 (128)". fact: the Tour Detail hero facts, larger, "★ 4.9 (128 reviews)". */
  size?: 'inline' | 'fact';
};
