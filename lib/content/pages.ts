import path from 'node:path';
import { z } from 'zod';
import { PAGE_NAMES, type PageName } from '../routes.ts';
import { slugSchema } from './collection.ts';
import { CONTENT_DIR, displayPath, parseFile, requireValid } from './files.ts';
import { checkChosenReviews } from './links.ts';
import { loadReviews } from './reviews.ts';
import { SETTINGS_TOKENS, type CompanyToken, type PolicyToken, type SettingsToken } from '../utils/tokens.ts';
import { checkUniqueIds, copy, copyWith, nonEmpty, pastDate, sample } from './fields.ts';
import { photoSchema, ownerImageSchema } from './images.ts';
import { PLACE_KINDS } from '../utils/destination.ts';
import { MONTH_LEVELS, SEASONS } from '../utils/seasonCalendar.ts';
import { BUDGETS, DURATIONS, SORTS, TRIP_TYPES } from '../utils/tourFilters.ts';
import { DETAIL_ROWS, SUMMARY_ROWS } from '../utils/plannerSummary.ts';
import { BEST_TIMES, DATE_MODES, DEPARTING_FROM, GROUP_TYPES, HOTELS, PLANNER_BUDGETS, TRANSPORT, TRIP_LENGTHS } from '../utils/plannerOptions.ts';

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
  /** The tour's reviews, with its rating beside the headline. */
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
    /** "← All destinations", to the destinations page. */
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

/** The destinations page's wording (PRD #118): every destination on one page. */
const destinationsCopySchema = z.strictObject({
  title: copy,
  description: copy,
  /** The page header: the <h1> and the line under it. */
  header: z.strictObject({ headline: copy, lead: copy }),
  /** The grid's headline, and the label over each card's months ("Best season"). */
  destinations: z.strictObject({ headline: copy, seasonLabel: copy }),
  /** A private trip, in the planner or on WhatsApp (its photo is the Tours banner's). */
  banner: z.strictObject({ headline: copy, lead: copy, planLabel: copy, askLabel: copy }),
});

export type DestinationsCopy = z.infer<typeof destinationsCopySchema>;

export function destinationsCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'destinations.json');
}

export function loadDestinationsCopy(dir = CONTENT_DIR) {
  return parseFile(destinationsCopySchema, destinationsCopyFile(dir));
}

let cachedDestinations: DestinationsCopy | undefined;

export function getDestinationsCopy(): DestinationsCopy {
  cachedDestinations ??= requireValid(loadDestinationsCopy());
  return cachedDestinations;
}

/** A planner question answered with one chip: its label, hint and a label for every option. */
const chipQuestion = <T extends readonly [string, ...string[]]>(ids: T) =>
  z.strictObject({ label: copy, hint: copy, options: z.record(z.enum(ids), copy) });

/** A counter in "Group size": "Adults", "18 and over", and the stepper's buttons. */
const counterRow = z.strictObject({ label: copy, hint: copy, fewer: copy, more: copy });

