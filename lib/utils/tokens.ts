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

/** Policy tokens only answers take (FAQs, later Help): the balance due and the refund schedule in sentences. */
export const POLICY_TOKENS = ['balanceDueDays', 'refundSchedule'] as const;

export type PolicyToken = (typeof POLICY_TOKENS)[number];

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
  };
}
