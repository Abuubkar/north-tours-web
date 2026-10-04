'use client';

import { BookingContext, useBookingState } from '@/hooks/useBooking';
import type { BookingProviderProps } from './BookingProvider.types';

/** Holds one booking (date, travellers, room) for everything inside it. */
export function BookingProvider({ departures, builtOn, children }: BookingProviderProps) {
  return <BookingContext value={useBookingState(departures, builtOn)}>{children}</BookingContext>;
}
