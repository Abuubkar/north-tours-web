import type { ReactNode } from 'react';
import type { HelpCategory } from '@/lib/utils/helpAnswers';

export type HelpProviderProps = {
  /** Every category and its answers, tokens filled, as the page shows them. */
  categories: HelpCategory[];
  /** What reads or changes the state: the search in the header and the answers below it. */
  children: ReactNode;
};
