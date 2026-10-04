import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { CONTENT_DIR } from './files.ts';
import { isoDate, nonEmpty, seasonSchema } from './fields.ts';
import { imageSchema } from './images.ts';

const pkr = z.int('Use whole rupees').positive();

/**
 * Room prices per person (ADR-0017). Sharing a room never costs more per person, so the set
 * runs twin ≥ triple ≥ quad.
 */
const roomPricesSchema = z
  .strictObject({ twin: pkr, triple: pkr, quad: pkr })
  .refine((p) => p.triple <= p.twin, { message: 'Triple sharing can’t cost more than twin', path: ['triple'] })
  .refine((p) => p.quad <= p.triple, { message: 'Quad sharing can’t cost more than triple', path: ['quad'] });

export const departureSchema = z
  .strictObject({
    start: isoDate,
    end: isoDate,
    seatsTotal: z.int().positive(),
    seatsLeft: z.int().min(0, 'Seats left can’t be negative'),
    /** Only when this date costs something else (e.g. Eid): replaces the tour's whole set. */
    prices: roomPricesSchema.optional(),
  })
  .refine((d) => d.end >= d.start, { message: 'Must end on or after its start', path: ['end'] })
  .refine((d) => d.seatsLeft <= d.seatsTotal, {
    message: 'Seats left can’t be more than seats in total',
    path: ['seatsLeft'],
  });

/** 2 to 5 short lines, e.g. who a trip suits. */
const lines = z.array(nonEmpty).min(2, 'List at least 2').max(5, 'List at most 5');

/** A place on the trip with its photo, e.g. a highlight. */
const placeCard = z.strictObject({ title: nonEmpty, text: nonEmpty, image: imageSchema });

export const tourSchema = z
  .strictObject({
    slug: slugSchema,
    title: nonEmpty,
    /** One sentence, the page's meta description (search results and share previews show about 160 characters). */
    summary: nonEmpty.max(160, 'Keep it to 160 characters or fewer'),
    /** Stops in order, e.g. ["Lahore", "Hunza", "Skardu"]. */
    route: z.array(nonEmpty).min(2, 'A route needs at least two stops'),
    destinations: z.array(slugSchema).min(1),
    tripTypes: z.array(z.enum(['family', 'couples', 'friends', 'corporate'])).min(1),
    days: z.int().positive(),
    nights: z.int().min(0),
    /** Per person, by room sharing (ADR-0017). "From" is worked out from these, never stored. */
    prices: roomPricesSchema,
    /** Quick facts, as shown, e.g. "Easy walking, long road days". */
    difficulty: nonEmpty,
    /** As shown, e.g. "Coaster and jeeps". */
    transport: nonEmpty,
    /** The best months for this trip. */
    bestSeason: seasonSchema,
    rating: z.strictObject({
      score: z.number().min(1).max(5).multipleOf(0.1),
      count: z.int().min(0),
    }),
    image: imageSchema,
    departures: z.array(departureSchema),
    /** What kind of trip it is: the overview's headline and paragraphs, and who it suits. */
    overview: z.strictObject({
      headline: nonEmpty,
      paragraphs: z.array(nonEmpty).min(1, 'Write at least one paragraph').max(2, 'Keep it to two paragraphs'),
      suitedTo: lines,
      notSuitedTo: lines,
    }),
    /** What you'll see along the way: a title, one line and a place photo each. */
    highlights: z.array(placeCard).min(3, 'List at least 3 highlights').max(6, 'List at most 6 highlights'),
  })
  .refine((t) => t.nights <= t.days, { message: 'Can’t have more nights than days', path: ['nights'] })
  .superRefine((tour, ctx) => {
    const starts = new Set<string>();
    tour.departures.forEach((d, i) => {
      if (starts.has(d.start)) {
        ctx.addIssue({ code: 'custom', message: 'Two departures start on this date', path: ['departures', i, 'start'] });
      }
      starts.add(d.start);
      const length = daysBetween(d.start, d.end) + 1;
      if (length !== tour.days) {
        ctx.addIssue({
          code: 'custom',
          message: `Lasts ${length} days; the tour is ${tour.days}`,
          path: ['departures', i, 'end'],
        });
      }
    });
  });

export type Tour = z.infer<typeof tourSchema>;
export type Departure = z.infer<typeof departureSchema>;
export type RoomPrices = z.infer<typeof roomPricesSchema>;

function daysBetween(start: string, end: string): number {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000);
}

export function loadTours(dir = CONTENT_DIR) {
  const result = loadCollection(tourSchema, path.join(dir, 'tours'));
  for (const tour of result.items) tour.departures.sort((a, b) => a.start.localeCompare(b.start));
  return result;
}
