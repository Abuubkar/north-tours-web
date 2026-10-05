import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { CONTENT_DIR } from './files.ts';
import { latitude, longitude, nonEmpty, sample, seasonSchema } from './fields.ts';
import { imageSchema } from './images.ts';
import { PLACE_KINDS } from '../utils/destination.ts';
import { bestSeasonProblems, MONTH_LEVELS, SEASONS } from '../utils/seasonCalendar.ts';

/** A stop on the road from Lahore: its name, and the drive to the next stop ("4–5 hrs"), which the last has none of. */
const roadStopSchema = z.strictObject({ name: nonEmpty, drive: nonEmpty.optional() });

/** A place to see: a kind, one line, where it is (for the places map) and a place photo, never people (ADR-0009). */
const placeSchema = z.strictObject({
  /** Unique within the destination, e.g. "baltit-fort". */
  id: slugSchema,
  name: nonEmpty,
  kind: z.enum(PLACE_KINDS),
  /** One line, e.g. "The centuries-old fort above Karimabad, restored and open to visitors." */
  text: nonEmpty,
  lat: latitude,
  lon: longitude,
  image: imageSchema,
});

/** Every trip leaves from Lahore. */
const ROAD_START = 'Lahore';

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
    /** What to see, 1 to 8 places, numbered in this order. Leave it out to hide the section. */
    places: z.array(placeSchema).min(1, 'List at least one place, or leave places out').max(8, 'List at most 8 places').optional(),
    /** The road from Lahore: its stops in order (Lahore first, the destination last), a "By road" and a "By air" note. */
    gettingThere: z.strictObject({
      stops: z.array(roadStopSchema).min(2, 'List at least two stops: Lahore and the destination'),
      byRoad: nonEmpty,
      byAir: nonEmpty,
    }),
    /** Good to know before you go: up to 6 practical notes. Empty or left out hides the section. */
    notes: z.array(z.strictObject({ title: nonEmpty, text: nonEmpty })).max(6, 'List at most 6 notes').optional(),
    /**
     * Names on the places map for context, e.g. "Karimabad"; one beyond the map shows at its edge ("↓ Gilgit"). The one
     * marked `entry: true` is the way in: the map's route line starts there (at the edge for one beyond the map).
     */
    mapLabels: z
      .array(
        z.strictObject({
          name: nonEmpty,
          lat: latitude,
          lon: longitude,
          entry: z.literal(true, { error: 'Use entry: true for the way in, or leave it out' }).optional(),
        }),
      )
      .optional(),
    /** A sample destination (ADR-0022), until the owner confirms it. */
    sample,
  })
  .superRefine((destination, ctx) => {
    for (const { month, message } of bestSeasonProblems(destination.months, destination.bestSeason)) {
      ctx.addIssue({ code: 'custom', message, path: ['months', month] });
    }
    const ids = new Set<string>();
    destination.places?.forEach(({ id }, i) => {
      if (ids.has(id)) ctx.addIssue({ code: 'custom', message: `"${id}" is used twice`, path: ['places', i, 'id'] });
      ids.add(id);
    });
    destination.mapLabels?.forEach(({ entry }, i, labels) => {
      if (entry && labels.findIndex((label) => label.entry) < i) {
        ctx.addIssue({ code: 'custom', message: 'Only one label is the way in', path: ['mapLabels', i, 'entry'] });
      }
    });
    const { stops } = destination.gettingThere;
    if (stops[0].name !== ROAD_START) {
      ctx.addIssue({ code: 'custom', message: `The road starts at ${ROAD_START}`, path: ['gettingThere', 'stops', 0, 'name'] });
    }
    stops.forEach((stop, i) => {
      const last = i === stops.length - 1;
      if (!last && !stop.drive) {
        ctx.addIssue({ code: 'custom', message: 'Add the drive to the next stop, e.g. "4–5 hrs"', path: ['gettingThere', 'stops', i, 'drive'] });
      }
      if (last && stop.drive) {
        ctx.addIssue({ code: 'custom', message: 'The last stop is the destination: no drive after it', path: ['gettingThere', 'stops', i, 'drive'] });
      }
    });
    destination.seasons.forEach(({ season }, i) => {
      if (season !== SEASONS[i]) {
        ctx.addIssue({ code: 'custom', message: `List the seasons in order: ${SEASONS[i]} comes here`, path: ['seasons', i, 'season'] });
      }
    });
  });

export type Destination = z.infer<typeof destinationSchema>;
export type Place = z.infer<typeof placeSchema>;

export function loadDestinations(dir = CONTENT_DIR) {
  return loadCollection(destinationSchema, path.join(dir, 'destinations'));
}
