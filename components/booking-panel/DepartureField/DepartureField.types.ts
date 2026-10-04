import type { TourCopy } from '@/lib/content/pages';

export type DepartureFieldProps = {
  copy: Pick<TourCopy['booking'], 'dateLabel' | 'choosePlaceholder'>;
  /** The compact form, for short screens: a select instead of the list of dates. */
  compact: boolean;
  /** Takes the first date control (the first radio, or the select), for the final call to action to focus. */
  controlRef?: (element: HTMLElement | null) => void;
};
