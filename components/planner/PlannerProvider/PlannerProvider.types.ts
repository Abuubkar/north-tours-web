import type { ReactNode } from 'react';
import type { PlannerCopy } from '@/lib/content/pages';

export type PlannerProviderProps = {
  /** Destination slugs in the loader's order. */
  destinations: readonly string[];
  /** The build's date (YYYY-MM-DD, Asia/Karachi). */
  builtOn: string;
  /** The page's error messages. */
  messages: PlannerCopy['errors'];
  children: ReactNode;
};
