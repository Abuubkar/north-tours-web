import type { HelpCopy } from '@/lib/content/pages';
import type { HelpCategory } from '@/lib/utils/helpAnswers';

export type HelpFaqsProps = {
  /** The category list's words and "Link to this answer". */
  copy: Pick<HelpCopy, 'categories' | 'linkToAnswer'>;
  /** Every category, in order, answers filled from settings. */
  categories: HelpCategory[];
};
