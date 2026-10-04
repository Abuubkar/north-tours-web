import type { HelpCategory } from '../utils/helpAnswers.ts';
import { phoneHref } from '../utils/contact.ts';
import { faqPage } from '../utils/structuredData.ts';
import { refundTableRows } from '../utils/refundTable.ts';
import { fillTokens, textTokens } from '../utils/tokens.ts';
import { whatsappLink } from '../utils/whatsapp.ts';
import { getFaqs, type Faqs } from './faqs.ts';
import { getHelpCopy, getHomeCopy, type HelpCopy } from './pages.ts';
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

/**
 * Help's booking policies, every `{token}` filled from settings, and the refund table's rows from
 * the settings schedule where a policy shows it. Takes the copy and settings, so tests can change them.
 */
export function helpPolicies(copy: HelpCopy, settings: Settings) {
  const tokens = textTokens(settings);
  const rows = refundTableRows(settings.policies, copy.policies.refundTable);
  return copy.policies.items.map(({ id, title, summary, refundTable, paragraphs }) => ({
    id,
    title,
    summary: fillTokens(summary, tokens),
    refundRows: refundTable ? rows : undefined,
    paragraphs: paragraphs.map((paragraph) => fillTokens(paragraph, tokens)),
  }));
}

/** Help's closing lead: "We reply on WhatsApp within 2 hours. Phone lines are open …", from settings. */
export function helpCtaLead(copy: HelpCopy, settings: Settings): string {
  return fillTokens(copy.cta.lead, { replyTime: settings.booking.replyTime, officeHours: settings.contact.officeHours });
}

/** Everything /help shows, shaped for its sections, so the route only composes. */
export function getHelpPage() {
  const settings = getSettings();
  const copy = getHelpCopy();
  const categories = helpCategories(getFaqs(), settings);
  return {
    copy: {
      ...copy,
      empty: { ...copy.empty, lead: fillTokens(copy.empty.lead, { replyTime: settings.booking.replyTime }) },
      cta: { ...copy.cta, lead: helpCtaLead(copy, settings) },
    },
    settings,
    /** "Ask on WhatsApp": the general message, with no number while it's a placeholder. */
    askHref: whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage),
    /** "Call us": only once the phone number is real. */
    callHref: phoneHref(settings.contact.phone),
    categories,
    /** For search engines: every question, in page order. */
    faqData: faqPage(categories.flatMap((category) => category.questions)),
    policies: helpPolicies(copy, settings),
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
