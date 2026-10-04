/*
 * Named `{tokens}` in page copy and message templates, filled from settings or the page, e.g.
 * "Hold your seats with a {advancePercent}% advance". The content schema checks each field
 * uses only the tokens it allows, so a typo fails the build instead of reaching the site.
 */

import type { Settings } from '../content/settings.ts';
import { paymentMethodsSentence } from './payments.ts';
import { fullRefundDays, refundScheduleText } from './policies.ts';

const TOKEN = /\{(\w+)\}/g;

/** Tokens page copy may take from settings, e.g. "{advancePercent}% advance" → "30% advance". */
export const SETTINGS_TOKENS = ['advancePercent', 'paymentMethods', 'pickupPoint', 'fullRefundDays', 'childFromAge'] as const;

export type SettingsToken = (typeof SETTINGS_TOKENS)[number];

/**
 * Policy tokens only answers, policies and legal text take: the balance due, the refund schedule
 * in sentences and how soon a refund is paid back.
 */
export const POLICY_TOKENS = ['balanceDueDays', 'refundSchedule', 'refundPaidWithinDays'] as const;

export type PolicyToken = (typeof POLICY_TOKENS)[number];

/**
 * The company's name, contact details, legal identifiers, hours and reply time, for answers,
 * policies and legal text. Placeholders are filled in as written (ADR-0010).
 */
export const COMPANY_TOKENS = [
  'brand',
  'email',
  'phone',
  'whatsapp',
  'travelSupport',
  'officeAddress',
  'officeHours',
  'dtsLicence',
  'companyRegistration',
  'replyTime',
] as const;

export type CompanyToken = (typeof COMPANY_TOKENS)[number];

/** The token names used in a template, in order: "{tour} on {date}" → ["tour", "date"]. */
export function tokensIn(template: string): string[] {
  return [...template.matchAll(TOKEN)].map((match) => match[1]);
}

/** Replaces each `{token}` with its value. Throws on a token with no value. */
export function fillTokens(template: string, values: Record<string, string>): string {
  return template.replace(TOKEN, (_, name: string) => {
    if (!(name in values)) throw new Error(`No value for {${name}} in "${template}"`);
    return values[name];
  });
}

/** The text either side of one `{token}`, for copy that puts an element there: "Read our {link}." → ["Read our ", "."]. */
export function splitAtToken(template: string, token: string): [string, string] {
  const [before, after = ''] = template.split(`{${token}}`);
  return [before, after];
}

/** The `{tokens}` copy may take from settings, filled with their current values. */
export function settingsTokens(
  settings: Pick<Settings, 'booking' | 'payments' | 'policies'>,
): Record<SettingsToken | PolicyToken, string> {
  return {
    advancePercent: String(settings.booking.advancePercent),
    paymentMethods: paymentMethodsSentence(settings),
    pickupPoint: settings.booking.pickupPoint,
    fullRefundDays: String(fullRefundDays(settings.policies)),
    childFromAge: String(settings.policies.childFromAge),
    balanceDueDays: String(settings.policies.balanceDueDays),
    /** The whole schedule in sentences, for FAQ and Help answers. */
    refundSchedule: refundScheduleText(settings.policies),
    refundPaidWithinDays: String(settings.policies.refundPaidWithinDays),
  };
}

/** The company's `{tokens}`, filled with their current values (placeholders as written). */
export function companyTokens(
  settings: Pick<Settings, 'brand' | 'contact' | 'legal' | 'booking'>,
): Record<CompanyToken, string> {
  const { contact, legal } = settings;
  return {
    brand: settings.brand.name,
    email: contact.email,
    phone: contact.phone,
    whatsapp: contact.whatsapp,
    travelSupport: contact.travelSupport,
    officeAddress: contact.officeAddress,
    officeHours: contact.officeHours,
    dtsLicence: legal.dtsLicence,
    companyRegistration: legal.companyRegistration,
    replyTime: settings.booking.replyTime,
  };
}

/**
 * Every token answers, policies and legal text may take, filled from settings: each field's
 * schema narrows it to the ones it allows. No figure from settings is ever typed into the text.
 */
export function textTokens(
  settings: Pick<Settings, 'booking' | 'payments' | 'policies' | 'brand' | 'contact' | 'legal'>,
): Record<SettingsToken | PolicyToken | CompanyToken, string> {
  return { ...settingsTokens(settings), ...companyTokens(settings) };
}
