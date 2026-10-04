import { fillTokens, textTokens } from '../utils/tokens.ts';
import { getHomeCopy, getLegalCopy, type LegalCopy, type LegalDocumentId } from './pages.ts';
import { getSettings, type Settings } from './settings.ts';

/**
 * A legal document as its page shows it: the sections numbered in order and every `{token}`
 * filled from settings, so no figure is ever typed twice. Takes the copy and settings, so tests
 * can change them.
 */
export function legalDocument(copy: LegalCopy, id: LegalDocumentId, settings: Settings) {
  const legal = copy[id];
  const tokens = textTokens(settings);
  return {
    ...legal,
    sections: legal.sections.map((section, i) => ({
      id: section.id,
      number: i + 1,
      heading: section.heading,
      paragraphs: section.paragraphs.map((paragraph) => fillTokens(paragraph, tokens)),
    })),
  };
}

/** Everything /privacy or /terms shows, shaped for its sections, so each route only composes. */
export function getLegalPage(id: LegalDocumentId) {
  const copy = getLegalCopy();
  const settings = getSettings();
  const legal = legalDocument(copy, id, settings);
  return {
    legal,
    settings,
    labels: {
      lastUpdated: copy.labels.lastUpdated,
      contents: copy.labels.contents,
      contentsCount: fillTokens(copy.labels.contentsCount, { count: String(legal.sections.length) }),
    },
    /** The pages have no photo of their own, so they share the Homepage's. */
    sharePhoto: getHomeCopy().hero.image,
  };
}
