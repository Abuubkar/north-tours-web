'use client';

import { Sheet } from '@/components/ui/Sheet/Sheet';
import { useBooking } from '@/hooks/useBooking';
import { BookingPanel } from '../BookingPanel/BookingPanel';
import type { BookingSheetProps } from './BookingSheet.types';
import styles from './BookingSheet.module.css';

/**
 * Below 1100px, the booking panel in a bottom sheet titled with the tour. It shares the page's
 * booking, so a date picked in the list is already chosen. Escape, the backdrop and Close
 * return focus to whatever opened it.
 */
export function BookingSheet({ subtitle, ...panel }: BookingSheetProps) {
  const { sheetOpen, closeSheet } = useBooking();
  return (
    <Sheet open={sheetOpen} onClose={closeSheet} title={panel.tour.title} handle>
      <p className={styles.subtitle}>{subtitle}</p>
      <BookingPanel variant="sheet" {...panel} />
    </Sheet>
  );
}
