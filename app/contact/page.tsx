import type { Metadata } from 'next';
import { OnTripMobileBanner } from '@/components/contact/OnTripMobileBanner/OnTripMobileBanner';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { CanonicalMeta } from '@/components/seo/CanonicalMeta/CanonicalMeta';
import { getContactPage } from '@/lib/content/contactPage';
import { getContactCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/utils/metadata';
import { OnTripNow } from '@/sections/OnTripNow/OnTripNow';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { QuickLinks } from '@/sections/QuickLinks/QuickLinks';
import { TrustStrip } from '@/sections/TrustStrip/TrustStrip';
import { VisitOffice } from '@/sections/VisitOffice/VisitOffice';
import { WaysToReachUs } from '@/sections/WaysToReachUs/WaysToReachUs';

export function generateMetadata(): Metadata {
  return pageMetadata(getContactCopy(), getSettings());
}

/**
 * Contact (PRD #86): every way to reach the company, WhatsApp first, the travel support line for
 * travellers on a trip (with a banner on phones that jumps to it), the office, quick links to carry
 * on and the trust strip. Contact values are links only once they're real.
 */
export default function ContactPage() {
  const { copy, channels, travelSupport, quickLinks, settings, sharePhoto } = getContactPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <CanonicalMeta path={routes.contact} siteUrl={settings.site.url} />
      <OnTripMobileBanner text={copy.banner} />
      <PageHeader variant="contact" headline={copy.header.headline} lead={copy.header.lead} />
      <WaysToReachUs copy={copy.ways} channels={channels} />
      <OnTripNow copy={copy.onTrip} support={travelSupport} />
      <VisitOffice settings={settings} form="two-row" />
      <QuickLinks {...quickLinks} />
      <TrustStrip settings={settings} year={new Date().getFullYear()} />
    </PageMain>
  );
}
