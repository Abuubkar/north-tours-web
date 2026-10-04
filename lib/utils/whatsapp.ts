import type { Settings } from '../content/settings.ts';
import type { Departure } from '../content/tours.ts';
import { messageDate } from './dates.ts';
import { seatStatus } from './departures.ts';
import { isPlaceholder } from './placeholder.ts';
import { fillTokens } from './tokens.ts';

/**
 * A wa.me link that opens a chat with `message` already written (ADR-0006).
 * While the number is a `[placeholder]` the link has no number, so WhatsApp opens with the
 * message ready and nobody reaches a made-up number (ADR-0010).
 */
export function whatsappLink(number: string, message: string): string {
  const digits = isPlaceholder(number) ? '' : number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * A wa.me link with a message and no number, so WhatsApp asks the visitor who to send it to:
 * sharing a guide's profile with family, say.
 */
export function whatsappShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/** A destination page's "Ask on WhatsApp" message: "Hi, I’d like to plan a private trip to Hunza." */
export function destinationMessage(whatsapp: Pick<Settings['whatsapp'], 'destinationMessage'>, destination: string): string {
  return fillTokens(whatsapp.destinationMessage, { destination });
}

/** A tour card's message from a settings template: "Hi, I’m interested in {tour} on {date}." */
export function departureMessage(template: string, tour: string, start: string): string {
  return fillTokens(template, { tour, date: messageDate(start) });
}

/**
 * A tour card's WhatsApp message: about the date it shows, the waitlist when that date is full,
 * or a general question when the tour has no dates left.
 */
export function cardMessage(
  whatsapp: Pick<Settings['whatsapp'], 'tourMessage' | 'waitlistMessage' | 'generalMessage'>,
  tour: string,
  departure: Pick<Departure, 'start' | 'seatsLeft'> | undefined,
): string {
  if (!departure) return whatsapp.generalMessage;
  const template = seatStatus(departure) === 'soldout' ? whatsapp.waitlistMessage : whatsapp.tourMessage;
  return departureMessage(template, tour, departure.start);
}
