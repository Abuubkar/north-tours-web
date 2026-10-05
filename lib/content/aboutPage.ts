import { companyStats } from '../utils/companyStats.ts';
import { officeMap } from '../utils/contact.ts';
import { guideProfile } from '../utils/guideProfile.ts';
import { fillTokens } from '../utils/tokens.ts';
import { getTour } from './catalog.ts';
import { getGuides } from './guides.ts';
import { getAboutCopy } from './pages.ts';
import { getReviews } from './reviews.ts';
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
    },
    settings,
    /** Every guide in the loader's order, with their profile's rows and share link. */
    profiles: guides.map((guide) =>
      guideProfile(guide, copy.guides.profile, settings.whatsapp.guideShareMessage, settings.site.url),
    ),
    /** "The company in numbers": years and trips as the trust strip shows them, up to the build year. */
    stats: companyStats({
      trust: settings.trust,
      travellers: copy.numbers.travellers.value,
      guideCount: guides.length,
      year: new Date().getFullYear(),
      labels: copy.numbers.labels,
    }),
    /** Credentials: the licence and registration from settings (placeholders as written), and the memberships. */
    credentials: {
      label: copy.credentials.label,
      licence: {
        label: copy.credentials.licence.label,
        value: fillTokens(copy.credentials.licence.value, { dtsLicence: settings.legal.dtsLicence }),
        // The trust strip's line under the licence.
        note: settings.trust.licence.note,
      },
      company: { label: copy.credentials.company.label, value: settings.legal.companyRegistration },
      memberships: { label: copy.credentials.memberships.label, names: copy.credentials.memberships.items.map((item) => item.name) },
    },
    /** The reviews page copy chooses, in its order (content:check makes sure each one exists). */
    reviews: copy.reviews.chosen.map((slug) => {
      const review = getReviews().find((r) => r.slug === slug)!;
      return { review, tourTitle: getTour(review.tour)!.title };
    }),
    /** "Visit the office": the office on a Google map, once the address is real (ADR-0029). */
    officeMap: officeMap(settings.contact.officeMapQuery, settings.visitOffice),
    /** The header's place photo is also the page's share image. */
    sharePhoto: copy.header.image,
  };
}

export type AboutPage = ReturnType<typeof getAboutPage>;
