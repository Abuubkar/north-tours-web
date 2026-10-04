import type { HelpCategory } from '@/lib/utils/helpAnswers';

export type FaqCategoryProps = HelpCategory & {
  /** Under each answer: "Link to this answer · {path}". */
  linkLabel: string;
  /** The answers' one-open-at-a-time group, shared by every category on the page. */
  group: string;
};
