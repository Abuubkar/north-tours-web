import type { Metadata } from 'next';
import { TourResults } from '@/components/filters/TourResults/TourResults';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getToursCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { getToursPage } from '@/lib/content/toursPage';
import { pageMetadata } from '@/lib/utils/metadata';
import { PageHeader } from '@/sections/PageHeader/PageHeader';

export function generateMetadata(): Metadata {
  return pageMetadata(getToursCopy(), getSettings());
}

/** Every trip, soonest first. It has no photo of its own, so it shares the Homepage's image. */
export default function ToursPage() {
  const { copy, settings, builtOn, sharePhoto, whatsapp, tours } = getToursPage();

  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <PageHeader headline={copy.header.headline} lead={copy.header.lead} />
      <TourResults tours={tours} builtOn={builtOn} copy={{ results: copy.results, sorts: copy.sorts }} settings={whatsapp} />
    </PageMain>
  );
}
