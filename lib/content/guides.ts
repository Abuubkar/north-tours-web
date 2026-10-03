import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { consent } from './consent.ts';
import { CONTENT_DIR, requireValid } from './files.ts';
import { nonEmpty } from './fields.ts';
import { imageSchema } from './images.ts';

const guideSchema = z.strictObject({
  slug: slugSchema,
  name: nonEmpty,
  role: z.enum(['Lead guide', 'Guide', 'Trek lead', 'Driver', 'Tour host']),
  /** Where they're from or work, e.g. "Hunza" or "Skardu & Deosai". */
  base: nonEmpty,
  languages: z.array(nonEmpty).min(1),
  /** Years guiding or driving, when it's worth saying ("12 years on the KKH"). */
  years: z.int().positive().optional(),
  bio: nonEmpty,
  /** Owner-supplied only (ADR-0009); a placeholder until the photo arrives. */
  portrait: imageSchema,
  consent,
});

export type Guide = z.infer<typeof guideSchema>;

export function loadGuides(dir = CONTENT_DIR) {
  return loadCollection(guideSchema, path.join(dir, 'guides'));
}

let cached: Guide[] | undefined;

export function getGuides(): Guide[] {
  if (!cached) {
    const { items, problems } = loadGuides();
    cached = requireValid({ data: items, problems });
  }
  return cached;
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides().find((guide) => guide.slug === slug);
}
