import { createContext, use, useState } from 'react';
import type { Departure } from '@/lib/content/tours';
import { clampTravellers, DEFAULT_TRAVELLERS, maxTravellers, type RoomType } from '@/lib/utils/booking';
import { upcomingDepartures } from '@/lib/utils/departures';
import { useToday } from './useToday';

/** What the visitor has chosen, shared by the booking panel, the departure rows and (on phones) the bar and sheet. */
export type Booking = {
  /** Today in Pakistan (YYYY-MM-DD): the build's date while hydrating, then the browser's. */
  today: string;
  /** The tour's departures still to come, checked again in the browser. */
  departures: Departure[];
  /** The chosen departure; cleared once its date has passed. */
  chosen: Departure | undefined;
  /** Kept between 1 and `maxTravellers`. */
  travellers: number;
  maxTravellers: number;
  room: RoomType;
  choose: (start: string) => void;
  setTravellers: (travellers: number) => void;
  setRoom: (room: RoomType) => void;
};

export const BookingContext = createContext<Booking | null>(null);

/** The booking state from the nearest `BookingProvider`. */
export function useBooking(): Booking {
  const booking = use(BookingContext);
  if (!booking) throw new Error('useBooking needs a BookingProvider above it');
  return booking;
}

/**
 * The booking state for a tour's departures (as built). The rules (clamping, totals, messages)
 * are pure functions in lib/utils/booking; this only holds the choices.
 */
export function useBookingState(departures: Departure[], builtOn: string): Booking {
  const today = useToday(builtOn);
  const upcoming = upcomingDepartures(departures, today);
  const [chosenStart, setChosenStart] = useState<string | null>(null);
  const [wanted, setWanted] = useState(DEFAULT_TRAVELLERS);
  const [room, setRoom] = useState<RoomType>('twin');

  const chosen = upcoming.find((departure) => departure.start === chosenStart);
  const max = maxTravellers(chosen, upcoming);
  const travellers = clampTravellers(wanted, max);

  return {
    today,
    departures: upcoming,
    chosen,
    travellers,
    maxTravellers: max,
    room,
    choose(start) {
      setChosenStart(start);
      // A date with fewer seats brings the travellers down to fit, and they stay there.
      const next = upcoming.find((departure) => departure.start === start);
      setWanted(clampTravellers(travellers, maxTravellers(next, upcoming)));
    },
    setTravellers: (value) => setWanted(clampTravellers(value, max)),
    setRoom,
  };
}
