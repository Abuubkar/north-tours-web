import { createContext, use, useRef, useState, type RefObject } from 'react';
import type { Departure } from '@/lib/content/tours';
import { clampTravellers, DEFAULT_TRAVELLERS, maxTravellers, SIDE_PANEL_QUERY, type RoomType } from '@/lib/utils/booking';
import { shownDeparture, upcomingDepartures } from '@/lib/utils/departures';
import { useToday } from './useToday';

/** What the visitor has chosen, shared by the booking panel, the departure rows and (on phones) the bar and sheet. */
export type Booking = {
  /** Today in Pakistan (YYYY-MM-DD): the build's date while hydrating, then the browser's. */
  today: string;
  /** The tour's departures still to come, checked again in the browser. */
  departures: Departure[];
  /** The chosen departure; cleared once its date has passed. */
  chosen: Departure | undefined;
  /** The date "Ask on WhatsApp" names: the chosen one, else the next (as a tour card shows it). */
  askDeparture: Departure | undefined;
  /** Kept between 1 and `maxTravellers`. */
  travellers: number;
  maxTravellers: number;
  room: RoomType;
  choose: (start: string) => void;
  setTravellers: (travellers: number) => void;
  setRoom: (room: RoomType) => void;
  /** The booking sheet (below 1100px). */
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  /** Opens the sheet where the panel lives in it (below 1100px); true if it did. */
  openSheetIfNarrow: () => boolean;
  /** The aside panel's first date control, which the final call to action focuses. */
  dateControlRef: RefObject<HTMLElement | null>;
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const dateControlRef = useRef<HTMLElement>(null);

  const chosen = upcoming.find((departure) => departure.start === chosenStart);
  const max = maxTravellers(chosen, upcoming);
  const travellers = clampTravellers(wanted, max);

  return {
    today,
    departures: upcoming,
    chosen,
    askDeparture: chosen ?? shownDeparture(upcoming, today),
    travellers,
    maxTravellers: max,
    room,
    // A date with fewer seats shows fewer travellers; the number asked for is kept, so passing
    // over a sold-out date (one seat, for its waitlist) doesn't lose it.
    choose: setChosenStart,
    setTravellers: (value) => setWanted(clampTravellers(value, max)),
    setRoom,
    sheetOpen,
    openSheet: () => setSheetOpen(true),
    closeSheet: () => setSheetOpen(false),
    openSheetIfNarrow() {
      if (window.matchMedia(SIDE_PANEL_QUERY).matches) return false;
      setSheetOpen(true);
      return true;
    },
    dateControlRef,
  };
}
