export type CounterRowProps = {
  /** "Adults": the row's label and its stepper's name. */
  label: string;
  /** "18 and over". */
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
};
