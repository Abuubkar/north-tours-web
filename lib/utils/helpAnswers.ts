import { helpAnswerHash } from '../routes.ts';
import { matchingCategories } from './helpSearch.ts';
import { optionName } from './resultsText.ts';

/*
 * The Help page's questions and answers (PRD #86): shaped at build time, then searched and
 * linked to in the browser.
 */

/** One question as Help shows it: its id (its anchor, /help#refunds) and its answer, tokens filled. */
export type HelpAnswer = { id: string; question: string; answer: string };

/** A category: its id (its heading's anchor, /help#cat-safety), its name and its questions. */
export type HelpCategory = { id: string; title: string; questions: HelpAnswer[] };

/** "{count} answer" and "{count} answers", from Help's page copy. */
export type AnswerCountWords = { one: string; other: string };

/** A category's link in Help's category list: its count, and its name read out with the count. */
export type CategoryLink = { id: string; title: string; count: number; name: string };

/**
 * Each category's link, with how many answers it holds: named "Booking & payment, 4 answers".
 * During a search (`matching` given) it counts the matches, and leaves out categories with none.
 */
export function categoryLinks(
  categories: readonly HelpCategory[],
  words: AnswerCountWords,
  matching: ReadonlySet<string> | null = null,
): CategoryLink[] {
  return matchingCategories(categories, matching).map(({ id, title, questions }) => ({
    id,
    title,
    count: questions.length,
    name: optionName(title, questions.length, words),
  }));
}

/**
 * The answer a URL hash links to: "#refunds" gives "refunds" when it's one of `ids`. Anything
 * else gives null: no hash, an unknown id, a category's heading ("#cat-booking") or the
 * policies ("#policies"), which stay plain anchors.
 */
export function answerForHash(hash: string, ids: readonly string[]): string | null {
  return ids.find((id) => hash === helpAnswerHash(id)) ?? null;
}
