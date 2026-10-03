export type StepperProps = {
  /** Names the control for assistive tech, e.g. "Travellers". */
  label: string;
  value: number;
  min: number;
  max: number;
  /** Called with the new value; the caller owns the state. */
  onChange: (value: number) => void;
  /** Accessible names for the buttons, e.g. "Fewer travellers" / "More travellers". */
  decreaseLabel: string;
  increaseLabel: string;
};
