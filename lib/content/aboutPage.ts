import { fillTokens } from '../utils/tokens.ts';
import { getAboutCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/**
 * Everything the About page shows, read through the loaders and shaped for its sections, so the
 * route only composes. The copy's `{tokens}` are filled from settings here.
 */
export function getAboutPage() {
  const settings = getSettings();
  const copy = getAboutCopy();
  return {
    copy: {
      ...copy,
      // The year the company started, as the trust strip counts it (#42).
      story: { ...copy.story, headline: fillTokens(copy.story.headline, { foundedYear: String(settings.trust.operatingSince) }) },
    },
    settings,
    /** The header's place photo is also the page's share image. */
    sharePhoto: copy.header.image,
  };
}

export type AboutPage = ReturnType<typeof getAboutPage>;
