import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, parseFile, requireValid, FRESH_READS } from './files.ts';
import { copy, copyWith, emailOrPlaceholder, linkOrPlaceholder, nonEmpty, phoneOrPlaceholder, sample } from './fields.ts';

/**
 * How much of the advance is refunded, by days before departure: each row applies from
 * `daysBefore` days up to the row above it. Read as "14 or more days: 100%, 7–13 days: 50%,
 * under 7 days: none". It starts at a full refund and ends at 0 days.
 */
const refundScheduleSchema = z
  .array(z.strictObject({ daysBefore: z.int().min(0), refundPercent: z.int().min(0).max(100) }))
  .min(2, 'List at least a full refund and the last row (0 days)')
  .superRefine((rows, ctx) => {
    if (rows[0].refundPercent !== 100) {
      ctx.addIssue({ code: 'custom', message: 'The first row is the full refund: 100%', path: [0, 'refundPercent'] });
    }
    if (rows[rows.length - 1].daysBefore !== 0) {
      ctx.addIssue({ code: 'custom', message: 'The last row starts at 0 days', path: [rows.length - 1, 'daysBefore'] });
    }
    rows.slice(1).forEach((row, i) => {
      if (row.daysBefore >= rows[i].daysBefore) {
        ctx.addIssue({ code: 'custom', message: 'List rows from most days before to fewest', path: [i + 1, 'daysBefore'] });
      }
      if (row.refundPercent > rows[i].refundPercent) {
        ctx.addIssue({ code: 'custom', message: 'Can’t refund more than the row above', path: [i + 1, 'refundPercent'] });
      }
    });
  });

