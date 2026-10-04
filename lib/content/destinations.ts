import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { CONTENT_DIR } from './files.ts';
import { nonEmpty, seasonSchema } from './fields.ts';
import { imageSchema } from './images.ts';


export const destinationSchema = z.strictObject({
  slug: slugSchema,
  name: nonEmpty,
  region: z.enum(['Gilgit-Baltistan', 'Khyber Pakhtunkhwa', 'Punjab']),
  description: nonEmpty,
  /** Best months to visit, e.g. Apr to Oct. */
  bestSeason: seasonSchema,
  image: imageSchema,
});

export type Destination = z.infer<typeof destinationSchema>;

export function loadDestinations(dir = CONTENT_DIR) {
  return loadCollection(destinationSchema, path.join(dir, 'destinations'));
}
