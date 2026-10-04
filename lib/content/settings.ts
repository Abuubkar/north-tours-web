import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { copyWith, emailOrPlaceholder, linkOrPlaceholder, nonEmpty, phoneOrPlaceholder } from './fields.ts';

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
    officeHours: nonEmpty,
    travelSupport: phoneOrPlaceholder,
  }),
  booking: z.strictObject({
    advancePercent: z.int().min(1).max(100),
    replyTime: nonEmpty,
    pickupPoint: nonEmpty,
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
  /** The trust strip (Homepage, Tours, Help, Contact): the same on every page. */
  trust: z.strictObject({
    /** The year the company started; "Operating" counts years from it. */
    operatingSince: z.int().min(1950, 'Use a year like 2014').max(new Date().getFullYear(), 'Can’t be in the future'),
    /** As shown, e.g. "1,200+". */
    tripsCompleted: nonEmpty,
    licence: z.strictObject({ label: nonEmpty, value: copyWith('licence'), note: nonEmpty }),
    operating: z.strictObject({ label: nonEmpty, value: copyWith('years'), note: nonEmpty }),
    trips: z.strictObject({ label: nonEmpty, note: nonEmpty }),
    payments: z.strictObject({ label: nonEmpty }),
  }),
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
  cached ??= requireValid(loadSettings());
  return cached;
}
