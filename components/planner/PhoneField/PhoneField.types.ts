import type { PlannerCopy } from '@/lib/content/pages';

export type PhoneFieldProps = {
  copy: PlannerCopy['details']['phone'];
  /** The message after Next, while the number is wrong. */
  error?: string;
};