/** The Trip Planner's wording (PRD #71): the header, the steps' labels, option words and messages. */
const plannerCopySchema = z.strictObject({
  /** The <title> part: "Plan a private trip from Lahore". */
  title: copy,
  description: copy,
  /** The page's one <h1>: in full on step 1, then the slim line on every later step. */
  header: z.strictObject({
    headline: copy,
    lead: copyWith('replyTime'),
    slim: copy,
    /** The photo band behind step 1's <h1> and lead, also the page's share image. */
    image: photoSchema,
  }),
  /** The progress heading: "Step 1 of 3 · Where and when", then "Review · Check and send". */
  progress: z.strictObject({ step: copyWith('step', 'title'), review: copy }),
  /** Each step's title, in the progress heading and the Next button. */
  steps: z.strictObject({ whereWhen: copy, whosComing: copy, details: copy }),
  /** Next names the step it goes to: "Next: Who’s coming". */
  /** Next names the step it goes to; on phones (below 820px) the bottom bar's Next is short. */
  nav: z.strictObject({ back: copy, next: copyWith('title'), nextShort: copy, review: copy }),
  whereWhen: z.strictObject({
    destinations: z.strictObject({
      label: copy,
      hint: copy,
      unsure: copy,
      /** The "Not sure, suggest something" card's photo: open country, no place in particular. */
      unsureImage: photoSchema,
    }),
    dates: z.strictObject({
      label: copy,
      hint: copy,
      /** Names the "Exact dates" and "Flexible" pair. */
      modeLabel: copy,
      modes: z.record(z.enum(DATE_MODES), copy),
      from: copy,
      to: copy,
      month: copy,
    }),
    /** The trip's length, asked once (owner feedback, 2026-10-05: no "Roughly … days"). */
    length: z.strictObject({ label: copy, hint: copy, options: z.record(z.enum(TRIP_LENGTHS), copy) }),
  }),
  whosComing: z.strictObject({
    /** "Group size": a row for adults and one for children, each a label, a hint and a stepper. */
    group: z.strictObject({ label: copy, hint: copy, adults: counterRow, children: counterRow }),
    /** One select per child: "Child {count}", first option "Age", then "Under 2" and 2 to 17. */
    ages: z.strictObject({ label: copy, child: copyWith('count'), placeholder: copy, underTwo: copy }),
    groupType: chipQuestion(GROUP_TYPES),
    hotels: chipQuestion(HOTELS),
    transport: chipQuestion(TRANSPORT),
    /** Always answered (Lahore by default); "Other city" shows a field for the city. */
    departingFrom: chipQuestion(DEPARTING_FROM).extend({ otherCity: copy, otherCityPlaceholder: copy }),
    budget: chipQuestion(PLANNER_BUDGETS),
  }),
  details: z.strictObject({
    name: z.strictObject({ label: copy, hint: copy, placeholder: copy }),
    /** "WhatsApp number": "+92" and a Pakistani mobile, or "Outside Pakistan?" for a country code and number. */
    phone: z.strictObject({
      label: copy,
      hint: copy,
      prefix: copy,
      placeholder: copy,
      abroad: copy,
      pakistani: copy,
      countryCode: copy,
      number: copy,
    }),
    bestTime: chipQuestion(BEST_TIMES),
    notes: z.strictObject({ label: copy, hint: copy, placeholder: copy }),
    /** "We only use your details to plan this trip. {link}.": {link} is the privacy policy link, named by `link`. */
    privacy: z.strictObject({ text: copyWith('link'), link: copy }),
  }),
  /** How the trip is written in the review, the side column and the message. */
  summary: z.strictObject({
    /** "Not sure" among the destinations: "Suggest something". */
    unsure: copy,
    exactDates: copyWith('from', 'to'),
    adults: z.strictObject({ one: copyWith('count'), other: copyWith('count') }),
    children: z.strictObject({ one: copyWith('count'), other: copyWith('count') }),
    /** After the children: "(age 6)", "(ages 6, 9)". */
    ages: z.strictObject({ one: copyWith('ages'), other: copyWith('ages') }),
    /** A child under 2 in that list. */
    underTwo: copy,
  }),
  /** Review · Check and send: every answer with Edit per step, the message, and the two ways to send it. */
  review: z.strictObject({
    rows: z.record(z.enum([...SUMMARY_ROWS, ...DETAIL_ROWS]), copy),
    edit: copy,
    /** The Edit button's name: "Edit where and when" ({section} is the step's title, in lower case). */
    editLabel: copyWith('section'),
    notGiven: copy,
    previewTitle: copy,
    previewNote: copy,
    send: copy,
    callBack: copy,
  }),
  /** After sending: "Thanks, Ayesha." ({firstName}), what happens next, and the ways on. */
  success: z.strictObject({
    headline: copyWith('firstName'),
    line: copyWith('replyTime'),
    browse: copy,
    explore: copy,
    again: copy,
  }),
  /** "Your trip so far": the postcard beside the form from 1100px, and the summary bar's rows below. */
  aside: z.strictObject({
    label: copy,
    /** "2 of 9": how many rows are answered. */
    answered: copyWith('count'),
    /** An empty row: "Not yet". */
    notYet: copy,
    /** The postcard's photo until a destination is chosen (or with only "Not sure"). */
    image: photoSchema,
    rows: z.record(z.enum(SUMMARY_ROWS), copy),
  }),
  /** The summary bar's label on phones: "Hunza · Jun · 4 people". */
  bar: z.strictObject({
    yourTrip: copy,
    suggestions: copy,
    noDates: copy,
    more: copyWith('count'),
    people: z.strictObject({ one: copyWith('count'), other: copyWith('count') }),
  }),
  /** "What happens next": three steps in order, then the licence line. */
  next: z.strictObject({
    title: copy,
    steps: z.array(copyWith('replyTime', 'advancePercent')).length(3, 'List exactly three steps'),
    licence: copyWith('dtsLicence'),
    office: copy,
  }),
  /** Each message beside its field after Next (DESIGN.md §2: the "!" badge and the error colour). */
  errors: z.strictObject({
    destinations: copy,
    month: copy,
    dates: copy,
    pastDate: copy,
    endBeforeStart: copy,
    ages: copy,
    name: copy,
    phoneEmpty: copy,
    /** {count} is how many digits there are: "(9 of 10 digits)". */
    phoneIncomplete: copyWith('count'),
    phoneInvalid: copy,
    phoneIntl: copy,
  }),
});

