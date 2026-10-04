import type { HelpCategory } from '@/lib/utils/helpAnswers';

export type FaqCategoryProps = HelpCategory & {
  /** Under each answer: "Link to this answer · {path}". */
  linkLabel: string;
  /** The answers' one-open-at-a-time group, shared by every category on the page; none while searching. */
  group: string | undefined;
  /** The search's words, marked in each question and answer; none outside a search. */
  terms: readonly string[];
  /** The answers open now, by id. */
  openIds: ReadonlySet<string>;
  /** An answer opened or closed (the native toggle event). */
  onToggle: (id: string, open: boolean) => void;
  /** "Link to this answer" followed: the page keeps the answer open and shows its link in the address. */
  onAnswerLink: (id: string) => void;
};
