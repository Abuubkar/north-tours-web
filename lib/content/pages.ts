import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { SETTINGS_TOKENS } from '../utils/tokens.ts';
import { copy, copyWith } from './fields.ts';
import { photoSchema } from './images.ts';
import { PLACE_KINDS } from '../utils/destination.ts';
import { MONTH_LEVELS, SEASONS } from '../utils/seasonCalendar.ts';
import { BUDGETS, DURATIONS, SORTS, TRIP_TYPES } from '../utils/tourFilters.ts';

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

const roomRow = z.strictObject({ label: copy, note: copy });

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
  /** The headings over the tour's suitability lists (the overview's headline is the tour's own). */
  overview: z.strictObject({ suitedTo: copy, notSuitedTo: copy }),
  highlights: z.strictObject({ headline: copy }),
  /** "The route, day by day" (#itinerary). */
  itinerary: z.strictObject({
    headline: copy,
    /** Over each day's title: {number} is "01". */
    dayLabel: copyWith('number'),
    overnight: copy,
    meals: copy,
    drive: copy,
    /** The side map (from 1280px). */
    map: z.strictObject({
      /** Its header on a day: "Day 03 of 09". */
      day: copyWith('day', 'days'),
      /** Its header before day 1, over the start's name. */
      start: copy,
      /** Read out in place of the drawing. */
      description: copy,
      caption: copy,
    }),
  }),
  /** "What the price includes" (#included) and its two lists' headings. */
  included: z.strictObject({ headline: copy, included: copy, notIncluded: copy }),
  hotels: z.strictObject({
    headline: copy,
    /** Each stay's line: {description} is the stay's own, e.g. "3-star · valley view · twin sharing". */
    description: copyWith('description'),
    /** Under the stays. */
    note: copy,
  }),
  /** "Upcoming departures and prices" (#dates). */
  dates: z.strictObject({
    headline: copy,
    /** Under each row's dates: {tripLength} is "9 days, 8 nights". */
    rowMeta: copyWith('tripLength'),
    /** Under each row's twin price. */
    priceNote: copy,
    selectLabel: copy,
    /** The chosen row's button. */
    selectedLabel: copy,
    waitlistLabel: copy,
    /** "Room sharing": a row per room, its name and a note, beside the tour's price. */
    rooms: z.strictObject({
      heading: copy,
      twin: roomRow,
      triple: roomRow,
      quad: roomRow,
      note: copyWith(...SETTINGS_TOKENS),
    }),
  }),
  /** The booking panel (aside, and the sheet on phones). */
  booking: z.strictObject({
    /** Names the aside: "Book this tour". */
    label: copy,
    /** Under the price. */
    priceNote: copy,
    dateLabel: copy,
    /** The compact form's select (short screens), until a date is chosen. */
    choosePlaceholder: copy,
    travellersLabel: copy,
    travellersHint: copyWith(...SETTINGS_TOKENS),
    fewerTravellers: copy,
    moreTravellers: copy,
    roomLabel: copy,
    /** Each room's short name on its option, e.g. "Twin"; the WhatsApp message says "twin sharing". */
    rooms: z.strictObject({ twin: copy, triple: copy, quad: copy }),
    /** The trust line: "DTS licence No. {licence}" (from settings) · "Departs from {pickupPoint}". */
    trustLicence: copyWith('licence'),
    trustDeparts: copyWith(...SETTINGS_TOKENS),
    totalLabel: copy,
    /** In place of the total until a date is chosen. */
    chooseDate: copy,
    /** {advance} is the amount, e.g. "PKR 87,000". */
    advance: copyWith('advance', ...SETTINGS_TOKENS),
    reserveLabel: copyWith(...SETTINGS_TOKENS),
    /** A sold-out date chosen: {date} is its dates, e.g. "9–17 Jun". */
    soldOut: copyWith('date'),
    waitlistLabel: copy,
    askLabel: copy,
    cancelNote: copyWith(...SETTINGS_TOKENS),
  }),
  /** The sticky bar on phones and tablets (below 1100px). */
  bar: z.strictObject({
    /** Under the price once a date is chosen: {date} is its dates, e.g. "12–20 May". */
    dateNote: copyWith('date'),
    soldOutNote: copyWith('date'),
    /** Opens the booking sheet. */
    reserveLabel: copy,
    /** The WhatsApp button's accessible name. */
    askLabel: copyWith('tour'),
  }),
  /** The booking sheet: under its title (the tour), e.g. "9 days, 8 nights · from Lahore". */
  sheet: z.strictObject({ subtitle: copyWith('tripLength') }),
  /** The final call to action, "Hold your seats with a 30% advance". */
  cta: z.strictObject({ headline: copyWith(...SETTINGS_TOKENS), lead: copy }),
  /** The tour's reviews (#reviews), with its rating beside the headline. */
  reviews: z.strictObject({ headline: copy }),
  /** The tour's questions, then the shared booking ones (#faqs). */
  faqs: z.strictObject({ headline: copy }),
  /** Three other trips. */
  related: z.strictObject({ headline: copy }),
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

/** "{count} trip" and "{count} trips": a count of trips in the page's words. */
const countWords = z.strictObject({ one: copyWith('count'), other: copyWith('count') });

