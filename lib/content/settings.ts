import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { emailOrPlaceholder, linkOrPlaceholder, nonEmpty, phoneOrPlaceholder } from './fields.ts';

const settingsSchema = z.strictObject({
  brand: z.strictObject({
    name: nonEmpty,
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
  /** WhatsApp wording, editable without touching code. */
  whatsapp: z.strictObject({
    /** Pre-filled in every general "WhatsApp us" link. */
    generalMessage: nonEmpty,
    /** The line above the footer's WhatsApp button. */
    footerIntro: nonEmpty,
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
