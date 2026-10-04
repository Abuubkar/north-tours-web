import type { Metadata } from 'next';
import { TourFiltersProvider } from '@/components/filters/TourFiltersProvider/TourFiltersProvider';
import { TourResults } from '@/components/filters/TourResults/TourResults';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getToursCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { getToursPage } from '@/lib/content/toursPage';
import { pageMetadata } from '@/lib/utils/metadata';
import { PENDING_SCRIPT } from '@/lib/utils/toursSearch';
import { PageHeader } from '@/sections/PageHeader/PageHeader';

export function generateMetadata(): Metadata {
  return pageMetadata(getToursCopy(), getSettings());
}

/**
 * Every trip, soonest first, filtered and sorted in the browser from the link (PRD #56). It has
 * no photo of its own, so it shares the Homepage's image.
 */
export default function ToursPage() {
  const { copy, settings, builtOn, sharePhoto, whatsapp, tours, destinations } = getToursPage();

  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      {/* Before the results are painted: a linked view keeps them hidden until it's applied. */}
      <script dangerouslySetInnerHTML={{ __html: PENDING_SCRIPT }} />
      <PageHeader headline={copy.header.headline} lead={copy.header.lead} />
      <TourFiltersProvider tours={tours} destinations={destinations.map((d) => d.slug)} builtOn={builtOn}>
        <TourResults copy={{ results: copy.results, sorts: copy.sorts, empty: copy.empty }} settings={whatsapp} />
      </TourFiltersProvider>
    </PageMain>
  );
}