/** The Tours page's wording (PRD #56). */
const toursCopySchema = z.strictObject({
  title: copy,
  description: copy,
  /** The page header: the <h1> and the line under it. */
  header: z.strictObject({ headline: copy, lead: copy }),
  results: z.strictObject({
    /** The results heading, "8 trips". */
    count: countWords,
    /** Beside it from 820px: {sort} is the sort's label, in lower case. */
    sortedBy: copyWith('sort'),
  }),
  /** The filters: the bar's name, each group's label, and the fixed groups' options by id. */
  filters: z.strictObject({
    /** Names the desktop bar for screen readers: "Filter trips". */
    label: copy,
    groups: z.strictObject({ dest: copy, dur: copy, budget: copy, type: copy, month: copy }),
    /** Every option needs a label (destinations use their names, months their dates). */
    options: z.strictObject({
      dur: z.record(z.enum(DURATIONS), copy),
      budget: z.record(z.enum(BUDGETS), copy),
      type: z.record(z.enum(TRIP_TYPES), copy),
    }),
    /** Removes every filter (the sort stays). */
    clearAll: copy,
  }),
  /** Below 820px: the bar's buttons and the two sheets. */
  mobile: z.strictObject({
    filters: copy,
    sort: copy,
    filtersTitle: copy,
    sortTitle: copy,
    /** The filter sheet's button: "Show 2 trips"; with none, `noMatch`. */
    show: countWords,
    noMatch: copy,
  }),
  /** Before the current sort on its menu: "Sort:". */
  sortLabel: copy,
  /** Each sort's label by its id, e.g. "Soonest departure"; every sort needs one. */
  sorts: z.record(z.enum(SORTS), copy),
  /** After the first row of results: a private trip, to the planner or on WhatsApp. */
  banner: z.strictObject({
    headline: copy,
    lead: copy,
    planLabel: copy,
    askLabel: copy,
    /** A place photo until the owner supplies one of a family with their guide (ADR-0009). */
    image: photoSchema,
  }),
  /** The reviews' headline: read out, not shown. */
  reviews: z.strictObject({ headline: copy }),
  /** When no trip matches. The headline's wording is fixed (DESIGN.md §6). */
  empty: z.strictObject({
    headline: copy,
    lead: copy,
    /** Removes every filter (the sort stays). */
    clearLabel: copy,
    /** To the Trip Planner. */
    planLabel: copy,
  }),
});

export type ToursCopy = z.infer<typeof toursCopySchema>;

export function toursCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'tours.json');
}

export function loadToursCopy(dir = CONTENT_DIR) {
  return parseFile(toursCopySchema, toursCopyFile(dir));
}

let cachedTours: ToursCopy | undefined;

export function getToursCopy(): ToursCopy {
  cachedTours ??= requireValid(loadToursCopy());
  return cachedTours;
}

/** The destination page's wording (PRD #63); each destination fills in its name. */
const destinationCopySchema = z.strictObject({
  /** The <title> part: "Hunza tours from Lahore". */
  title: copyWith('destination'),
  hero: z.strictObject({
    /** "← All destinations", to the Homepage's destinations (there's no index page). */
    backLabel: copy,
  }),
  /** The facts under the hero's lead. */
  facts: z.strictObject({
    bestSeason: copy,
    altitude: copy,
    fromLahore: copy,
    /** How many tours visit; left out when none do. */
    tours: copy,
  }),
  /** "The best months to visit": the legend, each month's label, and each season's name and months. */
  calendar: z.strictObject({
    headline: copy,
    /** The legend's words for each level, e.g. "Avoid · closed or not recommended". */
    legend: z.record(z.enum(MONTH_LEVELS), copy),
    /** Each month's label, e.g. "Best". */
    levels: z.record(z.enum(MONTH_LEVELS), copy),
    /** Each season's name and its months, e.g. "Spring", "Mar – May". */
    seasons: z.record(z.enum(SEASONS), z.strictObject({ name: copy, months: copy })),
  }),
  /** "What to see in {destination}" (#places) and each kind's tag. */
  places: z.strictObject({
    headline: copyWith('destination'),
    kinds: z.record(z.enum(PLACE_KINDS), copy),
    /** Under the map, e.g. "Schematic · positions approximate"; hidden from screen readers with the drawing. */
    mapCaption: copy,
  }),
  /** "Getting there from Lahore by road": the route line and its two notes. */
  gettingThere: z.strictObject({
    headline: copy,
    byRoad: copy,
    byAir: copy,
    /** Under the destination on phones. */
    arrive: copy,
    /** Each leg read out: "{time} by road to {stop}", e.g. "4–5 hrs by road to Islamabad". */
    leg: copyWith('time', 'stop'),
  }),
  /** "Good to know before you go" (light). */
  goodToKnow: z.strictObject({ headline: copy }),
  /** "Tours that visit {destination}", and the cell after the cards that opens Tours filtered to it. */
  tours: z.strictObject({
    headline: copyWith('destination'),
    seeAll: copyWith('destination'),
    seeAllNote: copyWith('destination'),
  }),
  /** "What travellers said about {destination}": its tours' reviews, with no rating summary. */
  reviews: z.strictObject({ headline: copyWith('destination') }),
  /** "Other valleys we travel to": a card per other destination. */
  others: z.strictObject({
    headline: copy,
    /** Under each name: "Best · {season}", the short months, e.g. "Best · Apr – Oct". */
    season: copyWith('season'),
    /** How many tours visit: "{count} tour" and "{count} tours". */
    tourCount: z.strictObject({ one: copyWith('count'), other: copyWith('count') }),
  }),
  /** "{destination}, on your own dates": a private trip, in the planner or on WhatsApp (its photo is the Tours banner's). */
  banner: z.strictObject({
    headline: copyWith('destination'),
    lead: copy,
    planLabel: copy,
    askLabel: copy,
  }),
});

export type DestinationCopy = z.infer<typeof destinationCopySchema>;

export function destinationCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'destination.json');
}

export function loadDestinationCopy(dir = CONTENT_DIR) {
  return parseFile(destinationCopySchema, destinationCopyFile(dir));
}

let cachedDestination: DestinationCopy | undefined;

export function getDestinationCopy(): DestinationCopy {
  cachedDestination ??= requireValid(loadDestinationCopy());
  return cachedDestination;
}
