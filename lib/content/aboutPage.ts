import { companyStats } from '../utils/companyStats.ts';
import { guideProfile } from '../utils/guideProfile.ts';
import { fillTokens } from '../utils/tokens.ts';
import { getGuides } from './guides.ts';
import { getAboutCopy } from './pages.ts';
import { getSettings } from './settings.ts';

/**
 * Everything the About page shows, read through the loaders and shaped for its sections, so the
 * route only composes. The copy's `{tokens}` are filled from settings here.
 */
export function getAboutPage() {
  const settings = getSettings();
  const copy = getAboutCopy();
  const guides = getGuides();
  return {
    copy: {
      ...copy,
      // The year the company started, as the trust strip counts it (#42).
      story: { ...copy.story, headline: fillTokens(copy.story.headline, { foundedYear: String(settings.trust.operatingSince) }) },
      credentials: {
        ...copy.credentials,
        licence: { ...copy.credentials.licence, value: fillTokens(copy.credentials.licence.value, { dtsLicence: settings.legal.dtsLicence }) },
      },
    },
    settings,
    /** Every guide in the loader's order, with their profile's rows and share link. */
    profiles: guides.map((guide) =>
      guideProfile(guide, copy.guides.profile, settings.whatsapp.guideShareMessage, settings.site.url),
    ),
    /** "The company in numbers": years and trips as the trust strip shows them, up to the build year. */
    stats: companyStats(settings.trust, copy.numbers.travellers.value, guides.length, new Date().getFullYear(), copy.numbers.labels),
    /** The header's place photo is also the page's share image. */
    sharePhoto: copy.header.image,
  };
}
