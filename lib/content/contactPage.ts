import { routes } from '../routes.ts';
import { emailHref, phoneHref, socialLinks, whatsappHref } from '../utils/contact.ts';
import { fillTokens } from '../utils/tokens.ts';
import { whatsappLink } from '../utils/whatsapp.ts';
import { getContactCopy, getHomeCopy, type ContactCopy } from './pages.ts';
import { getRouteMap } from './routeMap.ts';
import { getSettings, type Settings } from './settings.ts';

/**
 * Contact's quick links section with the given rows (Contact's own, or the not-found page's): its
 * label and "Follow the trips" stay Contact's, and the social profiles are links once real.
 */
export function quickLinksSection(copy: ContactCopy, links: { label: string; href: string }[], settings: Settings) {
  return { label: copy.quickLinks.label, links, follow: copy.quickLinks.follow, social: socialLinks(settings.social) };
}

/**
 * The Contact page's words and channels: the copy's `{tokens}` filled from settings, and each
 * contact value with its link, or none while it's a `[placeholder]` (shown as plain text, so
 * nobody reaches a made-up number). Takes the copy and settings, so tests can change them.
 */
export function contactPage(copy: ContactCopy, settings: Settings) {
  const { contact, booking, whatsapp } = settings;
  return {
    copy: {
      ...copy,
      header: { ...copy.header, lead: fillTokens(copy.header.lead, { replyTime: booking.replyTime, officeHours: contact.officeHours }) },
      ways: { ...copy.ways, whatsapp: { ...copy.ways.whatsapp, line: fillTokens(copy.ways.whatsapp.line, { replyTime: booking.replyTime }) } },
    },
    channels: {
      whatsapp: {
        value: contact.whatsapp,
        href: whatsappHref(contact.whatsapp, whatsapp.generalMessage),
        /** "Chat now": the general message, with no number while it's a placeholder. */
        chatHref: whatsappLink(contact.whatsapp, whatsapp.generalMessage),
      },
      phone: { value: contact.phone, href: phoneHref(contact.phone), hours: contact.officeHours },
      email: { value: contact.email, href: emailHref(contact.email) },
    },
    /** The travel support line: "Call travel support" only once the number is real. */
    travelSupport: { value: contact.travelSupport, href: phoneHref(contact.travelSupport) },
    /** Where to carry on from the page, and the social profiles (links once real, as in the footer). */
    quickLinks: quickLinksSection(
      copy,
      [
        { label: copy.quickLinks.links.plan, href: routes.plan },
        { label: copy.quickLinks.links.tours, href: routes.tours },
        { label: copy.quickLinks.links.help, href: routes.help },
        { label: copy.quickLinks.links.policies, href: routes.policies },
      ],
      settings,
    ),
  };
}

/** Everything /contact shows, shaped for its sections, so the route only composes. */
export function getContactPage() {
  const settings = getSettings();
  return {
    ...contactPage(getContactCopy(), settings),
    settings,
    /** The road north, drawn beside "On a trip right now?". */
    routeMap: getRouteMap(),
    /** The page has no photo of its own (the office's is a placeholder), so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
