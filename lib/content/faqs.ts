import path from 'node:path';
import { z } from 'zod';
import { slugSchema } from './collection.ts';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { copyWith, nonEmpty } from './fields.ts';
import type { PolicyToken, SettingsToken } from '../utils/tokens.ts';

/*
 * Shared questions and answers (PRD #47), in categories: Tour Detail shows the booking
 * category after each tour's own questions, and Help (PRD 11) reuses it and adds categories.
 */

/** The settings an answer may quote, filled in when shown (lib/utils/tokens `settingsTokens`). */
export const FAQ_TOKENS = [
  'advancePercent',
  'paymentMethods',
  'refundSchedule',
  'balanceDueDays',
  'childFromAge',
] as const satisfies readonly (SettingsToken | PolicyToken)[];

const faqsSchema = z.strictObject({
  categories: z
    .array(
      z.strictObject({
        /** e.g. "booking". */
        id: slugSchema,
        title: nonEmpty,
        questions: z.array(z.strictObject({ question: nonEmpty, answer: copyWith(...FAQ_TOKENS) })).min(1),
      }),
    )
    .min(1),
});

export type Faqs = z.infer<typeof faqsSchema>;

export function faqsFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'faqs.json');
}

export function loadFaqs(dir = CONTENT_DIR) {
  return parseFile(faqsSchema, faqsFile(dir));
}

let cached: Faqs | undefined;

export function getFaqs(): Faqs {
  cached ??= requireValid(loadFaqs());
  return cached;
}

/** One category's questions, e.g. "booking". Throws if content has no such category. */
export function getFaqCategory(id: string): Faqs['categories'][number] {
  const category = getFaqs().categories.find((c) => c.id === id);
  if (!category) throw new Error(`No FAQ category "${id}" in content/faqs.json`);
  return category;
}
