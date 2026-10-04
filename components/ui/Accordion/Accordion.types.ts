import type { ReactNode } from 'react';

export type AccordionItem = {
  /** Stable key for the item. */
  id: string;
  /** The item's anchor, so a link reaches it: Help's answers carry their id (/help#refunds). */
  anchor?: string;
  summary: ReactNode;
  /** The summary while open, e.g. "Hide the full policy"; shown from the open state, no JavaScript needed. */
  openSummary?: ReactNode;
  content: ReactNode;
  /** Open at first; the visitor opens and closes it from there. */
  defaultOpen?: boolean;
  /** Opened and closed by the page (Help's answer links): keep it in step with `onToggle`. */
  open?: boolean;
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
  /**
   * default: FAQs, the step title role with room around it. compact: a 52px row at 15/500 with no
   * list lines (the planner's summary bar, the legal contents on phones). link: one item whose
   * summary looks like a text link, 14/500 underlined, 44px tall, the caret after it ("Read the full policy").
   */
  size?: 'default' | 'compact' | 'link';
  /** An item opened or closed, by the visitor, the page, or its group closing it (the native `toggle` event). */
  onToggle?: (id: string, open: boolean) => void;
};
