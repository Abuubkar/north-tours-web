import type { HelpCategory } from '../utils/helpAnswers.ts';
import { fillTokens, textTokens } from '../utils/tokens.ts';
import { whatsappLink } from '../utils/whatsapp.ts';
import { getFaqs, type Faqs } from './faqs.ts';
import { getHelpCopy, getHomeCopy } from './pages.ts';
import { getSettings, type Settings } from './settings.ts';

/**
 * Help's categories and questions, every answer's `{tokens}` filled from settings. Takes the FAQs
 * and settings, so tests can change them.
 */
export function helpCategories(faqs: Faqs, settings: Settings): HelpCategory[] {
  const tokens = textTokens(settings);
  return faqs.categories.map(({ id, title, questions }) => ({
    id,
    title,
    questions: questions.map(({ id, question, answer }) => ({ id, question, answer: fillTokens(answer, tokens) })),
  }));
}

/** Everything /help shows, shaped for its sections, so the route only composes. */
export function getHelpPage() {
  const settings = getSettings();
  const copy = getHelpCopy();
  return {
    copy: { ...copy, empty: { ...copy.empty, lead: fillTokens(copy.empty.lead, { replyTime: settings.booking.replyTime }) } },
    settings,
    /** "Ask on WhatsApp": the general message, with no number while it's a placeholder. */
    askHref: whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage),
    categories: helpCategories(getFaqs(), settings),
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
