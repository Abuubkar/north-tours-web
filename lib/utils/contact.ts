import type { Settings } from '../content/settings.ts';
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

/*
 * The office on Google Maps (ADR-0029), from the address as Google knows it (`officeMapQuery` in
 * settings), encoded. None while any part of it is a `[placeholder]`, so nobody is sent to, or
 * shown, a made-up place.
 */

/** "Get directions": Google Maps directions to the office, from wherever the visitor is. */
export function directionsHref(address: string): string | undefined {
  return hasPlaceholder(address) ? undefined : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

/** The map under "Visit the office": Google's embed of the address, which needs no API key. */
export function officeMapSrc(address: string): string | undefined {
  return hasPlaceholder(address) ? undefined : `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

/** The link under the map: the address in Google Maps, full size. */
export function officeMapHref(address: string): string | undefined {
  return hasPlaceholder(address) ? undefined : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** "Visit the office"'s map: its frame, its name and the link under it; none while the address is a placeholder. */
export function officeMap(query: string, words: Pick<Settings['visitOffice'], 'mapTitle' | 'mapLinkLabel'>) {
  const src = officeMapSrc(query);
  const href = officeMapHref(query);
  return src && href ? { src, title: words.mapTitle, href, linkLabel: words.mapLinkLabel } : undefined;
}

/** A social profile's name and its link, or none while it's a placeholder (plain text). */
export type SocialLink = { label: string; href: string | undefined };

/** Instagram, Facebook and YouTube from settings, in that order (the footer and Contact's quick links). */
export function socialLinks(social: Settings['social']): SocialLink[] {
  return [
    { label: 'Instagram', href: webHref(social.instagram) },
    { label: 'Facebook', href: webHref(social.facebook) },
    { label: 'YouTube', href: webHref(social.youtube) },
  ];
}