export type PlannerCopy = z.infer<typeof plannerCopySchema>;

export function plannerCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'planner.json');
}

export function loadPlannerCopy(dir = CONTENT_DIR) {
  return parseFile(plannerCopySchema, plannerCopyFile(dir));
}

let cachedPlanner: PlannerCopy | undefined;

export function getPlannerCopy(): PlannerCopy {
  cachedPlanner ??= requireValid(loadPlannerCopy());
  return cachedPlanner;
}

/**
 * The About page's wording (PRD #78). Invented claims about the company carry `sample: true`
 * (ADR-0019); headlines and labels are page copy and aren't flagged.
 */
const aboutCopySchema = z.strictObject({
  title: copy,
  description: copy,
  /** The page header: the <h1>, the line under it and a wide photo, also the page's share image. */
  header: z.strictObject({ headline: copy, lead: copy, image: photoSchema }),
  /** "Running trips north since {foundedYear}" (the year from `trust.operatingSince`), the story and the founder. */
  story: z.strictObject({
    headline: copyWith('foundedYear'),
    paragraphs: z.array(copy).min(1, 'Write at least one paragraph'),
    founder: z.strictObject({
      name: nonEmpty,
      /** Under the name: "Founder". */
      role: copy,
      /** The owner's photo only (ADR-0009); a placeholder until then. */
      portrait: ownerImageSchema,
    }),
    sample,
  }),
  /** "How we run every trip": plain points, not a sequence, so never numbered. */
  principles: z.strictObject({
    headline: copy,
    items: z.array(z.strictObject({ title: copy, text: copy, sample })).min(1, 'List at least one principle'),
  }),
  /** "The full team of guides and drivers" (#guides): every guide's card, and the profile each opens. */
  guides: z.strictObject({
    headline: copy,
    intro: copy,
    /** Under each card's role. */
    viewProfile: copy,
    profile: z.strictObject({
      /** The label of each row under the bio. */
      rows: z.strictObject({ home: copy, joined: copy, languages: copy, leads: copy, licence: copy }),
      /** "With us": "Since 2016". */
      since: copyWith('year'),
      /** Beside the name: "2 of 6". */
      counter: copyWith('index', 'total'),
      /** Read out after Next or Previous: "Ali Raza, 2 of 6". */
      announcement: copyWith('name', 'counter'),
      previous: copy,
      next: copy,
      share: copy,
    }),
  }),
  /** "Our vehicles, and how we keep you safe": the fleet, its age and the safety practices (all sample, ADR-0019). */
  vehicles: z.strictObject({
    headline: copy,
    /**
     * Each vehicle: its name, what it's for ("22 seats · air-conditioned · group departures") and,
     * until the owner's photos of the real fleet, a stock photo of the type: no people, no other
     * company's name (ADR-0019).
     */
    items: z
      .array(z.strictObject({ name: copy, summary: copy, image: photoSchema, sample }))
      .min(1, 'List at least one vehicle'),
    /** "Average age of our fleet:" and "4 years". */
    fleetAge: z.strictObject({ label: copy, value: copy, sample }),
    /** "How we keep you safe" and the practices, one per row. */
    safety: z.strictObject({ title: copy, items: z.array(copy).min(1, 'List at least one practice'), sample }),
  }),
  /** The company in numbers: a heading only read out, each stat's label, and the travellers figure (sample). */
  numbers: z.strictObject({
    headline: copy,
    labels: z.strictObject({ years: copy, trips: copy, travellers: copy, guides: copy }),
    /** As shown, e.g. "9,000+". Years and trips come from the trust settings; guides are counted. */
    travellers: z.strictObject({ value: copy, sample }),
  }),
  /** "Credentials": the only section with a label instead of a headline (DESIGN.md §6). */
  credentials: z.strictObject({
    label: copy,
    /** "DTS licence No. {dtsLicence}", the licence from settings, over the trust strip's note. */
    licence: z.strictObject({ label: copy, value: copyWith('dtsLicence') }),
    /** The company registration, from settings. */
    company: z.strictObject({ label: copy }),
    /** Associations the company belongs to; the row is left out with none. Never a real organisation until confirmed. */
    memberships: z.strictObject({ label: copy, items: z.array(z.strictObject({ name: copy, sample })) }),
  }),
  /** "What travellers say about our guides and drivers": the reviews to show, by slug, in order (no rating summary). */
  reviews: z.strictObject({
    headline: copy,
    chosen: z
      .array(slugSchema)
      .min(1, 'Choose at least one review')
      .max(3, 'Choose at most three reviews')
      .refine((slugs) => new Set(slugs).size === slugs.length, 'Choose each review only once'),
  }),
  /** The closing call to action: "Start planning your trip north", to the tours and the planner. */
  cta: z.strictObject({ headline: copy, exploreLabel: copy, planLabel: copy }),
});

