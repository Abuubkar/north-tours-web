import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getDestinations, getTours } from '@/lib/content/catalog';
import { getGuides } from '@/lib/content/guides';
import { getAboutCopy, getCreditsCopy, getHomeCopy, getToursCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { photoCredits } from '@/lib/utils/credits';
import { pageMetadata } from '@/lib/utils/metadata';
import { PhotoCredits } from '@/sections/PhotoCredits/PhotoCredits';

export function generateMetadata(): Metadata {
  return pageMetadata(getCreditsCopy(), getSettings());
}

/** Every third-party photo on the site, credited (ADR-0009). It has no hero, so it shares the Homepage's image. */
export default function CreditsPage() {
  const copy = getCreditsCopy();
  const hero = getHomeCopy().hero.image;
  const credits = photoCredits([
    hero,
    ...getTours().flatMap((tour) => [
      tour.image,
      ...tour.highlights.map((highlight) => highlight.image),
      ...tour.stays.map((stay) => stay.image),
    ]),
    ...getDestinations().flatMap((destination) => [destination.image, ...(destination.places ?? []).map((place) => place.image)]),
    getToursCopy().banner.image,
    getAboutCopy().header.image,
    ...getGuides().map((guide) => guide.portrait),
  ]);

  return (
    <PageMain>
      <ShareImageMeta photo={hero} siteUrl={getSettings().site.url} />
      <PhotoCredits copy={copy} credits={credits} />
    </PageMain>
  );
}
