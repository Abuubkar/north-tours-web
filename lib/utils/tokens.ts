/*
 * Named `{tokens}` in page copy and message templates, filled from settings or the page, e.g.
 * "Hold your seats with a {advancePercent}% advance". The content schema checks each field
 * uses only the tokens it allows, so a typo fails the build instead of reaching the site.
 */

import type { Settings } from '../content/settings.ts';
import { paymentMethodsText } from './payments.ts';

const TOKEN = /\{(\w+)\}/g;

/** Tokens filled from settings, e.g. "{advancePercent}% advance" → "30% advance". */
export const SETTINGS_TOKENS = ['advancePercent', 'paymentMethods', 'pickupPoint'] as const;

export type SettingsToken = (typeof SETTINGS_TOKENS)[number];

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

/** The `{tokens}` page copy may take from settings, filled with their current values. */
export function settingsTokens(settings: Pick<Settings, 'booking' | 'payments'>): Record<SettingsToken, string> {
  return {
    advancePercent: String(settings.booking.advancePercent),
    paymentMethods: paymentMethodsText(settings),
    pickupPoint: settings.booking.pickupPoint,
  };
}
