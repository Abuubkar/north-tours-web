import type { ReactNode } from 'react';

export type AccordionItem = {
  /** Stable key for the item. */
  id: string;
  summary: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** plus: FAQs (44px box, turns 45° when open). caret: policies and summary bars (turns over). */
  marker?: 'plus' | 'caret';
  /**
   * Items sharing a name open one at a time. Omit to let items open independently. Use a name
   * that's unique on the page: two accordions with the same name close each other's items.
   */
  name?: string;
};
