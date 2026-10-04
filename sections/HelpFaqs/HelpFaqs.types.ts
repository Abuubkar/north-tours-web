import type { HelpCopy } from '@/lib/content/pages';

export type HelpFaqsProps = {
  /** The category list's words, "Link to this answer" and the empty state (its lead's reply time filled). */
  copy: Pick<HelpCopy, 'categories' | 'linkToAnswer' | 'empty'>;
  /** "Ask on WhatsApp" when nothing matches: the general message. */
  askHref: string;
};
