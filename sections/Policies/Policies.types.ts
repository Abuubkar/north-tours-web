import type { PolicyCardData } from '@/components/help/PolicyCard/PolicyCard.types';
import type { HelpCopy } from '@/lib/content/pages';

export type PoliciesProps = {
  /** The headline, the "Last updated" line, the disclosure's labels and the refund table's words. */
  copy: HelpCopy['policies'];
  /** When the policies were last updated, YYYY-MM-DD. */
  updated: string;
  policies: PolicyCardData[];
};
