import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { CanonicalMeta } from '@/components/seo/CanonicalMeta/CanonicalMeta';
import { getDestinationsPage } from '@/lib/content/destinationsPage';
import { getDestinationsCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/utils/metadata';
import { DestinationsGrid } from '@/sections/DestinationsGrid/DestinationsGrid';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { PrivateTripBanner } from '@/sections/PrivateTripBanner/PrivateTripBanner';

export function generateMetadata(): Metadata {
  return pageMetadata(getDestinationsCopy(), getSettings());
}

/** On phones the first row's two photos are the largest thing on screen, so they load straight away. */
const PRIORITY_CARDS = 2;

/**
 * Every destination on one page (PRD #118), so the nav's Destinations opens a page: the header,
 * the Homepage's destination cards in content order, then a private trip. Built only from
 * existing parts.
 */
export default function DestinationsPage() {
  const { copy, settings, destinations, sharePhoto, askHref, bannerImage } = getDestinationsPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <CanonicalMeta path={routes.destinations} siteUrl={settings.site.url} />
      <PageHeader headline={copy.header.headline} lead={copy.header.lead} />
      <DestinationsGrid copy={copy.destinations} destinations={destinations} priorityCards={PRIORITY_CARDS} />
      <PrivateTripBanner variant="section" copy={{ ...copy.banner, image: bannerImage }} planHref={routes.plan} whatsappHref={askHref} />
    </PageMain>
  );
}
