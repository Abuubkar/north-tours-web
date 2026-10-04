import { emailHref, phoneHref, whatsappHref } from '../utils/contact.ts';
import { fillTokens } from '../utils/tokens.ts';
import { whatsappLink } from '../utils/whatsapp.ts';
import { getContactCopy, getHomeCopy, type ContactCopy } from './pages.ts';
import { getSettings, type Settings } from './settings.ts';

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
  };
}

/** Everything /contact shows, shaped for its sections, so the route only composes. */
export function getContactPage() {
  const settings = getSettings();
  return {
    ...contactPage(getContactCopy(), settings),
    settings,
    /** The page has no photo of its own (the office's is a placeholder), so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
