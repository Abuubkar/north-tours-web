import { hasPlaceholder, isPlaceholder } from './placeholder.ts';
import { whatsappLink } from './whatsapp.ts';

/** A contact value from settings as shown: the number or address, and its link once it's real. */
export type ContactValue = { value: string; href: string | undefined };

/*
 * Links for contact details from settings. While a value is a `[placeholder]` there is no link
 * (undefined), so it shows as plain text and nobody reaches a made-up contact (ADR-0010).
 */

/** "tel:+924235781234" from "+92 42 3578 1234". */
export function phoneHref(number: string): string | undefined {
  return isPlaceholder(number) ? undefined : `tel:${number.replace(/[^\d+]/g, '')}`;
}

export function emailHref(email: string): string | undefined {
  return isPlaceholder(email) ? undefined : `mailto:${email}`;
}

/** A social profile or other web link. */
export function webHref(url: string): string | undefined {
  return isPlaceholder(url) ? undefined : url;
}

/** A WhatsApp number's chat link with `message` written, or none while the number is a placeholder. */
export function whatsappHref(number: string, message: string): string | undefined {
  return isPlaceholder(number) ? undefined : whatsappLink(number, message);
}

/**
 * "Get directions": a Google Maps search for the office's address, encoded. None while any part
 * of the address is a `[placeholder]`, so nobody is sent to a made-up place.
 */
export function directionsHref(address: string): string | undefined {
  return hasPlaceholder(address) ? undefined : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
