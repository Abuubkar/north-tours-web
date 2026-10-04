const countFormat = new Intl.NumberFormat('en-PK');

/** Average score shown with one decimal, as in the design: 4.9, 5.0. */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/** Review count with thousands separators: 128, 1,240. */
export function formatReviewCount(count: number): string {
  return countFormat.format(count);
}

/** "128 reviews", "1,240 reviews", "1 review". */
export function reviewsText(count: number): string {
  return `${formatReviewCount(count)} ${count === 1 ? 'review' : 'reviews'}`;
}

/** What a screen reader hears for an inline rating: "4.9 out of 5, 128 reviews". */
export function ratingLabel(score: number, count: number): string {
  return `${formatScore(score)} out of 5, ${reviewsText(count)}`;
}

/** What a screen reader hears for a row of stars: "4 out of 5 stars". */
export function starsLabel(rating: number): string {
  return `${rating} out of 5 stars`;
}

/**
 * The overall rating across tours: each tour's score weighted by its review count, and the
 * total count. Null when no tour has reviews, so the summary is hidden.
 */
export type RatingSummary = { score: number; count: number };

export function ratingSummary(ratings: readonly RatingSummary[]): RatingSummary | null {
  const count = ratings.reduce((sum, r) => sum + r.count, 0);
  if (count === 0) return null;
  return { score: ratings.reduce((sum, r) => sum + r.score * r.count, 0) / count, count };
}

/** The words after the score in a rating summary: "average · 699 reviews" ("1 review" in the singular). */
export function summaryText(count: number): string {
  return `average · ${reviewsText(count)}`;
}
