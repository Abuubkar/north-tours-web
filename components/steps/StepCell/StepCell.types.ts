export type StepCellProps = {
  /** The step's place in the sequence, from 1. */
  number: number;
  title: string;
  text: string;
  /** Points on to the next step; every step but the last. */
  arrow: boolean;
};
