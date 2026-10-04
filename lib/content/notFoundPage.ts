import { routes } from '../routes.ts';
import { socialLinks } from '../utils/contact.ts';
import { whatsappLink } from '../utils/whatsapp.ts';
import { getContactCopy, getHomeCopy, getNotFoundCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/** Everything the not-found page shows, shaped for its sections, so the route only composes. */
export function getNotFoundPage() {
  const copy = getNotFoundCopy();
  const settings = getSettings();
  const contact = getContactCopy().quickLinks;
  return {
    copy,
    settings,
    /** "Ask on WhatsApp": the general message, with no number while it's a placeholder. */
    askHref: whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage),
    /** Contact's quick links section, with this page's rows; its label and "Follow the trips" are Contact's. */
    quickLinks: {
      label: contact.label,
      links: copy.quickLinks.map(({ label, page }) => ({ label, href: routes[page] })),
      follow: contact.follow,
      social: socialLinks(settings.social),
    },
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
