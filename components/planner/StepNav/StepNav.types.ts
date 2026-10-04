export type StepNavProps = {
  /** "Back", from step 2. */
  backLabel?: string;
  /** "Next: Who’s coming"; none on a step with nothing after it yet. */
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
};
