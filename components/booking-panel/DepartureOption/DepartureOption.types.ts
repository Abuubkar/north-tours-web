import type { Departure } from '@/lib/content/tours';

export type DepartureOptionProps = {
  /** The radio group's name, unique to this panel. */
  name: string;
  departure: Departure;
  checked: boolean;
  /** Called when the visitor picks this date. */
  onChoose: (start: string) => void;
};
