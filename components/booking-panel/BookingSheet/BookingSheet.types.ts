import type { BookingPanelProps } from '../BookingPanel/BookingPanel.types';

export type BookingSheetProps = Omit<BookingPanelProps, 'variant'> & {
  /** Under the title, e.g. "9 days, 8 nights · from Lahore". */
  subtitle: string;
};
