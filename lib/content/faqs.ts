import path from 'node:path';
import { z } from 'zod';
import { slugSchema } from './collection.ts';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { checkUniqueIds, copy, copyWith, nonEmpty, sample } from './fields.ts';
import { HELP_CATEGORY_PREFIX } from '../routes.ts';
import type { CompanyToken, PolicyToken, SettingsToken } from '../utils/tokens.ts';

/*
 * Shared questions and answers (PRD #47, #86), in Help's categories. Help shows them all; tour
 * pages show the ones marked `tourPages`, in file order, after each tour's own questions.
 */

/** The settings an answer may quote, filled in when shown (lib/utils/tokens `textTokens`). */
export const FAQ_TOKENS = [
  'advancePercent',
  'paymentMethods',
  'refundSchedule',
  'balanceDueDays',
  'childFromAge',
  'fullRefundDays',
  'refundPaidWithinDays',
  'replyTime',
  'officeHours',
  'pickupPoint',
  'travelSupport',
] as const satisfies readonly (SettingsToken | PolicyToken | CompanyToken)[];

/** The Help page's other anchors, which an answer's id can't take: the skip link's target and the policies. */
const HELP_ANCHORS = ['main', 'policies'];

/** An answer's id is its anchor on Help (/help#refunds): a slug, and not one of the page's other anchors. */
const answerIdSchema = slugSchema
  .refine((id) => !HELP_ANCHORS.includes(id), 'Already an anchor on the Help page')
  .refine((id) => !id.startsWith(HELP_CATEGORY_PREFIX), `Can’t start with "${HELP_CATEGORY_PREFIX}", which category anchors use`);

const questionSchema = z.strictObject({
  id: answerIdSchema,
  question: nonEmpty,
  answer: copyWith(...FAQ_TOKENS),
  /** Shown on every tour page too, after the tour's own questions. */
  tourPages: z.literal(true, { error: 'Use tourPages: true, or leave it out' }).optional(),
  /** An answer with an invented claim about the company (ADR-0019). */
  sample,
});

const faqsSchema = z.strictObject({
  categories: z
    .array(
      z.strictObject({
        /** e.g. "safety": its heading's anchor is /help#cat-safety. */
        id: slugSchema,
        /** "Safety", in Help's category list and over its questions. */
        title: copy,
        questions: z.array(questionSchema).min(1, 'List at least one question'),
      }),
    )
    .min(1)
    .superRefine((categories, ctx) => {
      checkUniqueIds(categories.map(({ id }, i) => ({ id, path: [i] })), ctx);
      // Answer ids are anchors on one page, so each is used once across every category.
      checkUniqueIds(
        categories.flatMap((category, i) => category.questions.map(({ id }, j) => ({ id, path: [i, 'questions', j] }))),
        ctx,
      );
    }),
});

export type Faqs = z.infer<typeof faqsSchema>;

export type Faq = Faqs['categories'][number]['questions'][number];

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

/** The questions every tour page shows after its own: those marked `tourPages`, in file order. */
export function tourPageFaqs(faqs: Faqs): Faq[] {
  return faqs.categories.flatMap((category) => category.questions.filter((question) => question.tourPages));
}
