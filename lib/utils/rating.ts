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
