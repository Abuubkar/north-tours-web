import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, ContentError, parseFile } from './files.ts';
import { orPlaceholder, phone, text } from './fields.ts';

export const settingsSchema = z.strictObject({
  brand: z.strictObject({
    name: text,
  }),
  contact: z.strictObject({
    whatsapp: orPlaceholder(phone, 'a +92 number'),
    phone: orPlaceholder(phone, 'a +92 number'),
    email: orPlaceholder(z.email(), 'an email address'),
    officeAddress: text,
    officeHours: text,
    travelSupport: orPlaceholder(phone, 'a +92 number'),
  }),
  booking: z.strictObject({
    advancePercent: z.int().min(1).max(100),
    replyTime: text,
    pickupPoint: text,
  }),
  payments: z.strictObject({
    methods: z
      .array(z.enum(['Cash', 'Bank transfer']))
      .min(1, 'List at least one payment method')
      .refine((methods) => new Set(methods).size === methods.length, 'Each method only once'),
  }),
  legal: z.strictObject({
    dtsLicence: orPlaceholder(text, 'the licence number'),
    companyRegistration: orPlaceholder(text, 'the registration number'),
  }),
  social: z.strictObject({
    instagram: orPlaceholder(z.url(), 'a link'),
    facebook: orPlaceholder(z.url(), 'a link'),
    youtube: orPlaceholder(z.url(), 'a link'),
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
  if (cached) return cached;
  const { data, problems } = loadSettings();
  if (!data) throw new ContentError(problems);
  cached = data;
  return data;
}
