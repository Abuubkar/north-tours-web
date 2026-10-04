import type { Metadata } from 'next';
import { OnTripMobileBanner } from '@/components/contact/OnTripMobileBanner/OnTripMobileBanner';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getContactPage } from '@/lib/content/contactPage';
import { getContactCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { pageMetadata } from '@/lib/utils/metadata';
import { OnTripNow } from '@/sections/OnTripNow/OnTripNow';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { WaysToReachUs } from '@/sections/WaysToReachUs/WaysToReachUs';

export function generateMetadata(): Metadata {
  return pageMetadata(getContactCopy(), getSettings());
}

/**
 * Contact (PRD #86): every way to reach the company, WhatsApp first, and the travel support line
 * for travellers on a trip, with a banner on phones that jumps to it. Contact values are links
 * only once they're real.
 */
export default function ContactPage() {
  const { copy, channels, travelSupport, settings, sharePhoto } = getContactPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <OnTripMobileBanner text={copy.banner} />
      <PageHeader variant="contact" label={copy.header.label} headline={copy.header.headline} lead={copy.header.lead} />
      <WaysToReachUs copy={copy.ways} channels={channels} />
      <OnTripNow copy={copy.onTrip} support={travelSupport} />
    </PageMain>
  );
}