export type AboutCopy = z.infer<typeof aboutCopySchema>;

export function aboutCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'about.json');
}

/** Reads About's copy and checks each chosen review has a file. */
export function loadAboutCopy(dir = CONTENT_DIR) {
  const result = parseFile(aboutCopySchema, aboutCopyFile(dir));
  if (!result.data) return result;
  const missing = checkChosenReviews(result.data.reviews.chosen, displayPath(aboutCopyFile(dir)), loadReviews(dir).files);
  return missing.length > 0 ? { data: null, problems: missing } : result;
}

let cachedAbout: AboutCopy | undefined;

export function getAboutCopy(): AboutCopy {
  cachedAbout ??= requireValid(loadAboutCopy());
  return cachedAbout;
}

/** The tokens Help's policies may use, so no figure from settings is typed into them. */
const POLICY_TEXT_TOKENS = [
  'advancePercent',
  'paymentMethods',
  'refundSchedule',
  'fullRefundDays',
  'refundPaidWithinDays',
  'balanceDueDays',
  'childFromAge',
  'replyTime',
  'officeHours',
  'travelSupport',
  'brand',
] as const satisfies readonly (SettingsToken | PolicyToken | CompanyToken)[];

/**
 * One booking policy: a short summary, the refund table from settings where it applies, and the
 * full text. Sample text until the owner's lawyer has reviewed it, marked `sample: true` (ADR-0020).
 */
const policySchema = z.strictObject({
  id: slugSchema,
  title: copy,
  summary: copyWith(...POLICY_TEXT_TOKENS),
  /** Show the refund table, built from the settings refund schedule. */
  refundTable: z.literal(true, { error: 'Use refundTable: true, or leave it out' }).optional(),
  paragraphs: z.array(copyWith(...POLICY_TEXT_TOKENS)).min(1, 'Write at least one paragraph'),
  sample,
});

