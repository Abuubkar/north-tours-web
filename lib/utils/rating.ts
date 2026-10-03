const countFormat = new Intl.NumberFormat('en-PK');

/** Average score shown with one decimal, as in the design: 4.9, 5.0. */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/** Review count with thousands separators: 128, 1,240. */
export function formatReviewCount(count: number): string {
  return countFormat.format(count);
}

/** What a screen reader hears for an inline rating: "4.9 out of 5, 128 reviews". */
export function ratingLabel(score: number, count: number): string {
  const noun = count === 1 ? 'review' : 'reviews';
  return `${formatScore(score)} out of 5, ${formatReviewCount(count)} ${noun}`;
}

/** What a screen reader hears for a row of stars: "4 out of 5 stars". */
export function starsLabel(rating: number): string {
  return `${rating} out of 5 stars`;
}

/**
 * The overall rating across tours: each tour's score weighted by its review count, and the
 * total count. Null when no tour has reviews, so the summary is hidden.
 */
export function ratingSummary(ratings: readonly { score: number; count: number }[]): { score: number; count: number } | null {
  const count = ratings.reduce((sum, r) => sum + r.count, 0);
  if (count === 0) return null;
  return { score: ratings.reduce((sum, r) => sum + r.score * r.count, 0) / count, count };
}
