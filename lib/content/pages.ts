import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { SETTINGS_TOKENS } from '../utils/tokens.ts';
import { copy, copyWith } from './fields.ts';
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
  how: z.strictObject({
    headline: copy,
    /** The four booking steps, in order. Text may use {advancePercent}, {paymentMethods} and {pickupPoint}. */
    steps: z
      .array(z.strictObject({ title: copy, text: copyWith(...SETTINGS_TOKENS) }))
      .length(4, 'List exactly four steps'),
  }),
  route: z.strictObject({
    headline: copy,
  }),
  destinations: z.strictObject({
    headline: copy,
    /** Above each destination's months. */
    seasonLabel: copy,
  }),
  guides: z.strictObject({
    headline: copy,
  }),
  reviews: z.strictObject({
    headline: copy,
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

const creditsSchema = z.strictObject({
  title: copy,
  description: copy,
  /** The page's <h1>. */
  headline: copy,
  intro: copy,
});

export type CreditsCopy = z.infer<typeof creditsSchema>;

export function creditsCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'credits.json');
}

export function loadCreditsCopy(dir = CONTENT_DIR) {
  return parseFile(creditsSchema, creditsCopyFile(dir));
}

let cachedCredits: CreditsCopy | undefined;

export function getCreditsCopy(): CreditsCopy {
  cachedCredits ??= requireValid(loadCreditsCopy());
  return cachedCredits;
}

/** The tour page's wording; each tour fills it in (the meta description is the tour's own summary). */
const tourCopySchema = z.strictObject({
  /** The <title> part: "Hunza & Skardu Grand, 9 days from Lahore". */
  title: copyWith('tour', 'duration'),
  hero: z.strictObject({
    /** "← All tours", to the Tours page. */
    backLabel: copy,
  }),
  /** The facts under the hero's title. */
  facts: z.strictObject({
    duration: copy,
    rating: copy,
    from: copy,
    /** Under the "from" price. */
    fromNote: copy,
    nextDeparture: copy,
  }),
  quickFacts: z.strictObject({
    difficulty: copy,
    groupSize: copy,
    /** {count} is the largest group on any of the tour's departures. */
    groupSizeValue: copyWith('count'),
    departsFrom: copy,
    bestSeason: copy,
    transport: copy,
  }),
});

export type TourCopy = z.infer<typeof tourCopySchema>;

export function tourCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'tour.json');
}

export function loadTourCopy(dir = CONTENT_DIR) {
  return parseFile(tourCopySchema, tourCopyFile(dir));
}

let cachedTour: TourCopy | undefined;

export function getTourCopy(): TourCopy {
  cachedTour ??= requireValid(loadTourCopy());
  return cachedTour;
}
