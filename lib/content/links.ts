import path from 'node:path';
import { CONTENT_DIR, type ContentProblem } from './files.ts';
import type { Tour } from './tours.ts';

/** Checks references between files: every destination a tour names must have a file. */
export function checkTourLinks(tours: Tour[], destinationSlugs: string[], dir = CONTENT_DIR): ContentProblem[] {
  const known = new Set(destinationSlugs);
  return tours.flatMap((tour) =>
    tour.destinations.flatMap((slug, i) =>
      known.has(slug)
        ? []
        : [
            {
              file: path.relative(process.cwd(), path.join(dir, 'tours', `${tour.slug}.json`)),
              field: `destinations.${i}`,
              message: `No destination "${slug}" (expected a file in content/destinations)`,
            },
          ],
    ),
  );
}
