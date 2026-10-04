import type { HelpCategory } from '../utils/helpAnswers.ts';
import { fillTokens, textTokens } from '../utils/tokens.ts';
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
  return {
    copy: getHelpCopy(),
    settings,
    categories: helpCategories(getFaqs(), settings),
    /** The page has no photo of its own, so it shares the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
