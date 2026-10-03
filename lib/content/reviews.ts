import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { consent } from './consent.ts';
import { CONTENT_DIR, requireValid, type ContentProblem } from './files.ts';
import { nonEmpty } from './fields.ts';
import { loadTours } from './tours.ts';

const reviewSchema = z.strictObject({
  /** The file name, e.g. "grand-2026-05-ayesha". */
  slug: slugSchema,
  tour: slugSchema,
  /** As shown, e.g. "Ayesha Malik & family". */
  name: nonEmpty,
  place: nonEmpty,
  /** When they travelled, YYYY-MM. */
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM, e.g. 2026-05'),
  rating: z.int().min(1).max(5),
  quote: nonEmpty,
  consent,
});

export type Review = z.infer<typeof reviewSchema>;

/** Loads reviews and checks each one's tour has a file. */
export function loadReviews(dir = CONTENT_DIR) {
  const reviews = loadCollection(reviewSchema, path.join(dir, 'reviews'));
  const tourFiles = loadTours(dir).files;
  const links: ContentProblem[] = reviews.items.flatMap((review) =>
    review.tour in tourFiles
      ? []
      : [
          {
            file: reviews.files[review.slug],
            field: 'tour',
            message: `No tour "${review.tour}" (expected a file in content/tours)`,
          },
        ],
  );
  return { items: reviews.items, problems: [...reviews.problems, ...links] };
}

let cached: Review[] | undefined;

/** All reviews, newest trip first. */
export function getReviews(): Review[] {
  if (!cached) {
    const { items, problems } = loadReviews();
    cached = requireValid({ data: items, problems }).sort((a, b) => b.month.localeCompare(a.month));
  }
  return cached;
}

export function getReviewsForTour(tour: string): Review[] {
  return getReviews().filter((review) => review.tour === tour);
}