/** The Help page's wording (PRD #86); its questions and answers are the shared FAQs (content/faqs.json). */
const helpCopySchema = z.strictObject({
  title: copy,
  description: copy,
  /** The page's <h1>. */
  header: z.strictObject({ headline: copy }),
  /** The category list beside the questions (chips on phones): its name, and each link's count read out ("4 answers"). */
  categories: z.strictObject({ label: copy, count: countWords }),
  /** Under each answer: "Link to this answer · {path}", the answer's own address (/help#refunds). */
  linkToAnswer: copyWith('path'),
  /** The search in the header: its hidden label, the field's placeholder, the clear button's name and the result line. */
  search: z.strictObject({
    label: copy,
    placeholder: copy,
    clear: copy,
    /** Under the field once typing stops: "3 answers for “refund”", "1 answer for “altitude”", "No answers for “visa”". */
    results: z.strictObject({ many: copyWith('count', 'query'), one: copyWith('count', 'query'), none: copyWith('query') }),
  }),
  /** When nothing matches. The headline's wording is fixed (DESIGN.md §6); the lead may say the reply time. */
  empty: z.strictObject({ headline: copy, lead: copyWith('replyTime'), askLabel: copy, clearLabel: copy }),
  /** When the policies were last updated: not after the build date. */
  policiesUpdated: pastDate,
  /** "Our booking policies, in plain words" (#policies). */
  policies: z.strictObject({
    headline: copy,
    /** Beside the headline: "Last updated {date}". */
    lastUpdated: copyWith('date'),
    /** The disclosure's summary, closed and open. */
    readMore: copy,
    hide: copy,
    /** The refund table's words: its hidden caption, column headers, and each row's days and share. */
    refundTable: z.strictObject({
      caption: copy,
      days: copy,
      refund: copy,
      /** "14 or more days", "7–13 days", "Under 7 days"; "50%", and "None" for nothing back. */
      from: copyWith('days'),
      range: copyWith('from', 'to'),
      /** A range of one day: "7 days". */
      single: copyWith('days'),
      under: copyWith('days'),
      percent: copyWith('percent'),
      none: copy,
    }),
    items: z
      .array(policySchema)
      .min(1, 'List at least one policy')
      .superRefine((items, ctx) => checkUniqueIds(items.map(({ id }, i) => ({ id, path: [i] })), ctx)),
  }),
  /** "Still have a question? Ask us on WhatsApp": "Call us" shows only once the phone number is real. */
  cta: z.strictObject({ headline: copy, lead: copyWith('replyTime', 'officeHours'), askLabel: copy, callLabel: copy }),
});

export type HelpCopy = z.infer<typeof helpCopySchema>;

export function helpCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'help.json');
}

export function loadHelpCopy(dir = CONTENT_DIR) {
  return parseFile(helpCopySchema, helpCopyFile(dir));
}

let cachedHelp: HelpCopy | undefined;

export function getHelpCopy(): HelpCopy {
  cachedHelp ??= requireValid(loadHelpCopy());
  return cachedHelp;
}

/** The Contact page's wording (PRD #86); the numbers, email and hours come from settings. */
const contactCopySchema = z.strictObject({
  title: copy,
  description: copy,
  /** The header: the <h1> and the lead (no label: the owner removed it, as it repeated the headline). */
  header: z.strictObject({ headline: copy, lead: copyWith('replyTime', 'officeHours') }),
  /** "Ways to reach us" (a heading read out, not shown) and each channel's words. */
  ways: z.strictObject({
    headline: copy,
    whatsapp: z.strictObject({ label: copy, line: copyWith('replyTime'), chatLabel: copy }),
    phone: z.strictObject({ label: copy }),
    email: z.strictObject({ label: copy, line: copy }),
  }),
  /**
   * "On a trip right now?": the heading, the line under it, the two people to call (the guide, whose
   * number is in the trip confirmation, and the support line's label) and the call button.
   */
  onTrip: z.strictObject({ heading: copy, line: copy, guide: z.strictObject({ label: copy, note: copy }), support: copy, callLabel: copy }),
  /** The phones' banner at the top of the page, to the on-trip panel. */
  banner: copy,
  /** "Quick links" (the section's label and heading), each link's words, and "Follow the trips" over the social links. */
  quickLinks: z.strictObject({
    label: copy,
    links: z.strictObject({ plan: copy, tours: copy, help: copy, policies: copy }),
    follow: copy,
  }),
});

export type ContactCopy = z.infer<typeof contactCopySchema>;

export function contactCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'contact.json');
}

export function loadContactCopy(dir = CONTENT_DIR) {
  return parseFile(contactCopySchema, contactCopyFile(dir));
}

let cachedContact: ContactCopy | undefined;

