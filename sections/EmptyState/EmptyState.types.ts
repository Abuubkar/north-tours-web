import type { ReactNode } from 'react';

export type EmptyStateProps = {
  /** The fixed wording (DESIGN.md §6): "No trips match these filters yet.", "No answers for that yet." */
  headline: string;
  lead: string;
  /** Two 52px buttons: a way back to every result, and a way on (the planner, WhatsApp). */
  actions: ReactNode;
};
