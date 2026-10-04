import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { consent } from './consent.ts';
import { CONTENT_DIR, requireItems } from './files.ts';
import { nonEmpty } from './fields.ts';
import { portraitSchema } from './images.ts';
import { checkGuideYears } from './links.ts';
import { loadSettings } from './settings.ts';

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
  /** Their home valley, e.g. "Karimabad, Hunza" (the profile's "Home valley"). */
  home: nonEmpty,
  /** The places or routes they lead, e.g. "Hunza", "Nagar", "Gilgit". */
  leads: z.array(nonEmpty).min(1, 'List at least one place or route').max(6, 'List at most six places or routes'),
  /** The year they joined: not before the company started (checked against settings) nor after this year. */
  joined: z.int().max(new Date().getFullYear(), 'Can’t be after this year'),
  /** A guide or driving licence as written, once the owner supplies it; never invented (ADR-0010). */
  licence: nonEmpty.optional(),
  /** Owner-supplied only (ADR-0009); a placeholder until the photo arrives. */
  portrait: portraitSchema,
  consent,
});

export type Guide = z.infer<typeof guideSchema>;

/**
 * Loads guides and checks each one joined no earlier than the company started. Pass
 * `operatingSince` when settings are already loaded; with invalid settings the check is skipped
 * (settings report their own problems).
 */
export function loadGuides(dir = CONTENT_DIR, operatingSince = loadSettings(dir).data?.trust.operatingSince) {
  const guides = loadCollection(guideSchema, path.join(dir, 'guides'));
  const years = operatingSince === undefined ? [] : checkGuideYears(guides.items, guides.files, operatingSince);
  return { ...guides, problems: [...guides.problems, ...years] };
}

let cached: Guide[] | undefined;

export function getGuides(): Guide[] {
  cached ??= requireItems(loadGuides());
  return cached;
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides().find((guide) => guide.slug === slug);
}
