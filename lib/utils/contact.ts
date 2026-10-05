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

/** The office on Google Maps (ADR-0029): directions to it, the map's embed, and the full map. */
export type OfficeOnMaps = { directions: string; embed: string; search: string };

/**
 * The office on Google Maps, found by the address as Google knows it (`officeMapQuery`), encoded.
 * None while any part of the address or the query is a `[placeholder]`, so nobody is sent to, or
 * shown, a made-up place.
 */
export function officeOnMaps(contact: Pick<Settings['contact'], 'officeAddress' | 'officeMapQuery'>): OfficeOnMaps | undefined {
  if (hasPlaceholder(contact.officeAddress) || hasPlaceholder(contact.officeMapQuery)) return undefined;
  const query = encodeURIComponent(contact.officeMapQuery);
  return {
    directions: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
    embed: `https://www.google.com/maps?q=${query}&output=embed`,
    search: `https://www.google.com/maps/search/?api=1&query=${query}`,
  };
}

/** "Visit the office"'s map (`OfficeMap`): the frame's address, its name, and the link under it and its words. */
export type OfficeMapData = {
  /** Google's embed of the office on the pages; a stand-in page in stories, so tests never call Google. */
  src: string;
  /** The frame's name for screen readers: "Map of our office in DHA Phase 8, Lahore". */
  title: string;
  href: string;
  linkLabel: string;
};

/** "Visit the office"'s map, from settings; none while the office isn't real. */
export function officeMap(settings: Pick<Settings, 'contact' | 'visitOffice'>): OfficeMapData | undefined {
  const maps = officeOnMaps(settings.contact);
  return maps && { src: maps.embed, title: settings.visitOffice.mapTitle, href: maps.search, linkLabel: settings.visitOffice.mapLinkLabel };
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
