import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { consent } from './consent.ts';
import { CONTENT_DIR, requireItems } from './files.ts';
import { nonEmpty, sample, yearMonth } from './fields.ts';
import { checkReviewLinks } from './links.ts';
import { loadTours } from './tours.ts';

const reviewSchema = z.strictObject({
  /** The review's id, matching its file name, e.g. "hunza-2026-05-ayesha". */
  slug: slugSchema,
  tour: slugSchema,
  /** As shown, e.g. "Ayesha Malik & family". */
  name: nonEmpty,
  place: nonEmpty,
  /** When they travelled. */
  month: yearMonth,
  rating: z.literal([1, 2, 3, 4, 5], 'Use a whole number of stars, 1 to 5'),
  quote: nonEmpty,
  consent,
  /** A sample review (ADR-0022). `/add-review` writes real reviews, never flagged. */
  sample,
});

export type Review = z.infer<typeof reviewSchema>;

/**
 * Loads reviews and checks each one's tour has a file. Pass `tourFiles` when tours are
 * already loaded, so they aren't read twice.
 */
export function loadReviews(dir = CONTENT_DIR, tourFiles = loadTours(dir).files) {
  const reviews = loadCollection(reviewSchema, path.join(dir, 'reviews'));
  return {
    items: reviews.items,
    /** Each review's file as shown in errors, by slug (invalid files included), for checking links to them. */
    files: reviews.files,
    problems: [...reviews.problems, ...checkReviewLinks(reviews.items, reviews.files, tourFiles)],
  };
}

let cached: Review[] | undefined;

/** All reviews, most recent trip first. */
export function getReviews(): Review[] {
  cached ??= requireItems(loadReviews()).sort((a, b) => b.month.localeCompare(a.month));
  return cached;
}

export function getReviewsForTour(tour: string): Review[] {
  return getReviews().filter((review) => review.tour === tour);
}
