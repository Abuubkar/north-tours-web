import type { HelpAnswer, HelpCategory } from './helpAnswers.ts';
import { fillTokens } from './tokens.ts';

/*
 * Help's search (PRD #86), in the browser, with no library: the query and every question and
 * answer are compared in a folded form (lower case, accents removed, punctuation as spaces), and
 * an answer matches when it holds every word typed.
 */

/** Text folded for comparing, with where each of its characters came from in the original. */
type Folded = { text: string; from: number[]; to: number[] };

const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;
const MARK = /\p{M}/gu;

/**
 * Folds text one character at a time: lower case, accents removed (Unicode decomposition, the
 * combining marks dropped), anything but a letter or digit (punctuation, curly quotes, spaces) as
 * a space. Each folded character keeps its original's start and end, for highlighting.
 */
function fold(text: string): Folded {
  const folded: Folded = { text: '', from: [], to: [] };
  let index = 0;
  for (const char of text) {
    const end = index + char.length;
    for (const c of char.normalize('NFD').replace(MARK, '').toLowerCase()) {
      folded.text += LETTER_OR_DIGIT.test(c) ? c : ' ';
      folded.from.push(index);
      folded.to.push(end);
    }
    index = end;
  }
  return folded;
}

/** Lower case, no accents, punctuation as spaces, spaces collapsed: "Réfund’s  policy?" → "refund s policy". */
export function normalise(text: string): string {
  return fold(text).text.replace(/\s+/g, ' ').trim();
}

/** Words shorter than this are ignored ("a", "&"), so a stray letter doesn't hide every answer. */
const MIN_TERM = 2;

/** The query's words, folded: "Child price" → ["child", "price"]. None for an empty query. */
export function searchTerms(query: string): string[] {
  return normalise(query)
    .split(' ')
    .filter((term) => term.length >= MIN_TERM);
}

/**
 * Whether an answer matches: every term appears somewhere in its question or answer, as part of
 * a word ("refund" finds "refunds"). With no terms, every answer matches.
 */
export function matchesAnswer({ question, answer }: Pick<HelpAnswer, 'question' | 'answer'>, terms: readonly string[]): boolean {
  const text = fold(`${question} ${answer}`).text;
  return terms.every((term) => text.includes(term));
}

/** A stretch of text, marked when it matched a term. */
export type TextPart = { text: string; mark: boolean };

/**
 * The text split into parts, with each stretch that matched a term marked. Marks follow the
 * original text, so case and accents are kept ("cafe" marks "Café"); overlapping or touching
 * matches join into one mark.
 */
export function highlight(text: string, terms: readonly string[]): TextPart[] {
  const folded = fold(text);
  const ranges: [number, number][] = [];
  for (const term of terms) {
    for (let at = folded.text.indexOf(term); at !== -1; at = folded.text.indexOf(term, at + 1)) {
      ranges.push([folded.from[at], folded.to[at + term.length - 1]]);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of ranges) {
    const last = merged.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  const parts: TextPart[] = [];
  let index = 0;
  for (const [start, end] of merged) {
    if (start > index) parts.push({ text: text.slice(index, start), mark: false });
    parts.push({ text: text.slice(start, end), mark: true });
    index = end;
  }
  if (index < text.length || parts.length === 0) parts.push({ text: text.slice(index), mark: false });
  return parts;
}

/** The answers matching `terms`, by id, across every category (all of them with no terms). */
export function matchingAnswers(categories: readonly HelpCategory[], terms: readonly string[]): Set<string> {
  return new Set(categories.flatMap(({ questions }) => questions.filter((q) => matchesAnswer(q, terms)).map((q) => q.id)));
}

/** How many of each category's answers match, by category id. */
export function categoryCounts(categories: readonly HelpCategory[], matching: ReadonlySet<string>): Record<string, number> {
  return Object.fromEntries(categories.map(({ id, questions }) => [id, questions.filter((q) => matching.has(q.id)).length]));
}

/** The result line's words: "{count} answers for “{query}”", "1 answer for “{query}”", "No answers for “{query}”". */
export type ResultWords = { many: string; one: string; none: string };

/** The line under the search: how many answers match the query, quoted as typed (outer spaces trimmed). */
export function resultLine(words: ResultWords, count: number, query: string): string {
  const template = count === 0 ? words.none : count === 1 ? words.one : words.many;
  return fillTokens(template, { count: String(count), query: query.trim() });
}
