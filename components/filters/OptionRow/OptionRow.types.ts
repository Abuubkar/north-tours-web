export type OptionRowProps = {
  /** The option's words, e.g. "Hunza" or "Price: low to high". */
  label: string;
  /** How many trips it would show, beside the label. */
  count?: number;
  /** What a screen reader hears when the row shows a count, e.g. "Hunza, 3 trips". */
  name?: string;
  pressed: boolean;
  /** check: one of several (a square); radio: one at a time (a circle). */
  indicator: 'check' | 'radio';
  onClick: () => void;
};
