import { z } from 'zod';
import { todayInKarachi } from '../utils/departures.ts';
import { PLACEHOLDER } from '../utils/placeholder.ts';
import { tokensIn } from '../utils/tokens.ts';

/** Accepts a real value that passes `schema`, or a `[placeholder]`. `expected` names the value. */
function orPlaceholder<T extends z.ZodType>(schema: T, expected: string) {
  return z.union([z.string().regex(PLACEHOLDER), schema], {
    error: `Must be ${expected}, or a [placeholder]`,
  });
}

/** Any text, trimmed, not empty. Also holds `[placeholders]` (ADR-0010). */
export const nonEmpty = z.string().trim().min(1, 'Must not be empty');

/** A Pakistani number in international form (+92 then 9–10 digits), or a `[placeholder]`. */
export const phoneOrPlaceholder = orPlaceholder(
  z.string().regex(/^\+92(\s?\d){9,10}$/),
  'a number like +92 300 1234567',
);

export const emailOrPlaceholder = orPlaceholder(z.email(), 'an email address');

export const linkOrPlaceholder = orPlaceholder(z.url(), 'a link');

/** A real calendar date, YYYY-MM-DD. */
export const isoDate = z.iso.date('Use a real date as YYYY-MM-DD');

/** A date that has already come, e.g. when a policy was last updated: not after the build date (Asia/Karachi). */
export const pastDate = isoDate.refine((date) => date <= todayInKarachi(new Date()), 'Can’t be after today');

/** The best months to go, e.g. Apr to Oct. Destinations and tours both have one. */
const month = z.enum(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
export const seasonSchema = z.strictObject({ from: month, to: month });

export type Season = z.infer<typeof seasonSchema>;

/** A place's latitude and longitude, in degrees (maps). */
export const latitude = z.number().min(-90, 'Use a latitude from -90 to 90').max(90, 'Use a latitude from -90 to 90');
export const longitude = z.number().min(-180, 'Use a longitude from -180 to 180').max(180, 'Use a longitude from -180 to 180');

/** A month, YYYY-MM. */
export const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM, e.g. 2026-05');

/**
 * Page copy or a message: text that may use only the given `{tokens}`, filled from settings
 * or the page (lib/utils/tokens.ts). Any other token is rejected, so a typo fails the build.
 */
export function copyWith(...allowed: string[]) {
  return nonEmpty.superRefine((text, ctx) => {
    for (const token of tokensIn(text)) {
      if (!allowed.includes(token)) {
        const expected = allowed.length > 0 ? `Use only ${allowed.map((t) => `{${t}}`).join(', ')}` : 'Takes no tokens';
        ctx.addIssue({ code: 'custom', message: `Unknown token {${token}}. ${expected}` });
      }
    }
  });
}

/** Page copy with no tokens. */
export const copy = copyWith();

/**
 * Marks sample content: an invented claim about the company (ADR-0019), sample legal text
 * (ADR-0020), or a sample tour, rating, destination, guide, review or settings figure
 * (ADR-0022). Only `true`; the owner confirms the item by removing the field. Never shown on the
 * site; `pnpm launch:check` lists it.
 */
export const sample = z
  .literal(true, { error: 'Use sample: true for sample content, or remove the field once it’s real (ADR-0019, ADR-0022)' })
  .optional();

/**
 * Reports each id used more than once, at its place in the file: anchors on one page must be
 * unique, or a link would land on the wrong one. `entries` pairs each id with its path.
 */
export function checkUniqueIds(entries: { id: string; path: PropertyKey[] }[], ctx: z.RefinementCtx): void {
  const seen = new Set<string>();
  for (const { id, path } of entries) {
    if (seen.has(id)) ctx.addIssue({ code: 'custom', message: `"${id}" is used twice`, path: [...path, 'id'] });
    seen.add(id);
  }
}
