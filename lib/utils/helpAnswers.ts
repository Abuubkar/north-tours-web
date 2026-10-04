/*
 * The Help page's questions and answers (PRD #86): shaped at build time, then searched and
 * linked to in the browser.
 */

/** One question as Help shows it: its id (its anchor, /help#refunds) and its answer, tokens filled. */
export type HelpAnswer = { id: string; question: string; answer: string };

/** A category: its id (its heading's anchor, /help#cat-safety), its name and its questions. */
export type HelpCategory = { id: string; title: string; questions: HelpAnswer[] };
