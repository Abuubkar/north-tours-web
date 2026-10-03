import { isPlaceholder } from './placeholder.ts';

/**
 * A wa.me link that opens a chat with `message` already written (ADR-0006).
 * While the number is a `[placeholder]` the link has no number, so WhatsApp opens with the
 * message ready and nobody reaches a made-up number (ADR-0010).
 */
export function whatsappLink(number: string, message: string): string {
  const digits = isPlaceholder(number) ? '' : number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
