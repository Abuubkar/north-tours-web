import { isPlaceholder } from './placeholder.ts';

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
