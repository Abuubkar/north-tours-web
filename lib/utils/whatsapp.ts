import { messageDate } from './dates.ts';
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

/** A tour card's message from a settings template: "Hi, I’m interested in {tour} on {date}." */
export function departureMessage(template: string, tour: string, start: string): string {
  return fillTokens(template, { tour, date: messageDate(start) });
}
