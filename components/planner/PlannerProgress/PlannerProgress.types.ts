import type { Ref } from 'react';

export type PlannerProgressProps = {
  /** "Step 1 of 3 · Where and when", or "Review · Check and send". */
  text: string;
  /** How many of the three segments are lit: the steps done and the current one. */
  filled: number;
  /** The heading, which takes focus after a step change. */
  ref?: Ref<HTMLHeadingElement>;
};
