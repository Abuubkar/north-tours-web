export type StepNavProps = {
  /** "Back", from step 2. */
  backLabel?: string;
  /** "Next: Who’s coming", or "Review". */
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
};