const settingsSchema = z.strictObject({
  brand: z.strictObject({
    name: nonEmpty,
  }),
  site: z.strictObject({
    /** The live address, e.g. https://example.pk. Share images use absolute URLs once it's set. */
    url: linkOrPlaceholder,
  }),
  contact: z.strictObject({
    whatsapp: phoneOrPlaceholder,
    phone: phoneOrPlaceholder,
    email: emailOrPlaceholder,
    officeAddress: nonEmpty,
    /**
     * How Google Maps finds the office, for the map, its link and "Get directions" (ADR-0029): the
     * address as Google knows it. Google doesn't know the plot ("16-R") or the floor, and with them
     * shows no place at all, so this is the street and block.
     */
    officeMapQuery: nonEmpty,
    officeHours: nonEmpty,
    travelSupport: phoneOrPlaceholder,
  }),
  /** `sample` (ADR-0022) while the advance and reply time are invented. */
  booking: z.strictObject({
    advancePercent: z.int().min(1).max(100),
    replyTime: nonEmpty,
    pickupPoint: nonEmpty,
    sample,
  }),
  /**
   * Booking policies, read by the booking panel, the FAQs and Help, so they always agree.
   * `sample` (ADR-0022) while the figures are invented.
   */
  policies: z.strictObject({
    refundSchedule: refundScheduleSchema,
    /** The balance is due this many days before departure. */
    balanceDueDays: z.int().min(0),
    /** A refund is paid back within this many days of cancelling (Help's policies, the FAQs and the Terms). */
    refundPaidWithinDays: z.int().min(1, 'Use at least 1 day'),
    /** Children count as travellers (and pay) from this age. */
    childFromAge: z.int().min(0).max(17),
    sample,
  }),
  payments: z.strictObject({
    /** Accepted methods, shown as they're written here (ADR-0008: cash and bank transfer). */
    methods: z
      .array(nonEmpty)
      .min(1, 'List at least one payment method')
      .refine((methods) => new Set(methods).size === methods.length, 'Each method only once'),
  }),
  legal: z.strictObject({
    dtsLicence: nonEmpty,
    companyRegistration: nonEmpty,
  }),
  social: z.strictObject({
    instagram: linkOrPlaceholder,
    facebook: linkOrPlaceholder,
    youtube: linkOrPlaceholder,
  }),
  /**
   * The trust strip (Homepage, Tours, Help, Contact): the same on every page. `sample`
   * (ADR-0022) while operating since and trips completed are invented.
   */
  trust: z.strictObject({
    /** The year the company started; "Operating" counts years from it. */
    operatingSince: z.int().min(1950, 'Use a year like 2014').max(new Date().getFullYear(), 'Can’t be in the future'),
    /** As shown, e.g. "1,200+". */
    tripsCompleted: nonEmpty,
    licence: z.strictObject({ label: nonEmpty, value: copyWith('licence'), note: nonEmpty }),
    operating: z.strictObject({ label: nonEmpty, value: copyWith('years'), note: nonEmpty }),
    trips: z.strictObject({ label: nonEmpty, note: nonEmpty }),
    /** The pickup point, in the Tour Detail strip. */
    departs: z.strictObject({ label: nonEmpty }),
    payments: z.strictObject({ label: nonEmpty }),
    sample,
  }),
  /**
   * "Plan your trip over chai at our Lahore office": the same block on About and Contact (as the
   * trust strip). The address, hours and numbers stay in `contact`.
   */
  visitOffice: z.strictObject({
    headline: nonEmpty,
    rows: z.strictObject({ office: nonEmpty, open: nonEmpty, phone: nonEmpty, whatsapp: nonEmpty }),
    /** To Google Maps directions, only once the address is real. */
    directionsLabel: nonEmpty,
    /** Opens WhatsApp with the general message. */
    whatsappLabel: nonEmpty,
    /** The office map's name for screen readers (its iframe's title, ADR-0029). */
    mapTitle: nonEmpty,
    /** The link under the map, to the address in Google Maps. */
    mapLinkLabel: nonEmpty,
  }),
  /**
   * The owner sets `surveyOfPakistanVetted` to true once the Survey of Pakistan has vetted the
   * route, itinerary and places maps (CLAUDE.md §8). Nothing on the site reads it; `pnpm
   * launch:check` lists the maps until then.
   */
  maps: z.strictObject({ surveyOfPakistanVetted: z.boolean() }),
  /** WhatsApp wording, editable without touching code. */
  whatsapp: z.strictObject({
    /** Pre-filled in every general "WhatsApp us" link. */
    generalMessage: nonEmpty,
    /** The line above the footer's WhatsApp button. */
    footerIntro: nonEmpty,
    /** A tour card's WhatsApp message: {tour} is its title, {date} the start date ("12 May 2027"). */
    tourMessage: copyWith('tour', 'date'),
    /** A sold-out card's message, with the same tokens. */
    waitlistMessage: copyWith('tour', 'date'),
    /**
     * "Share this profile on WhatsApp" on a guide's profile, sent to whoever the visitor picks:
     * {name}, {role} (in lower case) and {url}, the site's address and the guide's anchor.
     */
    guideShareMessage: copyWith('name', 'role', 'url'),
    /** "Ask on WhatsApp" on a destination page: {destination} is its name. */
    destinationMessage: copyWith('destination'),
    /** "Reserve with 30% advance" on the booking panel: everything the visitor chose, filled in. */
    reserveMessage: copyWith('travellers', 'tour', 'dates', 'room', 'total', 'advancePercent', 'advance'),
    /**
     * The Trip Planner's messages, a template per line: the trip request ("Send on WhatsApp") and
     * the call back. A line whose tokens are all empty is left out.
     */
    planner: z.strictObject({
      greeting: copy,
      destinations: copyWith('destinations'),
      dates: copyWith('dates'),
      group: copyWith('group'),
      stay: copyWith('hotels', 'transport'),
      departingFrom: copyWith('departingFrom'),
      budget: copyWith('budget'),
      bestTime: copyWith('bestTime'),
      notes: copyWith('notes'),
      name: copyWith('name'),
      phone: copyWith('phone'),
      callBack: copyWith('phone', 'bestTime'),
      /** Hotels or transport left open. */
      any: nonEmpty,
      /** No best time, in the call back. */
      anyTime: nonEmpty,
    }),
  }),
});

export type Settings = z.infer<typeof settingsSchema>;

export function settingsFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'settings.json');
}

/** Reads and validates settings; returns them with any problems found. */
export function loadSettings(dir = CONTENT_DIR) {
  return parseFile(settingsSchema, settingsFile(dir));
}

let cached: Settings | undefined;

/** Global values (CLAUDE.md §7). Throws a ContentError naming the file and field if invalid. */
export function getSettings(): Settings {
  if (FRESH_READS || cached === undefined) cached = requireValid(loadSettings());
  return cached;
}
