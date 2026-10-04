import type { Settings } from '../content/settings.ts';
import type { Departure, RoomPrices } from '../content/tours.ts';
import { messageDateRange } from './dates.ts';
import { groupSize } from './departures.ts';
import { formatPkr } from './price.ts';
import { fillTokens } from './tokens.ts';
import { departureMessage } from './whatsapp.ts';

/*
 * The booking panel's rules (PRD #47): travellers, totals, the advance and the WhatsApp
 * messages. The panel, the departure rows, the sticky bar and the sheet all render these.
 */

/** Room sharing, cheapest per person last; twin first, as the panel lists them. */
export const ROOM_TYPES = ['twin', 'triple', 'quad'] as const satisfies readonly (keyof RoomPrices)[];

export type RoomType = (typeof ROOM_TYPES)[number];

/** From this width the booking panel sits beside the page (an aside); below it, a bar and sheet. */
export const SIDE_PANEL_QUERY = '(width >= 1100px)';

/** On screens shorter than this the aside's panel picks its date from a select (the compact form). */
export const COMPACT_PANEL_QUERY = '(height < 920px)';

/** Travellers before the visitor changes it. */
export const DEFAULT_TRAVELLERS = 2;

/** The total for the chosen room: travellers × the room's price per person. */
export function bookingTotal(prices: RoomPrices, room: RoomType, travellers: number): number {
  return prices[room] * travellers;
}

/** The advance to reserve: `percent` of the total, in whole rupees. */
export function advanceAmount(total: number, percent: number): number {
  return Math.round((total * percent) / 100);
}

/**
 * The most travellers one booking can ask for: the chosen date's seats left (at least 1, so a
 * sold-out date still has a traveller to put on its waitlist), or with no date chosen, the
 * largest group on any departure.
 */
export function maxTravellers(
  chosen: Pick<Departure, 'seatsLeft'> | undefined,
  departures: readonly Pick<Departure, 'seatsTotal'>[],
): number {
  if (chosen) return Math.max(1, chosen.seatsLeft);
  return groupSize(departures) ?? 1;
}

/** Travellers kept between 1 and `max`. */
export function clampTravellers(travellers: number, max: number): number {
  return Math.min(Math.max(travellers, 1), max);
}

/** The total's working: "2 × PKR 145,000". */
export function totalBreakdown(travellers: number, price: number): string {
  return `${travellers} × ${formatPkr(price)}`;
}

/** "1 traveller", "2 travellers". */
export function travellersText(travellers: number): string {
  return `${travellers} ${travellers === 1 ? 'traveller' : 'travellers'}`;
}

type Reservation = {
  tour: string;
  departure: Pick<Departure, 'start' | 'end'>;
  travellers: number;
  /** As the panel names it, e.g. "Twin"; the message says "twin sharing". */
  roomName: string;
  total: number;
  advancePercent: number;
};

/** "Reserve with 30% advance": the settings template with everything the visitor chose. */
export function reserveMessage(template: string, r: Reservation): string {
  return fillTokens(template, {
    travellers: travellersText(r.travellers),
    tour: r.tour,
    dates: messageDateRange(r.departure.start, r.departure.end),
    room: r.roomName.toLowerCase(),
    total: formatPkr(r.total),
    advancePercent: String(r.advancePercent),
    advance: formatPkr(advanceAmount(r.total, r.advancePercent)),
  });
}

/**
 * "Ask on WhatsApp": the tour message with a date (the chosen one, else the next departure), or
 * the general message when the tour has no dates left.
 */
export function askMessage(
  whatsapp: Pick<Settings['whatsapp'], 'tourMessage' | 'generalMessage'>,
  tour: string,
  departure: Pick<Departure, 'start'> | undefined,
): string {
  return departure ? departureMessage(whatsapp.tourMessage, tour, departure.start) : whatsapp.generalMessage;
}
