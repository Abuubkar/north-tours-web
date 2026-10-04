import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { CONTENT_DIR } from './files.ts';
import { nonEmpty, seasonSchema } from './fields.ts';
import { imageSchema } from './images.ts';
import { bestSeasonProblems, MONTH_LEVELS, SEASONS } from '../utils/seasonCalendar.ts';

export const destinationSchema = z
  .strictObject({
    slug: slugSchema,
    /** The page's <h1>, at display size. */
    name: nonEmpty,
    /** The line over the name in the hero. */
    region: z.enum(['Gilgit-Baltistan', 'Khyber Pakhtunkhwa', 'Punjab']),
    /** The page's meta description (search results and share previews show about 160 characters). */
    description: nonEmpty.max(160, 'Keep it to 160 characters or fewer'),
    /** The hero's one line under the name, e.g. "Forts, orchards and the Karakoram, three days up the highway from Lahore". */
    lead: nonEmpty,
    /** Best months to visit, e.g. Apr to Oct. */
    bestSeason: seasonSchema,
    /** The main town's altitude in metres, e.g. 2438 for Karimabad. */
    altitude: z.int('Use whole metres').min(0, 'Use metres above sea level'),
    /** How long the road from Lahore takes, as shown: "3 days by road", "5–7 hrs by road". */
    fromLahore: nonEmpty,
    /** The hero photo, also the page's share image. */
    image: imageSchema,
    /** "Why people go": a headline and one or two paragraphs. */
    overview: z.strictObject({
      headline: nonEmpty,
      paragraphs: z.array(nonEmpty).min(1, 'Write at least one paragraph').max(2, 'Keep it to two paragraphs'),
    }),
    /** The calendar: January to December, each best, good or avoid. */
    months: z.array(z.enum(MONTH_LEVELS)).length(12, 'List all twelve months, January to December'),
    /** A note on each season, spring to winter, one or two sentences each. */
    seasons: z.array(z.strictObject({ season: z.enum(SEASONS), text: nonEmpty })).length(4, 'Write a note for each of the four seasons'),
  })
  .superRefine((destination, ctx) => {
    for (const { month, message } of bestSeasonProblems(destination.months, destination.bestSeason)) {
      ctx.addIssue({ code: 'custom', message, path: ['months', month] });
    }
    destination.seasons.forEach(({ season }, i) => {
      if (season !== SEASONS[i]) {
        ctx.addIssue({ code: 'custom', message: `List the seasons in order: ${SEASONS[i]} comes here`, path: ['seasons', i, 'season'] });
      }
    });
  });

export type Destination = z.infer<typeof destinationSchema>;

export function loadDestinations(dir = CONTENT_DIR) {
  return loadCollection(destinationSchema, path.join(dir, 'destinations'));
}