export function getContactCopy(): ContactCopy {
  cachedContact ??= requireValid(loadContactCopy());
  return cachedContact;
}

/**
 * The tokens the Privacy Policy and the Terms may use: the company's details and the booking
 * policies, so no figure from settings is ever typed into them.
 */
export const LEGAL_TOKENS = [
  'brand',
  'email',
  'phone',
  'whatsapp',
  'officeAddress',
  'dtsLicence',
  'companyRegistration',
  'replyTime',
  'advancePercent',
  'paymentMethods',
  'refundSchedule',
  'fullRefundDays',
  'refundPaidWithinDays',
  'balanceDueDays',
  'childFromAge',
] as const satisfies readonly (SettingsToken | PolicyToken | CompanyToken)[];

/** One numbered section: its anchor (/privacy#cookies), its heading and its paragraphs. */
const legalSectionSchema = z.strictObject({
  id: slugSchema,
  heading: copy,
  paragraphs: z.array(copyWith(...LEGAL_TOKENS)).min(1, 'Write at least one paragraph'),
});

/**
 * A legal document (/privacy or /terms). Sample text until the owner's lawyer has reviewed it,
 * marked `sample: true` (ADR-0020); the owner removes the field once it has been.
 */
const legalDocumentSchema = z.strictObject({
  /** The <title> part, e.g. "Privacy policy". */
  title: copy,
  description: copy,
  /** The page's <h1>, in sentence case. */
  headline: copy,
  /** "Last updated": the date of this version, not after the build date. */
  lastUpdated: pastDate,
  /** The article's last line: "Questions about this policy? Email {email}." (a link once the email is real). */
  closing: copyWith('email'),
  sample,
  /** Numbered in this order; each anchor once only. */
  sections: z
    .array(legalSectionSchema)
    .min(1, 'Write at least one section')
    .superRefine((sections, ctx) => checkUniqueIds(sections.map(({ id }, i) => ({ id, path: [i] })), ctx)),
});

/** The legal pages' wording (PRD #86): the template's labels and both documents, which share one layout. */
const legalCopySchema = z.strictObject({
  labels: z.strictObject({
    /** Over the contents list from 820px. */
    contents: copy,
    /** The contents list's disclosure on phones: "Contents (9)". */
    contentsCount: copyWith('count'),
    /** Under the <h1>: "Last updated 4 October 2026". */
    lastUpdated: copyWith('date'),
  }),
  privacy: legalDocumentSchema,
  terms: legalDocumentSchema,
});

export type LegalCopy = z.infer<typeof legalCopySchema>;

/** Which legal document a page shows. */
export type LegalDocumentId = 'privacy' | 'terms';

export function legalCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'legal.json');
}

export function loadLegalCopy(dir = CONTENT_DIR) {
  return parseFile(legalCopySchema, legalCopyFile(dir));
}

let cachedLegal: LegalCopy | undefined;

export function getLegalCopy(): LegalCopy {
  cachedLegal ??= requireValid(loadLegalCopy());
  return cachedLegal;
}

/**
 * The not-found page's wording (PRD #94): the header's <h1> and lead, the empty state's headline,
 * lead and two labels, and the quick link rows, each to a page in the route map by name. The
 * quick links' label and "Follow the trips" are Contact's.
 */
const notFoundCopySchema = z.strictObject({
  title: copy,
  description: copy,
  header: z.strictObject({ headline: copy, lead: copy }),
  empty: z.strictObject({ headline: copy, lead: copy, toursLabel: copy, askLabel: copy }),
  quickLinks: z
    .array(z.strictObject({ label: copy, page: z.enum(PAGE_NAMES as [PageName, ...PageName[]]) }))
    .min(1, 'List at least one quick link'),
});

export type NotFoundCopy = z.infer<typeof notFoundCopySchema>;

export function notFoundCopyFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'pages', 'not-found.json');
}

export function loadNotFoundCopy(dir = CONTENT_DIR) {
  return parseFile(notFoundCopySchema, notFoundCopyFile(dir));
}

let cachedNotFound: NotFoundCopy | undefined;

export function getNotFoundCopy(): NotFoundCopy {
  cachedNotFound ??= requireValid(loadNotFoundCopy());
  return cachedNotFound;
}
