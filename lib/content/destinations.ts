import path from 'node:path';
import { z } from 'zod';
import { loadCollection, SLUG } from './collection.ts';
import { CONTENT_DIR } from './files.ts';
import { nonEmpty } from './fields.ts';
import { imageSchema } from './images.ts';

const month = z.enum(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

export const destinationSchema = z.strictObject({
  slug: z.string().regex(SLUG, 'Use lowercase words joined by hyphens'),
  name: nonEmpty,
  region: z.enum(['Gilgit-Baltistan', 'Khyber Pakhtunkhwa', 'Punjab']),
  description: nonEmpty,
  /** Best months to visit, e.g. Apr to Oct. */
  bestSeason: z.strictObject({ from: month, to: month }),
  image: imageSchema,
});

export type Destination = z.infer<typeof destinationSchema>;

export function loadDestinations(dir = CONTENT_DIR) {
  return loadCollection(destinationSchema, path.join(dir, 'destinations'));
}
