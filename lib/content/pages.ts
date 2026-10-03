import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { copy } from './fields.ts';
import { photoSchema } from './images.ts';

/*
 * Page copy (CLAUDE.md §7): each page's wording lives in content/pages, so components never
 * hard-code it. `title` is the page's part of the <title>; the brand is added from settings.
 */

const homeSchema = z.strictObject({
  title: copy,
  description: copy,
  hero: z.strictObject({
    lead: copy,
    exploreLabel: copy,
    whatsappLabel: copy,
    /** The large decorative word at the foot of the hero, hidden from screen readers. */
    displayWord: copy,
    /** Also the page's share image, cropped to 1200×630 by `pnpm images`. */
    image: photoSchema,
  }),
  statement: z.strictObject({
    /** The page's <h1>. */
    headline: copy,
    body: copy,
    linkLabel: copy,
  }),
  departures: z.strictObject({
    headline: copy,
    /** Beside the headline: what the prices mean. */
    note: copy,
    allToursLabel: copy,
  }),
});

export type HomeCopy = z.infer<typeof homeSchema>;

export function homeCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'home.json');
}

export function loadHomeCopy(dir = CONTENT_DIR) {
  return parseFile(homeSchema, homeCopyFile(dir));
}

let cachedHome: HomeCopy | undefined;

export function getHomeCopy(): HomeCopy {
  cachedHome ??= requireValid(loadHomeCopy());
  return cachedHome;
}
