import { routes } from '../routes.ts';
import { whatsappLink } from '../utils/whatsapp.ts';
import { quickLinksSection } from './contactPage.ts';
import { getContactCopy, getHomeCopy, getNotFoundCopy, type ContactCopy, type NotFoundCopy } from './pages.ts';
import { getSettings, type Settings } from './settings.ts';

/**
 * The not-found page's links: "Ask on WhatsApp" with the general message (no number while it's a
 * placeholder), and Contact's quick links section with this page's rows. Takes the copy and
 * settings, so tests can change them.
 */
export function notFoundPage(copy: NotFoundCopy, contactCopy: ContactCopy, settings: Settings) {
  return {
    askHref: whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage),
    quickLinks: quickLinksSection(contactCopy, copy.quickLinks.map(({ label, page }) => ({ label, href: routes[page] })), settings),
  };
}

/** Everything the not-found page shows, shaped for its sections, so the route only composes. */
export function getNotFoundPage() {
  const copy = getNotFoundCopy();
  const settings = getSettings();
  return {
    ...notFoundPage(copy, getContactCopy(), settings),
    copy,
    settings,
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
