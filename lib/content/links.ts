import type { ContentProblem } from './files.ts';
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
