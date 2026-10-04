import type { ContentProblem } from './files.ts';
import type { Guide } from './guides.ts';
import type { Review } from './reviews.ts';
import type { Tour } from './tours.ts';

/**
 * Checks references between files: every destination a tour names must have a file.
 * `tourFiles` and `destinationFiles` map slugs to files, as returned by the collection loader.
 */
export function checkTourLinks(
  tours: Tour[],
  tourFiles: Record<string, string>,
  destinationFiles: Record<string, string>,
): ContentProblem[] {
  return tours.flatMap((tour) =>
    tour.destinations.flatMap((slug, i) =>
      slug in destinationFiles
        ? []
        : [
            {
              file: tourFiles[tour.slug],
              field: `destinations.${i}`,
              message: `No destination "${slug}" (expected a file in content/destinations)`,
            },
          ],
    ),
  );
}

/** Every review's tour must have a file. */
export function checkReviewLinks(
  reviews: Review[],
  reviewFiles: Record<string, string>,
  tourFiles: Record<string, string>,
): ContentProblem[] {
  return reviews.flatMap((review) =>
    review.tour in tourFiles
      ? []
      : [
          {
            file: reviewFiles[review.slug],
            field: 'tour',
            message: `No tour "${review.tour}" (expected a file in content/tours)`,
          },
        ],
  );
}

/** Every guide joined no earlier than the year the company started (`trust.operatingSince`). */
export function checkGuideYears(guides: Guide[], guideFiles: Record<string, string>, operatingSince: number): ContentProblem[] {
  return guides.flatMap((guide) =>
    guide.joined >= operatingSince
      ? []
      : [{ file: guideFiles[guide.slug], field: 'joined', message: `Can’t be before the company started (${operatingSince})` }],
  );
}

/** Every review a page chooses must have a file. `field` names the list, e.g. "reviews.chosen". */
export function checkChosenReviews(chosen: string[], file: string, field: string, reviewFiles: Record<string, string>): ContentProblem[] {
  return chosen.flatMap((slug, i) =>
    slug in reviewFiles ? [] : [{ file, field: `${field}.${i}`, message: `No review "${slug}" (expected a file in content/reviews)` }],
  );
}
