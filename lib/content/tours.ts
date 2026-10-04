import path from 'node:path';
import { z } from 'zod';
import { loadCollection, slugSchema } from './collection.ts';
import { CONTENT_DIR } from './files.ts';
import { isoDate, latitude, longitude, nonEmpty, seasonSchema } from './fields.ts';
import { imageSchema } from './images.ts';
import { TRIP_TYPES } from '../utils/tourFilters.ts';

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

/** Who a trip suits, or may not: 2 to 5 short lines. */
const suitabilityLines = z.array(nonEmpty).min(2, 'List at least 2').max(5, 'List at most 5');

/** Something you'll see on the trip: a title, one line and a place photo. */
const highlightSchema = z.strictObject({ title: nonEmpty, text: nonEmpty, image: imageSchema });

/** The design's nine inclusion icons. */
const INCLUSION_ICONS = ['hotel', 'meals', 'transport', 'guide', 'jeep', 'lunch', 'personal', 'tickets', 'flights'] as const;

/** A row in "What the price includes": "Hotels · 8 nights in 3-star hotels, twin sharing". */
const inclusionSchema = z.strictObject({ icon: z.enum(INCLUSION_ICONS), title: nonEmpty, text: nonEmpty });

/**
 * Where you stay for a run of nights. Never a hotel's name, real or invented: a generic title
 * ("Hotel in Karimabad") and a photo of the town or valley (PRD #47).
 */
const staySchema = z.strictObject({
  /** Nights from and to, counting the first night as 1. */
  nights: z.strictObject({ from: z.int().positive(), to: z.int().positive() }),
  /** Where, for the nights label: "Nights 3–5 · Hunza". */
  place: nonEmpty,
  title: nonEmpty,
  /** e.g. "3-star · valley view". */
  description: nonEmpty,
  image: imageSchema,
});

/** A stop on the itinerary map (schematic, CLAUDE.md §8). The label sits beside or below it. */
const stopSchema = z.strictObject({
  name: nonEmpty,
  lat: latitude,
  lon: longitude,
  label: z.enum(['left', 'right', 'below']),
});

/** One day of the itinerary: "Day 03 · Chilas → Hunza". */
const daySchema = z.strictObject({
  title: nonEmpty,
  text: nonEmpty,
  /** The map stops the day covers, in order (names from `stops`). Its last is where it ends. */
  stops: z.array(nonEmpty).min(1, 'Name at least one stop'),
  /** Where you sleep, e.g. "Karimabad, Hunza"; "Home" on the last day. */
  overnight: nonEmpty,
  meals: nonEmpty,
  /** e.g. "4–5 hrs". */
  drive: nonEmpty,
});

export const tourSchema = z
  .strictObject({
    slug: slugSchema,
    title: nonEmpty,
    /** One sentence, the page's meta description (search results and share previews show about 160 characters). */
    summary: nonEmpty.max(160, 'Keep it to 160 characters or fewer'),
    /** Stops in order, e.g. ["Lahore", "Hunza", "Skardu"]. */
    route: z.array(nonEmpty).min(2, 'A route needs at least two stops'),
    destinations: z.array(slugSchema).min(1),
    tripTypes: z.array(z.enum(TRIP_TYPES)).min(1),
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
      suitedTo: suitabilityLines,
      notSuitedTo: suitabilityLines,
    }),
    /** What you'll see along the way: a title, one line and a place photo each. */
    highlights: z.array(highlightSchema).min(3, 'List at least 3 highlights').max(6, 'List at most 6 highlights'),
    included: z.array(inclusionSchema).min(1),
    notIncluded: z.array(inclusionSchema).min(1),
    /** Each night of the trip, once: from night 1 to the last, with no gap or overlap. */
    stays: z.array(staySchema).min(1),
    /** The itinerary map's stops; the first is where the trip starts (Lahore). */
    stops: z.array(stopSchema).min(2, 'List at least two stops'),
    /** One entry per day. */
    itinerary: z.array(daySchema),
    /** The tour's own questions (altitude, roads and similar), before the shared booking FAQs. */
    faqs: z
      .array(z.strictObject({ question: nonEmpty, answer: nonEmpty }))
      .min(2, 'List at least 2 questions')
      .max(4, 'List at most 4 questions'),
  })
  .refine((t) => t.nights <= t.days, { message: 'Can’t have more nights than days', path: ['nights'] })
  .superRefine((tour, ctx) => {
    if (tour.itinerary.length !== tour.days) {
      ctx.addIssue({ code: 'custom', message: `Has ${tour.itinerary.length} days; the tour is ${tour.days}`, path: ['itinerary'] });
    }
    const names = new Set<string>();
    tour.stops.forEach(({ name }, i) => {
      if (names.has(name)) ctx.addIssue({ code: 'custom', message: `"${name}" is listed twice`, path: ['stops', i, 'name'] });
      names.add(name);
    });
    if (tour.stops[0].name !== tour.route[0]) {
      ctx.addIssue({ code: 'custom', message: `The first stop is where the trip starts: ${tour.route[0]}`, path: ['stops', 0, 'name'] });
    }
    tour.itinerary.forEach((day, i) =>
      day.stops.forEach((stop, j) => {
        if (!names.has(stop)) ctx.addIssue({ code: 'custom', message: `No stop named "${stop}"`, path: ['itinerary', i, 'stops', j] });
      }),
    );
  })
  .superRefine((tour, ctx) => {
    let next = 1;
    tour.stays.forEach(({ nights }, i) => {
      const path = ['stays', i, 'nights'];
      if (nights.from !== next) {
        const message = nights.from > next ? `Night ${next} has no stay` : `Night ${nights.from} is already covered`;
        ctx.addIssue({ code: 'custom', message, path: [...path, 'from'] });
      }
      if (nights.to < nights.from) ctx.addIssue({ code: 'custom', message: 'Ends before it starts', path: [...path, 'to'] });
      if (nights.to > tour.nights) {
        ctx.addIssue({ code: 'custom', message: `The tour has ${tour.nights} nights`, path: [...path, 'to'] });
      }
      next = Math.max(next, nights.to + 1);
    });
    if (next <= tour.nights) ctx.addIssue({ code: 'custom', message: `Night ${next} has no stay`, path: ['stays'] });
  })
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
