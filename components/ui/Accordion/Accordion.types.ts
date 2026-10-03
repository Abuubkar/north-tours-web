import type { ReactNode } from 'react';

export type AccordionItem = {
  /** Stable id; also the element id, so a page can link to an item later. */
  id: string;
  summary: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** plus: FAQs (44px box, turns 45° when open). caret: policies and summary bars (turns over). */
  marker?: 'plus' | 'caret';
  /** Items sharing a name: opening one closes the others. Omit to let items open independently. */
  name?: string;
};
